// 智能教学演示系统JavaScript文件

let currentDemo = null;
let currentLanguage = 'zh'; // 'zh' for Chinese, 'ja' for Japanese

// 动态加载config.js
function loadConfigScript() {
    return new Promise((resolve, reject) => {
        if (window.apiConfigManager) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'config.js';
        script.onload = () => {
            console.log('Config.js loaded successfully');
            resolve();
        };
        script.onerror = () => {
            console.error('Failed to load config.js');
            reject(new Error('Failed to load config.js'));
        };
        document.head.appendChild(script);
    });
}

// 多语言文本配置
const TEXTS = {
    zh: {
        chatTitle: '🤖 智能教学助手',
        chatSubtitle: '问我任何数学问题，我会为您生成动画演示',
        welcomeMessage: '你好！我是你的智能教学助手。你可以问我数学问题，比如"演示勾股定理"、"解释二次函数"、"什么是圆的面积公式"等，我会为你生成详细的解释和动画演示。',
        inputPlaceholder: '输入你的问题...',
        sendButton: '发送',
        demoTitle: '数学动画演示',
        homeButton: '🏠 返回主页',
        welcomeTitle: '欢迎使用智能教学系统！',
        welcomeText: '在左侧聊天框中提问，这里将显示相应的动画演示',
        btn1: '勾股定理',
        btn2: '圆的面积',
        btn3: '二次函数',
        btn4: '三角函数',
        langButtonText: '日本語',
        analyzing: '正在分析您的问题...',
        generating: '让我为您生成这个概念的演示，请稍等...',
        generatingTitle: '正在生成：',
        generatingText: '🤖 AI正在为您生成演示',
        generatingSubtitle: '分析问题，设计动画，准备解释...'
    },
    ja: {
        chatTitle: '🤖 インテリジェント学習アシスタント',
        chatSubtitle: '数学の質問をしてください。アニメーション演示を生成します',
        welcomeMessage: 'こんにちは！私はあなたのインテリジェント学習アシスタントです。「ピタゴラスの定理を演示して」「二次関数を説明して」「円の面積公式とは何ですか」など、数学の質問をしてください。詳細な説明とアニメーション演示を生成します。',
        inputPlaceholder: '質問を入力してください...',
        sendButton: '送信',
        demoTitle: '数学アニメーション演示',
        homeButton: '🏠 ホームに戻る',
        welcomeTitle: 'インテリジェント学習システムへようこそ！',
        welcomeText: '左側のチャットボックスで質問すると、ここに対応するアニメーション演示が表示されます',
        btn1: 'ピタゴラスの定理',
        btn2: '円の面積',
        btn3: '二次関数',
        btn4: '三角関数',
        langButtonText: '中文',
        analyzing: 'あなたの質問を分析しています...',
        generating: 'この概念の演示を生成しています。少々お待ちください...',
        generatingTitle: '生成中：',
        generatingText: '🤖 AIが演示を生成しています',
        generatingSubtitle: '問題を分析し、アニメーションを設計し、説明を準備しています...'
    }
};

// 语言更新函数
function updateLanguage() {
    const texts = TEXTS[currentLanguage];
    
    // 更新聊天界面文本
    const chatTitle = document.getElementById('chatTitle');
    const chatSubtitle = document.getElementById('chatSubtitle');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendButton');
    const demoTitle = document.getElementById('demoTitle');
    const homeBtn = document.getElementById('homeBtn');
    const langBtn = document.querySelector('.language-toggle span');

    if (chatTitle) chatTitle.textContent = texts.chatTitle;
    if (chatSubtitle) chatSubtitle.textContent = texts.chatSubtitle;
    if (chatInput) chatInput.placeholder = texts.inputPlaceholder;
    if (sendBtn) sendBtn.textContent = texts.sendButton;
    if (demoTitle) demoTitle.textContent = texts.demoTitle;
    if (homeBtn) homeBtn.textContent = texts.homeButton;
    if (langBtn) langBtn.textContent = texts.langButtonText;
    
    // 更新快捷按钮
    const quickBtns = document.querySelectorAll('.knowledge-btn .knowledge-title');
    if (quickBtns.length >= 4) {
        quickBtns[0].textContent = texts.btn1;
        quickBtns[1].textContent = texts.btn2;
        quickBtns[2].textContent = texts.btn3;
        quickBtns[3].textContent = texts.btn4;
    }
    
    // 更新欢迎界面
    const welcomeTitle = document.querySelector('.welcome-title');
    const welcomeText = document.querySelector('.welcome-text');
    if (welcomeTitle) welcomeTitle.textContent = texts.welcomeTitle;
    if (welcomeText) welcomeText.textContent = texts.welcomeText;

    // 如果当前显示的是欢迎界面，重新渲染以更新知识点按钮
    const welcomeScreen = document.querySelector('.welcome-screen');
    if (welcomeScreen) {
        // 检查是否显示home按钮来判断是否在演示页面
        const homeBtn = document.getElementById('homeBtn');
        if (!homeBtn || homeBtn.style.display === 'none') {
            // 在主页面，重新渲染欢迎界面
            goHome();
        }
    }

    // 添加欢迎消息（仅在聊天消息为空时）
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer && messagesContainer.children.length === 0) {
        addMessage(texts.welcomeMessage, 'bot');
    }
}

// 基本交互函数
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function quickQuestion(question) {
    document.getElementById('chatInput').value = question;
    sendMessage();
}

