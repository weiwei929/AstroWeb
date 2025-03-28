// src/pages/api/auth/logout.js

// 显式标记为服务器端渲染
export const prerender = false;

// 处理 POST 请求来登出（最佳实践是通过 POST 请求进行登出）
export function POST({ cookies, redirect }) {
  // 删除 session cookie
  cookies.delete('isAdmin', {
    path: '/',
  });
  // 重定向到登录页
  return redirect('/login');
}

// 处理 GET 请求（可选，也可以直接重定向到登录页）
export function GET({ redirect }) {
  return redirect('/login');
}

// 处理其他请求方法
export function ALL({ redirect }) {
  return new Response('Method Not Allowed', { status: 405 });
}