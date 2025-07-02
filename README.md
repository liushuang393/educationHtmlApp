# インテリジェント学習演示システム

## 概要

このシステムは、数学概念の学習に特化したインテリジェントなWebアプリケーションです。
複数のAI APIを活用して、ユーザーの質問に対して動的にSVGアニメーションと詳細な解説を生成し、視覚的で理解しやすい数学学習体験を提供します。

## 主要機能

### 🤖 マルチAPI統合システム
- **Ollama** (ローカル) → **OpenAI** → **Google Gemini** → **Claude** の順でフォールバック
- 各APIの設定、認証、エラーハンドリングを完全サポート
- リアルタイムAPI状態表示とモデル選択機能

### 🎨 動的コンテンツ生成
- 任意の数学概念に対してSVGアニメーション自動生成
- 多言語対応（中文・日本語）の完全バイリンガルインターフェース
- 数学公式の自動抽出と表示
- レスポンシブデザインによるマルチデバイス対応

### 📚 プリセット演示
- ピタゴラスの定理（勾股定理）
- 円の面積公式（圆的面积）
- 二次関数（二次函数）
- 三角関数（三角函数）

### 🔧 高度な機能
- 環境変数による安全なAPI密钥管理
- Claude API専用プロキシサーバー
- 自動ヘルスチェック機能
- カスタマイズ可能なAPI優先順位設定

## 🚀 クイックスタート

### 前提条件チェック
```bash
# Python 3がインストールされているか確認
python3 --version
# または
python --version

# Node.js（Claude APIプロキシサーバー用）
node -v
npm -v

# curl（Ollama インストール用）
curl --version
```

### 1分で起動
```bash
# 1. htmlAppフォルダに移動
cd /path/to/htmlApp

# 2. 実行権限を付与（初回のみ）
chmod +x start_server.sh health_check.sh

# 3. Webサーバー起動
# プロキシサーバー起動
node claude-proxy-server.js
./start_server.sh

# または手動起動
python3 -m http.server 8000
```

### アクセス
ブラウザで以下のURLを開く：
- **メインページ**: http://localhost:8000
- **中文版**: http://localhost:8000/learning_system_zh.html
- **日本語版**: http://localhost:8000/learning_system_ja.html

## 📋 環境構築

### システム要件

#### 必須要件
- **Python 3.6+** または **Node.js 14+**
- **ブラウザ**: Chrome, Firefox, Safari, Edge（最新版推奨）
- **ポート**: 8000（Webサーバー）、11434（Ollama）、3002（Claude プロキシ）
- **ネットワーク**: インターネット接続（初回セットアップ時）

#### 推奨要件
- **RAM**: 8GB以上（Ollamaモデル実行用）
- **ストレージ**: 10GB以上の空き容量
- **OS**: Linux, macOS, Windows 10/11

### ステップ1: 基本環境の準備

#### Python環境の確認
```bash
# Python 3の確認
python3 --version
# または
python --version

# 必要に応じてPythonをインストール
# Ubuntu/Debian
sudo apt update && sudo apt install python3 python3-pip

# macOS (Homebrew)
brew install python3

# Windows
# https://www.python.org/downloads/ からダウンロード
```

#### Node.js環境の確認（Claude API用）
```bash
# Node.jsの確認
node -v
npm -v
```

#### Node.jsインストール手順

**Ubuntu/Debian:**
```bash
# 1. NodeSourceリポジトリを追加
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

# 2. Node.jsをインストール
sudo apt-get install -y nodejs

# 3. インストール確認
node -v
npm -v
```

**CentOS/RHEL/Fedora:**
```bash
# 1. NodeSourceリポジトリを追加
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -

# 2. Node.jsをインストール
sudo yum install -y nodejs
# または（Fedora/新しいCentOS）
sudo dnf install -y nodejs

# 3. インストール確認
node -v
npm -v
```

**macOS:**
```bash
# Homebrewを使用
brew install node

# または公式インストーラーを使用
# https://nodejs.org/ja からダウンロード
```

