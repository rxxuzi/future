package static

import (
	"embed"
	"io/fs"
)

//go:embed web
var staticFiles embed.FS

func GetStaticFS() fs.FS {
	staticFS, _ := fs.Sub(staticFiles, "web")
	return staticFS
}
