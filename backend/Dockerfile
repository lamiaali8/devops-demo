
FROM golang:1.24-alpine

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY main.go ./

RUN go build -o backend .

ENV PORT=8080

EXPOSE 8080

CMD ["./backend"]

