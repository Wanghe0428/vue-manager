<template>
  <div>
    <!-- 路由匹配到的组件将会显示 -->
    <router-view></router-view>
  </div>
</template>

// app.vue不能加scope，scope为局部样式，全局样式中不能加scope
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  list-style: none;
  outline: none;
  text-decoration: none;
}
.flex {
  display: flex;
}
.j-c {
  justify-content: center;
}
.j-s {
  justify-content: space-between;
}
.a-c {
  align-items: center;
}
</style>
