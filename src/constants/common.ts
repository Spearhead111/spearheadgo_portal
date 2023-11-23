import { CDN_URL } from './cdnUrl'

const imgUrl = CDN_URL + 'img/icon/'
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

/** 用户角色list */
export const USER_ROLE_MAP_LIST = [
  { label: '超级管理员', value: USER_ROLE_MAP.ROOT },
  { label: '管理员', value: USER_ROLE_MAP.ADMIN },
  { label: '写作者', value: USER_ROLE_MAP.AUTHOR },
  { label: '用户', value: USER_ROLE_MAP.VISITOR }
]

/** 用户状态list */
export const USER_STATUS_LIST = [
  { label: '正常', value: 1 },
  { label: '禁用', value: 0 }
]

/** 用户角色对应的icon */
export const USER_ROLE_ICON_MAP = {
  [USER_ROLE_MAP.ROOT]: {
    chipColor: '#c23911',
    icon: 'mdi-crown-outline',
    iconColor: '#ffff00',
    desc: '超级管理员'
  },
  [USER_ROLE_MAP.ADMIN]: {
    chipColor: '#77942a',
    icon: 'mdi-account-cog',
    iconColor: '#5b0dea',
    desc: '管理员'
  },
  [USER_ROLE_MAP.AUTHOR]: {
    chipColor: '#c5edff',
    icon: 'mdi-account-edit',
    iconColor: '#6284ff',
    desc: '写作者'
  },
  [USER_ROLE_MAP.VISITOR]: {
    chipColor: '#8b8b8b',
    icon: 'mdi-account',
    iconColor: '#ffffff',
    desc: '用户'
  },
  [USER_ROLE_MAP.GUEST]: {
    chipColor: '',
    icon: '',
    iconColor: '',
    desc: '路人'
  }
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
    iconUrl: imgUrl + 'house.png',
    children: []
  },
  goal: {
    des: '目标',
    needAuth: true,
    path: '/goal',
    submenuName: 'goal',
    auth: USER_ROLE_MAP.ROOT,
    iconUrl: imgUrl + 'target.png',
    children: []
  },
  write: {
    des: '写文章',
    needAuth: true,
    path: '/write?type=create',
    submenuName: 'write',
    auth: USER_ROLE_MAP.AUTHOR,
    iconUrl: imgUrl + 'pencil.png',
    children: []
  },
  admin: {
    des: '管理',
    needAuth: true,
    submenuName: 'admin',
    auth: USER_ROLE_MAP.ADMIN,
    iconUrl: imgUrl + 'support.png',
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
