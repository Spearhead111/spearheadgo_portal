import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
// Vuetify
import 'vuetify/styles'

const customLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    primary: '#2c3e50'
  }
}

const customDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#272727',
    primary: '#FFFFFF'
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'customLightTheme',
    themes: {
      customLightTheme,
      customDarkTheme
    }
  },
  icons: {
    defaultSet: 'mdi' // This is already the default value - only for display purposes
  }
})
