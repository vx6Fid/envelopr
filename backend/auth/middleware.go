package auth

import (
	"context"
	"fmt"
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
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		// Check and strip Bearer prefix
		if !strings.HasPrefix(authHeader, bearerPrefix) {
			http.Error(w, "Invalid authorization format", http.StatusUnauthorized)
			return
		}

		token := strings.TrimPrefix(authHeader, bearerPrefix)
		if token == "" {
			http.Error(w, "Empty token", http.StatusUnauthorized)
			return
		}

		userID, err := ParseToken(token)
		if err != nil {
			http.Error(w, fmt.Sprintf("Invalid token: %v", err), http.StatusUnauthorized)
			return
		}

		if userID == "" {
			http.Error(w, "Token contains no user ID", http.StatusUnauthorized)
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
