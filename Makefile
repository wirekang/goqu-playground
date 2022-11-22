SHELL := /bin/bash

test:
	go test -c ./internal/... -o .test && ./.test

clean:
	rm -f .test
