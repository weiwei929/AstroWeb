// src/pages/api/links/[id].js
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.resolve(__dirname, '../../../data/links.json');

// 辅助函数 (与 index.js 中的相同，可以考虑提取到公共模块)
async function readLinks() { /* ... (同上) ... */
    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        console.error('Error reading links data:', error);
        throw new Error('Could not read links data');
    }
}
async function writeLinks(links) { /* ... (同上) ... */
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(links, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing links data:', error);
        throw new Error('Could not write links data');
    }
}
function checkAuth(cookies) { /* ... (同上) ... */
    const isAdminCookie = cookies.get('isAdmin');
    return isAdminCookie && isAdminCookie.value === 'true';
}

// DELETE: 删除指定 ID 的链接
export async function DELETE({ params, cookies }) {
    if (!checkAuth(cookies)) {
        return new Response('Unauthorized', { status: 401 });
    }
    try {
        const linkId = parseInt(params.id, 10); // 从 URL 路径参数获取 ID
        if (isNaN(linkId)) {
            return new Response('Invalid link ID', { status: 400 });
        }

        let links = await readLinks();
        const initialLength = links.length;
        links = links.filter(link => link.id !== linkId);

        if (links.length === initialLength) {
            return new Response('Link not found', { status: 404 });
        }

        await writeLinks(links);

        return new Response(null, { status: 204 }); // 204 No Content (成功删除)
    } catch (error) {
        return new Response(error.message || 'Failed to delete link', { status: 500 });
    }
}

// 可以添加 GET /api/links/[id] 获取单个链接, PUT/PATCH 更新等，但我们先只做删除