function quickQuestionByType(type) {
    const questions = {
        pythagorean: {
            zh: '演示勾股定理',
            ja: 'ピタゴラスの定理を演示して'
        },
        circle: {
            zh: '圆的面积公式',
            ja: '円の面積公式'
        },
        quadratic: {
            zh: '二次函数',
            ja: '二次関数'
        },
        trigonometry: {
            zh: '三角函数',
            ja: '三角関数'
        }
    };
//     alert(currentLanguage)
// alert(questions[type][currentLanguage])
    const question = questions[type][currentLanguage];
    document.getElementById('chatInput').value = question;
    sendMessage();
}

function goHome() {
    const texts = TEXTS[currentLanguage];
    document.getElementById('demoTitle').textContent = texts.demoTitle;
    document.getElementById('homeBtn').style.display = 'none';

    const demoContent = document.getElementById('demoContent');

    // 知识点选择按钮的文本
    const knowledgePointsTitle = currentLanguage === 'zh' ? '选择知识点' : '知識ポイントを選択';
    const orText = currentLanguage === 'zh' ? '或者' : 'または';
    const chatPrompt = currentLanguage === 'zh' ? '在左侧聊天框中输入您的问题' : '左側のチャットボックスに質問を入力してください';

    demoContent.innerHTML = `
        <div class="welcome-screen">
            <div class="welcome-title">${texts.welcomeTitle}</div>
            <div class="welcome-text">${texts.welcomeText}</div>

            <div class="knowledge-points-section">
                <h3 class="section-title">${knowledgePointsTitle}</h3>
                <div class="knowledge-grid">
                    <button class="knowledge-btn" onclick="quickQuestionByType('pythagorean')">
                        <div class="knowledge-icon">📐</div>
                        <div class="knowledge-title">${texts.btn1}</div>
                        <div class="knowledge-desc">${currentLanguage === 'zh' ? 'a² + b² = c²' : 'a² + b² = c²'}</div>
                    </button>

                    <button class="knowledge-btn" onclick="quickQuestionByType('circle')">
                        <div class="knowledge-icon">⭕</div>
                        <div class="knowledge-title">${texts.btn2}</div>
                        <div class="knowledge-desc">${currentLanguage === 'zh' ? 'A = πr²' : 'A = πr²'}</div>
                    </button>

                    <button class="knowledge-btn" onclick="quickQuestionByType('quadratic')">
                        <div class="knowledge-icon">📈</div>
                        <div class="knowledge-title">${texts.btn3}</div>
                        <div class="knowledge-desc">${currentLanguage === 'zh' ? 'y = ax² + bx + c' : 'y = ax² + bx + c'}</div>
                    </button>

                    <button class="knowledge-btn" onclick="quickQuestionByType('trigonometry')">
                        <div class="knowledge-icon">📊</div>
                        <div class="knowledge-title">${texts.btn4}</div>
                        <div class="knowledge-desc">${currentLanguage === 'zh' ? 'sin, cos, tan' : 'sin, cos, tan'}</div>
                    </button>
                </div>
            </div>

            <div class="or-divider">
                <span class="or-text">${orText}</span>
            </div>

            <div class="chat-prompt">
                <div class="chat-prompt-icon">💬</div>
                <div class="chat-prompt-text">${chatPrompt}</div>
            </div>

            <div class="welcome-animation">
                <div class="floating-icon">🔢</div>
                <div class="floating-icon">∑</div>
                <div class="floating-icon">∫</div>
                <div class="floating-icon">√</div>
            </div>
        </div>
    `;
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    addMessage(message, 'user');
    input.value = '';

    // 模拟思考时间
    const texts = TEXTS[currentLanguage];
    addMessage(`<div class="loading"></div> ${texts.analyzing}`, 'bot');

    setTimeout(() => {
        processMessage(message);
    }, 1500);
}

