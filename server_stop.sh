#!/bin/bash

# 智能教学演示系统 - 停止スクリプト
# Stop script for Intelligent Learning Demo System

echo "🛑 智能教学演示系统 停止中..."
echo "🛑 Stopping Intelligent Learning Demo System..."

# Webサーバー停止
echo "🌐 Stopping web server..."
if pgrep -f "http.server" > /dev/null; then
    pkill -f "http.server"
    echo "✅ Web server stopped"
else
    echo "ℹ️  Web server was not running"
fi

# Ollama停止
echo "📡 Stopping Ollama service..."
if pgrep -f "ollama serve" > /dev/null; then
    pkill -f "ollama serve"
    sleep 2
    
    if pgrep -f "ollama serve" > /dev/null; then
        echo "⚠️  Force stopping Ollama..."
        pkill -9 -f "ollama"
    fi
    echo "✅ Ollama service stopped"
else
    echo "ℹ️  Ollama service was not running"
fi

# ログファイルのクリーンアップ（オプション）
read -p "🗑️  Delete log files? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f ollama.log webserver.log
    echo "✅ Log files deleted"
fi

echo ""
echo "✅ システム停止完了! / System stopped successfully!"
echo "🔄 再起動方法 / To restart: ./start_server.sh"
