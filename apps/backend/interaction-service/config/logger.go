package config

import (
	"io"
	"os"

	"github.com/sirupsen/logrus"
)

// SetupLogger configures the logger
func SetupLogger(cfg *LoggingConfig) *logrus.Logger {
	logger := logrus.New()

	// Set log level
	level, err := logrus.ParseLevel(cfg.Level)
	if err != nil {
		level = logrus.InfoLevel
	}
	logger.SetLevel(level)

	// Set formatter
	logger.SetFormatter(&logrus.TextFormatter{
		FullTimestamp:   true,
		TimestampFormat: "2006-01-02T15:04:05.000Z07:00",
	})

	// Set output
	var output io.Writer = os.Stdout

	// If a log file is specified, write to both file and stdout
	if cfg.File != "" {
		file, err := os.OpenFile(cfg.File, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
		if err == nil {
			output = io.MultiWriter(os.Stdout, file)
		} else {
			logger.Warnf("Failed to open log file: %v", err)
		}
	}

	logger.SetOutput(output)

	return logger
}
