<template>
  <scroll-view class="findDetail">
    <div class="search-box" @click='toSearch'>
      <i class="iconfont">&#xe787;</i>
      <span>输入药品名称或症状</span>
    </div>
    <div class="medicine-box">
      <div class="medicine" v-for='(item, index) in list' :key='index'>
        <img :src="item.img" class='img'>
        <div class="info-box">
          <span class="name">{{item.drugName}} {{item.specifications}}</span>
          <span class="change-box">
            <span class="group">{{item.manufacturer}}</span>
            <span class='number-box'>
              数量:
              <i class="iconfont" @click='minus(item)'>&#xe6c0;</i>
              <input type="number" class='number' v-model='item.quantity'>
              <i class="iconfont" @click='add(item)'>&#xe618;</i>
            </span>
          </span>
        </div>
        <i class="remove iconfont" @click='removeIt(item.drugId)'>&#xe600;</i>
      </div>
    </div>
    <div class="add-more">
      <div class="btn" @click='toSearch'>继续添加</div>
    </div>
    <div class="under-line"></div>
    <div class="address-box">
      <div class="get">
        <i class="iconfont bigfont">&#xe603;</i>
        <span class="name">{{address.thoose}}</span>
        <span class="placeHolder" @click='chooseAddress'>选择代收点</span>
        <i class="iconfont next" @click='chooseAddress'>&#xe634;</i>
      </div>
      <div class="address">
        <i class="iconfont">&#xe630;</i>
        <span class="name-info">
          <span>{{address.address}}</span>
          <span>{{address.name}} {{address.phone}}</span>
        </span>
      </div>
    </div>
    <div class="under-line"></div>
    <div class="all-price">
      <span class="info">商品预估价格：</span>
      <input type="number" placeholder="心理价格，仅供卖家参考" class='inputs' v-model="expectedAmount">
      <span>元</span>
    </div>
    <div class="under-line"></div>
    <div class="price-box">
      <div class="leave-price">
        <span>运费：</span>
        <span>
          <span class="info">基础运费15元，根据重量以发货为准</span>
          <span class="leave-price-detail">{{freight}}元</span>
        </span>
      </div>
      <div class="server-price">
        <span>服务费：</span>
        <span>
          <span class="info">基础服务费10元，下单后可自行增加</span>
          <span>{{serviceCharge}}元</span>
        </span>
      </div>
    </div>
    <div class="agree">
      <i class="iconfont" v-if='agree' @click='agree = false'>&#xe627;</i>
      <span class="circle" v-if='!agree' @click='agree = true'></span>
      <span>已阅读并同意
        <span class="text">《代订药品服务协议》</span>
      </span>
    </div>
    <div class="give-it">
      <span class="info">温馨提示：有人接单后，需要客官确认及付款</span>
      <span class="btn" @click='toOrder()'>开始找药</span>
    </div>
  </scroll-view>