**Windows:**
```bash
# 1. 公式サイトからダウンロード
# https://nodejs.org/ja

# 2. インストーラーを実行
# 3. PowerShellまたはコマンドプロンプトで確認
node -v
npm -v
```

### ステップ2: Ollama セットアップ（推奨）

#### Ollama インストール
```bash
# Linux/macOS
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# https://ollama.ai/download からダウンロード
```

#### モデルダウンロード
```bash
# 推奨モデル（デフォルト設定）
ollama pull gemma3n:latest

# その他の利用可能モデル
ollama pull qwen2.5:7b
ollama pull llama3.2:latest
ollama pull command-r7b:latest

# インストール済みモデル確認
ollama list
```

### ステップ3: 環境変数設定（API密钥管理）

#### .envファイルの作成
```bash
# htmlAppフォルダに移動
cd /path/to/htmlApp

# .env.exampleをコピーして.envファイルを作成
cp .env.example .env

# .envファイルを編集してAPI密钥を設定
nano .env
# または
vim .env
```

#### API密钥の設定
`.env`ファイルに以下の形式で実際のAPI密钥を入力：
```bash
# OpenAI API Key
OPENAI_API_KEY=sk-your-actual-openai-key-here

# Google Gemini API Key
GOOGLE_API_KEY=AIza-your-actual-google-key-here

# Claude API Key
CLAUDE_API_KEY=sk-ant-your-actual-claude-key-here
```

#### API密钥の取得方法
- **OpenAI**: https://platform.openai.com/ でアカウント作成後、API Keyを取得
- **Google Gemini**: https://makersuite.google.com/app/apikey でAPI Key取得
- **Claude**: https://console.anthropic.com/ でAPI Key取得

### ステップ4: サーバー起動

#### 自動起動スクリプト使用（推奨）
```bash
# 実行権限付与（初回のみ）
chmod +x start_server.sh health_check.sh

# サーバー起動
./start_server.sh
```

#### 手動起動
```bash
# Python 3 HTTP サーバー
python3 -m http.server 8000

# Python 2 HTTP サーバー（非推奨）
python -m SimpleHTTPServer 8000

# PHP 内蔵サーバー
php -S localhost:8000

# Node.js http-server
npx http-server -p 8000
```

#### Claude API プロキシサーバー起動（Claude使用時）

**プロキシサーバーが必要な理由:**
- Claude APIはCORS（Cross-Origin Resource Sharing）制限があるため
- ブラウザから直接Claude APIを呼び出すことができない
- プロキシサーバーがブラウザとClaude API間の仲介役となる

**起動手順:**
```bash
# 1. 別ターミナルを開く
# 2. htmlAppフォルダに移動
cd /path/to/htmlApp

# 3. プロキシサーバー起動
node claude-proxy-server.js

# 4. 起動確認メッセージ
# "Claude Proxy server running on http://localhost:3002"
# "Ready to proxy requests to Claude API..."
```

**バックグラウンド起動:**
```bash
# バックグラウンドで起動（推奨）
nohup node claude-proxy-server.js > claude-proxy.log 2>&1 &

# プロセス確認
ps aux | grep claude-proxy

# ログ確認
tail -f claude-proxy.log
```

**プロキシサーバーの停止:**
```bash
# フォアグラウンド実行の場合
# Ctrl+C で停止

# バックグラウンド実行の場合
pkill -f "claude-proxy-server"

# または特定のPIDで停止
kill <PID>
```

## 🎯 起動手順

### 完全起動手順
```bash
# 1. htmlAppフォルダに移動
cd /path/to/htmlApp

# 2. 環境変数設定（初回のみ）
cp .env.example .env
# .envファイルを編集してAPI密钥を設定

# 3. 実行権限付与（初回のみ）
chmod +x start_server.sh health_check.sh

# 4. Ollama起動（別ターミナル）
OLLAMA_ORIGINS="*" ollama serve

# 5. Claude プロキシサーバー起動（Claude使用時、別ターミナル）
node claude-proxy-server.js

# 6. Webサーバー起動
./start_server.sh

# 7. ブラウザでアクセス
# http://localhost:8000
```