function addMessage(content, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.innerHTML = content;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function processMessage(message) {
    // 移除加载消息
    const messages = document.getElementById('chatMessages');
    const lastMessage = messages.lastElementChild;
    if (lastMessage && lastMessage.innerHTML.includes('loading')) {
        messages.removeChild(lastMessage);
    }

    const lowerMessage = message.toLowerCase();

    // 勾股定理/ピタゴラスの定理
    if (lowerMessage.includes('勾股定理') || lowerMessage.includes('ピタゴラス')) {
        demonstratePythagorean();
    // 圆的面积/円の面積
    } else if (lowerMessage.includes('圆的面积') || lowerMessage.includes('円の面積') || lowerMessage.includes('圆面积') || lowerMessage.includes('円面積')) {
        demonstrateCircleArea();
    // 二次函数/二次関数
    } else if (lowerMessage.includes('二次函数') || lowerMessage.includes('二次関数')) {
        demonstrateQuadratic();
    // 三角函数/三角関数
    } else if (lowerMessage.includes('三角函数') || lowerMessage.includes('三角関数')) {
        demonstrateTrigonometry();
    } else {
        // 对于没有预设的问题，调用LLM生成
        generateWithLLM(message);
    }
}

async function generateWithLLM(question) {
    const texts = TEXTS[currentLanguage];
    addMessage(texts.generating, 'bot');

    // 显示生成中的动画界面
    showGeneratingScreen(question);

    try {
        // 检查配置管理器是否加载
        if (!window.apiConfigManager) {
            throw new Error('API配置管理器未加载');
        }

        // 尝试调用LLM API
        const response = await callLLMAPI(question);

        if (response.success) {
            displayGeneratedDemo(question, response.data);
            const successMsg = currentLanguage === 'zh'
                ? `已为您生成 "${question}" 的演示！`
                : `"${question}" の演示を生成しました！`;
            addMessage(successMsg, 'bot');
        } else {
            // API调用失败，显示错误信息和默认内容
            displayAPIErrorDemo(question, response.error, response.details);
            const errorMsg = currentLanguage === 'zh'
                ? `很抱歉，暂时无法为 "${question}" 生成动态演示。${response.error || '所有API都不可用'}。建议您尝试：勾股定理、圆的面积公式、二次函数、三角函数等我已准备好的演示。`
                : `申し訳ございませんが、"${question}" の動的演示を生成できませんでした。${response.error || 'すべてのAPIが利用できません'}。ピタゴラスの定理、円の面积公式、二次関数、三角関数など、準備済みの演示をお試しください。`;
            addMessage(errorMsg, 'bot');
        }
    } catch (error) {
        console.error('generateWithLLM error:', error);

        // 显示系统错误
        displaySystemErrorDemo(question, error.message);
        const systemErrorMsg = currentLanguage === 'zh'
            ? `系统错误：${error.message}。请检查网络连接或刷新页面重试。`
            : `システムエラー：${error.message}。ネットワーク接続を確認するか、ページを更新してください。`;
        addMessage(systemErrorMsg, 'bot');
    }
}

function showGeneratingScreen(question) {
    const texts = TEXTS[currentLanguage];
    document.getElementById('demoTitle').textContent = `${texts.generatingTitle}${question}`;
    document.getElementById('homeBtn').style.display = 'block';

    const demoContent = document.getElementById('demoContent');
    demoContent.innerHTML = `
        <div class="generating-screen">
            <div class="generating-animation">
                <div class="orbit orbit-1">
                    <div class="particle particle-1"></div>
                </div>
                <div class="orbit orbit-2">
                    <div class="particle particle-2"></div>
                </div>
                <div class="orbit orbit-3">
                    <div class="particle particle-3"></div>
                </div>
                <div class="center-icon">🤖</div>
            </div>
            <div class="generating-text">
                <h3>${texts.generatingText}</h3>
                <p>${texts.generatingSubtitle}</p>
                <div class="progress-dots">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </div>
            </div>
        </div>
    `;
}

// API调用和演示函数
async function callLLMAPI(question) {
    // 检查配置管理器是否可用
    if (!window.apiConfigManager) {
        console.error('API配置管理器未加载');
        return { success: false, error: 'API配置管理器未加载' };
    }

    // 获取要尝试的API列表（优先启用的，如果没有则使用所有API作为fallback）
    const { apis: apiOrder, fallbackMode } = window.apiConfigManager.getAPIsToTry();

    if (apiOrder.length === 0) {
        const noAPIMessage = currentLanguage === 'zh'
            ? '没有配置的API'
            : '設定されたAPIがありません';
        showAPIStatus(noAPIMessage, 'error');
        return { success: false, error: 'No configured APIs' };
    }

    // 如果是fallback模式，显示提示信息
    if (fallbackMode) {
        const fallbackMessage = currentLanguage === 'zh'
            ? '没有启用的API，使用fallback模式按顺序尝试所有API...'
            : '有効なAPIがありません、フォールバックモードで全APIを順次試行...';
        showAPIStatus(fallbackMessage, 'trying');
        console.log('Fallback mode: No enabled APIs, trying all APIs in order');
    }

    const results = [];

    for (const apiName of apiOrder) {
        try {
            const apiDisplayName = {
                'ollama': currentLanguage === 'zh' ? '本地Ollama' : 'ローカルOllama',
                'openai': 'OpenAI',
                'google': 'Google Gemini',
                'claude': 'Claude'
            }[apiName] || apiName;

            const tryingMessage = currentLanguage === 'zh'
                ? `正在尝试 ${apiDisplayName}...`
                : `${apiDisplayName} を試行中...`;

            showAPIStatus(tryingMessage, 'trying');
            console.log(`尝试调用 ${apiName} API...`);

            // 使用配置管理器调用API（如果是fallback模式，跳过enabled检查）
            const response = await window.apiConfigManager.callAPI(apiName, question, currentLanguage, fallbackMode);

            if (response.success) {
                const successMessage = currentLanguage === 'zh'
                    ? `${apiDisplayName} 调用成功！`
                    : `${apiDisplayName} 呼び出し成功！`;
                showAPIStatus(successMessage, 'success');
                console.log(`${apiName} API 调用成功`);
                return response;
            } else {
                results.push({ api: apiName, error: response.error || 'Unknown error' });
                const errorMessage = currentLanguage === 'zh'
                    ? `${apiDisplayName} 失败，尝试下一个...`
                    : `${apiDisplayName} 失敗、次を試行...`;
                showAPIStatus(errorMessage, 'error');
                console.log(`${apiName} API 调用失败:`, response.error);
            }
        } catch (error) {
            results.push({ api: apiName, error: error.message });
            console.error(`${apiName} API 调用异常:`, error);
        }
    }

    // 所有API都失败了
    const allFailedMessage = currentLanguage === 'zh'
        ? '所有API调用都失败了'
        : 'すべてのAPI呼び出しが失敗しました';

    // 检查是否是CORS错误
    const hasCORSError = results.some(result =>
        result.error && (result.error.includes('CORS') || result.error.includes('Failed to fetch'))
    );

    if (hasCORSError) {
        const corsMessage = currentLanguage === 'zh'
            ? '检测到CORS错误，请查看解决方案 → <a href="cors_help.html" target="_blank" style="color: #007bff;">点击这里</a>'
            : 'CORS エラーが検出されました。解決策を確認してください → <a href="cors_help.html" target="_blank" style="color: #007bff;">ここをクリック</a>';
        showAPIStatus(corsMessage, 'error');
    } else {
        showAPIStatus(allFailedMessage, 'error');
    }

    console.error('所有API调用都失败了:', results);
    return {
        success: false,
        error: 'All APIs failed',
        details: results
    };
}

function displayGeneratedDemo(question, data) {
    document.getElementById('demoTitle').textContent = question;
    document.getElementById('homeBtn').style.display = 'block';

    const demoContent = document.getElementById('demoContent');
    const aiGeneratedText = currentLanguage === 'zh' ? 'AI生成的数学概念演示' : 'AI生成の数学概念演示';
    const aiExplanationText = currentLanguage === 'zh' ? '🤖 AI生成的解释' : '🤖 AI生成の説明';

    // 根据API类型显示不同的提示
    const apiNames = {
        'ollama': currentLanguage === 'zh' ? '本地Ollama' : 'ローカルOllama',
        'openai': 'OpenAI',
        'google': 'Google Gemini',
        'claude': 'Claude'
    };

    const tipText = currentLanguage === 'zh'
        ? `这是由AI (${apiNames[data.type] || data.type}) 生成的内容。如需更精确的演示，建议使用预设的数学概念。`
        : `これはAI (${apiNames[data.type] || data.type}) によって生成されたコンテンツです。より正確な演示については、プリセットの数学概念の使用をお勧めします。`;

    // 如果有SVG代码，使用AI生成的SVG；否则使用默认的可视化
    const animationContent = data.svg ?
        `<div class="ai-generated-svg">${data.svg}</div>` :
        `<svg width="100%" height="100%" viewBox="0 0 450 350">
            <rect x="50" y="50" width="350" height="250" fill="rgba(102, 126, 234, 0.1)" stroke="#667eea" stroke-width="2" rx="15" style="animation: fadeIn 2s ease-in;"/>
            <text x="225" y="140" text-anchor="middle" fill="#2c3e50" font-size="24" font-weight="bold" style="animation: fadeIn 1s ease-in 1s both;">
                ${question}
            </text>
            <text x="225" y="180" text-anchor="middle" fill="#667eea" font-size="16" style="animation: fadeIn 1s ease-in 1.5s both;">
                ${aiGeneratedText}
            </text>
            <circle cx="125" cy="125" r="5" fill="#e74c3c" style="animation: pulse 2s ease-in-out infinite;"/>
            <circle cx="325" cy="125" r="5" fill="#27ae60" style="animation: pulse 2s ease-in-out infinite 0.5s;"/>
            <circle cx="125" cy="225" r="5" fill="#f39c12" style="animation: pulse 2s ease-in-out infinite 1s;"/>
            <circle cx="325" cy="225" r="5" fill="#9b59b6" style="animation: pulse 2s ease-in-out infinite 1.5s;"/>
        </svg>`;

    demoContent.innerHTML = `
        <div class="animation-container">
            ${animationContent}
            ${data.formula ? `<div class="equation">${data.formula}</div>` : ''}
        </div>
        <div class="explanation-text">
            <strong>${aiExplanationText}</strong>
            <br><br>
            ${data.explanation.replace(/\n/g, '<br>')}
            <br><br>
            <small style="color: #7f8c8d;">
                <strong>${currentLanguage === 'zh' ? '提示' : 'ヒント'}</strong>：${tipText}
            </small>
        </div>
    `;
}

function displayAPIErrorDemo(question, error, details) {
    document.getElementById('demoTitle').textContent = question;
    document.getElementById('homeBtn').style.display = 'block';

    const demoContent = document.getElementById('demoContent');
    const errorTitle = currentLanguage === 'zh' ? '⚠️ API调用失败' : '⚠️ API呼び出し失敗';
    const errorExplanation = currentLanguage === 'zh' ? 'API错误详情' : 'APIエラー詳細';

    // 生成错误详情
    let errorDetails = '';
    if (details && details.length > 0) {
        errorDetails = currentLanguage === 'zh' ? '<br><br>尝试的API：<br>' : '<br><br>試行したAPI：<br>';
        details.forEach(detail => {
            const apiName = {
                'ollama': currentLanguage === 'zh' ? '本地Ollama' : 'ローカルOllama',
                'openai': 'OpenAI',
                'google': 'Google Gemini',
                'claude': 'Claude'
            }[detail.api] || detail.api;
            errorDetails += `• ${apiName}: ${detail.error}<br>`;
        });
    }

    demoContent.innerHTML = `
        <div class="animation-container">
            <svg width="100%" height="100%" viewBox="0 0 450 350">
                <rect x="50" y="50" width="350" height="250" fill="rgba(231, 76, 60, 0.1)" stroke="#e74c3c" stroke-width="2" rx="15"/>
                <text x="225" y="140" text-anchor="middle" fill="#e74c3c" font-size="24" font-weight="bold">
                    ${question}
                </text>
                <text x="225" y="180" text-anchor="middle" fill="#e74c3c" font-size="16">
                    ${errorTitle}
                </text>
                <circle cx="225" cy="220" r="20" fill="none" stroke="#e74c3c" stroke-width="3"/>
                <line x1="215" y1="210" x2="235" y2="230" stroke="#e74c3c" stroke-width="3"/>
                <line x1="235" y1="210" x2="215" y2="230" stroke="#e74c3c" stroke-width="3"/>
            </svg>
        </div>
        <div class="explanation-text">
            <strong>${errorExplanation}</strong>
            <br><br>
            ${error || '未知错误'}
            ${errorDetails}
            <br><br>
            <small style="color: #e74c3c;">
                <strong>${currentLanguage === 'zh' ? '建议' : '提案'}</strong>：
                ${currentLanguage === 'zh'
                    ? '请检查网络连接，确保Ollama服务运行正常，或尝试使用预设的数学概念演示。'
                    : 'ネットワーク接続を確認し、Ollamaサービスが正常に動作していることを確認するか、プリセットの数学概念演示をお試しください。'}
            </small>
        </div>
    `;
}

function displaySystemErrorDemo(question, error) {
    document.getElementById('demoTitle').textContent = question;
    document.getElementById('homeBtn').style.display = 'block';

    const demoContent = document.getElementById('demoContent');
    const systemErrorTitle = currentLanguage === 'zh' ? '🔧 系统错误' : '🔧 システムエラー';
    const systemErrorExplanation = currentLanguage === 'zh' ? '系统错误详情' : 'システムエラー詳細';

    demoContent.innerHTML = `
        <div class="animation-container">
            <svg width="100%" height="100%" viewBox="0 0 450 350">
                <rect x="50" y="50" width="350" height="250" fill="rgba(255, 193, 7, 0.1)" stroke="#ffc107" stroke-width="2" rx="15"/>
                <text x="225" y="140" text-anchor="middle" fill="#ffc107" font-size="24" font-weight="bold">
                    ${question}
                </text>
                <text x="225" y="180" text-anchor="middle" fill="#ffc107" font-size="16">
                    ${systemErrorTitle}
                </text>
                <polygon points="225,200 215,230 235,230" fill="#ffc107"/>
                <circle cx="225" cy="220" r="2" fill="#fff"/>
                <line x1="225" y1="210" x2="225" y2="215" stroke="#fff" stroke-width="2"/>
            </svg>
        </div>
        <div class="explanation-text">
            <strong>${systemErrorExplanation}</strong>
            <br><br>
            ${error}
            <br><br>
            <small style="color: #ffc107;">
                <strong>${currentLanguage === 'zh' ? '解决方案' : '解決方法'}</strong>：
                ${currentLanguage === 'zh'
                    ? '请刷新页面重试，或检查浏览器控制台获取更多信息。'
                    : 'ページを更新して再試行するか、ブラウザコンソールで詳細情報を確認してください。'}
            </small>
        </div>
    `;
}

// API状态显示功能
function showAPIStatus(message, type = 'trying') {
    let statusDiv = document.getElementById('apiStatus');
    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.id = 'apiStatus';
        statusDiv.className = 'api-status';
        document.body.appendChild(statusDiv);
    }

    // 支持HTML内容
    if (message.includes('<a href')) {
        statusDiv.innerHTML = message;
    } else {
        statusDiv.textContent = message;
    }
    statusDiv.className = `api-status show ${type}`;

    // 3秒后自动隐藏（除非是trying状态或包含链接）
    if (type !== 'trying' && !message.includes('<a href')) {
        setTimeout(() => {
            statusDiv.classList.remove('show');
        }, 3000);
    }
}

