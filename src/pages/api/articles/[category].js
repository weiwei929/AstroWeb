import fs from 'fs';
import path from 'path';

export async function GET({ params }) {
    const { category } = params;
    
    // 验证分类
    if (!['tech', 'knowledge', 'leisure', 'history'].includes(category)) {
        return new Response(JSON.stringify({ error: '无效的分类' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        // 读取JSON文件
        const filePath = path.join(process.cwd(), 'src/data/articles', `${category}.json`);
        
        // 检查文件是否存在，不存在则创建
        if (!fs.existsSync(filePath)) {
            // 确保目录存在
            const dirPath = path.dirname(filePath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            
            fs.writeFileSync(filePath, JSON.stringify([]));
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const data = fs.readFileSync(filePath, 'utf-8');
        const articles = JSON.parse(data);
        
        // 按创建日期排序（最新的在前）
        articles.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
        
        return new Response(JSON.stringify(articles), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
        return new Response(JSON.stringify({ error: '获取文章失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}