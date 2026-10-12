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

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Go backend listening on port %s\n", port)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		panic(err)
	}
}
