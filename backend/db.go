package main

import (
	"database/sql"
	"log"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var db *sql.DB

type File struct {
	ID        uuid.UUID
	Name      string
	URL       string
	Owner     uuid.UUID
	CreatedAt time.Time
}

func initDB() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: Could not load .env file - using system environment variables")
	}

	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Fatal("DATABASE_URL environment variable not set")
	}

	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to connect to DB:", err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal("Failed to ping DB:", err)
	}
	log.Println("📦 Connected to DB")
}
