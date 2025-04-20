package main

import (
	"log"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/vxF6id/envelopr/backend/auth"
	"github.com/vxF6id/envelopr/backend/graph"
)

func main() {
	initDB()
	defer db.Close()

	resolver := &graph.Resolver{DB: db}

	// Create GraphQL handler with explicit transports
	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: resolver}))

	// Add supported transports
	srv.AddTransport(&transport.POST{})
	srv.AddTransport(&transport.GET{})
	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", cors.AllowAll().Handler(auth.Middleware(srv)))

	log.Println("Running on http://localhost:8080/")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
