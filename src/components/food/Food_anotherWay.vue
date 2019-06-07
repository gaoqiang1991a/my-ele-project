<template>
  <transition name="slide">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="img-header">
          <img :src="food.image">
          <div class="back" @click="back">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{ food.name }}</h1>
          <div class="detail">
            <span class="sell-count">月售{{ food.sellCount }}份</span>
            <span class="rating">好评率{{ food.rating }}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{ food.price }}</span><span class="old" v-if="food.oldPrice">￥{{ food.oldPrice }}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <!-- 通过@add="cartControlAdd"监听Cartcontrol组件向外派发的add事件，通过cartControlAdd处理函数再向外层父组件派发一个事件，实现购物车小球动画 -->
            <Cartcontrol :food="food" @add="cartControlAdd"></Cartcontrol>
          </div>
          <transition name="fade">
            <div @click.stop="addFirst" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
          </transition>
        </div>
        <Split v-show="food.info"></Split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{ food.info }}</p>
        </div>
        <Split></Split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <!-- 通过监听 RatingSelect组件向外派发的ratingTypeChange和contentToggle方法，将更改后的评论列表筛选条件传递给Food组件-->
          <RatingSelect :desc="desc" :ratings="food.ratings" @ratingTypeChange="changeRatingType" @contentToggle="toggleContent"></RatingSelect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <!-- 通过将计算属性filterRatings的值进行遍历，将匹配筛选条件后的列表进行渲染 -->
              <li v-for="(rating, index) in filterRatings" :key="index" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{ rating.username }}</span>
                  <img :src="rating.avatar" class="avatar" width="12" height="12">
                </div>
                <!-- 通过formatTime过滤器将时间戳进行格式化 -->
                <div class="time">{{ rating.rateTime | formatTime }}</div>
                <p class="text">
                  <span :class="{'icon-thumb_down': rating.rateType === 1, 'icon-thumb_up': rating.rateType === 0}"></span>
                  {{ rating.text }}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BScroll from 'better-scroll'
import Vue from 'vue'
import Cartcontrol from '@/components/cartcontrol/Cartcontrol'
import Split from '@/components/split/Split'
import RatingSelect from '@/components/ratingselect/RatingSelect'
import Moment from 'moment'

// 选用有语义化的词来预定义一些常量，便于提供代码的可读性
// const POSITIVE = 0
// const NEGATIVE = 1
const ALL = 2

