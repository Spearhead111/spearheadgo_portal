<template>
  <div class="header-background"></div>
  <div class="tools-page-content">
    <!-- 工具菜单 -->
    <div :class="['tools-menu-content', { 'tools-menu-content__collapsed': isCollapseMenu }]">
      <ul class="tools-menu-content-ul">
        <li class="elevation-8" v-for="submenu in TOOL_MENU_CONFIG" :key="submenu.titleName">
          <p>{{ submenu.titleName }}</p>
          <div class="tools-submenu-content">
            <div
              :class="[
                'tool-item',
                { 'tool-item__selected': currentComponentName === toolItem.name }
              ]"
              v-for="toolItem in submenu.toolItems"
              @click="selcetToolItem(toolItem)"
            >
              <v-img :width="45" :src="toolItem.icon"></v-img>
              <span>{{ toolItem.name }}</span>
            </div>
          </div>
        </li>
      </ul>
      <v-btn
        class="collapse-btn"
        size="x-small"
        color="purple-darken-2"
        :icon="isCollapseMenu ? 'mdi-chevron-right-circle' : 'mdi-chevron-left-circle'"
        variant="tonal"
        @click="isCollapseMenu = !isCollapseMenu"
      >
      </v-btn>
    </div>
    <!-- 内容 -->
    <component class="tool-content" :is="currentComponent"></component>
  </div>
</template>

<script lang="ts" setup>
import './style.scss'
import { onMounted, ref } from 'vue'
import { TOOL_MENU_CONFIG } from './constants/toolsMenu'

const currentComponent = ref()
const currentComponentName = ref('')
/** 工具菜单是否折叠 */
const isCollapseMenu = ref(false)

/** 选中工具项 */
const selcetToolItem = (toolItem: any) => {
  currentComponent.value = toolItem.component
  currentComponentName.value = toolItem.name
}
</script>
