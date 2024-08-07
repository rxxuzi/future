package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"time"
)

// ServerConfig holds the configuration for the server
type ServerConfig struct {
	Port    int
	RootDir string
	LogFlag bool
}

// GetLocalIP returns the non-loopback local IPv4 address
func GetLocalIP() string {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return "unable to get local IP"
	}
	for _, address := range addrs {
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil && !ipnet.IP.IsLinkLocalUnicast() {
				return ipnet.IP.String()
			}
		}
	}
	return "No suitable IP found"
}

// CreateServer creates an HTTP server with the specified configuration
func CreateServer(config *ServerConfig) (*http.Server, error) {
	staticFS := GetStaticFS()

	mux := http.NewServeMux()

	// 静的ファイルの提供
	fileServer := http.FileServer(http.FS(staticFS))
	mux.Handle("/web/", http.StripPrefix("/web/", fileServer))

	// カスタムファイルサーバーを使用
	customFileServer := CustomFileServer(config.RootDir, staticFS)

	// ルートハンドラーとしてカスタムファイルサーバーを設定
	mux.Handle("/", customFileServer)

	var handler http.Handler = mux

	// ログ記録用のミドルウェアを追加（LogFlagが真の場合のみ）
	if config.LogFlag {
		handler = logRequest(handler)
	}

	// 利用可能なポートを見つける
	availablePort, err := findAvailablePort(config.Port)
	if err != nil {
		return nil, fmt.Errorf("failed to find available port: %v", err)
	}

	// 設定を更新
	config.Port = availablePort

	return &http.Server{
		Addr:    fmt.Sprintf(":%d", config.Port),
		Handler: handler,
	}, nil
}

// findAvailablePort tries to find an available port starting from the given port
func findAvailablePort(startPort int) (int, error) {
	for port := startPort; port < startPort+100; port++ {
		addr := fmt.Sprintf(":%d", port)
		listener, err := net.Listen("tcp", addr)
		if err != nil {
			continue
		}
		listener.Close()
		return port, nil
	}
	return 0, fmt.Errorf("no available ports found in range %d-%d", startPort, startPort+99)
}

// PrintAccessInfo prints server access information
func PrintAccessInfo(config *ServerConfig) {
	localIP := GetLocalIP()
	fmt.Printf("Server Configuration:\n")
	fmt.Printf("  Port: %d\n", config.Port)
	fmt.Printf("  Root Directory: %s\n", config.RootDir)
	fmt.Printf("  Logging: %v\n", config.LogFlag)
	fmt.Println()

	fmt.Println("Access URLs:")
	fmt.Printf("  http://%s:%d\n", localIP, config.Port)
	fmt.Printf("  http://localhost:%d\n", config.Port)

	fmt.Println("\nNote: Use Ctrl+C to stop the server")
}

// logRequest is a middleware that logs each request
func logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// リクエストを処理
		next.ServeHTTP(w, r)

		// ログを記録
		log.Printf(
			"%s - [%s] \"%s %s %s\" %s",
			r.RemoteAddr,
			time.Now().Format(time.RFC1123),
			r.Method,
			r.URL.Path,
			r.Proto,
			time.Since(start),
		)
	})
}
