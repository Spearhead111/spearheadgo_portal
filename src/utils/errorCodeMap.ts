/** 接口错误码映射 */
export const errorCodeMap = (resultCode: string, message: string, additionalMessage?: string) => {
  resultCode = resultCode || ''
  let m = '' // 额外信息，展示在映射信息之前
  if (additionalMessage) {
    m = additionalMessage
  }
  // 如果展示message超过1000个字符，截断一下
  message?.length > 1000 && (message = message.slice(0, 1000))
  let result = message || ''
  const resultCodeMap: { [key: string]: string } = {
    category_id_not_found: '文章标签id不存在',
    category_label_already_exist: '标签名已存在',
    category_code_already_exist: '标签code已存在',
    category_has_realted_to_articles: '当前有文章与该标签关联，无法删除',
    article_id_not_found: '文章不存在',
    has_no_permission: '无权操作',
    user_not_found: '用户不存在',
    user_id_not_found: '用户不存在',
    user_name_already_exist: '账号已存在',
    file_exceed_limit: '文件超过限制',
    upload_failed: '上传失败',
    bannerimg_exceed_limitation: 'banner文件大小超过限制',
    comment_id_not_found: '评论不存在'
  }
  if (resultCodeMap && resultCodeMap[resultCode]) {
    result = resultCodeMap[resultCode]
  }
  // 是否需要展示html文本 (可用于换行)
  const htmlMessageList: string[] = []
  if (htmlMessageList.includes(resultCode)) {
    return {
      dangerouslyUseHTMLString: true,
      message: result,
      type: 'error'
    }
  }
  const connectGap = m && message ? '，' : ''
  return {
    message: `${m}${connectGap}${result}`,
    type: 'error'
  } as any
}
