/* header中menu的配置 */
export const HEAD_MENU = {
  home: {
    des: '首页',
    needAuth: false,
    path: '/'
  },
  goal: {
    des: '目标',
    needAuth: true,
    path: '/goal'
  },
  write: {
    des: '写文章',
    needAuth: true,
    path: '/write?type=create'
  }
}

/** 文章组件的查看方式 */
export const BLOG_VISIBLE_TYPE = {
  PREVIEW: 'preview', // 预览
  EDIT: 'edit', // 编辑
  DETAIL: 'detail' // 详情
}
