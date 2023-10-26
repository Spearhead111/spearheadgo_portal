<template>
  <div
    class="position-relative flex align-center justify-center"
    style="width: 100vw; height: 100vh"
  >
    <div class="shell">
      <div class="container b-container" id="b-container">
        <el-form
          ref="signInFromRef"
          :model="signInForm"
          :rules="signInRules"
          action=""
          method=""
          class="form"
          id="b-form"
        >
          <h2 class="form_title title">登入账号</h2>
          <!-- <div class="form_icons">
          <i class="iconfont icon-QQ"></i>
          <i class="iconfont icon-weixin"></i>
          <i class="iconfont icon-bilibili-line"></i>
        </div> -->
          <span class="form_span">请输入账号和密码</span>
          <el-form-item prop="account">
            <el-input
              type="text"
              v-model="signInForm.account"
              autocomplete="off"
              placeholder="Account / Email"
            >
              <template #prefix> <i class="iconfont icon-zhanghao"></i> </template
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              class="form_input"
              v-model="signInForm.password"
              autocomplete="off"
              placeholder="Password"
              onpaste="return false"
              oncontextmenu="return false"
              oncopy="return false"
              oncut="return false"
            >
              <template #prefix>
                <i class="iconfont icon-mima"></i>
              </template>
              <template #suffix>
                <i class="iconfont icon-xianshikejian" @click="changePwdShow($event)"></i>
              </template>
            </el-input>
          </el-form-item>
          <a class="form_link">忘记密码？</a>
          <button class="form_button button submit" @click="submitForm(signInFromRef, 'signIn')">
            SIGN IN
          </button>
        </el-form>
      </div>

      <div class="container a-container" id="a-container">
        <el-form
          ref="signUpFormRef"
          :model="signUpForm"
          :rules="signUpRules"
          action=""
          method=""
          class="form"
          id="a-form"
        >
          <h2 class="form_title title">创建账号</h2>
          <!-- <div class="form_icons">
          <i class="iconfont icon-QQ"></i>
          <i class="iconfont icon-weixin"></i>
          <i class="iconfont icon-bilibili-line"></i>
        </div> -->
          <span class="form_span"></span>
          <el-form-item prop="account">
            <el-input
              type="text"
              class="form_input"
              v-model="signUpForm.account"
              placeholder="Account"
            >
              <template #prefix> <i class="iconfont icon-zhanghao"></i> </template
            ></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input type="text" class="form_input" v-model="signUpForm.email" placeholder="Email">
              <template #prefix>
                <i class="iconfont icon-youxiang"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              class="form_input"
              v-model="signUpForm.password"
              placeholder="Password"
              onpaste="return false"
              oncontextmenu="return false"
              oncopy="return false"
              oncut="return false"
            >
              <template #prefix>
                <i class="iconfont icon-mima"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password_again">
            <el-input
              type="password"
              class="form_input"
              v-model="signUpForm.password_again"
              placeholder="Password again"
              onpaste="return false"
              oncontextmenu="return false"
              oncopy="return false"
              oncut="return false"
            >
              <template #prefix>
                <i class="iconfont icon-mima"></i>
              </template>
            </el-input>
          </el-form-item>
          <button class="form_button button submit" @click="submitForm(signUpFormRef, 'signUp')">
            SIGN UP
          </button>
        </el-form>
      </div>

      <div class="switch" id="switch-cnt">
        <div class="switch_circle"></div>
        <div class="switch_circle switch_circle-t"></div>
        <div class="switch_container" id="switch-c1">
          <h2 class="switch_title title" style="letter-spacing: 0">Welcome Back！</h2>
          <p class="switch_description description">
            已经有账号了嘛，去登入账号来进入奇妙世界吧！！！
          </p>
          <button class="switch_button button switch-btn">SIGN IN</button>
        </div>

        <div class="switch_container is-hidden" id="switch-c2">
          <h2 class="switch_title title" style="letter-spacing: 0">Hello Friend！</h2>
          <p class="switch_description description">注册一个新账号，让我们踏入奇妙的旅途！！！</p>
          <button class="switch_button button switch-btn">SIGN UP</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { FormInstance, FormRules, ElMessage } from 'element-plus'
import * as Base64 from 'js-base64'
import { Validator } from '@/utils/validator'
// import { LoginService } from '@/service'
import useUserStore from '@/stores/modules/user'
import './style.scss'

const userStore = useUserStore()

let switchCtn: Element
let switchC2: Element
let switchC1: Element
let switchCircle: NodeListOf<Element>
let switchBtn: NodeListOf<Element>
let aContainer: Element
let bContainer: Element
let allButtons: NodeListOf<Element>

