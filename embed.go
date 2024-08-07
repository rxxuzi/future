package main

import (
	"embed"
	"io/fs"
)

//go:embed web
var staticFiles embed.FS

// GetStaticFS returns a file system with the static files
func GetStaticFS() fs.FS {
	staticFS, _ := fs.Sub(staticFiles, "web")
	return staticFS
}