### 簡易起動（Ollamaのみ使用）
```bash
# 1. Ollama起動
OLLAMA_ORIGINS="*" ollama serve &

# 2. Webサーバー起動
./start_server.sh
```

### プロキシサーバー詳細設定

#### Claude プロキシサーバーの設定確認
```bash
# プロキシサーバーファイルの確認
cat claude-proxy-server.js

# 設定内容:
# - ポート: 3002
# - CORS対応: 有効
# - エンドポイント: /api/claude
# - 対応メソッド: POST
```

#### プロキシサーバーのテスト
```bash
# プロキシサーバーが正常に動作しているかテスト
curl -X OPTIONS http://localhost:3002/api/claude \
  -H "Origin: http://localhost:8000" \
  -v

# 期待される応答:
# HTTP/1.1 200 OK
# Access-Control-Allow-Origin: *
```

#### 複数サーバーの同時起動
```bash
# ターミナル1: Ollama
OLLAMA_ORIGINS="*" ollama serve

# ターミナル2: Claude プロキシ
node claude-proxy-server.js

# ターミナル3: Webサーバー
./start_server.sh

# または一括起動スクリプト作成
cat > start_all.sh << 'EOF'
#!/bin/bash
echo "🚀 全サービス起動中..."

# Ollama起動
echo "📡 Ollama起動..."
OLLAMA_ORIGINS="*" nohup ollama serve > ollama.log 2>&1 &

# Claude プロキシ起動
echo "🔗 Claude プロキシ起動..."
nohup node claude-proxy-server.js > claude-proxy.log 2>&1 &

# 少し待機
sleep 3

# Webサーバー起動
echo "🌐 Webサーバー起動..."
./start_server.sh
EOF

chmod +x start_all.sh
```

### ヘルスチェック
```bash
# システム状態確認
./health_check.sh
```

## 📝 使用方法

### 基本的な使用フロー
1. **ブラウザアクセス**: `http://localhost:8000`
2. **言語選択**: 中文版または日本語版を選択
3. **AI API選択**: 右上のドロップダウンでAPIとモデルを選択
4. **質問入力**: 数学概念について自然言語で質問
5. **結果確認**: AI生成のSVGアニメーションと詳細解説を確認

### 対応する質問例

#### プリセット演示（高速応答）
- 「ピタゴラスの定理を演示して」
- 「円の面積公式を説明して」
- 「二次関数とは何ですか」
- 「三角関数を教えて」

#### 動的生成（AI生成）
- 「微分とは何ですか」
- 「フーリエ変換を説明して」
- 「ベクトルの内積について」
- 「確率分布を視覚化して」

### API優先順位とフォールバック
1. **Ollama** (ローカル、高速、無料) ← 推奨
2. **OpenAI** (高品質、有料)
3. **Google Gemini** (バランス、有料)
4. **Claude** (高品質、有料)

## ✅ セットアップチェックリスト

### 初回セットアップ
- [ ] Python 3.6+ または Node.js 14+ インストール済み
- [ ] Ollama インストール済み（推奨）
- [ ] gemma3n:latest モデルダウンロード済み
- [ ] .envファイル作成とAPI密钥設定済み
- [ ] 実行権限付与済み (`chmod +x *.sh`)

### 起動前チェック
```bash
# ポート使用状況確認
lsof -i :8000   # Webサーバー用
lsof -i :11434  # Ollama用
lsof -i :3002   # Claude プロキシ用

# プロセス確認
ps aux | grep ollama
ps aux | grep "http.server"
ps aux | grep "claude-proxy"
```

### 起動手順
1. [ ] Ollama起動: `OLLAMA_ORIGINS="*" ollama serve`
2. [ ] Claude プロキシ起動: `node claude-proxy-server.js`（Claude使用時）
3. [ ] Webサーバー起動: `./start_server.sh`
4. [ ] ブラウザアクセス: `http://localhost:8000`

### 動作確認
- [ ] メインページが表示される
- [ ] 言語選択ボタンが動作する
- [ ] 学習システムページが開く
- [ ] API選択ドロップダウンが動作する
- [ ] プリセット演示が動作する
- [ ] AI質問応答が動作する

