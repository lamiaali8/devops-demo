package main

import (
	"fmt"
	"net/http"
	"os"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	hostname, err := os.Hostname()
	if err != nil {
		hostname = "unknown"
	}

	fmt.Fprintf(w, "Hello from Go Backend!\n")
	fmt.Fprintf(w, "Hostname: %s\n", hostname)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "OK")
}

func main() {
	http.HandleFunc("/api/hello", helloHandler)
	http.HandleFunc("/health", healthHandler)

	fmt.Println("Go backend listening on port 8080")

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
