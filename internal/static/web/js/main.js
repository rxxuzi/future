document.addEventListener('DOMContentLoaded', () => {
    const fileLinks = document.querySelectorAll('.file-link');
    const preview = document.getElementById('preview');
    const viewerContent = document.getElementById('viewer-content');
    const closeBtn = document.querySelector('.close');

    fileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filename = link.getAttribute('data-filename');
            if (!filename) {
                console.error('Filename is missing');
                return;
            }
            const fileExtension = filename.split('.').pop().toLowerCase();
            const fileType = link.closest('.item').classList[2]; // Get the file type class

            switch (fileType) {
                case 'image':
                    viewerContent.innerHTML = `<img src="${link.href}" alt="${filename}" style="max-width: 100%; max-height: 80vh;">`;
                    break;
                case 'audio':
                    viewerContent.innerHTML = `<audio controls src="${link.href}">Your browser does not support the audio element.</audio>`;
                    break;
                case 'video':
                    viewerContent.innerHTML = `<video controls style="max-width: 100%; max-height: 80vh;"><source src="${link.href}" type="video/${fileExtension}">Your browser does not support the video tag.</video>`;
                    break;
                case 'pdf':
                    viewerContent.innerHTML = `<iframe src="${link.href}" style="width: 100%; height: 80vh;"></iframe>`;
                    break;
                case 'text':
                case 'code':
                    fetch(link.href)
                        .then(response => response.text())
                        .then(text => {
                            viewerContent.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word; max-height: 80vh; overflow-y: auto;"><code class="language-${fileExtension}">${escapeHtml(text)}</code></pre>`;
                            highlightCode();
                        });
                    break;
                case 'archive':
                case 'document':
                    viewerContent.innerHTML = `
                        <div style="text-align: center; padding: 20px;">
                            <img src="/web/assets/${fileType}-icon.svg" alt="${fileType} icon" style="width: 64px; height: 64px;">
                            <p>Preview not available for ${fileType} files.</p>
                            <a href="${link.href}" download="${filename}" class="download-btn">Download</a>
                        </div>
                    `;
                    break;
                case 'binary':
                    viewerContent.innerHTML = `
                        <div style="text-align: center; padding: 20px;">
                            <img src="/web/assets/pv-binary.svg" alt="Binary file icon" style="width: 256px; height: 256px;">
                            <p>Preview not available for binary files.</p>
                            <a href="${link.href}" download="${filename}" class="download-btn">Download</a>
                        </div>
                    `;
                    break;
                default:
                    viewerContent.innerHTML = `
                        <div style="text-align: center; padding: 20px;">
                            <p>Preview not available for this file type.</p>
                            <a href="${link.href}" download="${filename}" class="download-btn">Download</a>
                        </div>
                    `;
            }

            preview.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', () => {
        preview.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === preview) {
            preview.style.display = 'none';
        }
    });

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