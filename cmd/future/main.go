package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"runtime"
	"syscall"
	"time"

	"github.com/rxxuzi/future/internal/global"
	"github.com/rxxuzi/future/internal/server"
)

func openBrowser(url string) {
	var cmd string
	var args []string

	switch _os := runtime.GOOS; _os {
	case "darwin":
		cmd = "open"
	case "windows":
		cmd = "rundll32"
		args = append(args, "url.dll,FileProtocolHandler")
	default: // "linux", "freebsd", "openbsd", "netbsd"
		cmd = "xdg-open"
	}
	args = append(args, url)
	err := exec.Command(cmd, args...).Start()
	if err != nil {
		return
	}
}

func main() {
	var (
		genFlag  bool
		port     int
		root     string
		logFlag  bool
		openFlag bool
	)

	flag.BoolVar(&genFlag, "gen", false, "Generate default configuration file")
	flag.IntVar(&port, "port", 0, "Port to run the svr on")
	flag.StringVar(&root, "root", "", "Root directory to serve")
	flag.BoolVar(&logFlag, "log", false, "Enable request logging")
	flag.BoolVar(&openFlag, "open", false, "Open browser after starting the svr")

	flag.Usage = func() {
		fmt.Println("Usage of future:")
		fmt.Println("  -gen")
		fmt.Println("        Generate default configuration file")
		fmt.Println("  -port <int>")
		fmt.Println("        Port to run the svr on (overrides config file)")
		fmt.Println("  -root <string>")
		fmt.Println("        Root directory to serve (overrides config file)")
		fmt.Println("  -log")
		fmt.Println("        Enable request logging (overrides config file)")
		fmt.Println("  -open")
		fmt.Println("        Open browser after starting the svr")
		fmt.Println("\nExample:")
		fmt.Println("  future -port 8080 -root public/ -log -open")
		fmt.Println("  future -gen")
	}

	// 引数の解析
	flag.Parse()

	// -genオプションが指定された場合
	if genFlag {
		err := global.GenerateDefaultConfig()
		if err != nil {
			log.Fatalf("Failed to generate default configuration: %v", err)
		}
		fmt.Println("Default configuration file (future.json) has been generated.")
		return
	}

	// 設定ファイルの読み込み
	config, err := global.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// コマンドライン引数で上書き
	if port != 0 {
		config.Port = port
	}
	if root != "" {
		config.Root = root
	}
	if flag.Lookup("log").Value.String() == "true" {
		config.Log = true
	}

	// rootが相対パスの場合、絶対パスに変換
	if !filepath.IsAbs(config.Root) {
		absRoot, err := filepath.Abs(config.Root)
		if err != nil {
			log.Fatalf("Failed to get absolute path for root directory: %v", err)
		}
		config.Root = absRoot
	}

	// サーバーの設定
	serverConfig := &server.ServerConfig{
		Port:    config.Port,
		RootDir: config.Root,
		LogFlag: config.Log,
	}

	// サーバーの作成
	svr, err := server.CreateServer(serverConfig)
	if err != nil {
		log.Fatalf("Failed to create server: %v", err)
	}

	// アクセス情報の表示
	server.PrintAccessInfo(serverConfig)

	// サーバーの起動
	go func() {
		log.Printf("Starting svr on port %d, serving directory: %s\n", config.Port, config.Root)
		if config.Log {
			log.Println("Request logging is enabled")
		}
		if err := svr.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// ブラウザを開くオプションが指定された場合
	if openFlag {
		url := fmt.Sprintf("http://localhost:%d", config.Port)
		go func() {
			time.Sleep(1 * time.Second) // サーバーが起動するまで少し待つ
			openBrowser(url)
		}()
	}

	// シグナル処理の設定
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	// シグナルを待機
	<-sigChan

	// シャットダウン処理
	log.Println("Shutting down svr...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := svr.Shutdown(ctx); err != nil {
		log.Printf("Error during svr shutdown: %v", err)
	}

	log.Println("Server shutdown complete")
}
