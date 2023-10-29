/** 文章组件的查看方式 */
export const BLOG_VISIBLE_TYPE = {
  PREVIEW: 'preview', // 预览
  EDIT: 'edit', // 编辑
  DETAIL: 'detail' // 详情
}

/** 用户角色map */
export const USER_ROLE_MAP = {
  ROOT: 'root',
  ADMIN: 'admin',
  AUTHOR: 'author',
  VISITOR: 'visitor',
  GUEST: 'guest'
}

/** 角色权限等级 */
export const ROLE_AUTH_MAP = {
  [USER_ROLE_MAP.ROOT]: 10,
  [USER_ROLE_MAP.ADMIN]: 8,
  [USER_ROLE_MAP.AUTHOR]: 5,
  [USER_ROLE_MAP.VISITOR]: 1,
  [USER_ROLE_MAP.GUEST]: -1
}

/* header中menu的配置 */
export const HEAD_MENU = {
  home: {
    des: '首页',
    needAuth: false,
    path: '/',
    auth: USER_ROLE_MAP.GUEST // 权限要求
  },
  goal: {
    des: '目标',
    needAuth: true,
    path: '/goal',
    auth: USER_ROLE_MAP.ROOT
  },
  write: {
    des: '写文章',
    needAuth: true,
    path: '/write?type=create',
    auth: USER_ROLE_MAP.ROOT
  }
}