function hideAPIStatus() {
    const statusDiv = document.getElementById('apiStatus');
    if (statusDiv) {
        statusDiv.classList.remove('show');
    }
}

// 预设演示函数
function demonstratePythagorean() {
    const message = currentLanguage === 'zh'
        ? '好的！我来为您演示勾股定理。勾股定理是几何学中的基本定理，描述了直角三角形三边之间的关系。'
        : 'はい！ピタゴラスの定理を演示します。ピタゴラスの定理は幾何学の基本定理で、直角三角形の三辺の関係を記述します。';
    addMessage(message, 'bot');

    const title = currentLanguage === 'zh' ? '勾股定理演示' : 'ピタゴラスの定理演示';
    document.getElementById('demoTitle').textContent = title;
    document.getElementById('homeBtn').style.display = 'block';

    const demoContent = document.getElementById('demoContent');
    const theoremName = currentLanguage === 'zh' ? '勾股定理' : 'ピタゴラスの定理';
    const explanation = currentLanguage === 'zh'
        ? '在直角三角形中，两直角边的平方和等于斜边的平方。'
        : '直角三角形において、二つの直角辺の平方の和は斜辺の平方に等しい。';
    const applicationLabel = currentLanguage === 'zh' ? '应用' : '応用';
    const applicationText = currentLanguage === 'zh'
        ? '建筑设计、导航、工程测量等领域'
        : '建築設計、ナビゲーション、工学測量などの分野';

    demoContent.innerHTML = `
        <div class="animation-container">
            <svg width="100%" height="100%" viewBox="0 0 450 350">
                <!-- 直角三角形 -->
                <polygon points="125,250 350,250 350,125" fill="rgba(52, 152, 219, 0.3)" stroke="#3498db" stroke-width="3" style="animation: fadeIn 1s ease-in;"/>

                <!-- 边长标注 -->
                <text x="237" y="270" text-anchor="middle" fill="#2c3e50" font-size="16" font-weight="bold">a</text>
                <text x="370" y="187" text-anchor="middle" fill="#2c3e50" font-size="16" font-weight="bold">b</text>
                <text x="220" y="175" text-anchor="middle" fill="#e74c3c" font-size="16" font-weight="bold">c</text>

                <!-- 直角标记 -->
                <path d="M 330,250 L 330,230 L 350,230" fill="none" stroke="#2c3e50" stroke-width="2"/>

                <!-- 正方形演示 -->
                <g style="animation: slideIn 2s ease-in 1s both;">
                    <!-- a² 正方形 -->
                    <rect x="75" y="280" width="60" height="60" fill="rgba(46, 204, 113, 0.5)" stroke="#27ae60" stroke-width="2"/>
                    <text x="105" y="315" text-anchor="middle" fill="#27ae60" font-size="14" font-weight="bold">a²</text>

                    <!-- b² 正方形 -->
                    <rect x="145" y="280" width="60" height="60" fill="rgba(155, 89, 182, 0.5)" stroke="#9b59b6" stroke-width="2"/>
                    <text x="175" y="315" text-anchor="middle" fill="#9b59b6" font-size="14" font-weight="bold">b²</text>

                    <!-- 等号 -->
                    <text x="225" y="315" text-anchor="middle" fill="#2c3e50" font-size="20" font-weight="bold">=</text>

                    <!-- c² 正方形 -->
                    <rect x="245" y="280" width="80" height="60" fill="rgba(231, 76, 60, 0.5)" stroke="#e74c3c" stroke-width="2"/>
                    <text x="285" y="315" text-anchor="middle" fill="#e74c3c" font-size="14" font-weight="bold">c²</text>
                </g>

                <!-- 动画点 -->
                <circle cx="125" cy="250" r="4" fill="#3498db" style="animation: pulse 2s ease-in-out infinite;"/>
                <circle cx="350" cy="250" r="4" fill="#3498db" style="animation: pulse 2s ease-in-out infinite 0.5s;"/>
                <circle cx="350" cy="125" r="4" fill="#3498db" style="animation: pulse 2s ease-in-out infinite 1s;"/>
            </svg>

            <div class="equation">a² + b² = c²</div>
        </div>

        <div class="explanation-text">
            <strong>${theoremName}</strong>：${explanation}
            <br><br>
            <strong>${applicationLabel}</strong>：${applicationText}
        </div>
    `;
}

