<template>
  <div class="shopcart">
    <div class="content">
      <div class="conten-left" @click="toggleList">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight': totalCount > 0}">
            <i class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></i>
          </div>
          <div class="num" v-show="totalCount > 0">{{ totalCount }}</div>
        </div>
        <div class="price" :class="{'highlight': totalPrice > 0}">￥{{ totalPrice }}</div>
        <div class="desc">另需配送费￥{{ deliveryPrice }}元</div>
      </div>
      <div class="content-right">
        <div class="pay" :class="payClass">
          {{ payDesc }}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <div v-for="(ball, index) in balls" :key="index">
        <transition
         @before-enter="beforeEnter"
         @enter="enter"
         @after-enter="afterEnter">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food border-1px" v-for="(food, index) in selectFoods" :key="index">
              <span class="name">{{ food.name }}</span>
              <div class="price">
                <span>￥{{ food.price * food.count }}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <Cartcontrol :food="food" @add="drop"></Cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script>
import Cartcontrol from '@/components/cartcontrol/Cartcontrol'
import BScroll from 'better-scroll'
const BALL_LEN = 10 // 定义了购物车动画小球的个数，以满足快速点击的需要
function creatBalls () { // 创建小球的工厂函数
  let ret = []
  for (let i = 0; i < BALL_LEN; i++) {
    ret.push({
      show: false
    })
  }
  return ret
}
export default {
  components: {
    Cartcontrol
  },
  props: {
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    selectFoods: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      balls: creatBalls(),
      dropBalls: [], // 下落的小球，用于回收
      fold: true // 购物车列表初始化为折叠状态
    }
  },
  methods: {
    drop (el) { // 触发小球下落动画的方法
      for (let i = 0; i < this.balls.length; i++) {
        const ball = this.balls[i]
        if (!ball.show) { // 从所有小球中找到一个未展示的小球
          ball.show = true // 将小球展示，触发小球动画的关键
          ball.target = el // 将点击的按钮元素绑定到小球上
          this.dropBalls.push(ball) // 将该小球添加到下落的小球的数组中
          return
        }
      }
    },
    beforeEnter (el) { // 该钩子里定义了小球下落之前的状态
      const ball = this.dropBalls[this.dropBalls.length - 1]
      const rect = ball.target.getBoundingClientRect() // 计算触发小球动画的按钮相对于视口的距离
      const x = rect.left - 32
      const y = -(window.innerHeight - rect.top - 22)
      el.display = ''
      // 外层小球负责Y轴方向的动画
      el.style.transform = `translate3d(0, ${y}px, 0)`
      // 内层小球负责X轴方向的动画
      const inner = el.getElementsByClassName('inner-hook')[0]
      inner.style.transform = `translate3d(${x}px, 0, 0)`
    },
    enter (el, done) { // 该钩子里定义了小球下落过程中的状态
      this.reflow = document.body.offsetHeight // 触发浏览器重绘
      el.style.transform = `translate3d(0, 0, 0)` // 将小球归位，即落到购物车位置
      const inner = el.getElementsByClassName('inner-hook')[0]
      inner.style.transform = `translate3d(0, 0, 0)`
      el.addEventListener('transitionend', done) // 监听过渡执行完毕事件，触发done方法，执行下一个钩子
    },
    afterEnter (el) {
      const ball = this.dropBalls.shift() // 将下落小球数组中取出一个小球
      if (ball) { // 将小球进行回收
        ball.show = false
        el.style.display = 'none'
      }
    },
    // 购物车栏点击，切换显示与折叠
    toggleList () {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold // 通过 this.fold 的修改，控制计算属性 lisShow，从而控制购物车列表 的显隐
      if (!this.fold) { // 列表展开时，创建BScroll或者进行刷新
        this.$nextTick(() => {
          // 创建 better-scroll 实例或者 refresh
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      }
    },
    // 清空购物车
    empty () {
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
      this.listShow = false
    },
    // 点击背景蒙层折叠列表层
    hideList () {
      this.fold = true
    }
  },
  computed: {
    totalPrice () {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.count * food.price
      })
      return total
    },
    totalCount () {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差${diff}元起送`
      } else {
        return '去结算'
      }
    },
    payClass () {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    },
    listShow: { // 控制购物车列表的显示和隐藏
      get () {
        if (!this.totalCount) { // 如果选择食品数量为 0 ，则不显示
          // eslint-disable-next-line
          this.fold = true
          return false
        }
        let show = !this.fold
        return show
      },
      set () {
        if (!this.totalCount) {
          this.fold = true
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../common/less/mixin.less';
.shopcart {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 99;
  width: 100%;
  height: 48px;
  .content {
    display: flex;
    background-color: #141d27;
    font-size: 0;
    .conten-left {
      flex: 1;
      .logo-wrapper {
        display: inline-block;
        vertical-align: top;
        position: relative;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        width: 56px;
        height: 56px;
        box-sizing: border-box;
        border-radius: 50%;
        background-color: #141d27;
        .logo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #2b343c;
          text-align: center;
          &.highlight {
            background-color: rgb(0,160,220);
          }
          .icon-shopping_cart {
            font-size: 24px;
            line-height: 44px;
            color: #80858a;
            &.highlight {
              color: #fff;
            }
          }
        }
        .num {
          position: absolute;
          top: 0;
          right: 0;
          width: 18px;
          height: 18px;
          line-height: 18px;
          text-align: center;
          border-radius: 16px;
          font-size: 9px;
          font-weight: 700;
          color: #fff;
          background-color: rgb(240,20,20);
          box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
        }
      }
      .price {
        display: inline-block;
        vertical-align: top;
        line-height: 24px; // 考虑到后面还有个边框，边框并不是占满整个宽度的，因此此处不用line-height取值父元素的高度来实现垂直居中，而是配合使用margin-top来实现
        margin-top: 12px;
        padding-right: 12px;
        box-sizing: border-box;
        border-right: 1px solid rgba(255,255,255,0.1);
        font-size: 16px;
        font-weight: 700;
        color: rgba(255,255,255,0.4);
        &.highlight {
          color: #fff;
        }
      }
      .desc {
        display: inline-block;
        vertical-align: top;
        margin-top: 12px;
        margin-left: 12px;
        line-height: 24px;
        font-size: 10px;
        color: rgba(255,255,255,0.4);
      }
    }
    .content-right {
      flex: 0 0 105px;
      width: 105px;
      .pay {
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 12px;
        font-weight: 700;
        color: rgba(255,255,255,0.4);
        &.not-enough {
          background-color: #2b333b;
        }
        &.enough {
          background-color: #00b43c;
          color: #fff;
        }
      }
    }
  }
  .ball-container {
    .ball {
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;
      transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
      .inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: rgb(0,160,220);
        transition: all 0.4s linear;
      }
    }
  }
  .shopcart-list {
    position: absolute;
    bottom: 48px;
    left: 0;
    z-index:-1;
    width: 100%;
    &.fold-enter, &.fold-leave-to {
      transform: translate3d(0,100%,0);
    }
    &.fold-enter-active, &.fold-leave-active {
      transition: all 0.5s ease;
    }
    .list-header {
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      background-color: #f3f5f7;
      border-bottom: 1px solid rgba(7,17,27,0.1);
      .title {
        float: left;
        font-size: 14px;
        color: rgb(7,17,27);
      }
      .empty {
        float: right;
        font-size: 12px;
        color: rgb(0,160,220);
      }
    }
    .list-content {
      padding: 0 18px;
      max-height: 217px;
      overflow: hidden;
      background-color: #fff;
      .food {
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        .border-1px(rgba(7,17,27,0.1));
        .name {
          line-height: 24px;
          font-size: 14px;
          color: rgb(7,17,27);
        }
        .price {
          position: absolute;
          right: 90px;
          bottom: 12px;
          line-height: 24px;
          font-size: 14px;
          font-weight: 700;
          color: rgb(240,20,20);
        }
        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 6px;
        }
      }
    }
  }
  .list-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    background-color: rgba(7,17,27,0.6);
    backdrop-filter: blur(10px);
    opacity: 1;
    &.fade-enter, &.fade-leave-to {
      opacity: 0;
    }
    &.fade-enter-active, &fade-leave-active {
      transition: all 0.4s;
    }
  }
}
</style>
