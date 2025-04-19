package main

import (
	"log"
	"net/http"

	"github.com/vxF6id/envelopr/backend/graph"
	"github.com/vxF6id/envelopr/backend/graph/generated"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

func main() {
	initDB()

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))
	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Println("Running on http://localhost:8080/")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
