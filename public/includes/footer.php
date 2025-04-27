</main>
    </div>
    
    <!-- 新規取引モーダル -->
    <div class="modal" id="transaction-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>新規取引</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="transaction-form">
                    <div class="transaction-type">
                        <button type="button" class="transaction-type-btn active" data-type="income">
                            <i class="fas fa-plus"></i> 収入
                        </button>
                        <button type="button" class="transaction-type-btn" data-type="expense">
                            <i class="fas fa-minus"></i> 支出
                        </button>
                    </div>
                    
                    <div class="form-group">
                        <label for="amount">金額</label>
                        <input type="number" id="amount" name="amount" step="0.01" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="category">カテゴリ</label>
                        <select id="category" name="category">
                            <optgroup label="収入" id="income-categories">
                                <option value="給料">給料</option>
                                <option value="ボーナス">ボーナス</option>
                                <option value="副収入">副収入</option>
                                <option value="その他収入">その他収入</option>
                            </optgroup>
                            <optgroup label="支出" id="expense-categories">
                                <option value="食費">食費</option>
                                <option value="住居費">住居費</option>
                                <option value="光熱費">光熱費</option>
                                <option value="通信費">通信費</option>
                                <option value="交通費">交通費</option>
                                <option value="娯楽費">娯楽費</option>
                                <option value="医療費">医療費</option>
                                <option value="教育費">教育費</option>
                                <option value="貯蓄">貯蓄</option>
                                <option value="投資">投資</option>
                                <option value="その他支出">その他支出</option>
                            </optgroup>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="date">日付</label>
                        <input type="date" id="date" name="date" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="memo">メモ</label>
                        <textarea id="memo" name="memo" rows="3"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary btn-block">保存</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <script src="js/theme.js"></script>
    <script src="js/mobile.js"></script>
</body>
</html>