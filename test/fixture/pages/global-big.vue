<template>
  <div>
    <!-- is is used to make invisible from tag extractor -->
    <component :is="'Big'" />
  </div>
</template>

<style scoped>
div {
  word-wrap: break-word;
}
</style>
