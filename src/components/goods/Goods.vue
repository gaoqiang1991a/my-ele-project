<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menu">
      <ul>
        <li
        v-for="(item,index) in goods"
        :key="index"
        class="menu-item"
        :class="{'current': currentIndex === index}"
        @click="selectMenu(index)">
          <span class="text border-1px">
            <span v-if="item.type > 0" class="icon" :class="classmap[item.type]"></span>
            {{ item.name }}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foods">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
          <h1 class="title">{{ item.name }}</h1>
          <ul>
            <li v-for="food in item.foods" :key="food.name" @click="selectFood(food)" class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{ food.name }}</h2>
                <p class="desc">{{ food.description }}</p>
                <div class="extra">
                  <span class="count">月售{{ food.sellCount }}份</span>
                  <span>好评率{{ food.rating }}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{ food.price }}</span><span class="old" v-if="food.oldPrice">￥{{ food.oldPrice }}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <!-- 监听Cartcontrol组件向外派发的add事件，调用onAdd方法，进而触发shopCart组件的drop方法 -->
                  <Cartcontrol :food="food" @add="onAdd"></Cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 购物车组件 -->
    <Shopcart :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectFoods="selectFoods" ref="shopCart"></Shopcart>
    <!-- 将所选中的商品对象通过food属性传递给Food商品详情页组件，监听Food组件向外派发的add事件，调用onAdd方法，进而触发shopCart组件的drop方法 -->
    <Food :food="selectedFood" ref="food" @add="onAdd"></Food>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import Shopcart from '@/components/shopcart/Shopcart'
import Cartcontrol from '@/components/cartcontrol/Cartcontrol'
import Food from '@/components/food/Food_anotherWay'

const ERR_OK = '200'
export default {
  props: ['seller'],
  data () {
    return {
      classmap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  components: {
    Shopcart,
    Cartcontrol,
    Food
  },
  computed: {
    currentIndex () { // 计算右侧food列表滚动位置对应左侧菜单栏的索引值
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods () { // 通过实时观测food.count的变化，来改变selectFoods的值，从而传递给购物车组件，实现购物车组件内数值的更新
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  created () {
    this.axios.get('/goods').then(res => {
      if (res.data.errno === ERR_OK) {
        this.goods = res.data.data.goods
        this.$nextTick(() => {
          // 注意调用两个方法的时机，mounted方法仅是对初始视图DOM的渲染挂载，是一次性的，而对于需要通过异步操作获取数据再更新视图的情况（如请求后台数据，使用v-for、v-if、v-show等进行渲染），mounted方法执行时这些DOM元素并未渲染挂载完成，需要在nextTick()方法中执行回调，来确保在数据更新完成，DOM挂在完成时，执行相应的操作。
          // $nextTick() 表示在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
          this.initScroll() // BSscroll初始化
          this.caculateHeight() // 页面DOM渲染更新完成后，计算每一分类商品区块对应的高度区间
        })
      }
    })
  },
  methods: {
    initScroll () { // BSscroll初始化方法
      this.menuScroll = new BScroll(this.$refs.menu, {
        click: true // better-scroll默认阻止了元素的touch事件，需通过该配置项设置开启
      })
      this.foodsScroll = new BScroll(this.$refs.foods, {
        click: true,
        probeType: 3 // 开启实时监听滚动的位置的状态
      })
      this.foodsScroll.on('scroll', (position) => {
        // BScroll可监听一个 scroll 事件，回调函数以“实时滚动的位置”作为参数
        this.scrollY = Math.abs(Math.round(position.y))
      })
    },
    caculateHeight () { // 计算每一分类商品区块对应的高度区间，用于实现右侧商品列表滚动时，左侧选中分类菜单的自动切换
      let foodList = this.$refs.foods.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    selectMenu (index) { // 点击左侧菜单栏，右侧商品页面自动滚动到对应的分类页位置
      let foodList = this.$refs.foods.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 300) // better-scroll提供了一个滚动到指定元素位置的API：scrollToElement(需要滚动到指定位置的元素, 滚动动画的时间毫秒)
    },
    onAdd (el) { // 监听子组件派发的add事件的处理函数，调用shopCart子组件中的drop方法，触发小球动画
      this.$refs.shopCart.drop(el)
    },
    selectFood (food) { // 点击商品条目，触发商品详情页的展示
      this.selectedFood = food
      this.$refs.food.show() // 父组件可以调用子组件中的方法
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../common/less/mixin.less";
.goods {
  display: flex;
  position: absolute;
  top: 174px;
  bottom: 46px;
  width: 100%;
  overflow: hidden;
  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background-color: #f3f5f7;
    .menu-item {
      display: table; // 方便做垂直居中
      height: 53px;
      width: 56px;
      line-height: 14px;
      padding: 0 12px;
      &.current {
        position: relative;
        z-index: 10;
        margin-top: -1px;
        background-color: #fff;
        .text {
          .border-none();
          font-weight: 700;
        }
      }
      .icon {
        display: inline-block;
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        &.decrease {
          background: url("./decrease_3@2x.png");
          background-size: 12px 12px;
          background-repeat: no-repeat;
        }
        &.discount {
          background: url("./discount_3@2x.png");
          background-size: 12px 12px;
          background-repeat: no-repeat;
        }
        &.guarantee {
          background: url("./guarantee_3@2x.png");
          background-size: 12px 12px;
          background-repeat: no-repeat;
        }
        &.invoice {
          background: url("./invoice_3@2x.png");
          background-size: 12px 12px;
          background-repeat: no-repeat;
        }
        &.special {
          background: url("./special_3@2x.png");
          background-size: 12px 12px;
          background-repeat: no-repeat;
        }
      }
      .text {
        display: table-cell; // 配合table布局实现垂直居中
        width: 56px;
        vertical-align: middle;
        .border-1px(rgba(7,17,27,0.1));
        font-size: 12px;
      }
      &:last-child > .text {
        .border-none();
      }
    }
  }
  .foods-wrapper {
    flex: 1;
    background-color: #fff;
    .title {
      padding-left: 14px;
      height: 26px;
      line-height: 26px;
      border-left: 2px solid #d9dde1;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background-color: #f3f5f7;
    }
    .food-item {
      display: flex;
      margin: 18px;
      padding-bottom: 18px;
      .border-1px(rgba(7,17,27,0.1));
      &:last-child {
        .border-none();
        margin-bottom: 0;
      }
      .icon {
        flex: 0 0 57px;
        margin-right: 10px;
      }
      .content {
        flex: 1;
        .name {
          margin: 2px 0 8px 0;
          height: 14px;
          line-height: 14px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }
        .desc, .extra {
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
        .desc {
          margin-bottom: 8px;
          line-height: 12px;
        }
        .extra {
          .count {
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
          right: 0;
          bottom: 12px;
        }
      }
    }
  }
}
</style>
