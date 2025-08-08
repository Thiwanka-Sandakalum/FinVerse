FROM golang:1.21-alpine AS builder

# Install necessary packages
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy go mod and sum files
COPY go.mod ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o interaction-service ./cmd

# Use a minimal alpine image for the final stage
FROM alpine:3.18

# Install certificates for HTTPS
RUN apk --no-cache add ca-certificates tzdata

# Set working directory
WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/interaction-service .

# Copy config file
COPY --from=builder /app/config/config.yaml /app/config/config.yaml

# Expose the service port
EXPOSE 4002

# Run the service
CMD ["./interaction-service"]
