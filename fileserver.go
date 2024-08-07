package main

import (
	"fmt"
	"html/template"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

type FileInfo struct {
	Name    string
	Size    int64
	Mode    os.FileMode
	ModTime time.Time
	IsDir   bool
}

func isImage(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	return ext == ".jpg" || ext == ".jpeg" || ext == ".png" || ext == ".gif"
}

type DirectoryContent struct {
	Path        string
	Files       []FileInfo
	CurrentPath string
}

func getFileIcon(filename string) string {
	ext := strings.ToLower(filepath.Ext(filename))
	switch ext {
	case ".pdf":
		return "fas fa-file-pdf"
	case ".doc", ".docx":
		return "fas fa-file-word"
	case ".xls", ".xlsx":
		return "fas fa-file-excel"
	case ".ppt", ".pptx":
		return "fas fa-file-powerpoint"
	case ".jpg", ".jpeg", ".png", ".gif":
		return "fas fa-file-image"
	case ".mp3", ".wav":
		return "fas fa-file-audio"
	case ".mp4", ".avi", ".mov":
		return "fas fa-file-video"
	default:
		return "fas fa-file"
	}
}

func formatSize(size int64) string {
	const unit = 1024
	if size < unit {
		return fmt.Sprintf("%d B", size)
	}

	div, exp := int64(unit), 0
	for n := size / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %cB", float64(size)/float64(div), "KMGTPE"[exp])
}

func formatTime(t time.Time) string {
	return t.Format("2006-01-02 15:04:05")
}

func truncate(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n-3] + "..."
}

func CustomFileServer(root string, staticFS fs.FS) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Join(root, filepath.Clean(r.URL.Path))

		info, err := os.Stat(path)
		if err != nil {
			http.Error(w, "File not found", http.StatusNotFound)
			return
		}

		if !info.IsDir() {
			http.ServeFile(w, r, path)
			return
		}

		files, err := os.ReadDir(path)
		if err != nil {
			http.Error(w, fmt.Sprintf("Unable to read directory: %v", err), http.StatusInternalServerError)
			return
		}

		var fileInfos []FileInfo
		for _, file := range files {
			info, _ := file.Info()
			fileInfos = append(fileInfos, FileInfo{
				Name:    file.Name(),
				Size:    info.Size(),
				Mode:    info.Mode(),
				ModTime: info.ModTime(),
				IsDir:   file.IsDir(),
			})
		}

		sort.Slice(fileInfos, func(i, j int) bool {
			if fileInfos[i].IsDir != fileInfos[j].IsDir {
				return fileInfos[i].IsDir
			}
			return strings.ToLower(fileInfos[i].Name) < strings.ToLower(fileInfos[j].Name)
		})

		tmplContent, err := fs.ReadFile(staticFS, "listing.html")
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to read template: %v", err), http.StatusInternalServerError)
			return
		}

		tmpl, err := template.New("listing").Funcs(template.FuncMap{
			"getFileIcon": getFileIcon,
			"formatSize":  formatSize,
			"formatTime":  formatTime,
			"isImage":     isImage,
			"truncate":    truncate,
		}).Parse(string(tmplContent))

		data := DirectoryContent{
			Path:        r.URL.Path,
			Files:       fileInfos,
			CurrentPath: filepath.Base(path),
		}

		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		if err := tmpl.Execute(w, data); err != nil {
			http.Error(w, fmt.Sprintf("Failed to execute template: %v", err), http.StatusInternalServerError)
			return
		}
	}
}
