document.addEventListener('DOMContentLoaded', () => {
    const fileLinks = document.querySelectorAll('.file-link');
    const preview = document.getElementById('preview');
    const viewerContent = document.getElementById('viewer-content');
    const closeBtn = document.querySelector('.close');

    fileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filename = link.getAttribute('data-filename');
            const fileExtension = filename.split('.').pop().toLowerCase();

            switch (fileExtension) {
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'webp':
                case 'svg':
                case 'gif':
                    viewerContent.innerHTML = `<img src="${link.href}" alt="${filename}" style="max-width: 100%; max-height: 80vh;">`;
                    break;
                case 'mp3':
                case 'wav':
                    viewerContent.innerHTML = `<audio controls src="${link.href}">Your browser does not support the audio element.</audio>`;
                    break;
                case 'mp4':
                case 'webm':
                    viewerContent.innerHTML = `<video controls style="max-width: 100%; max-height: 80vh;"><source src="${link.href}" type="video/${fileExtension}">Your browser does not support the video tag.</video>`;
                    break;
                case 'pdf':
                    viewerContent.innerHTML = `<iframe src="${link.href}" style="width: 100%; height: 80vh;"></iframe>`;
                    break;
                case 'txt':
                    fetch(link.href)
                        .then(response => response.text())
                        .then(text => {
                            viewerContent.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word;">${text}</pre>`;
                        });
                    break;
                default:
                    window.location.href = link.href;
                    return;
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
});