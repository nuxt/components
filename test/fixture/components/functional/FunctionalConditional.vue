<template functional>
  <div>
    <FunctionalChild v-if="props.showChild" />
  </div>
</template>

<script>
export default {
  props: {
    showChild: Boolean
  }
}
</script>