export default {
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: false,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  components: {
    Cartcontrol,
    Split,
    RatingSelect
  },
  methods: {
    show () { // 触发Food组件页面展示的方法，通过在父组件中调用该方法展示对应的food详情页
      this.showFlag = true
      this.selectType = ALL // 每次展示页面时重置状态
      this.onlyContent = false // 每次展示页面时重置状态
      this.$nextTick(() => {
        // BScroll的创建或者刷新一定要放到$nextTick()的回调函数中去执行，以确保DOM结构是最新的
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    back () { // 返回按钮处理函数
      this.showFlag = false
    },
    addFirst (event) { // 点击加入购物车按钮触发的事件
      this.$emit('add', event.target)
      Vue.set(this.food, 'count', 1)
    },
    cartControlAdd (target) { // 监听Cartcontrol组件向Food组件派发的add事件所触发的处理函数，用于向父组件Goods组件派发事件，从而触发在food组件中点击Cartcontrol按钮时的小球动画效果
      this.$emit('add', target)
    },
    changeRatingType (type) { // 监听RatingSelect子组件派发的ratingTypeChange事件的处理函数，将更改后的筛选类型传递给Food组件，从而改变评论列表的筛选条件
      this.selectType = type
    },
    toggleContent (toggle) { // 监听RatingSelect子组件派发的contentToggle事件的处理函数，将更改后的筛选类型传递给Food组件，从而改变评论列表的筛选条件
      this.onlyContent = toggle
    }
  },
  filters: {
    formatTime (time) { // 使用moment.js实现日期的格式化
      const formatTime = Moment(time).format('YYYY-MM-DD HH:mm')
      return formatTime
    }
  },
  computed: {
    // eslint-disable-next-line
    filterRatings () { // 评论列表筛选的第二种实现：通过匹配筛选条件将筛选后的结果返回到一个新的数组中，作为计算属性的值传递出去
      if (this.food.ratings) {
        return this.food.ratings.filter((rating) => {
          if (this.onlyContent && !rating.text) {
            return false
          }
          if (this.selectType === ALL) {
            return true
          }
          return rating.rateType === this.selectType
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../common/less/mixin.less';
.food {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 48px;
  z-index: 30;
  width: 100%;
  background-color: #fff;
  opacity: 1;
  &.slide-enter, &.slide-leave-to {
    transform: translate3d(100%,0,0);
    opacity: 0;
  }
  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.4s ease;
  }
  .food-content {
    .img-header {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 100%; // padding值取百分比时，是以盒子的宽度为基准计算的，这样设置可以确保图片未加载完成时仍然有一个宽高相等的盒子占位，避免页面抖动
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .back {
        position: absolute;
        left: 6px;
        top: 8px;
        .icon-arrow_lift {
          display: block;
          padding: 10px; // 使按钮的点击区域变大，但不影响外观
          font-size: 20px;
          color: #fff;
        }
      }
    }
    .content {
      position: relative;
      padding: 18px;
      .title {
        margin-bottom: 8px;
        line-height: 14px;
        font-size: 14px;
        font-weight: 700;
        color: rgb(7,17,27);
      }
      .detail {
        margin-bottom: 18px;
        line-height: 10px;
        height: 10px;
        font-size: 0;
        .sell-count, .rating {
          font-size: 10px;
          color: rgb(147,153,159);
        }
        .sell-count {
          margin-right: 12px;
        }
      }
      .price {
        font-weight: 700;
        line-height: 24px;
        .now {
          margin-right: 8px;
          font-size: 14px;
          color: rgb(240, 20, 20);
        }
        .old {
          text-decoration: line-through;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
      }
      .cartcontrol-wrapper {
        position: absolute;
        right: 12px;
        bottom: 12px;
      }
      .buy {
        position: absolute;
        right: 18px;
        bottom: 18px;
        z-index: 10;
        height: 24px;
        line-height: 24px;
        padding: 0 12px;
        box-sizing: border-box;
        border-radius: 12px;
        font-size: 10px;
        color: #fff;
        opacity: 1;
        background-color: rgb(0,160,220);
        &.fade-enter, &.fade-leave-to {
          opacity: 0;
        }
        &.fade-active, &.fade-leave-active {
          transition: all 0.4s;
        }
      }
    }
    .info {
      padding: 18px;
      .title {
        line-height: 14px;
        margin-bottom: 6px;
        font-size: 14px;
        color: rgb(7,17,27);
      }
      .text {
        padding: 0 8px;
        line-height: 24px;
        font-size: 12px;
        color: rgb(77,85,93);
      }
    }
    .rating {
      padding-top: 18px;
      .title {
        line-height: 14px;
        margin-left: 18px;
        font-size: 14px;
        color: rgb(7,17,27);
      }
      .rating-wrapper {
        padding: 0 18px;
        .rating-item {
          position: relative;
          padding: 16px 0;
          .border-1px(rgba(7,17,27,0.1));
          .user {
            position: absolute;
            right: 0;
            top: 16px;
            line-height: 12px;
            font-size: 0;
            .name {
              display: inline-block;
              vertical-align: top;
              margin-right: 6px;
              font-size: 10px;
              color: rgb(147,153,159);
            }
            .avatar {
              border-radius: 50%;
            }
          }
          .time {
            line-height: 12px;
            margin-bottom: 6px;
            font-size: 10px;
            color: rgb(147,153,159);
          }
          .text {
            line-height: 16px;
            font-size: 12px;
            color: rgb(7,17,27);
            .icon-thumb_down, .icon-thumb_up {
              line-height: 16px;
              margin-right: 4px;
              font-size: 12px;
              color: rgb(147,153,159);
            }
            .icon-thumb_up {
              color: rgb(0,160,220);
            }
          }
        }
      }
    }
  }
}
</style>
