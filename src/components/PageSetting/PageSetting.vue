<template>
  <el-popover placement="left" trigger="hover" :teleported="false">
    <template #reference>
      <div class="setting-icon-wapper">
        <v-icon class="setting-icon-top-left" icon=" mdi-cog" size="small"></v-icon>
        <v-icon class="setting-icon-bottom-right" icon=" mdi-cog" size="large"></v-icon>
      </div>
    </template>
    <ul class="page-setting-list">
      <li>
        <v-icon
          :icon="isDarkTheme ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
          @click="toggleTheme"
        />
      </li>
      <li>
        <v-icon
          :icon="isDarkTheme ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
          @click="toggleTheme"
        />
      </li>
    </ul>
  </el-popover>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import './style.scss'

const theme = useTheme()

const isDarkTheme = computed(() => {
  return theme.global.current.value.dark
})
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>
