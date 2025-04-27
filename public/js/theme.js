document.addEventListener('DOMContentLoaded', function() {
    // テーマ切り替えボタンを取得
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    // ローカルストレージからテーマ設定を取得
    const currentTheme = localStorage.getItem('theme');
    
    // 保存されているテーマがあれば適用
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    }
    
    // テーマ切り替えボタンのクリックイベント
    themeToggleBtn.addEventListener('click', function() {
        // ダークモードの切り替え
        const isDarkMode = document.body.classList.toggle('dark-mode');
        
        // ローカルストレージにテーマ設定を保存
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
        // テーマアイコンを更新
        updateThemeIcon(isDarkMode);
    });
    
    // テーマアイコンを更新する関数
    function updateThemeIcon(isDarkMode) {
        const themeIcon = themeToggleBtn.querySelector('i');
        const themeText = themeToggleBtn.querySelector('span');
        
        if (isDarkMode) {
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = 'ライトモード切替';
        } else {
            themeIcon.className = 'fas fa-moon';
            themeText.textContent = 'ダークモード切替';
        }
    }
});