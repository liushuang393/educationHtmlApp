#!/usr/bin/env python3
"""
Simple CORS proxy server to handle API requests from the browser
"""

import http.server
import socketserver
import urllib.request
import urllib.parse
import json
from urllib.parse import urlparse, parse_qs

class CORSProxyHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def do_POST(self):
        """Handle POST requests"""
        try:
            # Parse query parameters
            parsed_path = urlparse(self.path)
            query_params = parse_qs(parsed_path.query)
            
            target_url = query_params.get('url', [None])[0]
            if not target_url:
                self.send_error_response(400, "Missing target URL parameter")
                return

            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length) if content_length > 0 else None

            # Create request to target URL
            req = urllib.request.Request(target_url, data=post_data)
            
            # Copy relevant headers
            for header_name, header_value in self.headers.items():
                if header_name.lower() not in ['host', 'origin', 'referer']:
                    req.add_header(header_name, header_value)

            # Make the request
            with urllib.request.urlopen(req) as response:
                response_data = response.read()
                
                # Send response
                self.send_response(response.status)
                self.send_cors_headers()
                
                # Copy response headers
                for header_name, header_value in response.headers.items():
                    if header_name.lower() not in ['access-control-allow-origin']:
                        self.send_header(header_name, header_value)
                
                self.end_headers()
                self.wfile.write(response_data)

        except Exception as e:
            print(f"Proxy error: {e}")
            self.send_error_response(500, f"Proxy request failed: {str(e)}")

    def send_cors_headers(self):
        """Send CORS headers"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, anthropic-version')
        self.send_header('Access-Control-Max-Age', '86400')

    def send_error_response(self, status_code, message):
        """Send error response with CORS headers"""
        self.send_response(status_code)
        self.send_cors_headers()
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        error_response = json.dumps({"error": message})
        self.wfile.write(error_response.encode())

    def log_message(self, format, *args):
        """Override to reduce log noise"""
        print(f"[{self.address_string()}] {format % args}")

if __name__ == "__main__":
    PORT = 3001
    
    with socketserver.TCPServer(("", PORT), CORSProxyHandler) as httpd:
        print(f"CORS Proxy server running on http://localhost:{PORT}")
        print(f"Usage: http://localhost:{PORT}/?url=TARGET_URL")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down proxy server...")
            httpd.shutdown()
