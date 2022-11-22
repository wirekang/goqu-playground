package main

import "github.com/wirekang/goqu-playground/internal/core"

func main() {
	err := core.Listen()
	if err != nil {
		panic(err)
	}
}
