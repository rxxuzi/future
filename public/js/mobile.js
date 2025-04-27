document.addEventListener('DOMContentLoaded', function() {
    // モバイルメニューの要素を取得
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebar = document.querySelector('.sidebar');
    
    // モバイルメニュートグルボタンのクリックイベント
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            // ボディのスクロールを無効化（サイドメニュー表示中）
            if (sidebar.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    // サイドバー閉じるボタンのクリックイベント
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            sidebar.classList.remove('open');
            document.body.style.overflow = '';
        });
    }
    
    // サイドバーの外側をクリックしても閉じる（モバイル時のみ）
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && 
            sidebar.classList.contains('open') && 
            !sidebar.contains(event.target) && 
            event.target !== mobileMenuToggle && 
            !mobileMenuToggle.contains(event.target)) {
            sidebar.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
    
    // リサイズイベント（ウィンドウサイズが変わった時にサイドバーの状態をリセット）
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
    
    // モバイルテーマトグルボタンのクリックイベント
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', function() {
            // ダークモードの切り替え
            const isDarkMode = document.body.classList.toggle('dark-mode');
            
            // ローカルストレージにテーマ設定を保存
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            
            // テーマアイコンを更新
            updateMobileThemeIcon(isDarkMode);
        });
        
        // 初期アイコン状態の設定
        updateMobileThemeIcon(document.body.classList.contains('dark-mode'));
    }
    
    // モバイルテーマアイコンを更新する関数
    function updateMobileThemeIcon(isDarkMode) {
        const themeIcon = mobileThemeToggle.querySelector('i');
        
        if (isDarkMode) {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }
});