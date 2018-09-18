<template>
  <div class="index">
    <swiper class="index-swiper" indicator-dots='true' autoplay='true' indicator-active-color="#fff">
      <swiper-item v-for='(item, index) in swiperList' :key='index' >
        <!-- <img :src="item.bannerUrl" mode="aspectFit"> -->
        <img :src="item.imageUrl" mode='aspectFit'>
      </swiper-item>
    </swiper>
    <div class="search" @click='toSearch'>
      <i class="iconfont">&#xe787;</i>
      <span>输入药品名称或症状</span>
    </div>
    <div class="info-box">
      <p class='title'>快速找药</p>
      <!-- <i class="iconfont ask" @click='toask'>&#xe69e;</i> -->
      <div class="icon-group">
        <div class="icon-box" @click='findMedicine'>
          <i class="iconfont">&#xe611;</i>
          <span>找药排名</span>
        </div>
        <div class="icon-box" @click='alwaysUse'>
          <i class="iconfont">&#xe61f;</i>
          <span>长期用药</span>
          <!-- <div class="trs"></div>
          <div class="trs-text">折</div> -->
        </div>
        <div class="icon-box" @click='takePhoto'>
          <i class="iconfont">&#xe640;</i>
          <span>拍照下单</span>
        </div>
      </div>
    </div>
    <scroll-view class="info-list" scroll-y @scrolltolower='loadmoreList()'>
      <p class='title'>靠谱药师<span class='spans'>（你帮药师扬名，药师解你危难）</span></p>
      <div class="list" v-for="(item, index) in UserList" :key="index">
        <div class='left'>
          <span class="address-Group">
            <span class="address">{{item.storeName}}</span>
            <span class="name">{{item.name}}</span>
          </span>
          <span class='find'>最近找到 <span class='medicine'>{{item.lastDrugName}}{{item.successRate}}盒</span></span>
        </div>
        <div class="right">
          <span class='btn' v-if='item.init' @click=getSeller(item)>结交</span>
          <i class="iconfont success btn" v-if='!item.init'>&#xe609;</i>
          <span class="percent" style="visibility:hidden">成功率{{item.percent}}</span>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      swiperList: [],
      UserList: [],
      longitude: '',
      latitude: '',
      page: 1,
      loadMoreFlag: true
    }
  },
  mounted () {
    this.getLocation()
    this.getBanner()
    this.getUsers()
  },
  methods: {
    loadmoreList () { // 下拉加载更多药师
      if (this.loadMoreFlag) {
        this.page = this.page + 1
        this.getUsers()
      }
    },
    getSeller (item) { // 结交药师
      var that = this
      that.$wx(
        '/user/new/pharmacist?pharmacistId=' + item.id,
        'POST',
        {},
        (res) => {
          if (res.data.code === 0) {
            console.log(res)
            item.init = false
            that.$toast('结交成功')
          } else {
            that.$toast('结交失败')
          }
        }
      )
    },
    getUsers () {
      var that = this
      that.$wx(
        '/user/common/reliable/seller?page=' + that.page,
        'GET',
        {},
        (res) => {
          if (res.data.code === 0) {
            res.data.data.forEach(e => {
              e.init = true
            })
            if (res.data.data.length < 10) {
              that.loadMoreFlag = false
            }
            that.UserList = [...that.UserList, ...res.data.data]
            console.log(res)
          }
        }
      )
    },
    getBanner () {
      var that = this
      this.$wx(
        '/user/common/banners',
        'GET',
        {},
        (res) => {
          if (res.data.code === 0) {
            that.swiperList = res.data.data
          }
        },
        (res) => {
          console.log('err', res)
        }
      )
    },
    findMedicine () {
      const url = '../findMedicine/main'
      wx.navigateTo({ url })
    },
    takePhoto () {
      const url = '../takePhoto/main'
      wx.navigateTo({ url })
    },
    toask () {
      const url = '../askList/main'
      wx.navigateTo({ url })
    },
    alwaysUse () {
      const url = '../alwaysUse/main'
      wx.navigateTo({ url })
    },
    toSearch () {
      wx.setStorage({
        key: 'backPath',
        data: 'medicine'
      })
      const url = '../search/main'
      wx.navigateTo({ url })
    },
    getLocation () {
      var that = this
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          that.longitude = res.longitude
          that.latitude = res.latitude
          wx.setStorage({
            key: 'longitude',
            data: res.longitude
          })
          wx.setStorage({
            key: 'latitude',
            data: res.latitude
          })
        },
        fail: function () {
        }
      })
    }
  }
}
</script>

<style scoped>
.index {
  width:100%;
  height: 100%;
  overflow: hidden;
}
.index .index-swiper {
  width: 100%;
  height: 108px;
}
.index .index-swiper img {
  width: 100%;
  height: 100%;
}
.index .search {
  margin-left: 8px;
  width: calc(100% - 16px);
  height: 50px;
  border-radius:5px;
  border:1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color:#A6A3A3;
}
.index .search .iconfont {
  margin-right: 4px;
  font-size: 19px;
}
.index .info-box {
  width: 100%;
  height: 109px;
  border-bottom:5px solid #ccc;
  position: relative;
}
.index .info-box .title, .index .info-list .title {
  font-size: 16px;
  color:#101010;
  font-weight: bold;
  margin: 13px 0 3px 9px;
}
.index .info-list .title .spans {
  margin-left: 8px;
  font-size: 14px;
  color:#847C7C;
}
.index .info-box .icon-group {
  width: 100%;
  display: flex;
  height: 85px;
}
.index .info-box .icon-group .icon-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color:#268be5;
  font-size: 14px;
  position: relative;
}
.index  .icon-box .iconfont {
  font-size: 42px;
  margin-bottom: 5px;
}
.index  .icon-box .trs {
  position: absolute;
  right: 0;
  top:0;
  color: #fff;
  width:0;
  height:0;
  border-top: 26px solid #E51C23;
  border-left: 26px solid transparent; 
}
.index  .icon-box  .trs-text {
  color: #fff;
  position: absolute;
  right: 0;
  top:0;
  z-index:999;
  font-size:12px;
}
.index  .info-box .iconfont.ask {
  position: absolute;
  right: 0;
  top:-10px;
  font-size: 49px;
  color: #268be5;
}
.index .info-list {
  width: 100%;
  height: 263px;
  overflow-y: auto;
  /* border-bottom:5px solid #268be5; */
}
.index .info-list .list {
  width: calc(100% - 9px);
  margin-left: 9px;
  border-bottom: 1px solid #ccc;
  height: 53px;
  font-size:14px;
  color:#268be5;
  display: flex;
  justify-content: space-between;
}
.index .info-list .list .left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.index .left .address-Group {
  display: flex;
  margin-top: 10px;
  font-size:14px;
  color:#268be5
}
.index .left .address-Group .name {
  text-decoration: underline;
  margin-left: 5px;
  font-weight: bold;
}
.index .left .find {
    color:rgb(132, 124, 124)
}
.index .left .find .medicine {
  color:rgb(16, 16, 16)
}
.index .right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-right: 5px;
}
.index .right .btn {
  margin-top: 10px;
  color:#fff;
  background: #268be5;
  width: 48px;
  height: 27px;
  line-height: 27px;
  margin-bottom: 4px;
  text-align: center;
  border-radius: 5px;
}
.index .right .btn.success {
  background: #847C7C;
  font-size: 25px;
}
.index .right .percent {
  font-size: 12px;
  color:#847C7C;
  text-align: center;
}
</style>