### トラブル時チェック
```bash
# ヘルスチェック実行
./health_check.sh

# ログ確認
tail -f ollama.log
# ブラウザコンソールでエラー確認（F12）
```

## 📁 ファイル構成

```
htmlApp/
├── index.html                  # メインランディングページ
├── learning_system_zh.html     # 中文版学習システム
├── learning_system_ja.html     # 日本語版学習システム
├── script.js                   # メインJavaScript（UIロジック）
├── config.js                   # API設定管理システム
├── env-loader.js               # 環境変数読み込み機能
├── styles.css                  # スタイルシート
├── claude-proxy-server.js      # Claude API プロキシサーバー
├── proxy-server.js             # 汎用プロキシサーバー
├── start_server.sh             # Webサーバー起動スクリプト
├── health_check.sh             # システムヘルスチェック
├── server_stop.sh              # サーバー停止スクリプト
├── .env.example                # 環境変数テンプレート
├── .env                        # 実際のAPI密钥（Git管理外）
├── .gitignore                  # Git除外設定
├── protocol_explanation.html   # プロトコル説明ページ
├── java/                       # Javaサンプルコード
│   ├── LinkedListExample.java
│   └── NoLinkedListexample.java
└── README.md                   # このファイル
```

## 🏗️ アーキテクチャ

### コンポーネント構成
- **フロントエンド**: HTML5 + CSS3 + Vanilla JavaScript
- **バックエンド**: Python HTTP Server / Node.js HTTP Server
- **AI統合**: マルチAPI対応（Ollama, OpenAI, Google Gemini, Claude）
- **プロキシ**: Claude API専用プロキシサーバー（CORS対応）

### 技術スタック
- **言語**: JavaScript (ES6+), HTML5, CSS3, Node.js, Python
- **フレームワーク**: なし（Vanilla JavaScript）
- **ライブラリ**: なし（依存関係最小化）
- **API**: RESTful API, Fetch API
- **アニメーション**: SVG + CSS Animations
- **レスポンシブ**: CSS Grid, Flexbox

### データフロー
1. **ユーザー入力** → フロントエンド（script.js）
2. **API選択** → 設定管理（config.js）
3. **API呼び出し** → プロキシサーバー（必要に応じて）
4. **レスポンス処理** → SVG生成 + 表示
5. **エラーハンドリング** → フォールバック機能

## 🔧 設定とカスタマイズ

### API設定の変更
```javascript
// config.js内でデフォルトAPIを変更
defaultAPI: 'ollama', // 'ollama', 'openai', 'google', 'claude'

// モデルの変更
configs: {
    ollama: {
        model: 'gemma3n', // 使用するモデル名
        availableModels: ['gemma3n:latest', 'qwen3:latest', ...]
    }
}
```

### 新しいAPIの追加
1. `config.js`の`configs`オブジェクトに新しいAPI設定を追加
2. `callAPI`メソッドに新しいAPIのケースを追加
3. `parseResponse`メソッドに対応するパーサーを実装

### 言語の追加
1. `script.js`の`TEXTS`オブジェクトに新しい言語の翻訳を追加
2. 新しいHTMLファイルを作成（例：`learning_system_ko.html`）
3. 言語切り替えボタンを更新

### スタイルのカスタマイズ
```css
/* styles.css内で色やレイアウトを変更 */
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #fd79a8;
}
```

## 🚨 トラブルシューティング

### よくある問題と解決方法

#### 1. ポート競合エラー
```bash
# 問題: "Address already in use"
# 解決方法: 使用中のポートを確認して停止
lsof -i :8000
kill <PID>

# または別のポートを使用
python3 -m http.server 8080
```

#### 2. Ollama接続エラー
```bash
# 問題: "model 'gemma3n:latest' not found"
# 解決方法: モデルをダウンロード
ollama pull gemma3n:latest
ollama list  # 確認

# 問題: "HTTP error! status: 404"
# 解決方法: Ollamaサービス確認
ps aux | grep ollama
OLLAMA_ORIGINS="*" ollama serve
```

