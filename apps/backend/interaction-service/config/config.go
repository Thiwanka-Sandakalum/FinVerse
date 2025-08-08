package config

import (
	"fmt"
	"os"

	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig   `mapstructure:"server"`
	MongoDB  MongoDBConfig  `mapstructure:"mongodb"`
	RabbitMQ RabbitMQConfig `mapstructure:"rabbitmq"`
	Logging  LoggingConfig  `mapstructure:"logging"`
}

type ServerConfig struct {
	Port         int    `mapstructure:"port"`
	Host         string `mapstructure:"host"`
	ReadTimeout  int    `mapstructure:"readTimeout"`
	WriteTimeout int    `mapstructure:"writeTimeout"`
	IdleTimeout  int    `mapstructure:"idleTimeout"`
}

type MongoDBConfig struct {
	URI        string `mapstructure:"uri"`
	Database   string `mapstructure:"database"`
	Collection string `mapstructure:"collection"`
}

type RabbitMQConfig struct {
	URI               string `mapstructure:"uri"`
	InteractionQueue  string `mapstructure:"interactionQueue"`
	ProductViewQueue  string `mapstructure:"productViewQueue"`
	ComparisonQueue   string `mapstructure:"comparisonQueue"`
	SearchQueue       string `mapstructure:"searchQueue"`
	ExchangeName      string `mapstructure:"exchangeName"`
	ExchangeType      string `mapstructure:"exchangeType"`
	ReconnectAttempts int    `mapstructure:"reconnectAttempts"`
	ReconnectDelay    int    `mapstructure:"reconnectDelay"`
}

type LoggingConfig struct {
	Level string `mapstructure:"level"`
	File  string `mapstructure:"file"`
}

// LoadConfig loads configuration from config file and environment variables
func LoadConfig() (*Config, error) {
	var config Config

	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./config")
	viper.AddConfigPath(".")
	viper.AutomaticEnv()

	// Override configs with environment variables
	// Example: SERVER_PORT overrides server.port
	viper.SetEnvPrefix("")
	viper.SetEnvKeyReplacer(nil)

	// Set defaults
	setDefaults()

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, fmt.Errorf("error reading config file: %w", err)
		}
		// Config file not found; ignore error if desired
		fmt.Println("No config file found, using defaults and environment variables")
	}

	if err := viper.Unmarshal(&config); err != nil {
		return nil, fmt.Errorf("error unmarshalling config: %w", err)
	}

	return &config, nil
}

// setDefaults sets the default values for configuration
func setDefaults() {
	// Server defaults
	viper.SetDefault("server.port", 4002)
	viper.SetDefault("server.host", "0.0.0.0")
	viper.SetDefault("server.readTimeout", 10) // seconds
	viper.SetDefault("server.writeTimeout", 10)
	viper.SetDefault("server.idleTimeout", 120)

	// MongoDB defaults
	viper.SetDefault("mongodb.uri", "mongodb://localhost:27017")
	viper.SetDefault("mongodb.database", "interaction_service")
	viper.SetDefault("mongodb.collection", "interactions")

	// RabbitMQ defaults
	viper.SetDefault("rabbitmq.uri", "amqp://guest:guest@localhost:5672/")
	viper.SetDefault("rabbitmq.interactionQueue", "interactions")
	viper.SetDefault("rabbitmq.productViewQueue", "product_views")
	viper.SetDefault("rabbitmq.comparisonQueue", "comparisons")
	viper.SetDefault("rabbitmq.searchQueue", "searches")
	viper.SetDefault("rabbitmq.exchangeName", "interaction_events")
	viper.SetDefault("rabbitmq.exchangeType", "topic")
	viper.SetDefault("rabbitmq.reconnectAttempts", 5)
	viper.SetDefault("rabbitmq.reconnectDelay", 5) // seconds

	// Logging defaults
	viper.SetDefault("logging.level", "info")
	viper.SetDefault("logging.file", "")
}

// CreateDefaultConfigFile creates a default configuration file if it doesn't exist
func CreateDefaultConfigFile(path string) error {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		config := `server:
  port: 4002
  host: 0.0.0.0
  readTimeout: 10
  writeTimeout: 10
  idleTimeout: 120

mongodb:
  uri: mongodb://localhost:27017
  database: interaction_service
  collection: interactions

rabbitmq:
  uri: amqp://guest:guest@localhost:5672/
  interactionQueue: interactions
  productViewQueue: product_views
  comparisonQueue: comparisons
  searchQueue: searches
  exchangeName: interaction_events
  exchangeType: topic
  reconnectAttempts: 5
  reconnectDelay: 5

logging:
  level: info
  file: ""
`

		if err := os.MkdirAll(fmt.Sprintf("%s/config", path), 0755); err != nil {
			return fmt.Errorf("error creating config directory: %w", err)
		}

		if err := os.WriteFile(fmt.Sprintf("%s/config/config.yaml", path), []byte(config), 0644); err != nil {
			return fmt.Errorf("error writing config file: %w", err)
		}

		fmt.Println("Created default config file at", fmt.Sprintf("%s/config/config.yaml", path))
	}

	return nil
}
