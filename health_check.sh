#!/bin/bash

# 智能教学演示系统 - 健康チェックスクリプト
# Health check script for Intelligent Learning Demo System

echo "🔍 システム健康チェック / System Health Check"
echo "================================================"

# 基本情報
echo "📊 System Information:"
echo "Date: $(date)"
echo "User: $(whoami)"
echo "Directory: $(pwd)"
echo ""

# Python チェック
echo "🐍 Python Check:"
if command -v python3 &> /dev/null; then
    echo "✅ Python 3: $(python3 --version)"
else
    echo "❌ Python 3: Not found"
fi
echo ""

# Ollama チェック
echo "📡 Ollama Service Check:"
if command -v ollama &> /dev/null; then
    echo "✅ Ollama installed: $(ollama --version 2>/dev/null || echo 'Version unknown')"
    
    # Ollama プロセスチェック
    if pgrep -f "ollama serve" > /dev/null; then
        echo "✅ Ollama process: Running (PID: $(pgrep -f 'ollama serve'))"
    else
        echo "❌ Ollama process: Not running"
    fi
    
    # Ollama API チェック
    if curl -s --max-time 5 http://localhost:11434/api/tags > /dev/null; then
        echo "✅ Ollama API: Responding"
        
        # モデルリスト
        echo "📋 Available models:"
        ollama list | head -10
    else
        echo "❌ Ollama API: Not responding"
    fi
else
    echo "❌ Ollama: Not installed"
fi
echo ""

# Webサーバーチェック
echo "🌐 Web Server Check:"
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "✅ Port 8000: In use"
    
    # HTTP レスポンスチェック
    if curl -s --max-time 5 http://localhost:8000 > /dev/null; then
        echo "✅ Web server: Responding"
        echo "📱 Access URL: http://localhost:8000"
    else
        echo "❌ Web server: Not responding"
    fi
else
    echo "❌ Port 8000: Not in use"
fi
echo ""

# ファイルチェック
echo "📁 File Check:"
required_files=("index.html" "config.js" "script.js" "styles.css")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file: Found"
    else
        echo "❌ $file: Missing"
    fi
done
echo ""

# ディスク容量チェック
echo "💾 Disk Space Check:"
df -h . | tail -1 | awk '{print "Available: " $4 " (" $5 " used)"}'
echo ""

# メモリ使用量チェック
echo "🧠 Memory Usage:"
free -h | grep "Mem:" | awk '{print "Total: " $2 ", Used: " $3 ", Available: " $7}'
echo ""

# ネットワークチェック
echo "🌐 Network Check:"
if ping -c 1 google.com > /dev/null 2>&1; then
    echo "✅ Internet connection: OK"
else
    echo "❌ Internet connection: Failed"
fi
echo ""

# 推奨アクション
echo "💡 Recommended Actions:"
if ! pgrep -f "ollama serve" > /dev/null; then
    echo "🔧 Start Ollama: ./daily_start.sh"
fi

if ! lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "🔧 Start Web server: ./daily_start.sh"
fi

if ! ollama list | grep -q "gemma3n:latest"; then
    echo "🔧 Install model: ollama pull gemma3n:latest"
fi

echo ""
echo "🎯 Health check completed!"
echo "📖 For more help: cat README.md"
