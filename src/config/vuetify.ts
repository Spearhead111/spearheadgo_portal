import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
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
  }
})
