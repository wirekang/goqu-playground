FROM golang:1.19.2-alpine3.16

ENV TZ=Asia/Seoul

RUN apk add --no-cache alpine-conf && setup-timezone -z Asia/Seoul
RUN apk add --no-cache git

WORKDIR /app
COPY go.mod ./
COPY go.sum ./
RUN go mod download
COPY internal ./internal
COPY cmd ./cmd
COPY assets ./assets
RUN go build -ldflags "-s -w" -o ./out ./cmd/goqu-playground-server
CMD "./out"
