<template>
  <div class="helpShare">
    <div class="title">
      来自好友
      <span class='name'>【{{user.nickName}}】</span>
      的求助
    </div>
    <div class="help-box">
        <img :src="user.avatar" class='avatar'>
        <div class="info-box">
            <span>万能找药，正在帮我找药！</span>
            <span>急！你也帮我打听一下这个药吧~</span>
            <span class='down'>已有{{user.total}}个好友帮我打听：</span>
        </div>
        <div class="helper">
            <img :src="item.avatar" class='help-avatar' v-for='(item, index) in user.users' :key='index'>
        </div>
    </div>
    <button class="help-btn" open-type="getUserInfo"  @click='tohelp'>
        转发专业人士，帮他打听一下！
    </button>
    <div class="btn-group">
        <button class="btn index-btn" open-type="getUserInfo" @click='toIndex'>
            去看看【万能找药】
        </button>
        <!-- <button class="btn other-btn">
            我是药神
        </button> -->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fastFlag: true,
      user: {
        nickName: '',
        avatar: '',
        total: 5,
        users: []
      }
    }
  },
  mounted () {
    this.getInfo(this.$mp.query.orderId)
  },
  methods: {
    getInfo (id) {
      var that = this
      that.$wx(
        '/user/order/share/stat',
        'GET',
        {
          orderId: id
        },
        (res) => {
          if (res.data.code === 0) {
            that.user = res.data.data
          }
        }
      )
    },
    tohelp () {
      if (this.fastFlag) {
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
                        that.$wx(
                          '/user/order/share',
                          'POST',
                          {
                            orderId: that.$mp.query.orderId
                          },
                          (res) => {
                            if (res.data.code === 0) {
                              that.fastFlag = false
                              that.$toast('加速成功')
                            }
                          }
                        )
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
      } else {
        this.$toast('您已经加速过了')
      }
    },
    toIndex () {
      var that = this
      wx.getStorage({
        key: 'token',
        success: (res) => {
          const url = '../index/main'
          wx.switchTab({ url })
        },
        fail: (res) => {
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
                          const url = '../index/main'
                          wx.switchTab({ url })
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
        }
      })
    }
  }
}
</script>

<style scoped>
.helpShare {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #7285f3;
}
.helpShare .title {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-top: 50px;
  margin-bottom: 24px;
}
.helpShare .title .name {
    font-weight: bold;
}
.helpShare .help-box {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.helpShare .help-box .avatar {
    width: 62px;
    height: 62px;
    border-radius: 50%;
    z-index:50;
    position: relative;
}
.helpShare .help-box .info-box{
    width: 278px;
    height: 175px;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color:#101010;
    font-weight: bold;
    line-height: 20px;
    margin-top: -31px;
    border: 1px solid #ccc;
}
.helpShare .help-box .info-box .down {
    margin-top: 30px;
}
.helpShare .help-box .helper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: -31px;
    z-index:50;
    position: relative;
}
.helpShare .help-box .helper .help-avatar {
    margin-left: -8px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
.helpShare .help-btn {
    width: 275px;
    height: 80px;
    font-size: 18px;
    line-height: 80px;
    text-align: center;
    background: #FF9800;
    color:#101010;
    margin-top: 76px;
    border-radius: 4px;
    border:1px solid #ccc;
    margin-bottom: 90px;
    box-shadow: 10px 10px 5px #888888;
}
.helpShare .btn-group {
    width: 275px;
    height: 36px;
    display: flex;
    justify-content: space-between;
}
.helpShare .btn-group .btn {
    font-size: 16px;
    font-weight: bold;
    width: 300px;
    height: 36px;
    text-align: center;
    line-height: 36px;
    color:#fff;
    background: #268be5;
    border-radius: 4px;
    border:1px solid #268be5;
}
.helpShare .btn-group .other-btn {
    background:#fff;
    color: #268be5;
    border:1px solid #fff;
}
</style>
