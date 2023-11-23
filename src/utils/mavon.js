import $ from 'jquery'
import { ElMessage } from 'element-plus'

export const addCodeBtn = (_) => {
  //markdown代码存放在pre code 标签对中
  $('pre code').each(function () {
    let lines = $(this).text().split('\n').length - 1
    //添加有序列表
    let $numbering = $('<ol/>').addClass('pre-numbering')
    //添加复制按钮，此处使用的是element-ui icon 图标
    // let $copy = $('<i title="copy代码"></i>').addClass('el-icon-document-copy code-copy')
    let $copy = $('<div><div ></div><div>Copy code</div><div></div>').addClass('code-copy')
    $(this).parent().addClass('code').append($numbering).append($copy)
    for (let i = 0; i <= lines; i++) {
      $numbering.append($('<li/>'))
    }
  })
  //监听复制按钮点击事件
  $('pre.code div.code-copy').click((e) => {
    let text = $(e.target).siblings('code').text()
    // 下面做了一个判断，因为复制的图标用的div下的div绘制的，兼容点击了div下的div
    if (!text) {
      text = $(e.target).parent().siblings('code').text()
    }
    // let element = $('<textarea>' + text + '</textarea>')
    // $('body').append(element)
    // element[0].select()
    // document.execCommand('Copy')
    // element.remove()
    // 上面复制的方法太过时了。。。而且还不起作用
    navigator.clipboard.writeText(text).then(() => {})
    // //这里是自定义的消息通知组件
    // Vue.prototype.$notice.success({
    //   msg: '代码复制成功'
    // })
    ElMessage.success('代码抄到手了🤭')
  })
}
