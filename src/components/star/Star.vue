<template>
  <div class="star" :class="starType">
    <span
      v-for="(itemClass,index) in itemClasses"
      :key="index"
      :class="itemClass"
      class="star-item"
    ></span>
  </div>
</template>

<script>
// 技巧：把一些可能会变化的地方用常量表示，便于后期修改
const LENGTH = 5
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'

export default {
  props: ['size', 'score'],
  computed: {
    starType () {
      return 'star-' + this.size
    },
    itemClasses () {
      let result = []
      let score = Math.floor(this.score * 2) / 2 // 分数计算：向下取0.5的倍数
      let hasDecimal = score % 1 !== 0 // 判断是否有小数
      let integer = Math.floor(score)
      for (let i = 0; i < integer; i++) {
        result.push(CLS_ON)
      }
      if (hasDecimal) {
        result.push(CLS_HALF)
      }
      while (result.length < LENGTH) {
        result.push(CLS_OFF)
      }
      return result
    }
  }
}
</script>

<style lang="less" scoped>
.star {
  font-size: 0;
  .star-item {
    display: inline-block;
    background-repeat: no-repeat;
  }
  &.star-48 {
    .star-item {
      width: 20px;
      height: 20px;
      margin-right: 22px;
      background-size: 20px 20px;
      &:last-child {
        margin-right: 0;
      }
      &.on {
        background-image: url("./star48_on@2x.png");
      }
      &.half {
        background-image: url("./star48_half@2x.png");
      }
      &.off {
        background-image: url("./star48_off@2x.png");
      }
    }
  }
  &.star-36 {
    .star-item {
      width: 15px;
      height: 15px;
      margin-right: 8px;
      background-size: 15px 15px;
      @media only screen and (max-width: 320px) { // 兼容iphone5设置
        margin-right: 4px;
      }
      &:last-child {
        margin-right: 0;
      }
      &.on {
        background-image: url("./star36_on@2x.png");
      }
      &.half {
        background-image: url("./star36_half@2x.png");
      }
      &.off {
        background-image: url("./star36_off@2x.png");
      }
    }
  }
  &.star-24 {
    .star-item {
      width: 10px;
      height: 10px;
      margin-right: 3px;
      background-size: 10px 10px;
      &:last-child {
        margin-right: 0;
      }
      &.on {
        background-image: url("./star24_on@2x.png");
      }
      &.half {
        background-image: url("./star24_half@2x.png");
      }
      &.off {
        background-image: url("./star24_off@2x.png");
      }
    }
  }
}
</style>
