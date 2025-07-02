// 环境变量加载器 - 用于浏览器环境
// Environment Variable Loader - For Browser Environment

(function(window) {
    'use strict';

    const envLoader = {
        // 存储环境变量
        env: {},
        
        // 加载.env文件
        async loadEnv() {
            try {
                const response = await fetch('.env');
                if (!response.ok) {
                    console.warn('未找到.env文件，使用默认配置');
                    return false;
                }
                
                const envText = await response.text();
                this.parseEnv(envText);
                console.log('环境变量加载成功');
                return true;
            } catch (error) {
                console.warn('加载.env文件失败:', error.message);
                return false;
            }
        },
        
        // 解析.env文件内容
        parseEnv(envText) {
            const lines = envText.split('\n');
            
            for (const line of lines) {
                // 跳过注释和空行
                const trimmedLine = line.trim();
                if (!trimmedLine || trimmedLine.startsWith('#')) {
                    continue;
                }
                
                // 解析 KEY=VALUE 格式
                const equalIndex = trimmedLine.indexOf('=');
                if (equalIndex > 0) {
                    const key = trimmedLine.substring(0, equalIndex).trim();
                    const value = trimmedLine.substring(equalIndex + 1).trim();
                    
                    // 移除引号
                    const cleanValue = value.replace(/^["']|["']$/g, '');
                    this.env[key] = cleanValue;
                }
            }
        },
        
        // 获取环境变量
        get(key, defaultValue = '') {
            return this.env[key] || defaultValue;
        },
        
        // 检查是否有有效的API密钥
        hasValidKey(key) {
            const value = this.get(key);
            return value && value !== 'your_openai_api_key_here' && 
                   value !== 'your_google_api_key_here' && 
                   value !== 'your_claude_api_key_here';
        }
    };

    // 暴露到全局
    window.envLoader = envLoader;

})(window);