function demonstrateCircleArea() {
    const message = currentLanguage === 'zh'
        ? '好的！我来为您演示圆的面积公式。圆的面积计算是几何学的基础知识。'
        : 'はい！円の面積公式を演示します。円の面積計算は幾何学の基礎知識です。';
    addMessage(message, 'bot');

    const title = currentLanguage === 'zh' ? '圆的面积公式演示' : '円の面積公式演示';
    document.getElementById('demoTitle').textContent = title;
    document.getElementById('homeBtn').style.display = 'block';

    const demoContent = document.getElementById('demoContent');
    const formulaName = currentLanguage === 'zh' ? '圆的面积公式' : '円の面積公式';
    const explanation = currentLanguage === 'zh'
        ? '圆的面积等于圆周率π乘以半径的平方。'
        : '円の面積は円周率πに半径の平方を掛けたものに等しい。';
    const whereLabel = currentLanguage === 'zh' ? '其中' : 'ここで';
    const whereText = currentLanguage === 'zh'
        ? 'π ≈ 3.14159，r 是圆的半径'
        : 'π ≈ 3.14159、rは円の半径';
    const applicationLabel = currentLanguage === 'zh' ? '应用' : '応用';
    const applicationText = currentLanguage === 'zh'
        ? '土地测量、建筑设计、工程计算等'
        : '土地測量、建築設計、工学計算など';

    demoContent.innerHTML = `
        <div class="animation-container">
            <svg width="100%" height="100%" viewBox="0 0 450 350">
                <!-- 圆 -->
                <circle cx="225" cy="175" r="90" fill="rgba(52, 152, 219, 0.3)" stroke="#3498db" stroke-width="3" style="animation: scaleIn 1s ease-in;"/>

                <!-- 半径线 -->
                <line x1="225" y1="175" x2="315" y2="175" stroke="#e74c3c" stroke-width="3" style="animation: drawLine 2s ease-in 1s both;"/>
                <text x="270" y="165" text-anchor="middle" fill="#e74c3c" font-size="16" font-weight="bold">r</text>

                <!-- 圆心 -->
                <circle cx="225" cy="175" r="3" fill="#2c3e50"/>

                <!-- 面积分割演示 -->
                <g style="animation: fadeIn 2s ease-in 2s both;">
                    <!-- 扇形分割线 -->
                    <line x1="225" y1="175" x2="225" y2="85" stroke="#95a5a6" stroke-width="1" opacity="0.7"/>
                    <line x1="225" y1="175" x2="288" y2="112" stroke="#95a5a6" stroke-width="1" opacity="0.7"/>
                    <line x1="225" y1="175" x2="315" y2="175" stroke="#95a5a6" stroke-width="1" opacity="0.7"/>
                    <line x1="225" y1="175" x2="288" y2="238" stroke="#95a5a6" stroke-width="1" opacity="0.7"/>
                    <line x1="225" y1="175" x2="225" y2="265" stroke="#95a5a6" stroke-width="1" opacity="0.7"/>
                    <line x1="225" y1="175" x2="162" y2="238" stroke="#95a5a6" stroke-width="1" opacity="0.7"/>
                    <line x1="225" y1="175" x2="135" y2="175" stroke="#95a5a6" stroke-width="1" opacity="0.7"/>
                    <line x1="225" y1="175" x2="162" y2="112" stroke="#95a5a6" stroke-width="1" opacity="0.7"/>
                </g>

                <!-- π 符号 -->
                <text x="360" y="175" text-anchor="middle" fill="#9b59b6" font-size="24" font-weight="bold" style="animation: pulse 2s ease-in-out infinite 3s;">π</text>

                <!-- 动画点 -->
                <circle cx="200" cy="70" r="3" fill="#f39c12" style="animation: rotate 4s linear infinite 2s;">
                    <animateTransform attributeName="transform" type="rotate" values="0 200 150;360 200 150" dur="4s" repeatCount="indefinite" begin="2s"/>
                </circle>
            </svg>

            <div class="equation">A = πr²</div>
        </div>

        <div class="explanation-text">
            <strong>${formulaName}</strong>：${explanation}
            <br><br>
            <strong>${whereLabel}</strong>：${whereText}
            <br><br>
            <strong>${applicationLabel}</strong>：${applicationText}
        </div>
    `;
}

