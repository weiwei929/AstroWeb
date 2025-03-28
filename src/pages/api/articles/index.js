import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST({ request }) {
    try {
        const article = await request.json();
        
        // 验证必填字段
        if (!article.title || !article.content || !article.category) {
            return new Response(JSON.stringify({ error: '缺少必要字段' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // 验证分类
        if (!['tech', 'knowledge', 'leisure', 'history'].includes(article.category)) {
            return new Response(JSON.stringify({ error: '无效的分类' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // 准备新文章数据
        const now = new Date().toISOString();
        const newArticle = {
            id: uuidv4(),
            title: article.title,
            content: article.content,
            createDate: now,
            updateDate: now,
            author: 'Admin',
            coverImage: ''
        };
        
        // 读取现有文章
        const filePath = path.join(process.cwd(), 'src/data/articles', `${article.category}.json`);
        
        // 确保目录存在
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        
        // 检查文件是否存在
        let articles = [];
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            articles = JSON.parse(data);
        }
        
        // 添加新文章
        articles.push(newArticle);
        
        // 保存到文件
        fs.writeFileSync(filePath, JSON.stringify(articles, null, 2));
        
        return new Response(JSON.stringify(newArticle), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error adding article:', error);
        return new Response(JSON.stringify({ error: '添加文章失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}