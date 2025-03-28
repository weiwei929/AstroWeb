import fs from 'fs';
import path from 'path';

/**
 * 获取特定分类的文章列表
 * @param {string} category - 文章分类
 * @param {number|null} [limit=null] - 限制返回数量
 * @returns {Promise<Array>} 文章列表
 */
export async function getArticles(category, limit = null) {
    try {
        const filePath = path.join(process.cwd(), 'src/data/articles', `${category}.json`);
        
        // 如果文件不存在，返回空数组
        if (!fs.existsSync(filePath)) {
            // 确保目录存在
            const dirPath = path.dirname(filePath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            
            // 创建空文件
            fs.writeFileSync(filePath, JSON.stringify([], null, 2));
            return [];
        }
        
        const data = fs.readFileSync(filePath, 'utf-8');
        let articles = [];
        
        try {
            // 尝试解析 JSON
            articles = JSON.parse(data);
            
            // 确保 articles 是数组
            if (!Array.isArray(articles)) {
                console.warn(`${category}.json 不包含数组，重置为空数组`);
                articles = [];
                fs.writeFileSync(filePath, JSON.stringify([], null, 2));
            }
        } catch (parseError) {
            // 如果解析失败，创建新的空数组文件
            console.error(`解析 ${category}.json 失败，重置为空数组:`, parseError);
            fs.writeFileSync(filePath, JSON.stringify([], null, 2));
            return [];
        }
        
        // 按创建日期排序（最新的在前）
        articles.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
        
        // 如果指定了限制，则返回前N篇
        if (limit && Number.isInteger(limit) && limit > 0) {
            articles = articles.slice(0, limit);
        }
        
        return articles;
    } catch (error) {
        console.error(`Error getting articles for ${category}:`, error);
        return [];
    }
}

/**
 * 通过ID获取文章
 * @param {string} id - 文章ID
 * @returns {Promise<Object|null>} 文章对象或null
 */
export async function getArticleById(id) {
    if (!id) return null;
    
    const categories = ['tech', 'knowledge', 'leisure', 'history'];
    
    for (const category of categories) {
        try {
            const filePath = path.join(process.cwd(), 'src/data/articles', `${category}.json`);
            
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf-8');
                let articles = [];
                
                try {
                    articles = JSON.parse(data);
                    
                    // 确保 articles 是数组
                    if (!Array.isArray(articles)) {
                        console.warn(`${category}.json 不包含数组，跳过`);
                        continue;
                    }
                } catch (parseError) {
                    console.error(`解析 ${category}.json 失败，跳过:`, parseError);
                    continue;
                }
                
                const article = articles.find(article => article.id === id);
                if (article) {
                    return { ...article, category };
                }
            }
        } catch (error) {
            console.error(`Error searching for article in ${category}:`, error);
        }
    }
    
    return null;
}

/**
 * 获取分类的中文名称
 * @param {string} category - 分类代码
 * @returns {string} 分类显示名称
 */
export function getCategoryName(category) {
    const categoryMap = {
        'tech': '技术日志',
        'knowledge': '知识汇集',
        'leisure': '休闲阅读',
        'history': '文史博览'
    };
    
    return categoryMap[category] || '未知分类';
}

/**
 * 修复特定分类的JSON文件
 * @param {string} category - 文章分类
 * @returns {Promise<boolean>} 是否成功修复
 */
export async function repairCategoryFile(category) {
    try {
        const filePath = path.join(process.cwd(), 'src/data/articles', `${category}.json`);
        
        // 如果文件不存在，创建空文件
        if (!fs.existsSync(filePath)) {
            const dirPath = path.dirname(filePath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            
            fs.writeFileSync(filePath, JSON.stringify([], null, 2));
            return true;
        }
        
        // 读取文件，尝试解析
        const data = fs.readFileSync(filePath, 'utf-8');
        
        try {
            const articles = JSON.parse(data);
            
            // 如果不是数组，重置为空数组
            if (!Array.isArray(articles)) {
                fs.writeFileSync(filePath, JSON.stringify([], null, 2));
            } else {
                // 确保数据格式一致，重新写入格式化后的JSON
                fs.writeFileSync(filePath, JSON.stringify(articles, null, 2));
            }
            
            return true;
        } catch (parseError) {
            // JSON解析失败，重置文件
            fs.writeFileSync(filePath, JSON.stringify([], null, 2));
            return true;
        }
    } catch (error) {
        console.error(`Error repairing ${category}.json:`, error);
        return false;
    }
}

/**
 * 修复所有分类文件
 * @returns {Promise<Object>} 修复结果
 */
export async function repairAllCategoryFiles() {
    const categories = ['tech', 'knowledge', 'leisure', 'history'];
    const results = {};
    
    for (const category of categories) {
        results[category] = await repairCategoryFile(category);
    }
    
    return results;
}