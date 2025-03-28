import fs from 'fs';
import path from 'path';

export async function GET({ params }) {
    const { id } = params;
    if (!id) {
        return new Response(JSON.stringify({ error: '缺少ID参数' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        // 检查所有分类以查找文章
        const categories = ['tech', 'knowledge', 'leisure', 'history'];
        
        for (const category of categories) {
            const filePath = path.join(process.cwd(), 'src/data/articles', `${category}.json`);
            
            // 检查文件是否存在
            if (!fs.existsSync(filePath)) {
                continue;
            }
            
            // 读取文件内容
            const data = fs.readFileSync(filePath, 'utf-8');
            let articles = [];
            
            try {
                articles = JSON.parse(data);
            } catch(e) {
                // 如果解析失败，跳过此文件
                continue;
            }
            
            // 查找文章
            const article = articles.find(article => article.id === id);
            
            if (article) {
                // 找到文章，返回它
                return new Response(JSON.stringify({ ...article, category }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }
        
        return new Response(JSON.stringify({ error: '文章不存在' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching article:', error);
        return new Response(JSON.stringify({ error: '获取文章失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function DELETE({ params }) {
    const { id } = params;
    if (!id) {
        return new Response(JSON.stringify({ error: '缺少ID参数' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        // 检查所有分类以查找文章
        const categories = ['tech', 'knowledge', 'leisure', 'history'];
        
        for (const category of categories) {
            const filePath = path.join(process.cwd(), 'src/data/articles', `${category}.json`);
            
            // 检查文件是否存在
            if (!fs.existsSync(filePath)) {
                continue;
            }
            
            // 读取文件内容
            const data = fs.readFileSync(filePath, 'utf-8');
            let articles = [];
            
            try {
                articles = JSON.parse(data);
            } catch(e) {
                // 如果解析失败，跳过此文件
                continue;
            }
            
            // 查找文章索引
            const index = articles.findIndex(article => article.id === id);
            
            if (index !== -1) {
                // 找到文章，删除它
                articles.splice(index, 1);
                
                // 写回文件
                fs.writeFileSync(filePath, JSON.stringify(articles, null, 2));
                
                return new Response(JSON.stringify({ success: true }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }
        
        // 没有找到文章
        return new Response(JSON.stringify({ error: '文章不存在' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error deleting article:', error);
        return new Response(JSON.stringify({ error: '服务器错误' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}