package server

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

func GetFileIcon(filename string, fileType string) string {
	ext := strings.ToLower(filepath.Ext(filename))

	switch fileType {
	case "archive":
		return "fas fa-file-archive"
	case "audio":
		return "fas fa-file-audio"
	case "code":
		return "fas fa-file-code"
	case "document":
		switch ext {
		case ".doc", ".docx":
			return "fas fa-file-word"
		case ".xls", ".xlsx":
			return "fas fa-file-excel"
		case ".ppt", ".pptx":
			return "fas fa-file-powerpoint"
		case ".pdf":
			return "fas fa-file-pdf"
		default:
			return "fas fa-file-alt"
		}
	case "image":
		return "fas fa-file-image"
	case "pdf":
		return "fas fa-file-pdf"
	case "text":
		switch ext {
		case ".txt":
			return "fas fa-file-alt"
		case ".md", ".markdown":
			return "fab fa-markdown"
		case ".json":
			return "fas fa-brackets-curly"
		case ".xml":
			return "fas fa-code"
		case ".csv":
			return "fas fa-file-csv"
		default:
			return "fas fa-file-alt"
		}
	case "video":
		return "fas fa-file-video"
	case "executable":
		return "fas fa-cog"
	case "binary":
		return "fas fa-file"
	default:
		return "fas fa-file"
	}
}

func GetFileType(filename string, root string) string {
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

func isVideo(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	return ext == ".mp4" || ext == ".webm" || ext == ".ogg" || ext == ".mov"
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
				fileType = GetFileType(file.Name(), path)
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
			"formatSize": formatSize,
			"formatTime": formatTime,
			"isImage":    isImage,
			"isVideo":    isVideo,
			"truncate":   truncate,
			"getFileIcon": func(name string) string {
				for _, file := range fileInfos {
					if file.Name == name {
						return GetFileIcon(name, file.Type)
					}
				}
				return "fas fa-file"
			},
		}).Parse(string(tmplContent))

		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to parse template: %v", err), http.StatusInternalServerError)
			return
		}

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
