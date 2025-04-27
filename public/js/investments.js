/**
 * investments.js
 * 投資ページのメインJavaScriptファイル
 * 他のJSファイルを読み込んで初期化する
 */

// 必要なスクリプトを読み込む
document.addEventListener('DOMContentLoaded', function() {
    // データ関連のスクリプトを動的に読み込む
    loadScript('js/invest-data.js', function() {
        // コア機能のスクリプトを読み込む
        loadScript('js/invest-core.js', function() {
            // UI関連のスクリプトを読み込む
            loadScript('js/invest-ui.js', function() {
                console.log('全ての投資関連スクリプトが読み込まれました');
            });
        });
    });
});

// JavaScriptファイルを非同期で読み込む関数
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}