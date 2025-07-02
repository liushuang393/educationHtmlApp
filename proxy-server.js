const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3001;

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, anthropic-version',
    'Access-Control-Max-Age': '86400'
};

const server = http.createServer((req, res) => {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200, corsHeaders);
        res.end();
        return;
    }

    // Parse the request URL
    const parsedUrl = url.parse(req.url, true);
    const targetUrl = parsedUrl.query.url;

    if (!targetUrl) {
        res.writeHead(400, corsHeaders);
        res.end(JSON.stringify({ error: 'Missing target URL parameter' }));
        return;
    }

    // Parse target URL
    const target = url.parse(targetUrl);
    const isHttps = target.protocol === 'https:';
    const httpModule = isHttps ? https : http;

    // Prepare request options
    const options = {
        hostname: target.hostname,
        port: target.port || (isHttps ? 443 : 80),
        path: target.path,
        method: req.method,
        headers: { ...req.headers }
    };

    // Remove host header to avoid conflicts
    delete options.headers.host;
    delete options.headers.origin;
    delete options.headers.referer;

    // Make the proxy request
    const proxyReq = httpModule.request(options, (proxyRes) => {
        // Set CORS headers
        const responseHeaders = { ...corsHeaders, ...proxyRes.headers };
        res.writeHead(proxyRes.statusCode, responseHeaders);
        
        // Pipe the response
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
        console.error('Proxy request error:', err);
        res.writeHead(500, corsHeaders);
        res.end(JSON.stringify({ error: 'Proxy request failed', details: err.message }));
    });

    // Pipe the request body
    req.pipe(proxyReq);
});

server.listen(PORT, () => {
    console.log(`CORS Proxy server running on http://localhost:${PORT}`);
    console.log(`Usage: http://localhost:${PORT}/?url=TARGET_URL`);
});
// node proxy-server.js