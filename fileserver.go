package main

import (
	"bufio"
	"bytes"
	"fmt"
	"html/template"
	"io"
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
	Type    string
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

func getFileType(filename string, root string) string {
	ext := strings.ToLower(filepath.Ext(filename))
	switch ext {
	case ".zip", ".rar", ".7z", ".tar", ".gz":
		return "archive"
	case ".mp3", ".wav", ".ogg", ".flac":
		return "audio"
	case ".html", ".css", ".js", ".py", ".go", ".java", ".cpp", ".c", ".h", ".md", ".markdown", ".scala", ".php":
		return "code"
	case ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx":
		return "document"
	case ".exe", ".app", ".out", ".run", ".bin":
		return "executable"
	case ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp":
		return "image"
	case ".pdf":
		return "pdf"
	case ".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm":
		return "video"
	default:
		fullPath := filepath.Join(root, filename)
		if isTextFile(fullPath) {
			return "text"
		}
		return "binary"
	}
}

func isTextFile(filePath string) bool {
	file, err := os.Open(filePath)
	if err != nil {
		return false
	}
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {

		}
	}(file)

	// ファイルの先頭1024バイトを読み込む
	buffer := make([]byte, 1024)
	n, err := file.Read(buffer)
	if err != nil && err != io.EOF {
		return false
	}

	// NULL バイトがあればバイナリファイルとみなす
	if bytes.IndexByte(buffer[:n], 0) != -1 {
		return false
	}

	// UTF-8でデコード可能かチェック
	reader := bufio.NewReader(bytes.NewReader(buffer[:n]))
	_, err = reader.ReadString('\n')
	return err == nil || err == io.EOF
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
			fileType := "folder"
			if !file.IsDir() {
				fileType = getFileType(file.Name(), path)
			}
			fileInfos = append(fileInfos, FileInfo{
				Name:    file.Name(),
				Size:    info.Size(),
				Mode:    info.Mode(),
				ModTime: info.ModTime(),
				IsDir:   file.IsDir(),
				Type:    fileType,
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
