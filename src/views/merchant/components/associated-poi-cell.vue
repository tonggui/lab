<template functional>
  <router-link :to="{name: 'merchantRelPoi', params: { spuId: props.id }}">
    <slot></slot>
  </router-link>
</template>