#### 3. CORS エラー
```bash
# 問題: "CORS policy blocked"
# 解決方法1: CORS対応でOllama起動
OLLAMA_ORIGINS="*" ollama serve

# 解決方法2: プロキシサーバー使用
node claude-proxy-server.js

# 解決方法3: ブラウザでfile://ではなくhttp://でアクセス
# ❌ 間違い: file:///path/to/index.html
# ✅ 正しい: http://localhost:8000/index.html
```

#### 4. API密钥エラー
```bash
# 問題: "API key missing"
# 解決方法: .envファイル確認
cat .env
# API密钥が正しく設定されているか確認

# 問題: "Invalid API key"
# 解決方法: API提供者のダッシュボードで密钥の有効性を確認
```

#### 5. パフォーマンス問題
```bash
# 問題: 応答が遅い
# 解決方法: システムリソース確認
free -h          # メモリ使用量
top | grep ollama # CPU使用率

# 軽量モデルに変更
ollama pull qwen2.5:1.5b
# config.jsでモデル名を変更
```

### デバッグ方法

#### ブラウザデバッグ
```bash
# 1. ブラウザ開発者ツールを開く（F12）
# 2. Console タブでJavaScriptエラー確認
# 3. Network タブでAPI呼び出し状況確認
# 4. Application タブでlocalStorage確認
```

#### ログ確認
```bash
# Webサーバーログ（ターミナルでリアルタイム確認）
python3 -m http.server 8000

# Ollamaログ
tail -f ollama.log

# Claude プロキシログ
# node claude-proxy-server.js の出力を確認
```

#### API接続テスト
```bash
# Ollama API テスト
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model": "gemma3n:latest", "prompt": "Test", "stream": false}'

# Claude プロキシテスト
curl -X POST http://localhost:3002/api/claude \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-claude-api-key" \
  -d '{"model": "claude-3-sonnet-20240229", "max_tokens": 100, "messages": [{"role": "user", "content": "Hello"}]}'
```

## 🔧 サービス管理

### 起動・停止コマンド

#### Webサーバー
```bash
# 起動
./start_server.sh
# または
python3 -m http.server 8000

# 停止
# Ctrl+C または
pkill -f "http.server"
```

#### Ollama
```bash
# 起動
OLLAMA_ORIGINS="*" ollama serve

# バックグラウンド起動
nohup OLLAMA_ORIGINS="*" ollama serve > ollama.log 2>&1 &

# 停止
pkill ollama
```

#### Claude プロキシ
```bash
# 起動
node claude-proxy-server.js

# バックグラウンド起動
nohup node claude-proxy-server.js > claude-proxy.log 2>&1 &

# 停止
pkill -f "claude-proxy-server"
```

### 状態確認
```bash
# 全体ヘルスチェック
./health_check.sh

# 個別確認
lsof -i :8000   # Webサーバー
lsof -i :11434  # Ollama
lsof -i :3002   # Claude プロキシ
```

## カスタマイズ

### 新しいAPIの追加
1. `config.js`の`getDefaultConfig()`に設定追加
2. `script.js`の`callLLMAPI()`にケース追加
3. 対応するAPI呼び出し関数を実装

### 新しい言語の追加
1. `script.js`の`TEXTS`オブジェクトに翻訳追加
2. 新しいHTMLファイルを作成
3. 言語切り替えボタンを更新

## 📚 参考資料