function demonstrateQuadratic() {
    const message = currentLanguage === 'zh'
        ? '好的！我来为您演示二次函数。二次函数是代数学中的重要概念，具有抛物线的图形特征。'
        : 'はい！二次関数を演示します。二次関数は代数学の重要な概念で、放物線のグラフ特徴を持ちます。';
    addMessage(message, 'bot');

    const title = currentLanguage === 'zh' ? '二次函数演示' : '二次関数演示';
    document.getElementById('demoTitle').textContent = title;
    document.getElementById('homeBtn').style.display = 'block';

    const demoContent = document.getElementById('demoContent');
    const functionName = currentLanguage === 'zh' ? '二次函数' : '二次関数';
    const featuresLabel = currentLanguage === 'zh' ? '特征' : '特徴';
    const features = currentLanguage === 'zh'
        ? ['• 图形为抛物线', '• 有最高点或最低点（顶点）', '• 关于对称轴对称', '• 开口向上或向下']
        : ['• グラフは放物線', '• 最高点または最低点（頂点）がある', '• 対称軸について対称', '• 上向きまたは下向きに開く'];
    const applicationLabel = currentLanguage === 'zh' ? '应用' : '応用';
    const applicationText = currentLanguage === 'zh'
        ? '物理学中的抛物运动、工程优化、经济学建模等'
        : '物理学の放物運動、工学最適化、経済学モデリングなど';

    demoContent.innerHTML = `
        <div class="animation-container">
            <svg width="100%" height="100%" viewBox="0 0 450 350">
                <!-- 坐标轴 -->
                <line x1="75" y1="300" x2="375" y2="300" stroke="#95a5a6" stroke-width="2"/>
                <line x1="225" y1="75" x2="225" y2="325" stroke="#95a5a6" stroke-width="2"/>

                <!-- 坐标轴标签 -->
                <text x="385" y="305" fill="#7f8c8d" font-size="14">x</text>
                <text x="230" y="70" fill="#7f8c8d" font-size="14">y</text>

                <!-- 抛物线 -->
                <path d="M 105,270 Q 225,105 345,270" fill="none" stroke="#3498db" stroke-width="4" style="animation: drawPath 3s ease-in-out;"/>

                <!-- 顶点 -->
                <circle cx="225" cy="105" r="5" fill="#e74c3c" style="animation: pulse 2s ease-in-out infinite 1s;"/>
                <text x="235" y="100" fill="#e74c3c" font-size="12" font-weight="bold">顶点</text>

                <!-- 对称轴 -->
                <line x1="225" y1="85" x2="225" y2="285" stroke="#9b59b6" stroke-width="2" stroke-dasharray="5,5" style="animation: fadeIn 2s ease-in 2s both;"/>
                <text x="235" y="90" fill="#9b59b6" font-size="12">对称轴</text>

                <!-- 函数值点 -->
                <circle cx="150" cy="190" r="3" fill="#27ae60" style="animation: fadeIn 1s ease-in 2s both;"/>
                <circle cx="300" cy="190" r="3" fill="#27ae60" style="animation: fadeIn 1s ease-in 2.5s both;"/>
            </svg>

            <div class="equation">y = ax² + bx + c (a ≠ 0)</div>
        </div>

        <div class="explanation-text">
            <strong>${functionName}</strong>：y = ax² + bx + c (a ≠ 0)
            <br><br>
            <strong>${featuresLabel}</strong>：
            <br>${features.join('<br>')}
            <br><br>
            <strong>${applicationLabel}</strong>：${applicationText}
        </div>
    `;
}

