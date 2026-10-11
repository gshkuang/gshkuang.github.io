<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import SidebarToggle from './SidebarToggle.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #nav-bar-content-after>
      <SidebarToggle />
    </template>
  </DefaultTheme.Layout>
</template>
