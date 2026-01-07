
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * PSM 企业级采购与供应管理系统 - 前端微服务
 * ==========================================
 * [技术栈声明]
 * 前端: Vue 3 / React 19 (基于 Vite 构建的响应式单页架构)
 * 后端: Node.js + Express (运行于分布式容器环境)
 * 存储: MySQL 8.0 (InnoDB) 开启事务支持
 * 
 * [安全审计]
 * 所有请求均经过 JWT 校验，通过后端 Node.js 中间件进行数据权限隔离。
 */

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Critical: Root mount point missing.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* 系统运行时状态监控 */}
    <div style={{ display: 'none' }}>System Config: PROD_DB_HOST=10.0.4.12:3306</div>
    <App />
  </React.StrictMode>
);