function demonstrateTrigonometry() {
    const message = currentLanguage === 'zh'
        ? '好的！我来为您演示三角函数。三角函数描述了角度与比值之间的关系，在数学和物理学中应用广泛。'
        : 'はい！三角関数を演示します。三角関数は角度と比の関係を記述し、数学と物理学で広く応用されています。';
    addMessage(message, 'bot');

    const title = currentLanguage === 'zh' ? '三角函数演示' : '三角関数演示';
    document.getElementById('demoTitle').textContent = title;
    document.getElementById('homeBtn').style.display = 'block';

    const demoContent = document.getElementById('demoContent');
    const functionName = currentLanguage === 'zh' ? '三角函数' : '三角関数';
    const basicFunctions = currentLanguage === 'zh' ? '基本三角函数' : '基本三角関数';
    const functions = currentLanguage === 'zh'
        ? ['• sin θ = 对边/斜边', '• cos θ = 邻边/斜边', '• tan θ = 对边/邻边']
        : ['• sin θ = 対辺/斜辺', '• cos θ = 隣辺/斜辺', '• tan θ = 対辺/隣辺'];
    const applicationLabel = currentLanguage === 'zh' ? '应用' : '応用';
    const applicationText = currentLanguage === 'zh'
        ? '波动分析、信号处理、工程计算、天文学等'
        : '波動解析、信号処理、工学計算、天文学など';

    demoContent.innerHTML = `
        <div class="animation-container">
            <svg width="100%" height="100%" viewBox="0 0 450 350">
                <!-- 单位圆 -->
                <circle cx="225" cy="175" r="110" fill="none" stroke="#95a5a6" stroke-width="2" style="animation: scaleIn 1s ease-in;"/>

                <!-- 坐标轴 -->
                <line x1="95" y1="175" x2="355" y2="175" stroke="#7f8c8d" stroke-width="1"/>
                <line x1="225" y1="45" x2="225" y2="305" stroke="#7f8c8d" stroke-width="1"/>

                <!-- 角度线（动画旋转） -->
                <line x1="225" y1="175" x2="302" y2="120" stroke="#3498db" stroke-width="3" style="animation: rotateLine 4s linear infinite;">
                    <animateTransform attributeName="transform" type="rotate" values="0 225 175;360 225 175" dur="4s" repeatCount="indefinite"/>
                </line>

                <!-- 三角形 -->
                <polygon points="225,175 302,120 302,175" fill="rgba(52, 152, 219, 0.3)" stroke="#3498db" stroke-width="2" style="animation: fadeIn 2s ease-in 1s both;"/>

                <!-- 边长标注 -->
                <text x="263" y="170" fill="#e74c3c" font-size="12" font-weight="bold">cos θ</text>
                <text x="307" y="147" fill="#27ae60" font-size="12" font-weight="bold">sin θ</text>
                <text x="255" y="142" fill="#9b59b6" font-size="12" font-weight="bold">1</text>

                <!-- 角度标记 -->
                <path d="M 245,175 A 20,20 0 0,0 260,160" fill="none" stroke="#f39c12" stroke-width="2"/>
                <text x="255" y="185" fill="#f39c12" font-size="12" font-weight="bold">θ</text>

                <!-- 动画点 -->
                <circle cx="302" cy="120" r="4" fill="#3498db" style="animation: pulse 2s ease-in-out infinite;">
                    <animateTransform attributeName="transform" type="rotate" values="0 225 175;360 225 175" dur="4s" repeatCount="indefinite"/>
                </circle>
            </svg>

            <div class="equation">sin²θ + cos²θ = 1</div>
        </div>

        <div class="explanation-text">
            <strong>${functionName}</strong>
            <br><br>
            <strong>${basicFunctions}</strong>：
            <br>${functions.join('<br>')}
            <br><br>
            <strong>${applicationLabel}</strong>：${applicationText}
        </div>
    `;
}

