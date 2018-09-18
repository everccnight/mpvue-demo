<template>
  <div class="user">
    <div class="user-info">
      <div class="avatar" v-if='loginFlag'>
        <open-data type="userAvatarUrl" class='avatardata'></open-data>
      </div> 
      <div class="user-name-box" v-if='loginFlag'>
        <open-data type="userNickName"></open-data>
        <!-- <span class='phone'>{{userInfo.phone}}</span> -->
      </div>
      <button v-if='!loginFlag' open-type="getUserInfo" class='getlogin' @click='login'>请登录</button> 
    </div>
    <div class="list" @click='toPharmacist'>
      <span class='left-list'>
        <i class="iconfont">&#xe613;</i>
        <span>我的药师</span>
      </span>
      <i class="iconfont">&#xe634;</i>
    </div>
    <div class="list" @click='toAddress'>
      <span class='left-list'>
        <i class="iconfont">&#xe603;</i>
        <span>我的地址</span>
      </span>
      <i class="iconfont">&#xe634;</i>
    </div>
    <div class="list" @click='toCoupon'>
      <span class='left-list'>
        <i class="iconfont">&#xe725;</i>
        <span>我的优惠</span>
      </span>
      <i class="iconfont">&#xe634;</i>
    </div>
    <div class="list"  @click='toTotal'>
      <span class='left-list'>
        <i class="iconfont">&#xe633;</i>
        <span>联系客服</span>
      </span>
      <i class="iconfont">&#xe634;</i>
    </div>
    <!-- <div class="list" @click='toFeedBack'>
      <span class='left-list'>
        <i class="iconfont">&#xe686;</i>
        <span>反馈建议</span>
      </span>
      <i class="iconfont">&#xe634;</i>
    </div> -->
    <div class="list" @click='toAsk'>
      <span class='left-list'>
        <i class="iconfont">&#xe69e;</i>
        <span>帮助中心</span>
      </span>
      <i class="iconfont">&#xe634;</i>
    </div>
    <div class="model-box" v-if='feedBack'>
      <div class="box">
        <i class="iconfont close" @click='feedBack=false'>&#xe612;</i>
        <span class="time">服务时间：9:00-20:00</span>
        <div class="btn-group">
          <button open-type="contact" class="btn">在线客服</button>
          <div class="btn">电话客服</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      feedBack: false,
      loginFlag: false
    }
  },
  mounted () {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.loginFlag = true
      },
      fail: function (res) {
        that.loginFlag = false
      }
    })
  },
  methods: {
    login () {
      var that = this
      wx.login({
        success: item => {
          if (item.code) {
            wx.getUserInfo({
              withCredentials: true,
              success: res => {
                that.$wx(
                  '/user/common/wechat/login',
                  'POST',
                  {
                    jscode: item.code,
                    iv: res.iv,
                    encryptedData: res.encryptedData
                  },
                  (res) => {
                    console.log(res)
                    if (res.data.code === 0) {
                      that.loginFlag = true
                      wx.setStorage({
                        key: 'openid',
                        data: res.data.data.openid
                      })
                      wx.setStorage({
                        key: 'token',
                        data: res.data.data.access_token
                      })
                    } else {
                      this.$toast('登录失败')
                    }
                  },
                  (res) => {
                    console.log('err', res)
                    that.loginFlag = false
                  }
                )
              }
            })
          } else {
            console.log('登录失败！' + item.errMsg)
          }
        }
      })
    },
    toAsk () {
      if (!this.loginFlag) {
        this.$toast('请登录')
      } else {
        const url = '../askList/main'
        wx.navigateTo({ url })
      }
    },
    toPharmacist () {
      if (!this.loginFlag) {
        this.$toast('请登录')
      } else {
        const url = '../pharmacist/main'
        wx.navigateTo({ url })
      }
    },
    toFeedBack () {
      if (!this.loginFlag) {
        this.$toast('请登录')
      } else {
        const url = '../feedback/main'
        wx.navigateTo({ url })
      }
    },
    toTotal () {
      if (!this.loginFlag) {
        this.$toast('请登录')
      } else {
        this.feedBack = true
      }
    },
    toAddress () {
      if (!this.loginFlag) {
        this.$toast('请登录')
      } else {
        const url = '../address/main'
        wx.navigateTo({ url })
      }
    },
    toCoupon () {
      if (!this.loginFlag) {
        this.$toast('请登录')
      } else {
        const url = '../coupon/main'
        wx.navigateTo({ url })
      }
    }
  }
}
</script>

<style scoped>
.user {
  width:100%;
  height: 100%;
  overflow: hidden;
}
.user .model-box {
  width:100%;
  height: 100%;
  position: fixed;
  top:0;
  left:0;
  background: rgba(0,0,0,0.6);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.user .model-box .box {
  width: 100%;
  height: 124px;
  background: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.user .model-box .box .close {
  position: absolute;
  right: 10px;
  top:10px;
  font-size: 20px;
  color:#847C7C;
}
.user .model-box .box .time {
  color: #101010;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 12px;
}
.user .model-box .box .btn-group {
  display: flex;
  justify-content: space-between;
  width: 70%;
}
.user .model-box .box .btn-group .btn {
  width: 113px;
  height: 35px;
  line-height: 35px;
  border-radius: 20px;
  border:1px solid #bbb;
  color: #101010;
  text-align: center;
  font-size: 14px;
}
.user .user-info {
  width: calc(100% - 18px);
  margin: 0 9px;
  height:98px;
  border-bottom:5px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 34px 0 18px;
  box-sizing: border-box;
}
.user .user-info .getlogin {
  border:none;
  background: transparent;
  text-decoration: underline
}
.user .user-info .avatar {
  overflow: hidden;
  border-radius: 50%;
  width: 68px;
  height: 68px;
}
.user .user-info .avatardata {
  width: 68px;
  height: 68px;
}
.user .user-info .user-name-box {
  font-size: 20px;
  color:#101010;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.user .user-info .user-name-box .phone {
  color:#847C7C;
  font-size: 12px;
  margin-top: 5px;
}
.user .list {
  width: calc(100% - 26px);
  margin: 0 13px;
  height: 50px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  box-sizing: border-box;
  font-size: 14px;
  color:#101010;
  line-height:24px;
}
.user .list  .left-list {
  display: flex;
}
.user .list .iconfont {
  font-size: 24px;
  color:#268be5;
}
.user .list .left-list .iconfont {
  margin-right: 13px;
}
</style>