### 公式ドキュメント
- [Ollama Documentation](https://ollama.ai/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Google Gemini API](https://ai.google.dev/docs)
- [Claude API Documentation](https://docs.anthropic.com/)

### 関連ファイル
- `debug_test.html` - API接続テスト用
- `protocol_explanation.html` - プロトコルの違い説明
- `daily_start.sh` - 日常起動スクリプト
- `daily_stop.sh` - 停止スクリプト
- `health_check.sh` - システム健康チェック

## 🤝 サポート

### よくある質問
1. **Q: モデルが見つからないエラーが出る**
   A: `ollama pull gemma3n:latest` でモデルをダウンロード

2. **Q: ブラウザでアクセスできない**
   A: `http://localhost:8000` でアクセス（file://は使用不可）

3. **Q: API呼び出しが失敗する**
   A: `./health_check.sh` でシステム状態を確認

4. **Q: パフォーマンスが悪い**
   A: より軽量なモデル（qwen2.5:1.5b等）に変更を検討

### トラブル時の連絡先
- GitHub Issues: プロジェクトリポジトリ
- ログファイル: `ollama.log`, `webserver.log`

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🎯 貢献

プルリクエストやイシューの報告を歓迎します。

### 開発環境セットアップ
```bash
# リポジトリクローン
git clone <repository-url>
cd htmlApp

# 開発用起動
./daily_start.sh

# 健康チェック
./health_check.sh
```

---

## ⚠️ 重要な注意事項

1. **セキュリティ**: API keyは安全に管理し、公開リポジトリにコミットしないでください
2. **プロトコル**: 必ずWebサーバー経由（http://）でアクセスしてください
3. **ポート**: 8000番と11434番ポートが必要です
4. **リソース**: Ollamaモデル実行には十分なメモリ（8GB+推奨）が必要です

## 🎉 最後に

このシステムを使用して、効果的な数学教育を実現してください！

**Happy Learning! 📚✨**

---

## 🔐 環境変数管理（新機能）

### セキュリティ強化

このシステムでは、API密钥を安全に管理するために環境変数システムを導入しています。

### 設定手順

#### 1. 環境変数ファイルの作成
```bash
# .env.example をコピーして .env ファイルを作成
cp .env.example .env
```

#### 2. API密钥の設定
`.env` ファイルを編集して、実際のAPI密钥を入力：

```bash
# OpenAI API Key
OPENAI_API_KEY=sk-your-actual-openai-key-here

# Google Gemini API Key
GOOGLE_API_KEY=AIza-your-actual-google-key-here

# Claude API Key
CLAUDE_API_KEY=sk-ant-your-actual-claude-key-here
```

#### 3. ファイル構成
- `.env` - 実際のAPI密钥（**Git管理対象外**）
- `.env.example` - テンプレートファイル（Git管理対象）
- `.gitignore` - `.env`ファイルを除外設定済み

### 安全性の特徴

✅ **API密钥の分離**: ソースコードから密钥を完全分離
✅ **Git除外**: `.env`ファイルは自動的にGit管理から除外
✅ **テンプレート提供**: `.env.example`で設定方法を明示
✅ **自動読み込み**: ページ読み込み時に自動的に環境変数を読み込み
✅ **フォールバック**: 環境変数が見つからない場合の適切な処理

### 使用方法

1. **初回設定**: `.env`ファイルを作成してAPI密钥を設定
2. **通常使用**: 特別な操作は不要、自動的に読み込まれます
3. **共有時**: `.env.example`をテンプレートとして使用

### トラブルシューティング

#### 問題: 環境変数が読み込まれない
```bash
# 解決方法
1. .envファイルが存在するか確認
2. ファイル形式が正しいか確認（KEY=VALUE）
3. ブラウザコンソールでエラーメッセージを確認
```

#### 問題: API密钥が無効
```bash
# 解決方法
1. .envファイルの密钥が正しいか確認
2. API提供者のダッシュボードで密钥の有効性を確認
3. 密钥の権限設定を確認
```

### 開発者向け情報

#### ファイル構成
```
htmlApp/
├── .env                 # 実際のAPI密钥（Git管理外）
├── .env.example         # テンプレート（Git管理対象）
├── .gitignore          # .envを除外設定
├── env-loader.js       # 環境変数読み込み機能
├── config.js           # API設定管理
└── ...
```

#### 技術仕様
- **読み込み方式**: Fetch APIによる`.env`ファイル読み込み
- **解析方式**: 正規表現による`KEY=VALUE`形式の解析
- **セキュリティ**: ブラウザ環境での安全な密钥管理
- **互換性**: 既存のconfig.jsシステムとの完全互換

この環境変数システムにより、API密钥を安全に管理しながら、GitHubなどの公開リポジトリに安心してコードを公開できます。
>>>>>>> 3f1b6cf (初期新規)
