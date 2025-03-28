// src/pages/api/links/index.js
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义 JSON 数据文件路径
// 注意: 路径是相对于当前 JS 文件计算的
const dataFilePath = path.resolve(__dirname, '../../../data/links.json');

// 辅助函数：读取数据
async function readLinks() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // 如果文件不存在或无法读取，返回空数组
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading links data:', error);
    throw new Error('Could not read links data');
  }
}

// 辅助函数：写入数据
async function writeLinks(links) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(links, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing links data:', error);
    throw new Error('Could not write links data');
  }
}

// 检查认证的辅助函数
function checkAuth(cookies) {
    const isAdminCookie = cookies.get('isAdmin');
    return isAdminCookie && isAdminCookie.value === 'true';
}

// --- API 处理函数 ---

// GET: 获取所有链接
export async function GET({ cookies }) {
    if (!checkAuth(cookies)) {
        return new Response('Unauthorized', { status: 401 });
    }
    try {
        const links = await readLinks();
        return new Response(JSON.stringify(links), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(error.message, { status: 500 });
    }
}

// POST: 添加新链接
export async function POST({ request, cookies }) {
    if (!checkAuth(cookies)) {
        return new Response('Unauthorized', { status: 401 });
    }
    try {
        const newLinkData = await request.json();
        if (!newLinkData.url || !newLinkData.description) {
          return new Response('Missing URL or description', { status: 400 });
        }

        const links = await readLinks();
        const newLink = {
          id: Date.now(), // 使用时间戳作为简单唯一 ID
          url: newLinkData.url,
          description: newLinkData.description,
        };
        links.push(newLink);
        await writeLinks(links);

        return new Response(JSON.stringify(newLink), {
            status: 201, // 201 Created
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
         if (error instanceof SyntaxError) { // JSON 解析错误
            return new Response('Invalid JSON data in request body', { status: 400 });
         }
        return new Response(error.message || 'Failed to add link', { status: 500 });
    }
}
