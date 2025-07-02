// =================================================================================
// API Configuration and Management for the Intelligent Learning System
// =================================================================================

(function(window) {
    'use strict';

    // --- Helper Functions ---

    /**
     * Extracts a mathematical formula from the AI's response text.
     * @param {string} text - The text to search for a formula.
     * @returns {string} The extracted formula or an empty string.
     */
    function extractFormula(text) {
        if (!text) return '';
        const patterns = [
            /(?:\\[|\\\(|\$\$|\$)(.*?)(?:\\]|\\\)|\$\$|\$)/, // LaTeX delimiters
            /([a-zA-Z]\s?²\s?[+\-]\s?[a-zA-Z]\s?²\s?=\s?[a-zA-Z]\s?²)/, // Pythagorean theorem like a² + b² = c²
            /([A-Z]\s?=\s?π\s?r\s?²)/, // Circle area like A = πr²
            /(y\s?=\s?ax²\s?[+\-]\s?bx\s?[+\-]\s?c)/, // Quadratic function
            /(sin|cos|tan)\(θ\)\s?=\s?.*?\/.*?/ // Trigonometric functions
        ];
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1]) return match[1].trim();
        }
        return '';
    }

    /**
     * Extracts an SVG string from the AI's response text.
     * @param {string} text - The text to search for an SVG.
     * @returns {string} The extracted SVG code or an empty string.
     */
    function extractSVG(text) {
        if (!text) return '';
        const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/);
        return svgMatch ? svgMatch[0] : '';
    }

    // --- Prompt Generation ---

    /**
     * Generates a detailed prompt for the AI based on the user's question and language.
     * @param {string} question - The user's question.
     * @param {string} language - The current language ('zh' or 'ja').
     * @returns {string} The generated prompt.
     */
    function getAIPrompt(question, language) {
        const commonInstructions = `
            Your task is to be a math education expert.
            1.  **Explanation**: Provide a clear, concise, and easy-to-understand explanation of the mathematical concept. Structure it with a definition, the main formula (if any), and a real-world application.
            2.  **SVG Animation**: Generate a simple, clean, and illustrative SVG animation to demonstrate the concept. The SVG should be self-contained, use CSS animations, and be visually appealing. The animation should loop infinitely.
                - The SVG size should be viewBox="0 0 400 300".
                - Use colors like #3B82F6 (blue), #10B981 (green), #F97316 (orange), and #EF4444 (red).
                - Animate elements to illustrate the concept dynamically (e.g., drawing lines, moving shapes).
            3.  **Output Format**: Respond with a single JSON object. Do not include any text outside of this JSON object. The JSON must have two keys: "explanation" (a string) and "svg" (a string containing the SVG code).
        `;

        if (language === 'ja') {
            return `
                ユーザーの質問：「${question}」

                あなたは数学教育の専門家です。以下のタスクを実行してください。
                1.  **説明**: この数学の概念について、明確で簡潔、かつ分かりやすい説明を提供してください。定義、主要な公式（もしあれば）、そして実世界での応用例を含む構成にしてください。
                2.  **SVGアニメーション**: この概念を説明するための、シンプルでクリーン、そして分かりやすいSVGアニメーションを生成してください。SVGは自己完結型で、CSSアニメーションを使用し、視覚的に魅力的である必要があります。アニメーションは無限にループするようにしてください。
                    - SVGのサイズは viewBox="0 0 400 300" としてください。
                    - 色は #3B82F6 (青), #10B981 (緑), #F97316 (オレンジ), #EF4444 (赤) などを活用してください。
                    - 概念を動的に示すために要素をアニメーション化してください（例：線の描画、図形の移動）。
                3.  **出力形式**: 単一のJSONオブジェクトで応答してください。このJSONオブジェクトの外には何もテキストを含めないでください。JSONには「explanation」（文字列）と「svg」（SVGコードを含む文字列）の2つのキーが必要です。
            `;
        }

        // Default to Chinese
        return `
            用户问题：“${question}”

            你的任务是扮演一名数学教育专家。
            1.  **解释**: 针对这个数学概念，提供一个清晰、简洁、易于理解的解释。内容应包含定义、主要公式（如有），以及一个实际应用场景。
            2.  **SVG 动画**: 生成一个简单、清晰、有说明性的 SVG 动画来演示这个概念。SVG 代码必须是自包含的，使用 CSS 动画，并且视觉上要吸引人。动画需要无限循环。
                - SVG 尺寸应为 viewBox="0 0 400 300"。
                - 使用 #3B82F6 (蓝色), #10B981 (绿色), #F97316 (橙色), #EF4444 (红色) 等颜色。
                - 通过动画动态地展示概念（例如：绘制线条、移动形状）。
            3.  **输出格式**: 请以一个单独的 JSON 对象进行响应。不要在此 JSON 对象之外包含任何文本。此 JSON 必须包含两个键："explanation"（字符串）和 "svg"（包含 SVG 代码的字符串）。
        `;
    }


    // --- API Configuration Manager ---

    const apiConfigManager = {
        // Default configurations. Can be overridden by user settings.
        defaultAPI: 'ollama', // 默认优先使用的API（推荐使用本地Ollama避免CORS问题）
        configs: {
            ollama: {
                enabled: false,
                url: 'http://localhost:11434/api/generate',
                model: 'gemma3n', // 当前选择的模型
                availableModels: ['gemma3n:latest', 'qwen3:latest', 'command-r7b:latest', 'llama3:latest'], // 可选模型列表
                headers: { 'Content-Type': 'application/json' },
                useProxy: false // Set to true if CORS issues occur
            },
            openai: {
                enabled: false, // Disabled by default, requires user key
                url: 'https://api.openai.com/v1/chat/completions',
                apiKey: '', // Will be loaded from .env file
                model: 'gpt-4o-mini', // 当前选择的模型
                availableModels: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo', 'gpt-4-turbo'], // 可选模型列表
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': '' // Will be set dynamically
                }
            },
            google: {
                enabled: false, // Disabled by default
                url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
                apiKey: '', // Will be loaded from .env file
                model: 'gemini-2.5-flash', // 当前选择的模型
                availableModels: ['gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.5-flash-lite-preview-06-17'], // 可选模型列表
                headers: { 'Content-Type': 'application/json' }
            },
            claude: {
                enabled: true, // Enabled by default
                url: 'http://localhost:3002/api/claude', // 改为指向代理服务器 原来url为 https://api.anthropic.com/v1/messages
                apiKey: '', // Will be loaded from .env file
                model: 'claude-sonnet-4-20250514', // 当前选择的模型，改为默认使用最新模型
                availableModels: ['claude-3-haiku-20240307', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229', 'claude-sonnet-4-20250514'], // 可选模型列表
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': '', // Will be set dynamically and passed to proxy server
                }
            }
        },

        // Order in which to try the APIs
        apiPriority: ['ollama', 'openai', 'google', 'claude'],

        /**
         * Returns a list of enabled APIs in their priority order.
         * @returns {string[]}
         */
        getEnabledAPIs: function() {
            return this.apiPriority.filter(apiName => this.configs[apiName] && this.configs[apiName].enabled);
        },

        /**
         * Returns a list of APIs to try, prioritizing default API first.
         * @returns {object} Object with 'apis' array and 'fallbackMode' boolean
         */
        getAPIsToTry: function() {
            // 1. 优先检查默认API是否可用
            if (this.defaultAPI && this.configs[this.defaultAPI]) {
                return { apis: [this.defaultAPI], fallbackMode: false };
            }

            // 2. 如果默认API不可用，尝试启用的APIs
            const enabledAPIs = this.apiPriority.filter(apiName => this.configs[apiName] && this.configs[apiName].enabled);
            if (enabledAPIs.length > 0) {
                return { apis: enabledAPIs, fallbackMode: false };
            }

            // 3. 如果没有启用的APIs，使用所有配置的APIs作为fallback
            const allAPIs = this.apiPriority.filter(apiName => this.configs[apiName]);
            return { apis: allAPIs, fallbackMode: true };
        },

        /**
         * 设置默认API
         * @param {string} apiName - API名称
         */
        setDefaultAPI: function(apiName) {
            if (this.configs[apiName]) {
                this.defaultAPI = apiName;
                console.log(`默认API已设置为: ${apiName}`);
            } else {
                console.error(`API ${apiName} 不存在`);
            }
        },

        /**
         * 设置API的模型
         * @param {string} apiName - API名称
         * @param {string} modelName - 模型名称
         */
        setAPIModel: function(apiName, modelName) {
            if (this.configs[apiName]) {
                const availableModels = this.configs[apiName].availableModels || [this.configs[apiName].model];
                if (availableModels.includes(modelName)) {
                    this.configs[apiName].model = modelName;
                    console.log(`${apiName} 的模型已设置为: ${modelName}`);
                    return true;
                } else {
                    console.error(`API ${apiName} 不支持模型 ${modelName}，可用模型: [${availableModels.join(', ')}]`);
                    return false;
                }
            } else {
                console.error(`API ${apiName} 不存在`);
                return false;
            }
        },

        /**
         * The main function to call an AI API. It tries APIs in the specified priority order.
         * @param {string} apiName - The name of the API to call ('ollama', 'openai', etc.).
         * @param {string} question - The user's question.
         * @param {string} language - The current language.
         * @param {boolean} skipEnabledCheck - If true, skip the enabled check (for fallback mode).
         * @returns {Promise<object>} A promise that resolves with the API response.
         */
        callAPI: async function(apiName, question, language, skipEnabledCheck = false) {
            const config = this.configs[apiName];
            if (!config) {
                return { success: false, error: `${apiName} is not configured.` };
            }

            // 如果是默认API，跳过enabled检查
            const isDefaultAPI = (apiName === this.defaultAPI);

            // Check if API is enabled (unless we're in fallback mode or using default API)
            if (!skipEnabledCheck && !isDefaultAPI && !config.enabled) {
                return { success: false, error: `${apiName} is not enabled.` };
            }

            // Check for API key if required
            if (apiName !== 'ollama' && !config.apiKey) {
                 return { success: false, error: `API key for ${apiName} is missing.` };
            }

            const prompt = getAIPrompt(question, language);
            let requestBody, requestUrl = config.url;

            // Prepare request based on API type
            switch (apiName) {
                case 'ollama':
                    requestBody = {
                        model: config.model,
                        prompt: prompt,
                        stream: false,
                        format: 'json' // Request JSON output for structured response
                    };
                    break;
                case 'openai':
                    config.headers['Authorization'] = `Bearer ${config.apiKey}`;
                    requestBody = {
                        model: config.model,
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: 2048,
                        temperature: 0.6,
                        response_format: { "type": "json_object" }
                    };
                    break;
                case 'google':
                    requestUrl = `${config.url}?key=${config.apiKey}`;
                    requestBody = {
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            response_mime_type: "application/json",
                            temperature: 0.6,
                        }
                    };
                    break;
                case 'claude':
                    config.headers['x-api-key'] = config.apiKey;
                    requestBody = {
                        model: config.model,
                        max_tokens: 2048,
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.6,
                    };
                    break;
                default:
                    return { success: false, error: 'Unknown API type' };
            }

            try {
                console.log(`[${apiName}] Making API call to:`, requestUrl);
                console.log(`[${apiName}] Request body:`, requestBody);

                const fetchOptions = {
                    method: 'POST',
                    headers: config.headers,
                    body: JSON.stringify(requestBody)
                };

                // For Ollama, try to handle CORS issues
                if (apiName === 'ollama') {
                    fetchOptions.mode = 'cors';
                    fetchOptions.credentials = 'omit';
                    console.log(`[${apiName}] Using CORS mode with credentials omitted`);
                }

                console.log(`[${apiName}] Fetch options:`, fetchOptions);
                const response = await fetch(requestUrl, fetchOptions);
                console.log(`[${apiName}] Response status:`, response.status);
                console.log(`[${apiName}] Response headers:`, [...response.headers.entries()]);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`[${apiName}] Error response:`, errorText);
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                const data = await response.json();
                return this.parseResponse(apiName, data);

            } catch (error) {
                console.error(`[${apiName}] Error calling API:`, error);
                console.error(`[${apiName}] Error type:`, error.constructor.name);
                console.error(`[${apiName}] Error stack:`, error.stack);

                // Provide more specific error messages
                let errorMessage = error.message;
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    if (apiName === 'claude') {
                        errorMessage = `Network error: Unable to connect to Claude proxy server. Please check if the proxy server is running on http://localhost:3002`;
                    } else {
                        errorMessage = `Network error: Unable to connect to ${apiName} API. Please check if the service is running.`;
                    }
                } else if (error.message.includes('CORS')) {
                    errorMessage = `CORS error: ${apiName} API blocked by browser security policy.`;
                }

                return { success: false, error: errorMessage };
            }
        },

        /**
         * Parses the raw response from different APIs into a standardized format.
         * @param {string} apiName - The name of the API.
         * @param {object} responseData - The raw data from the API.
         * @returns {object} A standardized response object.
         */
        parseResponse: function(apiName, responseData) {
            let rawJSON;
            try {
                // Extract the core JSON content from the response
                switch (apiName) {
                    case 'ollama':
                        rawJSON = JSON.parse(responseData.response);
                        break;
                    case 'openai':
                        rawJSON = JSON.parse(responseData.choices[0].message.content);
                        break;
                    case 'google':
                        // Gemini's response might have ```json ... ``` markdown, remove it.
                        const cleanedText = responseData.candidates[0].content.parts[0].text.replace(/```json\n?|\n?```/g, '');
                        rawJSON = JSON.parse(cleanedText);
                        break;
                    case 'claude':
                        // Claude's response might have ```json ... ``` markdown, remove it.
                        const claudeText = responseData.content[0].text.replace(/```json\n?|\n?```/g, '');
                        rawJSON = JSON.parse(claudeText);
                        break;
                    default:
                        throw new Error('Unknown API type for parsing.');
                }

                if (!rawJSON.explanation || !rawJSON.svg) {
                     throw new Error('Invalid JSON structure from AI. Missing "explanation" or "svg".');
                }

                return {
                    success: true,
                    data: {
                        explanation: rawJSON.explanation,
                        svg: rawJSON.svg,
                        formula: extractFormula(rawJSON.explanation),
                        type: apiName
                    }
                };

            } catch (error) {
                console.error(`Error parsing ${apiName} response:`, error, "Raw Data:", responseData);
                return { success: false, error: `Failed to parse response from ${apiName}: ${error.message}` };
            }
        }
    };

    // 加载环境变量的函数
    async function loadEnvironmentVariables() {
        if (window.envLoader) {
            const loaded = await window.envLoader.loadEnv();
            if (loaded) {
                // 从环境变量设置API密钥
                if (window.envLoader.hasValidKey('OPENAI_API_KEY')) {
                    apiConfigManager.configs.openai.apiKey = window.envLoader.get('OPENAI_API_KEY');
                    console.log('OpenAI API密钥已从环境变量加载');
                }

                if (window.envLoader.hasValidKey('GOOGLE_API_KEY')) {
                    apiConfigManager.configs.google.apiKey = window.envLoader.get('GOOGLE_API_KEY');
                    console.log('Google API密钥已从环境变量加载');
                }

                if (window.envLoader.hasValidKey('CLAUDE_API_KEY')) {
                    apiConfigManager.configs.claude.apiKey = window.envLoader.get('CLAUDE_API_KEY');
                    console.log('Claude API密钥已从环境变量加载');
                }
            } else {
                console.warn('未能加载.env文件，请确保.env文件存在并包含有效的API密钥');
            }
        } else {
            console.warn('环境变量加载器未找到，请确保env-loader.js已加载');
        }
    }

    // Expose the manager to the global window object
    window.apiConfigManager = apiConfigManager;

    // 暴露环境变量加载函数
    window.loadEnvironmentVariables = loadEnvironmentVariables;

    console.log('API配置管理器已加载');

    // Claude API代理服务器提示
    if (apiConfigManager.configs.claude.enabled) {
        console.log('Claude API已启用，使用代理服务器模式');
        console.log('请确保代理服务器运行在 http://localhost:3002');
        console.log('运行命令: node claude-proxy-server.js');
    }

})(window);