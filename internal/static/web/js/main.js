document.addEventListener('DOMContentLoaded', () => {
    const fileLinks = document.querySelectorAll('.file-link');
    const preview = document.getElementById('preview');
    const viewerContent = document.getElementById('viewer-content');
    const closeBtn = document.querySelector('.close-button');
    const downloadBtn = document.querySelector('.download-button');
    const infoBtn = document.querySelector('.info-button');
    const filename = document.querySelector('.filename');
    const fileInfo = document.getElementById('file-info');
    const filePath = document.getElementById('file-path');
    const fileModified = document.getElementById('file-modified');
    const fileSize = document.getElementById('file-size');
    const fileType = document.getElementById('file-type');

    let currentFile = null;


    fileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const file = link.getAttribute('data-filename');
            if (!file) {
                console.error('Filename is missing');
                return;
            }
            currentFile = {
                name: file,
                path: link.href,
                type: link.closest('.item').classList[2],
                size: link.getAttribute('data-size'),
                modified: link.getAttribute('data-modified')
            };

            const fileExtension = file.split('.').pop().toLowerCase();
            const fileType = link.closest('.item').classList[2];

            filename.textContent = file;

            switch (fileType) {
                case 'image':
                    viewerContent.innerHTML = `<img src="${link.href}" alt="${file}">`;
                    break;
                case 'audio':
                    viewerContent.innerHTML = `<audio controls src="${link.href}">Your browser does not support the audio element.</audio>`;
                    break;
                case 'video':
                    viewerContent.innerHTML = `<video controls><source src="${link.href}" type="video/${fileExtension}">Your browser does not support the video tag.</video>`;
                    break;
                case 'pdf':
                    viewerContent.innerHTML = `<iframe src="${link.href}" style="width: 100%; height: 100%;"></iframe>`;
                    break;
                case 'text':
                case 'code':
                    fetch(link.href)
                        .then(response => response.text())
                        .then(text => {
                            viewerContent.innerHTML = `<pre><code class="language-${fileExtension}">${escapeHtml(text)}</code></pre>`;
                            highlightCode();
                        });
                    break;
                default:
                    viewerContent.innerHTML = `
                        <div style="text-align: center; padding: 20px; background-color: white; border-radius: 8px;">
                            <img src="/web/assets/pv-binary.svg" alt="File icon" id="binary-img">
                            <p>Preview not available for this file type.</p>
                        </div>
                    `;
            }

            preview.style.display = 'block';
            fileInfo.classList.add('hidden');
        });
    });

    closeBtn.addEventListener('click', closePreview);

    downloadBtn.addEventListener('click', () => {
        const file = filename.textContent;
        const link = document.createElement('a');
        link.href = file;
        link.download = file;
        link.click();
    });

    infoBtn.addEventListener('click', () => {
        if (currentFile) {
            filePath.textContent = currentFile.path;
            fileModified.textContent = currentFile.modified;
            fileSize.textContent = currentFile.size;
            fileType.textContent = currentFile.type;
            fileInfo.classList.toggle('hidden');
        }
    });

    closeBtn.addEventListener('click', closePreview);
    downloadBtn.addEventListener('click', () => {
        if (currentFile) {
            const link = document.createElement('a');
            link.href = currentFile.path;
            link.download = currentFile.name;
            link.click();
        }
    });

    viewerContent.addEventListener('click', (e) => {
        if (e.target === viewerContent) {
            closePreview();
        }
    });

    function closePreview() {
        preview.style.display = 'none';
        viewerContent.innerHTML = '';
        fileInfo.classList.add('hidden');
        currentFile = null;
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function highlightCode() {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    }
});