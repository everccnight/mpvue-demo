<template>
  <div class='chooseAddress'>
    <div class="search">
      <i class="iconfont">&#xe787;</i>
      <input type="text" class='inputs' placeholder="请输入地址或名称关键词">
      <span class='cancel' @click='goBack'>取消</span>
    </div>
    <div class="list">
      <div class="info"  v-for='(item, index) in shop' :key='index' @click='getSHOPS(item.id, item.name)'>
        <span class='left-info'>
          <span class="address-name">
            <span class="name">{{item.name}}</span>
            <span class="tap" v-if='item.nearBy'>最近网点</span>
          </span>
          <span class="address-info">{{item.address}}</span>
        </span>
        <span class="kilo">{{item.distance}}km</span>
      </div>
    </div>
    <div class="list">
      <div class="info" v-for='(item, index) in hospital' :key='index'>
        <span class='left-info'>
          <span class="address-name">
            <span class="name">{{item.name}}</span>
            <span class="tap hospital-tap" v-if='item.nearBy'>最近医院</span>
          </span>
          <span class="address-info">{{item.address}}</span>
        </span>
        <span class="kilo">{{item.distance}}km</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'chooseAddress',
  data () {
    return {
      shop: [],
      hospital: [],
      longitude: '',
      latitude: ''
    }
  },
  mounted () {
    var that = this
    wx.getStorage({
      key: 'longitude',
      success: function (res) {
        that.longitude = res.data
        wx.getStorage({
          key: 'latitude',
          success: function (res) {
            that.shop = []
            that.latitude = res.data
            that.getDrugStore(that.latitude, that.longitude)
          },
          fail: function (res) {}
        })
      },
      fail: function (res) {}
    })
  },
  methods: {
    getSHOPS (id, name) {
      wx.getStorage({
        key: 'backPath',
        success: function (res) {
          console.log(res)
          if (res.data === 'medicine') {
            const url = `../findDetail/main?id=${id}&name=${name}`
            wx.navigateTo({ url })
          } else if (res.data === 'long') {
            const url = `../alwaysUse/main?id=${id}&name=${name}`
            wx.navigateTo({ url })
          } else {
            const url = `../takePhoto/main?id=${id}&name=${name}`
            wx.navigateTo({ url })
          }
        }
      })
    },
    getDrugStore (lat, lon) {
      var that = this
      that.$wx(
        '/user/common/drugstore',
        'GET',
        {
          lat: lat,
          lon: lon
        },
        (res) => {
          if (res.data.code === 0) {
            that.shop = res.data.data
          }
        }
      )
    },
    goBack () {
      wx.navigateBack({
        delta: 1
      })
    }
  }
}
</script>
<style scoped>
.chooseAddress {
  width: 100%;
  height: 100%;
}
.chooseAddress .search {
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
  padding:  0 11px;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
  border-top: 1px solid #ccc;
}
.chooseAddress .search .iconfont {
  font-size: 24px;
  color:#101010;
}
.chooseAddress .search .inputs {
  font-size: 14px;
  flex:1;
}
.chooseAddress .search .cancel{
  font-size: 14px;
  color: #101010;
}
.chooseAddress .list {
  width: 100%;
  padding-left: 8px;
  box-sizing: border-box;
  font-size: 14px;
  color: #101010;
}
.chooseAddress .list .info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 44px;
  border-bottom: 1px solid #ccc;
}
.chooseAddress .list .info .left-info {
  display: flex;
  flex-direction: column;
}
.chooseAddress .list .info .address-info {
  font-size: 12px;
  color:#555353;
}
.chooseAddress .list .info .kilo {
  font-size: 12px;
  color:#626161;
  margin-right: 10px;
}
.chooseAddress .list .info .tap {
  line-height: 17px;
  font-size: 12px;
  color:#fff;
  background:#574BF7;
  border-radius: 70px;
  padding: 0 10px;
  height: 20px;
}
.chooseAddress .list .info .hospital-tap {
  background:#E51C23;
}
</style>
