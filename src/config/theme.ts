// 这里配置的主题色必须在common.scss中注册一下
const darkTheme = {
  '--hover-bg-color': '#494949',
  '--header-bg-color': 'rgb(120, 120, 120)',
  '--second-bg-color': '#404040',
  '--third-bg-color': '#404040'
}
const lightTheme = {
  '--hover-bg-color': '#eeeeee',
  '--header-bg-color': 'rgb(80, 80, 80)',
  '--second-bg-color': '#fbfbfb',
  '--third-bg-color': '#eee'
}

export const toggleThemeGlobal = (isDark: boolean) => {
  const theme = isDark ? darkTheme : lightTheme
  for (let key in theme) {
    document.documentElement.style.setProperty(key, theme[key as keyof typeof theme])
  }
  document.documentElement.classList.toggle('dark', isDark)
}
