#!/bin/bash

# Simple script to start a web server for the htmlApp

echo "🚀 Starting web server for htmlApp..."
echo "📁 Current directory: $(pwd)"

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the htmlApp directory."
    exit 1
fi

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Try different ports
PORTS="8000 8080 3000 5000 8888"
SELECTED_PORT=""

for port in $PORTS; do
    if ! check_port $port; then
        SELECTED_PORT=$port
        break
    fi
done

if [ -z "$SELECTED_PORT" ]; then
    echo "❌ All common ports are in use. Please stop other servers or use a different port."
    exit 1
fi

echo "🌐 Starting server on port $SELECTED_PORT..."
echo "📱 Access your app at: http://localhost:$SELECTED_PORT"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Try different server options
if command -v python3 &> /dev/null; then
    echo "🐍 Using Python 3 HTTP server..."
    python3 -m http.server $SELECTED_PORT
elif command -v python &> /dev/null; then
    echo "🐍 Using Python HTTP server..."
    python -m http.server $SELECTED_PORT
elif command -v php &> /dev/null; then
    echo "🐘 Using PHP built-in server..."
    php -S localhost:$SELECTED_PORT
elif command -v node &> /dev/null; then
    echo "🟢 Using Node.js http-server..."
    npx http-server -p $SELECTED_PORT
else
    echo "❌ No suitable server found. Please install Python, PHP, or Node.js."
    exit 1
fi
