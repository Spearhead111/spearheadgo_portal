import hljs from 'highlight.js'

/** 高亮代码块 */
export const highlightCode = () => {
  let blocks = document.querySelectorAll('pre code')
  ;[].forEach.call(blocks, hljs.highlightBlock)
}
