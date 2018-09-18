<template>
  <div class="waitOrder">
    <div class="find-box">
      <div class="tit">找药中……</div>
      <div class="spanName">
        <i class="iconfont">&#xe611;</i>
        已通知所有药仓，{{sellerNum}}个有响应，请尽快确认
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
      <span class="tir">赏金更多，找药更快</span>
      <picker placeholder="请输入赏金" class='inputs' :value='moreMoney' :range="MoneyRange" @change='getMoreMoney'>
        当前赏金:{{moreMoney}}
      </picker>
      <span class="btn" @click='giveMoreMoney'>重金悬赏</span>
    </div>
    <div class="title">{{sellerNum}}个商家已响应您的订单，请选择：</div>
    <scroll-view class="shop-list" scroll-y @scrolltolower='loadmoreList()'>
        <div class="shop" v-for='(item, index) in shopList' :key='index'>
            <i class="iconfont">&#xe77f;</i>
            <div class="info">
                <span>
                    <span class="name">{{item.drugStore}}</span>
                    <span class="way" style='visibility: hidden;'>({{item.way}}km)</span>
                </span>
                <span>
                    <span class="price">药费{{item.amount}}元</span>
                    <span class="price">服务费{{item.server}}元</span>
                </span>
            </div>
            <div class="confirm-btn" @click='conOrder(item.sellerId)'>确认</div>
        </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      MoneyRange: [0, 5, 10, 20, 50, 100],
      moreMoney: 0,
      sellerNum: '',
      number: 100,
      address: '',
      list: [],
      shopList: [],
      page: 1,
      moreflag: true
    }
  },
  mounted () {
    this.list = []
    this.shopList = []
    this.address = ''
    this.page = 1
    this.moreMoney = 0
    this.moreflag = true
    this.sellerNum = ''
    this.getDetail(this.$mp.query.orderId)
    this.getShop(this.$mp.query.orderId)
  },
  methods: {
    getMoreMoney (e) {
      console.log(e)
      this.moreMoney = this.MoneyRange[e.mp.detail.value]
    },
    loadmoreList () {
      if (this.moreflag) {
        this.page = this.page + 1
        this.getShop(this.$mp.query.orderId)
      }
    },
    getShop (id) {
      var that = this
      that.$wx(
        '/user/seller/orders',
        'GET',
        {
          orderId: id,
          page: that.page
        },
        (res) => {
          if (res.data.code === 0) {
            if (res.data.data.length < 10) {
              that.moreflag = false
            }
            that.shopList = [...that.shopList, ...res.data.data]
          }
        }
      )
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
            that.sellerNum = res.data.data.sellerNum
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
    },
    conOrder (id) {
      var that = this
      wx.showModal({
        title: '请确认？',
        content: '确定要选择此商家吗？',
        success: function (res) {
          if (res.confirm) {
            that.$wx(
              '/user/confirm-order?orderId=' + that.orderId + '&sellerId=' + id,
              'POST',
              {},
              (res) => {
                if (res.data.code === 0) {
                  const url = '../conOrder/main?orderId=' + that.orderId
                  wx.reLaunch({ url })
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
.waitOrder {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.waitOrder .find-box {
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
.waitOrder .find-box .tit {
  line-height: 20px;
  font-weight: bold;
}
.waitOrder .find-box .spanName {
  color: #ccc;
  display: flex;
  align-items: center;
  margin-top: 7px;
}
.waitOrder .find-box .spanName .iconfont {
  font-size: 19px;
  margin-right: 10px;
}
.waitOrder .find-title {
  color:#101010;
  font-size: 16px;
  font-weight: bold;
  width: 100%;
  padding-left: 15px;
  box-sizing: border-box;
  line-height: 24px;
  margin-top: 7px;
}
.waitOrder .medicine-box {
  margin-top: 7px;
  margin-bottom: 7px;
  width: 100%;
  padding:0 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.waitOrder .medicine-box .medicine {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.waitOrder .medicine-box .medicine .img {
  width: 46px;
  height: 46px;
  margin-right: 5px;
}
.waitOrder .medicine-box .medicine .medicine-info {
  width: calc(100% - 50px);
  display: flex;
  flex-direction: column;
}
.waitOrder .medicine-box .medicine .name {
  color:#101010;
  font-size: 14px;
  line-height: 20px;
}
.waitOrder .more-money {
  width: 100%;
  height: 41px;
  display: flex;
  align-items: center;
  background: #D5D2D2;
  padding: 0 13px;
  box-sizing: border-box;
}
.waitOrder .more-money .tir {
  font-size: 14px;
  color:#101010;
}
.waitOrder .more-money .inputs {
  margin-left: 10px;
  border:1px solid #ccc;
  width: 100px;
  background: #fff;
  margin-right: 15px;
  border-radius: 4px;
  padding: 0 8px;
  font-size: 14px;
}
.waitOrder .more-money .btn {
  height: 25px;
  font-size: 14px;
  text-align: center;
  line-height: 25px;
  border-radius: 4px;
  background: #268be5;
  color:#fff;
  padding: 0 8px;
}
.waitOrder .title {
    line-height: 23px;
    color:#101010;
    font-size: 14px;
    margin: 5px 0;
}
.waitOrder .shop-list {
    width: 100%;
    display: flex;
    flex-direction: column;
}
.waitOrder .shop-list .shop{
    width: 100%;
    height: 52px;
    border-bottom: 1px solid #ccc;
    padding:  0 9px 0 17px;
    display: flex;
}
.waitOrder .shop-list .shop .iconfont {
    font-size: 24px;
    color:#268be5;
    margin-right: 14px;
}
.waitOrder .shop-list .shop .info {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    font-size: #847C7C;
    line-height: 23px;
    width: 250px;
}
.waitOrder .shop-list .shop .info .name {
    text-decoration: underline;
}
.waitOrder .shop-list .shop .info .way {
    color:#C8C5C5;
    font-size: 12px;
    margin-left: 10px;
}
.waitOrder .shop-list .shop .info .price {
    margin-right: 10px;
}
.waitOrder .shop-list .shop .confirm-btn {
    font-size: 14px;
    border-radius: 5px;
    width: 61px;
    line-height: 23px;
    height: 23px;
    text-align: center;
    background: #268be5;
    color:#fff;
    align-self: center;
}
</style>
