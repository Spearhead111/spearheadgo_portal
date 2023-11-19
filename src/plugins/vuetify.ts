import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
// Vuetify
import 'vuetify/styles'

const light: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FFFFFF', // 整体的背景颜色
    primary: '#252933',
    surface: '#FFFFFF' // vuetify组件的背景颜色
  }
}

const dark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#272727',
    primary: '#b4b4b4',
    surface: '#272727'
  }
}

// const theme = {
//   defaultTheme: 'light',
//   themes: {
//     light: {
//       dark: false,
//       variables: {}, // ✅ this property is required to avoid Vuetify crash
//       colors: {
//         //green: '#00ff00' // cannot use primary color names here, so use a custom color name (such as 'greenish')
//         greenish: '#03DAC5',
//         // Workaround: Custom colors seem to erase default colors, so we need to include the default colors (of `light` or `dark` theme)
//         background: '#fbfbfb',
//         surface: '#212121',
//         primary: '#00ff00',
//         'primary-darken-1': '#3700B3',
//         secondary: '#03DAC5',
//         'secondary-darken-1': '#03DAC5',
//         error: '#CF6679',
//         info: '#2196F3',
//         success: '#4CAF50',
//         warning: '#FB8C00'
//       }
//     },
//     darkBlue: {
//       dark: true,
//       variables: {}, // ✅ this property is required to avoid Vuetify crash
//       colors: {
//         //green: '#00ff00' // cannot use primary color names here, so use a custom color name (such as 'greenish')
//         greenish: '#03DAC5',
//         // Workaround: Custom colors seem to erase default colors, so we need to include the default colors (of `light` or `dark` theme)
//         background: '#111928',
//         surface: '#212121',
//         primary: '#00ff00',
//         'primary-darken-1': '#3700B3',
//         secondary: '#03DAC5',
//         'secondary-darken-1': '#03DAC5',
//         error: '#CF6679',
//         info: '#2196F3',
//         success: '#4CAF50',
//         warning: '#FB8C00'
//       }
//     }
//   }
// }

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light,
      dark
    }
  },
  icons: {
    defaultSet: 'mdi' // This is already the default value - only for display purposes
  }
})
