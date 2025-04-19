package main

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func initDB() {
	var err error
	DB, err = sql.Open("postgres", "postgres://docuser:docpass@localhost:5434/docdb?sslmode=disable")
	if err != nil {
		log.Fatal("Failed to connect to DB:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Failed to ping DB:", err)
	}
	log.Println("Connected to DB")
}
