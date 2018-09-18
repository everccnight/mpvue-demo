<template>
  <div class="takePhoto">
    <div class="medicine-box">
      <div class="medicine" v-for='(item, index) in drugs' :key='index'>
        <img :src="item.img" class='img' v-if="item.photos !== ''">
        <i class="iconfont imgIconfot" v-if="item.photos === ''" @click='chooseImg(item)'>&#xe6a4;</i>
        <div class="info-box">
          <input type="text" v-model="item.remark" placeholder=" 详细描述：药品名称/规格/单位" class="name">
          <span class="change-box">
            <!-- <input type="text" v-model="item.group" placeholder=" 生产企业名称" class="group"> -->
            <span class='number-box'>
              数量:
              <i class="iconfont" @click='minus(item)'>&#xe6c0;</i>
              <input type="number" class='number' v-model='item.quantity'>
              <i class="iconfont" @click='add(item)'>&#xe618;</i>
            </span>
          </span>
        </div>
        <i class="remove iconfont" @click='removeIt(index)'>&#xe600;</i>
      </div>
    </div>
    <div class="add-more">
      <div class="btn" @click='addMedicine'>继续添加</div>
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
      <input type="number" placeholder="心理价格，仅供卖家参考" v-model="expectedAmount" class='inputs'>
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
  </div>
