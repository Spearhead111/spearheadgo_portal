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
    submenuName: 'home',
    auth: USER_ROLE_MAP.GUEST, // 权限要求
    children: []
  },
  goal: {
    des: '目标',
    needAuth: true,
    path: '/goal',
    submenuName: 'goal',
    auth: USER_ROLE_MAP.ROOT,
    children: []
  },
  write: {
    des: '写文章',
    needAuth: true,
    path: '/write?type=create',
    submenuName: 'write',
    auth: USER_ROLE_MAP.AUTHOR,
    children: []
  },
  admin: {
    des: '管理',
    needAuth: true,
    submenuName: 'admin',
    auth: USER_ROLE_MAP.ROOT,
    children: [
      {
        des: '用户管理',
        needAuth: true,
        path: '/admin/users',
        submenuName: 'admin-usersAdmin',
        auth: USER_ROLE_MAP.ROOT
      },
      {
        des: '文章管理',
        needAuth: true,
        path: '/admin/articles',
        submenuName: 'admin-articlesAdmin',
        auth: USER_ROLE_MAP.ROOT
      }
    ]
  }
}

/** 文章管理tab */
export const ADMIN_ARTICLE_TAB = {
  article: {
    name: '文章列表',
    value: 'article'
  },
  categories: {
    name: '文章标签',
    value: 'categories'
  }
}

/** 标签颜色的色板 */
export const SWATCHES = [
  ['#FF0000', '#AA0000', '#550000'],
  ['#FFFF00', '#AAAA00', '#555500'],
  ['#00FF00', '#00AA00', '#005500'],
  ['#00FFFF', '#00AAAA', '#005555'],
  ['#0000FF', '#0000AA', '#000055']
]
