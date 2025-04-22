package auth

import (
	"context"
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
		if r.Method == http.MethodOptions {
			next.ServeHTTP(w, r) // Preflight requests
			return
		}

		if r.Method == http.MethodPost {
			buf := new(strings.Builder)
			_, _ = io.Copy(buf, r.Body)
			body := buf.String()
			r.Body = io.NopCloser(strings.NewReader(body)) // Refill body for gqlgen

			if strings.Contains(body, "login") ||
				strings.Contains(body, "register") ||
				strings.Contains(body, "refreshToken") {
				next.ServeHTTP(w, r)
				return
			}
		}

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

// Return the user ID from the context
func ForContext(ctx context.Context) (string, bool) {
	userID, ok := ctx.Value(userIDKey).(string)
	return userID, ok
}