const signInFromRef = ref<FormInstance>()
const signUpFormRef = ref<FormInstance>()
// 登录表单数据
const signInForm = reactive({
  account: '',
  password: ''
})
// 注册表单数据
const signUpForm = reactive({
  account: '',
  email: '',
  password: '',
  password_again: ''
})
// 登录表单的验证规则
const signInRules = reactive<FormRules>({
  account: [{ required: true, message: '账号不能为空', trigger: 'change' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'change' }]
})
// 注册表单的验证规则
const signUpRules = reactive({
  account: [{ validator: Validator.standardName, trigger: 'change' }],
  email: [{ validator: Validator.checkemail, trigger: 'change' }],
  password: [{ validator: Validator.password, trigger: 'change' }],
  password_again: [{ validator: confirmPwd, trigger: 'change' }]
})

/* 确认密码的校验规则 */
function confirmPwd(rule: any, value: any, callback: any) {
  if (value !== signUpForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

/* 改变密码是否可见 */
const changePwdShow = (e: Event) => {
  const element = e.target as HTMLElement
  const elementInput = element.parentElement?.parentElement?.parentElement?.children[1]
  const nowType = elementInput?.getAttribute('type')
  const newType = nowType === 'password' ? 'text' : 'password'
  elementInput?.setAttribute('type', newType)

  element.classList.contains('icon-xianshikejian')
    ? element.classList.replace('icon-xianshikejian', 'icon-yincangbukejian')
    : element.classList.replace('icon-yincangbukejian', 'icon-xianshikejian')
}

/* 提交登录or注册表单 */
const submitForm = (formEl: FormInstance | undefined, type: string) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      if (type === 'signIn') {
        // 判断是账号名登录还是邮箱登录
        const loginParams: LoginParams = {
          password: Base64.encode(Base64.encode(signInForm.password))
        }
        const signInAccount = signInForm.account.replace(/^\s*|\s*$/g, '')
        signInForm.account.includes('@')
          ? (loginParams.email = signInAccount)
          : (loginParams.account = signInAccount)
        login(loginParams)
      } else {
        let [account, password, email] = [
          signUpForm.account,
          Base64.encode(Base64.encode(signUpForm.password)),
          signUpForm.email
        ]
        register({ account, password, email }, formEl)
      }
    } else {
      type === 'signIn' ? console.log('singIn error') : console.log('signUp error')
    }
  })
}

interface RegisterParams {
  account: string
  password: string
  email: string
}
interface LoginParams {
  account?: string
  password: string
  email?: string
}
/* 提交注册请求 */
function register(params: RegisterParams, formEl: FormInstance | undefined) {
  // LoginService.register(params).then(
  //   (res) => {
  //     if (res.status === 0) {
  //       ElMessage({ showClose: true, message: '注册成功，快去登录吧！', type: 'success' })
  //       formEl && formEl.resetFields()
  //       changeForm()
  //     } else {
  //       ElMessage({ showClose: true, message: res.msg, type: 'error' })
  //     }
  //     console.log(res)
  //   },
  //   (err) => {
  //     ElMessage({ showClose: true, message: '注册失败，请稍后再试！', type: 'error' })
  //   }
  // )
}

/* 登录 */
function login(params: LoginParams) {
  // userStore.login(params)
}

const getButtons = (e: Event) => e.preventDefault()
const changeForm = (e?: Event) => {
  // 修改类名
  switchCtn.classList.add('is-gx')
  setTimeout(function () {
    switchCtn.classList.remove('is-gx')
  }, 1500)
  switchCtn.classList.toggle('is-txr')
  switchCircle[0].classList.toggle('is-txr')
  switchCircle[1].classList.toggle('is-txr')

  switchC1.classList.toggle('is-hidden')
  switchC2.classList.toggle('is-hidden')
  aContainer.classList.toggle('is-txl')
  bContainer.classList.toggle('is-txl')
  bContainer.classList.toggle('is-z')
}
// 点击切换
const shell = () => {
  for (let i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener('click', getButtons)
  }
  for (let i = 0; i < switchBtn.length; i++) {
    switchBtn[i].addEventListener('click', changeForm)
  }
}

onMounted(() => {
  switchCtn = document.querySelector('#switch-cnt') as Element
  switchC2 = document.querySelector('#switch-c2') as Element
  switchC1 = document.querySelector('#switch-c1') as Element
  switchCircle = document.querySelectorAll('.switch_circle') as NodeListOf<Element>
  switchBtn = document.querySelectorAll('.switch-btn') as NodeListOf<Element>
  aContainer = document.querySelector('#a-container') as Element
  bContainer = document.querySelector('#b-container') as Element
  allButtons = document.querySelectorAll('.submit') as NodeListOf<Element>
  shell()
})
</script>
