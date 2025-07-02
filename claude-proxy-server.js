const http = require('http');
const https = require('https');

const PORT = 3002;

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, anthropic-version',
    'Access-Control-Max-Age': '86400'
};

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200, corsHeaders);
        res.end();
        return;
    }

    // Only handle Claude API requests
    if (req.url !== '/api/claude') {
        res.writeHead(404, corsHeaders);
        res.end(JSON.stringify({ error: 'Not found. Use /api/claude endpoint.' }));
        return;
    }

    if (req.method !== 'POST') {
        res.writeHead(405, corsHeaders);
        res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
        return;
    }

    // Get API key from headers
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        res.writeHead(400, corsHeaders);
        res.end(JSON.stringify({ error: 'Missing x-api-key header' }));
        return;
    }

    // Collect request body
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const requestData = JSON.parse(body);
            console.log('Request data:', requestData);

            // Prepare Claude API request
            const claudeOptions = {
                hostname: 'api.anthropic.com',
                port: 443,
                path: '/v1/messages',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                }
            };

            const claudeReq = https.request(claudeOptions, (claudeRes) => {
                console.log(`Claude API response status: ${claudeRes.statusCode}`);
                
                let responseBody = '';
                claudeRes.on('data', chunk => {
                    responseBody += chunk.toString();
                });

                claudeRes.on('end', () => {
                    console.log('Claude API response:', responseBody);
                    
                    // Set CORS headers and forward response
                    const responseHeaders = { ...corsHeaders };
                    responseHeaders['Content-Type'] = 'application/json';
                    
                    res.writeHead(claudeRes.statusCode, responseHeaders);
                    res.end(responseBody);
                });
            });

            claudeReq.on('error', (err) => {
                console.error('Claude API request error:', err);
                res.writeHead(500, corsHeaders);
                res.end(JSON.stringify({ 
                    error: 'Claude API request failed', 
                    details: err.message 
                }));
            });

            // Send request to Claude API
            claudeReq.write(body);
            claudeReq.end();

        } catch (error) {
            console.error('Request parsing error:', error);
            res.writeHead(400, corsHeaders);
            res.end(JSON.stringify({ 
                error: 'Invalid JSON in request body', 
                details: error.message 
            }));
        }
    });
});

server.listen(PORT, () => {
    console.log(`Claude Proxy server running on http://localhost:${PORT}`);
    console.log(`Claude API endpoint: http://localhost:${PORT}/api/claude`);
    console.log('Ready to proxy requests to Claude API...');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down Claude proxy server...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});
