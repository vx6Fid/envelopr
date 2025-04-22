package auth

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
)

type contextKey string

const (
	userIDKey    = contextKey("userID")
	bearerPrefix = "Bearer "
)

func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 1. Allow OPTIONS preflight requests
		if r.Method == http.MethodOptions {
			next.ServeHTTP(w, r)
			return
		}

		// 2. Allow public file access through dedicated endpoint
		if strings.HasPrefix(r.URL.Path, "/public/") {
			next.ServeHTTP(w, r)
			return
		}

		// 3. Handle GraphQL requests
		if r.Method == http.MethodPost && r.URL.Path == "/query" {
			// Read and restore body
			bodyBytes, err := io.ReadAll(r.Body)
			if err != nil {
				http.Error(w, "Error reading request body", http.StatusBadRequest)
				return
			}
			r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

			// Parse GraphQL request
			var gqlReq struct {
				OperationName string `json:"operationName"`
			}
			if json.Unmarshal(bodyBytes, &gqlReq) == nil {
				// Allow unauthenticated access to specific operations
				switch strings.ToLower(gqlReq.OperationName) {
				case "publicfile", "login", "register", "refreshtoken":
					next.ServeHTTP(w, r)
					return
				}
			}
		}

		// 4. Require authentication for all other requests
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, bearerPrefix) {
			http.Error(w, "Authorization header missing or invalid", http.StatusUnauthorized)
			return
		}

		token := strings.TrimPrefix(authHeader, bearerPrefix)
		userID, err := ParseToken(token)
		if err != nil {
			http.Error(w, fmt.Sprintf("Invalid token: %v", err), http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), userIDKey, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func ForContext(ctx context.Context) (string, bool) {
	userID, ok := ctx.Value(userIDKey).(string)
	return userID, ok
}
