<template functional>
  <router-link :to="{name: 'merchantRelPoi', query: { spuId: props.id }}">
    <slot></slot>
  </router-link>
</template>
