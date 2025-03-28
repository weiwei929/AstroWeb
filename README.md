# AstroWeb - 个人内容管理系统

AstroWeb 是一个基于 [Astro](https://astro.build/) 构建的轻量级个人内容管理系统，专为管理个人文章、链接收藏和其他内容而设计。系统提供了直观的管理界面和优雅的阅读体验。

## 核心功能

### 文章管理
- 🗂️ 支持多个内容分类 (技术、知识、休闲、历史)
- 📝 Markdown 格式文章编辑
- 📎 本地 Markdown 文件导入功能
- 🔍 文章详情查看与预览

### 链接收藏
- 🔗 便捷的链接管理界面
- 📌 链接分类和组织
- 🔄 快速添加和删除操作

### 用户界面
- 🏠 优雅的欢迎页面
- 🔐 安全的管理员登录
- 📱 响应式设计，适配多种设备

## 技术栈

- **前端框架**: [Astro](https://astro.build/)
- **样式**: 原生 CSS
- **数据存储**: 本地 JSON 文件
- **Markdown 渲染**: Marked 库

## 安装指南

1. **克隆仓库**
   ```bash
   git clone https://github.com/weiwei929/AstroWeb.git
   cd AstroWeb
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **构建生产版本**
   ```bash
   npm run build
   ```

## 使用说明

1. 访问首页 `http://localhost:4321/`
2. 点击"进入管理系统"按钮
3. 使用管理员账号登录 (默认: admin/admin)
4. 根据需要管理文章和链接

## 目录结构

```
AstroWeb/
├── src/
│   ├── layouts/           # 页面布局组件
│   ├── pages/             # 路由页面
│   │   ├── admin/         # 管理页面
│   │   ├── api/           # API端点
│   │   ├── articles/      # 文章页面
│   │   ├── index.astro    # 欢迎页面
│   │   └── login.astro    # 登录页面
│   ├── data/              # 数据存储
│   │   ├── articles/      # 文章数据
│   │   └── links.json     # 链接数据
│   └── utils/             # 工具函数
├── public/                # 静态资源
├── package.json           # 项目配置
└── astro.config.mjs       # Astro配置
```

## 开发计划

- [ ] 阅读模式：提供专注于内容阅读的界面
- [ ] 搜索功能：实现全文搜索
- [ ] 多媒体支持：增加图片、音频和视频内容管理
- [ ] 数据备份：自动备份和恢复功能

## 贡献指南

欢迎贡献代码、报告问题或提出新功能建议。请遵循以下步骤：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 LICENSE 文件。

## 联系方式

如有任何问题或建议，请通过 GitHub Issues 与我联系。

---

**AstroWeb** - 简单而强大的个人内容管理解决方案
