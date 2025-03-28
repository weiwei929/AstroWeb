// src/pages/api/auth/login.js

// 显式标记为服务器端渲染
export const prerender = false;

export async function POST({ request, cookies, redirect }) {
  try {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    // 从环境变量获取正确的凭据
    const correctUsername = import.meta.env.ADMIN_USERNAME;
    const correctPassword = import.meta.env.ADMIN_PASSWORD;
    const sessionSecret = import.meta.env.ADMIN_SESSION_SECRET; // 虽然这里没直接用，但表示存在

    // 极简验证 (生产环境需要更安全的验证和哈希)
    if (username === correctUsername && password === correctPassword) {
      // 登录成功，设置一个简单的 session cookie
      cookies.set('isAdmin', 'true', {
        path: '/',
        httpOnly: true, // 防止客户端 JS 读取
        maxAge: 60 * 60 * 24, // 有效期 1 天
        // secure: true, // 仅在 HTTPS 下发送，本地开发时可能需要注释掉
        sameSite: 'lax',
      });
      // 重定向到管理后台主页
      return redirect('/admin');
    } else {
      // 登录失败，重定向回登录页并带上错误标记
      return redirect('/login?error=1', 302);
    }
  } catch (error) {
    console.error('登录处理错误:', error);
    return new Response('登录处理发生错误', { status: 500 });
  }
}

// 处理非 POST 请求
export function GET({ redirect }) {
  return redirect('/login');
}

// 处理其他 HTTP 方法
export function ALL({ redirect }) {
  return new Response('Method Not Allowed', { status: 405 });
}