</template>
<script>
export default {
  data () {
    return {
      agree: true,
      drugs: [
        {
          photos: '',
          remark: '',
          quantity: 1
        }
      ],
      address: {
        thoose: '',
        address: '',
        name: '',
        phone: ''
      },
      expectedAmount: '', // 预估价格
      freight: 15, // 运费
      serviceCharge: 10, // 服务费
      storeId: '',
      token: ''
    }
  },
  mounted () {
    var that = this
    wx.setStorage({
      key: 'backPath',
      data: 'photo'
    })
    wx.getStorage({
      key: 'token',
      success: (res) => {
        that.token = res.data
      }
    })
    if (this.$mp.query.name === undefined) {
      this.getStores()
    } else {
      this.address.thoose = this.$mp.query.name
      this.address.storeId = this.$mp.query.id
      this.storeId = this.$mp.query.id
    }
    this.getAddress()
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
    getStores () { // 获取用户商店
      var that = this
      that.$wx(
        '/user/my/stores',
        'GET',
        {},
        (res) => {
          if (res.data.code === 0) {
            that.address.thoose = res.data.data[res.data.data.length - 1].name
            that.address.storeId = res.data.data[res.data.data.length - 1].id
            that.storeId = res.data.data[res.data.data.length - 1].id
          }
        }
      )
    },
    addMedicine () { // 添加拍照药品
      var flag = false
      this.drugs.forEach(e => {
        if (e.photos === '' || e.remark === '') {
          flag = true
        }
      })
      if (!flag) {
        const obj = {
          photos: '',
          remark: '',
          quantity: 1
        }
        this.list.push(obj)
      } else {
        wx.showToast({
          title: '请先完善药品信息',
          icon: 'none',
          duration: 2000
        })
      }
    },
    chooseAddress () { // 选择地址
      const url = '../chooseAddress/main'
      wx.navigateTo({ url })
    },
    chooseImg (item) { // 拍照下单
      var that = this
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          // item.photos = res.tempFilePaths
          // item.img = res.tempFilePaths[0]
          wx.uploadFile({
            url: that.$http + '/file/upload', // 仅为示例，非真实的接口地址
            filePath: res.tempFilePaths[0],
            name: 'file',
            header: {
              access_token: that.token
            },
            success: function (res) {
              console.log(res)
              let resQ = JSON.parse(res.data)
              console.log(resQ)
              if (resQ.code === 0) {
                item.img = resQ.data.file
                item.photos = [resQ.data.file]
              }
            }
          })
        }
      })
    },
    toOrder () { // 开始找药
      var that = this
      for (var i in that.drugs) {
        if (that.drugs[i].photos === '' || that.drugs[i].remark === '') {
          that.$toast('请完善药品信息')
          return false
        }
      }
      if (this.expectedAmount === '') {
        that.$toast('请完善预估价格')
        return false
      }
      if (this.storeId === '') {
        that.$toast('请选择收货地址')
        return false
      }
      that.$wx(
        '/user/photo/order',
        'POST',
        {
          expectedAmount: that.expectedAmount,
          storeId: that.storeId,
          freight: that.freight,
          serviceCharge: that.serviceCharge,
          drugs: that.drugs
        },
        (res) => {
          console.log(res)
          if (res.data.code === 0) {
            that.$toast('下单成功')
            setTimeout(() => {
              that.drugs = [
                {
                  photos: '',
                  remark: '',
                  quantity: 1
                }
              ]
              that.address = {
                thoose: '',
                address: '',
                name: '',
                phone: ''
              }
              that.expectedAmount = ''
              const url = '../order/main'
              wx.switchTab({ url })
            }, 2000)
          }
        }
      )
    },
    minus (item) {
      if (item.quantity > 1) {
        item.quantity--
      }
    },
    add (item) {
      item.quantity++
    },
    removeIt (index) {
      var that = this
      wx.showModal({
        title: '请确认',
        content: '确定要删除该药品吗',
        success: function (res) {
          if (res.confirm) {
            that.drugs.splice(index, 1)
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
.takePhoto {
  width:100%;
  height: calc(100% - 46px);
  overflow-x: hidden;
  overflow-y: auto; 
  padding-bottom: 46px;
  position: relative;
}
.takePhoto .medicine-box {
  width: 100%;
}
.takePhoto .medicine {
  height: 80px;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0px 17px 9px 22px;
  box-sizing: border-box;
  font-size: 14px;
  color:#101010;
  line-height: 23px;
}
.takePhoto .medicine .img {
  width: 73px;
  height: 58px;
  margin-right: 17px;
}
.takePhoto .medicine .imgIconfot {
  width: 73px;
  height: 58px;
  font-size: 25px;
  text-align: center;
  line-height: 58px;
  border:1px solid #ccc;
  margin-right: 17px;
}
.takePhoto .medicine .info-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 285px;
}
.takePhoto .medicine .info-box .name {
  width: 221px;
  height: 22px;
  border:1px solid #ccc;
  line-height: 22px;
  margin-bottom: 10px;
}
.takePhoto .medicine .info-box  .group {
  width: 97px;
  height: 22px;
  border:1px solid #ccc;
  line-height: 22px
}
.takePhoto .medicine .info-box .change-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.takePhoto .medicine .info-box .number-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.takePhoto .medicine .info-box .number-box .iconfont {
  font-size: 17px;
  margin: 0 6px;
}
.takePhoto .medicine .info-box .number-box .number {
  width: 26px;
  height: 23px;
  border:1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}
.takePhoto .medicine .remove {
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
.takePhoto .add-more {
  width: 100%;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  padding-right: 9px;
  margin: 10px 0;
}
.takePhoto .add-more .btn {
  width: 80px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background: #268be5;
  border-radius: 4px;
}
.takePhoto .address-box {
  width: 100%;
  height: 80px;
  padding:  0 10px;
  box-sizing: border-box;
}
.takePhoto .address-box .get {
  height: 40px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 23px;
  color: #101010;
}
.takePhoto .address-box .iconfont {
  margin-right: 10px;
  font-size: 14px;
}
.takePhoto .address-box .bigfont {
  font-size:20px;
}
.takePhoto .address-box .name {
  min-width:225px;
}
.takePhoto .address-box .placeHolder{
  color:#bbb;
}
.takePhoto .address-box .next {
  color:#bbb;
  font-size: 10px;
  margin-left: 5px;
}
.takePhoto .address-box .address {
  height: 40px;
  display: flex;
  align-items: center;
}
.takePhoto .address-box .address .iconfont {
  font-size: 20px;
}
.takePhoto .address-box .address .name-info {
  display: flex;
  flex-direction: column;
  text-decoration: underline;
  color: #847C7C;
  font-size: 14px;
  line-height: 20px;
}
.takePhoto .under-line {
  width: 100%;
  height: 11px;
  background: #268be5;
}
.takePhoto .all-price {
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
.takePhoto .all-price .inputs {
  margin-left: 5px;
}
.takePhoto .price-box {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  height: 81px;
  font-size: 14px;
  color:#101010;
  border-bottom:1px solid #ccc;
}
.takePhoto .price-box .server-price, 
.takePhoto .price-box .leave-price{
  height: 40px;
  display: flex;
  border-bottom:1px solid #ccc;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}
.takePhoto .price-box .server-price {
  border-bottom: none;
}
.takePhoto .price-box .server-price .del {
  margin-right: 5px;
  position: relative;
  text-decoration: line-through;
  text-decoration-color: red;
}
.takePhoto .price-box .info {
  font-size: 12px;
  color:#A8A5A5;
  margin-right: 8px;
}
.takePhoto .agree {
  display: flex;
  width: 100%;
  margin-left: 8px;
  font-size: 14px;
  height: 26px;
  align-items: center;
}
.takePhoto .agree .iconfont {
  margin-right: 6px;
  font-size: 17px;
  width: 17px;
  height: 17px;
}
.takePhoto .agree .circle {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  border:1px solid #ccc;
  box-sizing: border-box;
  margin-right: 6px;
}
.takePhoto .agree .text {
  color:#268be5;
}
.takePhoto .give-it {
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
.takePhoto .give-it .btn {
  width: 74px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  color:#fff;
  background:#268be5;
  border-radius: 4px;
}
</style>
