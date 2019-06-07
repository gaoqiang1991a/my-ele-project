<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{ seller.score }}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{ seller.rankRate }}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <Star :size="36" :score="seller.serviceScore"></Star>
            <span class="score">{{ seller.serviceScore }}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <Star :size="36" :score="seller.foodScore"></Star>
            <span class="score">{{ seller.foodScore }}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{ seller.deliveryTime }}分钟</span>
          </div>
        </div>
      </div>
      <Split/>
      <RatingSelect
        :desc="desc"
        :ratings="ratings"
        @ratingTypeChange="changeRatingType"
        @contentToggle="toggleContent"/>
      <div class="rating-wrapper">
        <ul>
          <li v-for="(rating, index) in filterRatings" :key="index" class="rating-item border-1px">
            <div class="avatar">
              <img :src="rating.avatar" width="28px" height="28px">
            </div>
            <div class="content">
              <div class="name">{{ rating.username }}</div>
              <div class="star-wrapper">
                <Star :size="24" :score="rating.score"/>
                <span class="delivery" v-show="rating.deliveryTime">{{ rating.deliveryTime }}分钟送达</span>
              </div>
              <p class="text">{{ rating.text }}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <i class="icon-thumb_up"></i>
                <span v-for="(item, index) in rating.recommend" :key="index" class="recommend-item">{{ item }}</span>
              </div>
              <div class="time">{{ rating.rateTime | formatTime }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import Star from '@/components/star/Star'
import Split from '@/components/split/Split'
import RatingSelect from '@/components/ratingselect/RatingSelect'
import Moment from 'moment'

// const POSITIVE = 0
// const NEGATIVE = 1
const ALL = 2
const ERR_OK = '200'

export default {
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    Star,
    Split,
    RatingSelect
  },
  data () {
    return {
      desc: {
        all: '全部',
        positive: '满意',
        negative: '不满意'
      },
      selectType: ALL,
      onlyContent: false,
      ratings: []
    }
  },
  created () {
    this.axios.get('/ratings').then(res => {
      if (res.data.errno === ERR_OK) {
        this.ratings = res.data.data.ratings
      }
    })
    this.$nextTick(() => {
      // BScroll的创建或者刷新一定要放到$nextTick()的回调函数中去执行，以确保DOM结构是最新的
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.ratings, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
    })
  },
  methods: {
    changeRatingType (type) {
      this.selectType = type
    },
    toggleContent (toggle) {
      this.onlyContent = toggle
    }
  },
  computed: {
    // eslint-disable-next-line
    filterRatings () { // 评论列表筛选的第二种实现：通过匹配筛选条件将筛选后的结果返回到一个新的数组中，作为计算属性的值传递出去
      if (this.ratings) {
        return this.ratings.filter((rating) => {
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
  },
  filters: {
    formatTime (time) { // 使用moment.js实现日期的格式化
      const formatTime = Moment(time).format('YYYY-MM-DD HH:mm')
      return formatTime
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../common/less/mixin.less';
.ratings {
  position: fixed;
  top: 174px;
  left: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  .overview {
    display: flex;
    padding: 18px 0;
    .overview-left {
      flex: 0 0 137px;
      padding: 6px 0;
      width: 137px;
      border-right: 1px solid rgba(7,17,27,0.1);
      text-align: center;
      @media only screen and (max-width: 320px) { // 兼容iphone5设置
        flex: 0 0 120px;
        width: 120px;
      }
      .score {
        margin-bottom: 6px;
        line-height: 28px;
        font-size: 24px;
        color: rgb(255,153,0);
      }
      .title {
        margin-bottom: 8px;
        line-height: 12px;
        font-size: 12px;
        color: rgb(7,17,27);
      }
      .rank {
        line-height: 10px;
        font-size: 10px;
        color: rgb(147,153,159);
      }
    }
    .overview-right {
      flex: 1;
      padding: 6px 0 6px 24px;
      @media only screen and (max-width: 320px) { // 兼容iphone5设置
        padding-left: 6px;
      }
      .score-wrapper {
        margin-bottom: 8px;
        font-size: 0;
        .title {
          display: inline-block;
          vertical-align: top;
          line-height: 18px;
          font-size: 12px;
          color: rgb(7,17,27);
        }
        .star {
          display: inline-block;
          margin: 0 12px;
          vertical-align: top;
        }
        .score {
          display: inline-block;
          vertical-align: top;
          line-height: 18px;
          font-size: 12px;
          color: rgb(255,153,0);
        }
      }
      .delivery-wrapper {
        font-size: 0;
        .title {
          line-height: 18px;
          font-size: 12px;
          color: rgb(7,17,27);
        }
        .delivery {
          margin-left: 12px;
          font-size: 12px;
          color: rgb(147,153,159);
        }
      }
    }
  }
  .rating-wrapper {
    padding: 0 18px;
    .rating-item {
      display: flex;
      padding: 18px 0;
      .border-1px(rgba(7,17,27,0.1));
      .avatar {
        flex: 0 0 28px;
        width: 28px;
        margin-right: 12px;
        img {
          border-radius: 50%;
        }
      }
      .content {
        position: relative;
        flex: 1;
        .name {
          margin-bottom: 4px;
          line-height: 12px;
          font-size: 10px;
          color: rgb(7,17,27);
        }
        .star-wrapper {
          margin-bottom: 6px;
          font-size: 0;
          .star {
            display: inline-block;
            vertical-align: top;
            margin-right: 6px;
          }
          .delivery {
            display: inline-block;
            vertical-align: top;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147,153,159);
          }
        }
        .text {
          margin-bottom: 8px;
          line-height: 18px;
          color: rgb(7,17,27);
          font-size: 12px;
        }
        .recommend {
          line-height: 16px;
          font-size: 0;
          .icon-thumb_up, .recommend-item {
            display: inline-block;
            margin: 0 8px 4px 0;
            font-size: 9px;
          }
          .icon-thumb_up {
            color: rgb(0,160,220);
          }
          .recommend-item {
            padding: 0 6px;
            border: 1px solid rgba(7,17,27,0.1);
            border-radius: 1px;
            color: rgb(147,153,159);
            background-color: #fff;
          }
        }
        .time {
          position: absolute;
          top: 0;
          right: 0;
          line-height: 12px;
          font-size: 10px;
          color: rgb(147,153,159);
        }
      }
    }
  }
}
</style>
