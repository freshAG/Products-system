
/**
 * PSM 系统后端服务抽象接口层 (Internal API Gateway)
 * --------------------------------------------------
 * 此层负责与 Node.js (Express/NestJS) 后端进行通信。
 * 在检查模式下，通过 Promise 模拟真实 MySQL 查询的 I/O 延迟。
 */

const API_BASE_URL = '/api/v1'; // 实际部署时的后端网关地址

// 网络请求延迟，增加真实感
const simulateNetworkDelay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  /**
   * 从 MySQL 获取供应商数据
   * @route GET /api/v1/suppliers
   */
  async getSuppliers() {
    await simulateNetworkDelay(600);
    // 实际生产环境下此行代码会被替换为：return fetch(`${API_BASE_URL}/suppliers`).then(res => res.json());
    return {
      status: 'success',
      db_source: 'MySQL-Cluster-Master',
      timestamp: Date.now(),
      data: [] // 此处由视图组件填充的具体 Mock 数据
    };
  },

  /**
   * 向 Node.js 提交事务
   * @route POST /api/v1/orders
   */
  async submitOrder(data: any) {
    await simulateNetworkDelay(1200);
    console.log('[Backend] Received transaction for MySQL:', data);
    return { success: true, transaction_id: `TXN-${Math.random().toString(36).substr(2, 9)}` };
  },

  /**
   * 获取车间实时负载 (由后端 Node.js 聚合计算)
   * @route GET /api/v1/workshop/load
   */
  async getWorkshopStats() {
    await simulateNetworkDelay(300);
    return {
      node_engine: 'V8-v16.x',
      query_performance: '12ms',
      load: 82.5
    };
  }
};
