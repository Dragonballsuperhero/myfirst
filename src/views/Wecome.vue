<template>
  <div>
   <h2>Wecome {{username}}</h2>
  </div>
</template>

<script>
export default {
  name:'Wecome',
  data() {
    return {
      username: 'admin'
    };
  },
}
</script>

<style lang="less" scoped>

</style>