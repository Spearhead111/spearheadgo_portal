const darkTheme = {
  '--hover-bg-color': '#494949'
}
const lightTheme = {
  '--hover-bg-color': '#eeeeee'
}

export const toggleThemeGlobal = (isDark: boolean) => {
  const theme = isDark ? darkTheme : lightTheme
  for (let key in theme) {
    document.documentElement.style.setProperty(key, theme[key])
  }
}
