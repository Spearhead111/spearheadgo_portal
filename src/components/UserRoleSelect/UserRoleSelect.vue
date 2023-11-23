<template>
  <v-select
    label="用户角色"
    :value="modelValue"
    :items="USER_ROLE_MAP_LIST"
    density="compact"
    prepend-inner-icon="mdi-tag-multiple"
    item-title="label"
    item-value="value"
    :multiple="multiple"
    :clearable="clearable"
    color="blue-grey-lighten-2"
    variant="underlined"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <!-- 选中的tag(chip)在select框中的插槽设置 -->
    <template v-slot:selection="{ item, index }">
      <v-chip
        v-if="(collapseTags && index < 2) || !collapseTags"
        class="rounded-lg"
        elevation="0"
        :color="USER_ROLE_ICON_MAP[item.raw.value].chipColor"
        variant="elevated"
        ><v-icon
          start
          style="padding-left: 6px;"
          :color="USER_ROLE_ICON_MAP[item.raw.value].iconColor"
          :icon="USER_ROLE_ICON_MAP[item.raw.value].icon"
        ></v-icon
        ><span class="tag-label">{{ item.raw.label }}</span></v-chip
      >
      <!-- 超过两个省略 -->
      <span v-if="multiple && collapseTags && index === 2" class="text-grey text-caption align-self-center">
        (+{{ modelValue?.length - 2 }} 其他)
      </span>
    </template>

    <!-- 选中的tag(chip)在select下拉框中的插槽设置 -->
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props">
        <v-chip
          class="rounded-lg"
          size="small"
          elevation="0"
          :color="USER_ROLE_ICON_MAP[item.raw.value].chipColor"
          variant="elevated"
        >
          <v-icon
            start
            :color="USER_ROLE_ICON_MAP[item.raw.value].iconColor"
            :icon="USER_ROLE_ICON_MAP[item.raw.value].icon"
          >
          </v-icon>
          <span class="tag-label">{{ item.raw.label }}</span>
        </v-chip>
      </v-list-item>
    </template>
  </v-select>
</template>

<script lang="ts" setup>
import { USER_ROLE_ICON_MAP, USER_ROLE_MAP_LIST } from '@/constants';
import { nextTick, onMounted, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: string | string[]
    multiple?: boolean
    collapseTags?: boolean
    clearable?: boolean
  }>(),
  {
    multiple: false,
    collapseTags: false,
    clearable: false
  }
)

onMounted(() => {})
</script>

<style lang="scss">
</style>
