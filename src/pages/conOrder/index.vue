<template>
  <div class="conOrder">
    <div class="find-box">
      <div class="tit">请尽快支付……</div>
      <div class="spanName">
        <i class="iconfont">&#xe611;</i>
        <span class='name'>{{shop}}
          <!-- <span class='way'>({{way}}Km)</span> -->
        </span>
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
    <div class="price-box">
        <span class='flex-price'>
            <span class="title">药品费:</span>
            <span class="price">{{price.medicine}}元</span>
        </span>
        <span class='flex-price'>
            <span class="title">运费:</span>
            <span class="price">{{price.go}}元</span>
        </span>
        <span class='flex-price'>
            <span class="title">服务费:</span>
            <span class="price">{{price.server}}元</span>
        </span>
        <span class='flex-price'>
            <span class="title">赏金:</span>
            <span class="price">{{price.reward}}元</span>
        </span>
        <span class='flex-price'>
            <span class="title total">总费用:</span>
            <span class="price total">{{price.total}}元</span>
        </span>
    </div>
    <div class="more-money">
      <span class="tir">该价格24小时内有效，请尽快支付</span>
      <span class="btn" @click='toPay'>支付</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      price: {
        total: 135,
        server: 15,
        go: 20,
        medicine: 100
      },
      shop: '',
      way: '',
      address: '',
      list: []
    }
  },
  mounted () {
    this.getDetail(this.$mp.query.orderId)
  },
  methods: {
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
            that.shop = res.data.data.collectionStore
            that.orderId = res.data.data.id
            that.sellerNum = res.data.data.sellerNum
            that.list = res.data.data.drugs
            that.address = res.data.data.collectionStore
          }
        }
      )
    },
    toPay () {
      const url = '../paySuccess/main'
      wx.navigateTo({ url })
    }
  }
}
</script>

<style scoped>
.conOrder {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.conOrder .find-box {
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
.conOrder .find-box .tit {
  line-height: 20px;
  font-weight: bold;
}
.conOrder .find-box .spanName {
  color: #ccc;
  display: flex;
  align-items: center;
  margin-top: 7px;
}
.conOrder .find-box .spanName .name {
    color: #847C7C;
}
.conOrder .find-box .spanName .way {
    color: #C8C5C5;
    font-size: 12px;
}
.conOrder .find-box .spanName .iconfont {
  font-size: 19px;
  margin-right: 10px;
}
.conOrder .find-title {
  color:#101010;
  font-size: 16px;
  font-weight: bold;
  width: 100%;
  padding-left: 15px;
  box-sizing: border-box;
  line-height: 24px;
  margin-top: 7px;
}
.conOrder .medicine-box {
  margin-top: 7px;
  margin-bottom: 7px;
  width: 100%;
  padding:0 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #ccc;
}
.conOrder .medicine-box .medicine {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.conOrder .medicine-box .medicine .img {
  width: 46px;
  height: 46px;
  margin-right: 5px;
}
.conOrder .medicine-box .medicine .medicine-info {
  width: calc(100% - 50px);
  display: flex;
  flex-direction: column;
}
.conOrder .medicine-box .medicine .name {
  color:#101010;
  font-size: 14px;
  line-height: 20px;
}
.conOrder .price-box {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin: 5px 0;
    width: 100%;
}
.conOrder .price-box .flex-price {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color:#101010;
    font-size: 14px;
    margin-right: 20px;
    height: 23px;
}
.conOrder .price-box .flex-price .total {
    font-weight: bold;
}
.conOrder .more-money {
  width: 100%;
  height: 41px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #D5D2D2;
  padding: 0 13px;
  box-sizing: border-box;
}
.conOrder .more-money .tir {
  font-size: 14px;
  color:#101010;
}
.conOrder .more-money .btn {
  height: 25px;
  font-size: 14px;
  text-align: center;
  line-height: 25px;
  border-radius: 4px;
  background: #268be5;
  color:#fff;
  width: 80px;
}
</style>