</template>
<script>
export default {
  data () {
    return {
      agree: true,
      list: [],
      address: {
        thoose: '',
        address: '',
        name: '',
        phone: ''
      },
      storeId: '',
      expectedAmount: '', // 预估价格
      freight: 15, // 运费
      serviceCharge: 10 // 服务费
    }
  },
  mounted () {
    this.list = []
    this.expectedAmount = ''
    wx.setStorage({
      key: 'backPath',
      data: 'medicine'
    })
    this.getCharts()
    this.getAddress()
    if (this.$mp.query.name === undefined) {
      this.getStores()
    } else {
      this.address.thoose = this.$mp.query.name
      this.storeId = this.$mp.query.id
    }
  },
  methods: {
    getAddress () { // 获取用户地址
      var that = this
      this.$wx(
        '/user/my/address',
        'GET',
        {},
        (res) => {
          if (res.data.code === 0) {
            res.data.data.forEach(e => {
              if (e.status === 1) {
                that.address.name = e.name
                that.address.address = `${e.cityName} ${e.address}`
                that.address.phone = e.mobile
              }
            })
          }
        }
      )
    },
    getStores () {
      var that = this
      that.$wx(
        '/user/my/stores',
        'GET',
        {},
        (res) => {
          if (res.data.code === 0) {
            that.address.thoose = res.data.data[res.data.data.length - 1].name
            that.storeId = res.data.data[res.data.data.length - 1].id
          }
        }
      )
    },
    getCharts () {
      var that = this
      that.$wx(
        '/user/my/carts',
        'GET',
        {},
        (res) => {
          if (res.data.code === 0) {
            res.data.data.forEach(e => {
              e.img = 'https://p2.maiyaole.com/img/item/1535016117014139.jpg'
              e.quantity = 1
              e.id = e.drugId
            })
            this.list = res.data.data
          }
        }
      )
    },
    toSearch () {
      const url = '../search/main'
      wx.navigateTo({ url })
    },
    chooseAddress () {
      const url = '../chooseAddress/main'
      wx.navigateTo({ url })
    },
    toOrder () {
      if (this.expectedAmount === '') {
        this.$toast('请输入预估价格')
      } else if (this.list.length === 0) {
        this.$toast('暂无可用药品')
      } else if (this.storeId === '') {
        this.$toast('请选择收货地址')
      } else {
        var that = this
        that.$wx(
          '/user/order',
          'POST',
          {
            expectedAmount: that.expectedAmount,
            serviceCharge: that.serviceCharge,
            freight: that.freight,
            storeId: that.storeId,
            drugs: that.list
          },
          (res) => {
            if (res.data.code === 0) {
              that.$toast('下单成功')
              setTimeout(() => {
                const url = '../order/main'
                wx.switchTab({ url })
              }, 2000)
            }
          }
        )
      }
    },
    minus (item) {
      if (item.quantity > 1) {
        item.quantity--
      }
    },
    add (item) {
      item.quantity++
    },
    removeIt (id) {
      var that = this
      wx.showModal({
        title: '请确认',
        content: '确定要删除该药品吗',
        success: function (res) {
          if (res.confirm) {
            that.$wx(
              '/user/delete/cart',
              'POST',
              {
                ids: [id]
              },
              (res) => {
                if (res.data.code === 0) {
                  that.list = []
                  that.getCharts()
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
.findDetail {
  width:100%;
  height: calc(100% - 46px);
  overflow-x: hidden;
  overflow-y: auto; 
  padding-bottom: 46px;
  position: relative;
}
.findDetail .search-box {
  margin: 5px 0 0 8px;
  width: calc(100% - 16px);
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A6A3A3;
  border:1px solid #ccc;
  border-radius:  9px;
  font-size: 14px;
  margin-bottom: 5px;
}
.findDetail .search-box .iconfont {
  margin-right: 5px;
  font-size: 19px;
}
.findDetail .medicine-box {
  width: 100%;
}
.findDetail .medicine {
  height: 75px;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 6px 17px 9px 22px;
  box-sizing: border-box;
  font-size: 14px;
  color:#101010;
  line-height: 23px;
}
.findDetail .medicine .img {
  width: 42px;
  height: 42px;
  margin-right: 25px;
}
.findDetail .medicine .info-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 285px;
}
.findDetail .medicine .info-box .change-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.findDetail .medicine .info-box .group {
  width: 50%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
}
.findDetail .medicine .info-box .number-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.findDetail .medicine .info-box .number-box .iconfont {
  font-size: 17px;
  margin: 0 6px;
}
.findDetail .medicine .info-box .number-box .number {
  width: 26px;
  height: 23px;
  border:1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}
.findDetail .medicine .remove {
  align-self: flex-start;
  background: red;
  border-radius: 50%;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  width: 17px;
  height: 17px;
  color:#fff;
}
.findDetail .add-more {
  width: 100%;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  padding-right: 9px;
  margin: 10px 0;
}
.findDetail .add-more .btn {
  width: 80px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background: #268be5;
  border-radius: 4px;
}
.findDetail .address-box {
  width: 100%;
  height: 80px;
  padding:  0 10px;
  box-sizing: border-box;
}
.findDetail .address-box .get {
  height: 40px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 23px;
  color: #101010;
}
.findDetail .address-box .iconfont {
  margin-right: 10px;
  font-size: 14px;
}
.findDetail .address-box .bigfont {
  font-size:20px;
}
.findDetail .address-box .name {
  min-width:225px;
}
.findDetail .address-box .placeHolder{
  color:#bbb;
}
.findDetail .address-box .next {
  color:#bbb;
  font-size: 10px;
  margin-left: 5px;
}
.findDetail .address-box .address {
  height: 40px;
  display: flex;
  align-items: center;
}
.findDetail .address-box .address .iconfont {
  font-size: 20px;
}
.findDetail .address-box .address .name-info {
  display: flex;
  flex-direction: column;
  text-decoration: underline;
  color: #847C7C;
  font-size: 14px;
  line-height: 20px;
}
.findDetail .under-line {
  width: 100%;
  height: 11px;
  background: #ccc;
}
.findDetail .all-price {
  background: #fff;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  color:#101010;
  padding: 0 10px;
  box-sizing: border-box;
}
.findDetail .all-price .inputs {
  margin-left: 5px;
}
.findDetail .price-box {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  height: 81px;
  font-size: 14px;
  color:#101010;
  border-bottom:1px solid #ccc;
}
.findDetail .price-box .server-price, 
.findDetail .price-box .leave-price{
  height: 40px;
  display: flex;
  border-bottom:1px solid #ccc;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}
.findDetail .price-box .server-price {
  border-bottom: none;
}
.findDetail .price-box .server-price .del {
  margin-right: 5px;
  position: relative;
  text-decoration: line-through;
  text-decoration-color: red;
}
.findDetail .price-box .info {
  font-size: 12px;
  color:#A8A5A5;
  margin-right: 8px;
}
.findDetail .agree {
  display: flex;
  width: 100%;
  margin-left: 8px;
  font-size: 14px;
  height: 26px;
  align-items: center;
}
.findDetail .agree .iconfont {
  margin-right: 6px;
  font-size: 17px;
  width: 17px;
  height: 17px;
}
.findDetail .agree .circle {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  border:1px solid #ccc;
  box-sizing: border-box;
  margin-right: 6px;
}
.findDetail .agree .text {
  color:#268be5;
}
.findDetail .give-it {
  width: 100%;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 11px;
  box-sizing: border-box;
  font-size: 14px;
  color:#101010;
  border-top:1px solid #ccc;
  position: fixed;
  bottom:0;
  background: #fff;
}
.findDetail .give-it .btn {
  width: 74px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  color:#fff;
  background:#268be5;
  border-radius: 4px;
}
</style>
