<template>
  <div class="coupon">
    <div class="banner" v-for="(item, index) in list" :key="index">
      <div class="top">
        <div class="inner">
          <div class="money">{{item.amount}}元</div>
          <div class="use">
            <div class="voucher">服务费立减券</div>
            <div class="time">{{item.times}}</div>
          </div>
        </div>
        <div class="button">立即使用</div>
      </div>
      <div class="middle-line">
        <div class="line"></div>
      </div>
      <div class="bottom">
        <p class="use-flag">限首次找药订单</p>
        <!-- <p class="use-flag">{{item.useAddress}}等城市可用</p> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      page: 1,
      MoreFlag: true
    }
  },
  mounted () {
    this.list = []
    this.page = 1
    this.MoreFlag = true
    this.getCoupon()
  },
  onReachBottom () {
    if (this.MoreFlag) {
      this.page = this.page + 1
      this.getCoupon()
    }
  },
  methods: {
    getCoupon () {
      var that = this
      this.$wx(
        '/user/my/coupons',
        'GET',
        {
          page: that.page
        },
        (res) => {
          if (res.data.code === 0) {
            if (res.data.data.length < 10) {
              that.MoreFlag = false
            }
            res.data.data.forEach(e => {
              e.times = `${e.startDate}到${e.endDate.split('-')[1]}-${e.endDate.split('-')[2]}`
            })
            that.list = [...that.list, ...res.data.data]
            console.log(res)
          }
        }
      )
    }
  }
}
</script>

<style scoped>
.coupon {
  width:100%;
  height: 100%;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
}
.coupon .banner {
  border-radius: 10px;
  text-align: center;
  border: 1px solid rgba(187, 187, 187, 1);
  margin-bottom: 13px;
}
.coupon .banner .top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.coupon .banner .top .button {
  width: 71px;
  line-height: 20px;
  border-radius: 20px;
  color: rgba(63, 81, 181, 1);
  font-size: 14px;
  margin-right: 13px;
  text-align: center;
  border: 1px solid rgba(63, 81, 181, 1);
}
.coupon .banner .top .inner {
  display: flex;
  padding: 20px 20px 4px 20px;
  box-sizing: border-box;
  /* border-bottom: 1px solid #bebebe; */
}
.coupon .banner .top .inner .money {
  font-size: 20px;
  margin-right: 10px;
  display: flex;
  align-items: center;
}
.coupon .banner .top .inner .use {
  font-size: 14px;
  text-align: left;
}
.coupon .banner .top .inner .use .voucher {
  line-height: 20px;
}
.coupon .banner .top .inner .use .time {
  color: #847C7C;
}
.coupon .banner .bottom {
  /* display: flex; */
  padding: 8px 0 10px 28px;
  text-align: left;
  font-size: 14px;
}
.coupon .banner .middle-line {
  display: flex;
  justify-content: center;
}
.coupon .banner .middle-line .line {
  height: 1px;
  background:  rgba(187, 187, 187, 1);
  width: calc(100% - 40px)
}
</style>
