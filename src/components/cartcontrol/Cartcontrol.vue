<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="decrease icon-remove_circle_outline"
      v-show="food.count > 0"
      @click.stop="decreaseCart">
      </div>
    </transition>
    <div class="count" v-show="food.count > 0" ref="count">{{ food.count }}</div>
    <!-- 注意使用@click.stop来阻止事件冒泡 -->
    <div class="add icon-add_circle" @click.stop="addCart"></div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart (event) {
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
        // 通过Vue.set(需要添加属性的对象，新增属性，属性默认值)方法可以为实例添加响应式属性，同时新添加的属性是双向绑定的，属性值的变化可以映射到父组件中
      } else {
        this.food.count++
      }
      // 通过向外派发add事件，将当前点击的按钮对象传递给父组件
      this.$emit('add', event.target)
    },
    decreaseCart () {
      if (this.food.count > 0) {
        this.food.count--
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cartcontrol {
  position: relative;
  font-size: 0;
  .decrease {
    display: inline-block;
    padding: 6px;
    line-height: 24px;
    font-size: 24px;
    color: rgb(0, 160, 220);
    &.move-enter, &.move-leave-to {
      opacity: 0;
      transform: translate3d(24px, 0, 0) rotate(180deg);
    }
    &.move-enter-active, &.move-leave-active {
      transition: all 0.4s ease;
    }
  }
  .count {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    padding-top: 6px;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    color: rgb(147,153,159);
  }
  .add {
    display: inline-block;
    padding: 6px;
    line-height: 24px;
    font-size: 24px;
    color: rgb(0, 160, 220);
  }
}
</style>
