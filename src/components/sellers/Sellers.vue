<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <div class="title">
          {{ seller.name }}
        </div>
        <div class="desc border-1px">
          <Star :size="36" :score="seller.score"></Star>
          <span class="text">({{ seller.ratingCount }})</span>
          <span class="text">月售{{ seller.sellCount }}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{ seller.minPrice }}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送费</h2>
            <div class="content">
              <span class="stress">{{ seller.deliveryPrice }}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{ seller.deliveryTime }}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <i class="icon-favorite" :class="{'active': favorite}"></i>
          <span class="text">{{ favoriteText }}</span>
        </div>
      </div>
      <Split></Split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{ seller.bulletin }}</p>
        </div>
        <ul class="supports" v-if="seller.supports">
          <li v-for="(support,index) in seller.supports" :key="index" class="supports-item border-1px">
            <span class="icon" :class="classmap[support.type]"></span>
            <span class="desc">{{ support.description }}</span>
          </li>
        </ul>
      </div>
      <Split></Split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(pic, index) in seller.pics" :key="index">
              <!-- 使用vue-photo-preview插件 实现点击图片预览的效果 -->
              <img :src="pic" width="120" height="90" preview="1">
            </li>
          </ul>
        </div>
      </div>
      <Split></Split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item border-1px" v-for="(info,index) in seller.infos" :key="index">{{ info }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Star from '@/components/star/Star'
import Split from '@/components/split/Split'
import BScroll from 'better-scroll'
import { saveToLocal, loadFromLocal } from '@/common/js/store.js'