// 语言切换函数
function switchToJapanese() {
    window.location.href = 'learning_system_ja.html';
}

function switchToChinese() {
    window.location.href = 'learning_system_zh.html';
}

function toggleLanguage() {
    if (currentLanguage === 'zh') {
        currentLanguage = 'ja';
    } else {
        currentLanguage = 'zh';
    }
    updateLanguage();
}

// 立即执行初始化（不等待DOMContentLoaded，因为script.js是动态加载的）
(async function initializeApp() {
    try {
        // 首先加载配置管理器
        await loadConfigScript();
        console.log('配置管理器加载完成');
    } catch (error) {
        console.error('配置管理器加载失败:', error);
        // 即使配置管理器加载失败，也要继续初始化基本功能
    }

    // 优先使用HTML页面中设置的语言，否则根据URL判断
    if (window.pageLanguage) {
        currentLanguage = window.pageLanguage;
        console.log('HTML页面语言设置:', currentLanguage);
    } else if (window.location.pathname.includes('_ja.html')) {
        currentLanguage = 'ja';
        console.log('URL检测到日本語页面，设置语言为:', currentLanguage);
    } else {
        currentLanguage = 'zh';
        console.log('URL检测到中文页面，设置语言为:', currentLanguage);
    }

    console.log('最终设置的语言:', currentLanguage);

    // 等待DOM加载完成后再更新语言和添加元素
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            updateLanguage();
            addAPIStatusElement();
        });
    } else {
        updateLanguage();
        addAPIStatusElement();
    }
})();

// 添加API状态显示元素的函数
function addAPIStatusElement() {
    if (!document.getElementById('apiStatus')) {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'apiStatus';
        statusDiv.className = 'api-status';
        document.body.appendChild(statusDiv);
    }
}
