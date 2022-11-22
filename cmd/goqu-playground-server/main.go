package main

import (
	"os"

	"github.com/joho/godotenv"
	"github.com/wirekang/goqu-playground/internal/core"
)

func main() {
	if os.Getenv("IS_PRODUCTION") == "" {
		err := godotenv.Load(".env.development")
		if err != nil {
			panic(err)
		}
	}

	err := core.Listen()
	if err != nil {
		panic(err)
	}
}