export default {
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    Star,
    Split
  },
  data () {
    return {
      classmap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      favorite: ''
    }
  },
  computed: {
    favoriteText () {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  watch: {
    seller () {
      // 因为vue中数据的获取和渲染是异步的，所以需监听seller属性的变化，当seller数据获取后再给商家图片列表的宽度进行赋值，再渲染DOM，以激活Bscroll的滚动效果监听到seller变化时，也即seller数据获取到并传递给本组件后，再设置图片列表的内容宽度，此函数是解决在seller页面刷新时获取seller属性的情况，如果在其他页面进行刷新，再切换至该组件，则此方法不会执行。
      if (this.seller.pics.length) {
        let picWidth = 120
        let margin = 6
        let width = (picWidth + margin) * this.seller.pics.length - margin
        this.$refs.picList.style.width = width + 'px'
      }
      // 监听seller属性的变化，使得在商家页面进行页面刷新时，当请求数据异步获取完seller属性并传递给seller组件后，可以从本地存储中读取到favorite属性的值，如果只在created中读取favorite属性值，由于数据是异步获取的，因此会出现created执行时seller为undefined的情况
      this.favorite = loadFromLocal(this.seller.id, 'favorite', false)
    }
  },
  created () {
    // 如果只在watch seller的函数中执行loadFromLocal，则当在非商家页刷新页面，在切换至商家详情页时，由于seller属性之前已获取到，并传入了子组件，因此seller并不会改变，也就不会触发loadFromLocal的执行，因此还需要在created钩子中调用loadFromLocal来读取favorite
    this.favorite = loadFromLocal(this.seller.id, 'favorite', false)
  },
  mounted () {
    // 在mounted钩子函数中仍需重新对图片列表的宽度进行赋值，因为如果在非商家详情页进行刷新，则当页面切换至seller组件页面时，由于seller数据此前已获取到，所以并不会发生变化，也就不会触发watch seller里面的宽度赋值方法，也不能在created钩子中去赋值，因为在created钩子中DOM还未生成，因此通过this.$refs.picList将获取不到DOM对象，也就无法对其样式进行修改，所以需在mounted钩子中等DOM节点生成后再获取DOM元素并进行宽度样式的修改
    if (this.seller.pics) {
      let picWidth = 120
      let margin = 6
      let width = (picWidth + margin) * this.seller.pics.length - margin
      this.$refs.picList.style.width = width + 'px'
    }
    this.$nextTick(() => {
      // BScroll的创建或者刷新一定要放到$nextTick()的回调函数中去执行，以确保DOM结构是最新的
      this.initPageScroll()
      this.initPicListScroll()
    })
  },
  methods: {
    initPageScroll () { // 总体页面的上下滑动
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
    },
    initPicListScroll () {
      if (!this.picScroll) { // 商家图片的横向滑动
        this.picScroll = new BScroll(this.$refs.picWrapper, {
          click: true,
          scrollX: true, // 开启横向滚动
          eventPassThrough: 'vertical' // 横向滚动时忽略纵向的滑动
        })
      } else {
        this.picScroll.refresh()
      }
    },
    toggleFavorite () { // 切换收藏状态
      this.favorite = !this.favorite
      saveToLocal(this.seller.id, 'favorite', this.favorite)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../common/less/mixin.less';
.seller {
  position: fixed;
  top: 174px;
  left: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  .seller-content {
    .overview {
      position: relative;
      padding: 18px;
      .title {
        margin-bottom: 8px;
        line-height: 14px;
        color: rgb(7,17,27);
        font-size: 14px;
      }
      .desc {
        padding-bottom: 18px;
        font-size: 0;
        .border-1px(rgba(7,17,27,0.1));
        .star {
          display: inline-block;
          margin-right: 8px;
          vertical-align: top;
        }
        .text {
          display: inline-block;
          margin-right: 12px;
          line-height: 18px;
          vertical-align: top;
          font-size: 10px;
          color: rgb(77,85,93);
        }
      }
      .remark {
        display: flex;
        padding-top: 18px;
        .block {
          flex: 1;
          text-align: center;
          border-right: 1px solid rgba(7,17,27,0.1);
          &:last-child {
            border: none;
          }
          h2 {
            margin-bottom: 4px;
            line-height: 10px;
            font-size: 10px;
            color: rgb(147,153,159);
          }
          .content {
            line-height: 24px;
            font-size: 10px;
            color: rgb(7,17,27);
            .stress {
              font-size: 24px;
            }
          }
        }
      }
      .favorite {
        position: absolute;
        top: 18px;
        right: 11px;
        width: 50px;
        text-align: center;
        .icon-favorite {
          display: block;
          margin-bottom: 4px;
          line-height: 24px;
          font-size: 24px;
          color: #d4d6d9;
          &.active {
            color: rgb(240,20,20);
          }
        }
        .text {
          line-height: 10px;
          font-size: 10px;
          color: rgb(77,85,93);
        }
      }
    }
    .bulletin {
      padding: 18px 18px 0 18px;
      .title {
        margin-bottom: 8px;
        line-height: 14px;
        color: rgb(7,17,27);
        font-size: 14px;
      }
      .content-wrapper {
        padding: 0 12px 18px 12px;
        .border-1px(rgba(7,17,27,0.1));
        .content {
          line-height: 24px;
          font-size: 12px;
          color: rgb(240,20,20);
        }
      }
      .supports {
        .supports-item {
          padding: 16px 12px;
          font-size: 0;
          .border-1px(rgba(7,17,27,0.1));
          &:last-child {
            .border-none();
          }
          .icon {
            display: inline-block;
            vertical-align: top;
            width: 16px;
            height: 16px;
            margin-right: 6px;
            &.decrease {
              background: url("./decrease_4@2x.png");
              background-size: 16px 16px;
              background-repeat: no-repeat;
            }
            &.discount {
              background: url("./discount_4@2x.png");
              background-size: 16px 16px;
              background-repeat: no-repeat;
            }
            &.guarantee {
              background: url("./guarantee_4@2x.png");
              background-size: 16px 16px;
              background-repeat: no-repeat;
            }
            &.invoice {
              background: url("./invoice_4@2x.png");
              background-size: 16px 16px;
              background-repeat: no-repeat;
            }
            &.special {
              background: url("./special_4@2x.png");
              background-size: 16px 16px;
              background-repeat: no-repeat;
            }
          }
          .desc {
            line-height: 16px;
            font-size: 12px;
            color: rgb(7,17,27);
          }
        }
      }
    }
    .pics {
      padding: 18px;
      .title {
        margin-bottom: 12px;
        line-height: 14px;
        color: rgb(7,17,27);
        font-size: 14px;
      }
      .pic-wrapper {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        .pic-list {
          font-size: 0;
          .pic-item {
            display: inline-block;
            margin-right: 6px;
            width: 120px;
            height: 90px;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }
    .info {
      padding: 18px 18px 0 18px;
      .title {
        padding-bottom: 12px;
        line-height: 14px;
        color: rgb(7,17,27);
        font-size: 14px;
        .border-1px(rgba(7,17,27,0.1));
      }
      .info-item {
        padding: 16px 12px;
        line-height: 16px;
        .border-1px(rgba(7,17,27,0.1));
        font-size: 12px;
        color: rgb(7,17,27);
        &:last-child {
          .border-none();
        }
      }
    }
  }
}
</style>
