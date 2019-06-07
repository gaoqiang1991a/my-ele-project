<template>
  <div class="header">
    <div class="content-wraper">
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar" alt>
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{ seller.name }}</span>
        </div>
        <div class="description">{{ seller.description }}/{{ seller.deliveryTime }}分钟送达</div>
        <div v-if="seller.supports" class="supports">
          <span class="icon" :class="classmap[seller.supports[0].type]"></span>
          <span class="text">{{ seller.supports[0].description }}</span>
        </div>
      </div>
      <div class="support-count" v-if="seller.supports" @click="showDetail">
        <span class="count">{{ seller.supports.length }}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wraper" @click="showDetail">
      <span class="bulletin"></span>
      <span class="text">{{ seller.bulletin }}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <transition name="detail">
      <div v-show="detailShow" class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <div class="name">{{ seller.name }}</div>
            <div class="star-wrapper">
              <Star :size="48" :score="seller.score"></Star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul class="supports" v-if="seller.supports">
              <li v-for="(support,index) in seller.supports" :key="index" class="supports-item">
                <span class="icon" :class="classmap[support.type]"></span>
                <span class="des">{{ support.description }}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="buletin-detail">{{ seller.bulletin }}</div>
          </div>
        </div>
        <div class="detail-close" @click="closeDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Star from '@/components/star/Star'

export default {
  props: ['seller'],
  data () {
    return {
      classmap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      detailShow: false
    }
  },
  methods: {
    showDetail () {
      this.detailShow = true
    },
    closeDetail () {
      this.detailShow = false
    }
  },
  components: {
    Star
  }
}
</script>

<style lang="less" scoped>
.header {
  position: relative;
  color: #fff;
  background-color: rgba(7, 17, 27, 0.5);
  overflow: hidden;
  .content-wraper {
    position: relative;
    padding: 24px 12px 18px 24px;
    font-size: 0;
    .avatar {
      display: inline-block;
      vertical-align: top;
      img {
        border-radius: 2px;
      }
    }
    .content {
      display: inline-block;
      margin-left: 16px;
      .title {
        margin-top: 2px;
        margin-bottom: 8px;
        .brand {
          display: inline-block;
          vertical-align: top;
          width: 30px;
          height: 18px;
          background: url(./brand@2x.png);
          background-size: 30px 18px;
          background-repeat: no-repeat;
        }
        .name {
          margin-left: 6px;
          line-height: 18px;
          font-size: 16px;
          font-weight: 700;
        }
      }
      .description {
        margin-bottom: 10px;
        line-height: 12px;
        font-size: 12px;
      }
      .supports {
        .icon {
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin-right: 4px;
          &.decrease {
            background: url("./decrease_1@2x.png");
            background-size: 12px 12px;
            background-repeat: no-repeat;
          }
          &.discount {
            background: url("./discount_1@2x.png");
            background-size: 12px 12px;
            background-repeat: no-repeat;
          }
          &.guarantee {
            background: url("./guarantee_1@2x.png");
            background-size: 12px 12px;
            background-repeat: no-repeat;
          }
          &.invoice {
            background: url("./invoice_1@2x.png");
            background-size: 12px 12px;
            background-repeat: no-repeat;
          }
          &.special {
            background: url("./special_1@2x.png");
            background-size: 12px 12px;
            background-repeat: no-repeat;
          }
        }
        .text {
          line-height: 12px;
          font-size: 10px;
        }
      }
    }
    .support-count {
      position: absolute;
      right: 12px;
      bottom: 18px;
      padding: 0 8px;
      height: 24px;
      line-height: 24px;
      border-radius: 14px;
      background-color: rgba(0, 0, 0, 0.2);
      text-align: center;
      .count {
        vertical-align: top;
        font-size: 10px;
      }
      .icon-keyboard_arrow_right {
        margin-left: 2px;
        font-size: 10px;
        line-height: 24px;
      }
    }
  }
  .bulletin-wraper {
    position: relative;
    height: 28px;
    line-height: 28px;
    padding: 0 22px 0 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: rgba(7, 17, 27, 0.2);
    .bulletin {
      display: inline-block;
      vertical-align: top;
      margin-top: 7px;
      width: 22px;
      height: 12px;
      background-image: url("./bulletin@2x.png");
      background-size: 22px 12px;
      background-repeat: no-repeat;
    }
    .text {
      vertical-align: top;
      margin: 0 4px;
      font-size: 10px;
    }
    .icon-keyboard_arrow_right {
      position: absolute;
      right: 12px;
      bottom: 7px;
      font-size: 10px;
    }
  }
  .background {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    filter: blur(8px);
  }
  .detail {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(7, 17, 27, 0.8);
    backdrop-filter: blur(10px);  // IOS上可实现背景的模糊
    &.detail-enter, &.detail-leave-to {
      transform: translate3d(0, 100%, 0);
    }
    &.detail-enter-active, &.detail-leave-active {
      transition: all 0.4s ease;
    }
    .detail-wrapper {
      width: 100%;
      min-height: 100%;
      .detail-main {
        margin-top: 64px;
        padding-bottom: 64px; // 固定套路：底部要预留关闭按钮的位置
        .name {
          line-height: 16px;
          text-align: center;
          font-size: 16px;
          font-weight: 700;
        }
        .star-wrapper {
          margin-top: 18px;
          padding: 2px 0;
          text-align: center;
        }
        .title {
          display: flex;
          width: 80%;
          margin: 28px auto 24px auto;
          .line {
            flex: 1;
            position: relative;
            top: -6px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          }
          .text {
            padding: 0 12px;
            font-size: 14px;
            font-weight: 700;
          }
        }
        .supports {
          width: 80%;
          margin: 0 auto;
          padding: 0 12px;
          box-sizing: border-box;
          .supports-item {
            margin-bottom: 12px;
            &:last-child {
              margin-bottom: 0;
            }
            .icon {
              display: inline-block;
              vertical-align: top;
              width: 16px;
              height: 16px;
              margin-right: 6px;
              &.decrease {
                background: url("./decrease_2@2x.png");
                background-size: 16px 16px;
                background-repeat: no-repeat;
              }
              &.discount {
                background: url("./discount_2@2x.png");
                background-size: 16px 16px;
                background-repeat: no-repeat;
              }
              &.guarantee {
                background: url("./guarantee_2@2x.png");
                background-size: 16px 16px;
                background-repeat: no-repeat;
              }
              &.invoice {
                background: url("./invoice_2@2x.png");
                background-size: 16px 16px;
                background-repeat: no-repeat;
              }
              &.special {
                background: url("./special_2@2x.png");
                background-size: 16px 16px;
                background-repeat: no-repeat;
              }
            }
            .des {
              line-height: 12px;
              font-size: 12px;
            }
          }
        }
        .buletin-detail {
          width: 80%;
          margin: 0 auto;
          padding: 0 12px;
          box-sizing: border-box;
          line-height: 24px;
          font-size: 12px;
        }
      }
    }
    .detail-close {
      position: relative;
      width: 32px;
      height: 32px;
      margin: -64px auto 0 auto; // 固定套路
      clear: both;  // 固定套路
      font-size: 32px;
    }
  }
}
</style>
