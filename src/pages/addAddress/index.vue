<template>
  <div class="add-address">
    <div class="ipt-box">
      <input type="text" placeholder="姓名" auto-focus  class='inputs' v-model='address.name'>
      <input type="number" placeholder="手机号码" class='inputs' v-model='address.mobile'>
      <picker mode="region" @change="bindRegionChange" :value="address.district" custom-item="请选择">
        <view class='inputs' v-if='address.district.length > 0'>
          {{address.cityName}}
        </view>
        <view class='inputs' v-else>
          省份-城市-区县
        </view>
      </picker>
      <input type="text" placeholder="详细地址，如街道、楼盘号等" class='inputs' v-model='address.address'>
      <label class="checkbox" @click='changeCheck'>
        <checkbox value='default' :checked="AddressDefault" color='#268be5'/>设为默认地址
      </label>
    </div>
    <div class="btn" @click='saveBtn'>
      保存
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      address: {
        name: '',
        mobile: '',
        openid: '',
        cityName: '',
        district: '',
        address: ''
      },
      AddressDefault: false,
      checkLength: 0
    }
  },
  mounted () {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.address.openid = res.data
      },
      fail: function (res) {
      }
    })
    this.address = {
      name: '',
      mobile: '',
      openid: '',
      cityName: '',
      district: '',
      address: ''
    }
    this.AddressDefault = false
    this.checkLength = 0
  },
  methods: {
    bindRegionChange: function (e) {
      this.address.cityName = e.mp.detail.value.splice(0, e.mp.detail.code.length).join('-')
      this.address.district = e.mp.detail.code[e.mp.detail.code.length - 1]
    },
    changeCheck () {
      if (this.AddressDefault) {
        this.AddressDefault = !this.AddressDefault
        this.checkLength = 0
      } else {
        this.AddressDefault = !this.AddressDefault
        this.checkLength = 1
      }
    },
    saveBtn () {
      var that = this
      if (this.address.name === '') {
        this.$toast('请填写姓名')
      } else if (this.address.mobile === '') {
        this.$toast('请填写电话')
      } else if (this.address.district === '') {
        this.$toast('请填写街区')
      } else if (this.address.address === '') {
        this.$toast('请填写详细地址')
      } else {
        that.address.default = that.checkLength
        that.$wx(
          '/user/new/address',
          'POST',
          that.address,
          (res) => {
            if (res.data.code === 0) {
              wx.navigateBack({
                delta: 1
              })
            } else {
              this.$toast('添加地址失败')
            }
          },
          (res) => {
            console.log('err', res)
          }
        )
      }
    }
  }
}
</script>

<style scoped>
.add-address {
  width:100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.add-address  .btn {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 18px);
  border-radius: 20px;
  color:#268be5;
  border: 1px solid #268be5;
  height: 40px;
  bottom:17px;
  left: 9px;
  font-size: 16px;
  background:#fff;
}
.add-address .ipt-box {
  width: 100%;
  position: relative;
}
.add-address .ipt-box .yzm-button {
  position: absolute;
  right:10px;
  height: 30px;
  top: 85px;
  width: 140px;
  line-height: 30px;
  font-size: 14px;
  text-align: center;
  z-index: 9999;
}
.add-address .ipt-box .inputs {
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  color:#847C7C;
  height: 40px;
  line-height: 40px;
  width: 100%;
  box-sizing: border-box;
  padding-left: 20px;
}
.add-address .ipt-box .checkbox {
  margin: 10px 0 0 20px;
  color:#847C7C;
  display: flex;
  align-items: center;
}
</style>
