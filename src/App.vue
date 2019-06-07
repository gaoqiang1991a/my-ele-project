<template>
  <div id="app">
    <Header :seller='seller'></Header>
    <div class="tab border-1px">
      <router-link to='/goods' class="tab-item">商品</router-link>
      <router-link to='/ratings' class="tab-item">评论</router-link>
      <router-link to='/sellers' class="tab-item">商家</router-link>
    </div>
    <!-- 使用 keep-alive 缓存组件状态，确保各组件在切换时不重新渲染，保存已有的状态-->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Header from '@/components/header/Header'
const ERR_OK = '200'
export default {
  data () {
    return {
      seller: {}
    }
  },
  components: {
    Header
  },
  created () {
    this.axios.get('/seller').then(res => {
      if (res.data.errno === ERR_OK) {
        this.seller = res.data.data.seller
      }
    })
  }
}
</script>

<style lang="less" scoped>
@import './common/less/mixin.less';

#app {
  width: 100%;
  overflow: hidden;
  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    // border-bottom: 1px solid rgba(7,17,27,0.1);
    .border-1px(rgba(7,17,27,0.1));
    .tab-item {
      flex: 1;
      text-align: center;
      font-size: 14px;
      color: rgb(77, 85, 93);
      &.active {
        color: rgb(240, 20, 20);
      }
    }
  }
  .routerView-enter {
    transform: translate3d(100%, 0, 0);
  }
  .routerView-leave-to {
    transform: translate3d(-100%, 0, 0);
  }
  .routerView-enter-active,
  .routerView-leave-active {
    transition: all 0.3s ease;
  }
}
</style>
