const darkTheme = {
  '--hover-bg-color': '#494949',
  '--header-bg-color': 'rgb(120, 120, 120)'
}
const lightTheme = {
  '--hover-bg-color': '#eeeeee',
  '--header-bg-color': 'rgb(80, 80, 80)'
}

export const toggleThemeGlobal = (isDark: boolean) => {
  const theme = isDark ? darkTheme : lightTheme
  for (let key in theme) {
    document.documentElement.style.setProperty(key, theme[key as keyof typeof theme])
  }
}
