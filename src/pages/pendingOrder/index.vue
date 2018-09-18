<template>
  <div class="pendingOrder">
    <div class="find-box">
      <div class="tit">找药中……</div>
      <div class="spanName">
        <i class="iconfont">&#xe611;</i>
        已通知所有药仓,请等候......
      </div>
      <div class="spanName">
        <i class="iconfont">&#xe603;</i>
        收货点:{{address}}
      </div>
    </div>
    <div class="find-title">找药清单</div>
    <div class="medicine-box">
      <div class="medicine" v-for='(item, index) in list' :key='index'>
        <img :src="item.photos"  class='img'>
        <span class="medicine-info">
          <span class='name' v-if='item.drugId === 0'>{{item.remark}}</span>
          <span class='name' v-if='item.drugId !== 0'>{{item.manufacturer}} </span>
          <span class="name" v-if='item.drugId !== 0'>{{item.drugName}} {{item.specifications}} {{item.quantity}}盒</span>
        </span>
      </div>
    </div>
    <div class="more-money">
      <span class="tir" @click='toShare'>赏金更多，找药更快</span>
      <picker placeholder="请输入赏金" class='inputs' :value='moreMoney' :range="MoneyRange" @change='getMoreMoney'>
        当前赏金:{{moreMoney}}
      </picker>  
      <span class="btn" @click='giveMoreMoney'>重金悬赏</span>
    </div>
    <button class="share-box" open-type="share">
      <div class="fast">找药令牌</div>
      <div>转发5人</div>
      <div>找药快5倍</div>
      <div class="line-box">
        <div class="line-left"></div>
        <div class="circle">令</div>
        <div class="line-right"></div>
      </div>
      <div class="help">转发越多，赏金越多</div>
      <div class="help">找药快快快</div>
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      MoneyRange: [0, 5, 10, 20, 50, 100],
      moreMoney: 0,
      number: 10,
      address: '',
      list: [],
      orderId: ''
    }
  },
  onShareAppMessage: function (res) {
    let orderId = this.orderId
    return {
      title: '快帮我打听一下这个药！',
      path: `/pages/helpShare/main?orderId=${orderId}`
    }
  },
  mounted () {
    this.list = []
    this.orderId = ''
    this.address = ''
    this.moreMoney = 0
    this.getDetail(this.$mp.query.orderId)
  },
  methods: {
    toShare () {
      const url = `../helpShare/main?orderId=${this.orderId}`
      wx.reLaunch({ url })
    },
    getMoreMoney (e) {
      console.log(e)
      this.moreMoney = this.MoneyRange[e.mp.detail.value]
    },
    getDetail (id) {
      var that = this
      that.$wx(
        '/user/order/detail',
        'GET',
        {
          orderId: id
        },
        (res) => {
          if (res.data.code === 0) {
            console.log(res)
            res.data.data.drugs.forEach(e => {
              if (e.photos === '' || e.photos === null || e.photos === undefined) {
                e.photos = 'https://p2.maiyaole.com/img/item/1535016117014139.jpg'
              }
            })
            that.orderId = res.data.data.id
            that.list = res.data.data.drugs
            that.address = res.data.data.collectionStore
          }
        }
      )
    },
    giveMoreMoney () {
      var that = this
      wx.showModal({
        title: '请确认？',
        content: '确定要悬赏吗',
        success: function (res) {
          if (res.confirm) {
            that.$wx(
              '/user/order/reward',
              'POST',
              {
                orderId: that.orderId,
                amount: that.moreMoney
              },
              (res) => {
                if (res.data.code === 0) {
                  that.$toast('悬赏成功')
                  that.moreMoney = 0
                }
              }
            )
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.pendingOrder {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pendingOrder .find-box {
  width: 100%;
  box-sizing: border-box;
  height: 91px;
  border-radius: 9px;
  border:1px solid #ccc;
  padding:5px 0 8px 15px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color:#101010;
}
.pendingOrder .find-box .tit {
  line-height: 20px;
  font-weight: bold;
}
.pendingOrder .find-box .spanName {
  color: #ccc;
  display: flex;
  align-items: center;
  margin-top: 7px;
}
.pendingOrder .find-box .spanName .iconfont {
  font-size: 19px;
  margin-right: 10px;
}
.pendingOrder .find-title {
  color:#101010;
  font-size: 16px;
  font-weight: bold;
  width: 100%;
  padding-left: 15px;
  box-sizing: border-box;
  line-height: 24px;
  margin-top: 7px;
}
.pendingOrder .medicine-box {
  margin-top: 7px;
  margin-bottom: 7px;
  width: 100%;
  padding:0 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.pendingOrder .medicine-box .medicine {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  width: 100%;
}
.pendingOrder .medicine-box .medicine .img {
  width: 46px;
  height: 46px;
  margin-right: 5px;
}
.pendingOrder .medicine-box .medicine .medicine-info {
  width: calc(100% - 50px);
  display: flex;
  flex-direction: column;
}
.pendingOrder .medicine-box .medicine .name {
  color:#101010;
  font-size: 14px;
  line-height: 20px;
}
.pendingOrder .more-money {
  width: 100%;
  height: 41px;
  display: flex;
  align-items: center;
  background: #D5D2D2;
  padding: 0 13px;
  box-sizing: border-box;
}
.pendingOrder .more-money .tir {
  font-size: 14px;
  color:#101010;
}
.pendingOrder .more-money .inputs {
  margin-left: 10px;
  border:1px solid #ccc;
  width: 100px;
  background: #fff;
  margin-right: 15px;
  border-radius: 4px;
  padding: 0 8px;
  font-size: 14px;
}
.pendingOrder .more-money .btn {
  height: 25px;
  font-size: 14px;
  text-align: center;
  line-height: 25px;
  border-radius: 4px;
  background: #268be5;
  color:#fff;
  padding: 0 8px;
}
.pendingOrder .share-box {
  margin-top: 27px;
  width: 283px;
  height: 223px;
  background: #268be5;
  border-radius: 4px;
  color:#fff;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 23px;
  padding: 0;
}
.pendingOrder .share-box .fast {
  font-size: 16px;
}
.pendingOrder .share-box .line-box {
  width: 100%;
  height: 73px;
  position: relative;
}
.pendingOrder .share-box .line-box .circle {
  background: #fff;
  border-radius: 50%;
  height: 71px;
  width: 71px;
  color:#101010;
  font-size: 36px;
  text-align: center;
  line-height: 71px;
  position: absolute;
  top:0;
  left: 50%;
  margin-left: -36px;
}
.pendingOrder .share-box .line-box .line-left {
  height: 10px;
  width: 121px;
  transform:rotate(19deg);
  background: #fff;
  position: absolute;
  left: -6px;
  top:0;
}
.pendingOrder .share-box .line-box .line-right {
  height: 10px;
  width: 121px;
  transform:rotate(338deg);
  background: #fff;
  position: absolute;
  right: -6px;
  top:0;
}
.pendingOrder .share-box .help {
  line-height: 20px;
  font-size: 14px;
  color:#101010;
  margin-top: 5px;
}
</style>
