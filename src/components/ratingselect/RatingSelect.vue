<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="select(2)" class="block positive" :class="{'active': selectType === 2}">
        {{ desc.all }}
        <span class="count">{{ ratings.length }}</span>
      </span>
      <span @click="select(0)" class="block positive" :class="{'active': selectType === 0}">
        {{ desc.positive }}
        <span class="count">{{ positives.length }}</span>
      </span>
      <span @click="select(1)" class="block negative" :class="{'active': selectType === 1}">
        {{ desc.negative }}
        <span class="count">{{ negatives.length }}</span>
      </span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'on': onlyContent}">
      <i class="icon-check_circle"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2

export default {
  props: {
    ratings: {
      type: Array,
      default () {
        return []
      }
    },
    desc: {
      type: Object,
      default () {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    }
  },
  data () {
    return {
      selectType: ALL,
      onlyContent: false
    }
  },
  methods: {
    select (type) { // 点击评价筛选按钮实现筛选条件的变更
      this.selectType = type
      // 向外派发ratingTypeChange事件，将更改后的筛选条件传递给父组件
      this.$emit('ratingTypeChange', type)
    },
    toggleContent () { // 点击“只看有内容的评价”按钮实现内容展示的切换
      this.onlyContent = !this.onlyContent
      // 向外派发contentToggle事件，将更改后的筛选条件传递给父组件
      this.$emit('contentToggle', this.onlyContent)
    }
  },
  computed: {
    positives () { // 通过匹配评论状态为满意，将筛选出的数组作为计算属性的值，用于动态计算评论为满意状态的条目的个数
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITIVE
      })
    },
    negatives () { // 通过匹配评论状态为不满意，将筛选出的数组作为计算属性的值，用于动态计算评论为不满意状态的条目的个数
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../common/less/mixin.less';

.ratingselect {
  .rating-type {
    padding: 18px 0;
    margin: 0 18px;
    .border-1px(rgba(7,17,27,0.1));
    font-size: 0;
    .block {
      display: inline-block;
      padding: 8px 12px;
      margin-right: 8px;
      line-height: 16px;
      border-radius: 1px;
      font-size: 12px;
      color: rgb(77,85,93);
      &.active {
        color: #fff;
      }
      .count {
        font-size: 8px;
        margin-left: 2px;
      }
      &.positive {
        background-color: rgba(0,160,220,0.2);
        &.active {
          background-color: rgb(0,160,220);
        }
      }
      &.negative {
        background-color: rgba(77,85,93,0.2);
        &.active {
          background-color: rgb(77,85,93);
        }
      }
    }
  }
  .switch {
    padding: 12px 18px;
    line-height: 24px;
    border-bottom: 1px solid rgba(7,17,27,0.1);
    color: rgb(147,153,159);
    font-size: 0;
    &.on {
      .icon-check_circle {
        color: rgb(0,160,220);
      }
    }
    .icon-check_circle {
      display: inline-block;
      margin-right: 4px;
      vertical-align: top;
      font-size: 24px;
    }
    .text {
      display: inline-block;
      font-size: 12px;
    }
  }
}
</style>
