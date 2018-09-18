<template>
  <div class="address">
    <div class="list-group">
      <div class="list"  v-for='(item, index) in list' :key='index'>
        <div class="name-info">
          <span>
            <span class="name">{{item.name}}</span>
            <span class="phone">{{item.mobile}}</span>
          </span>
          <span>
            <span v-if='item.status === 1' class='default'>默认</span>
            <span class="addressInfo">{{item.cityName}} {{item.address}}</span>
          </span>
        </div>
        <div class="iconfont-group">
          <i class="iconfont del" @click='toDelete(item.id)'>&#xe602;</i>
          <i class="iconfont" @click='toEdit(item.id)'>&#xe639;</i>
        </div>
      </div>
    </div>
    <div class="btn" @click='toAdd'>
      <i class="iconfont">&#xe6a4;</i>
      新增地址
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.list = []
    this.getAddress()
  },
  onShow () {
    this.list = []
    this.getAddress()
  },
  methods: {
    getAddress () {
      var that = this
      this.list = []
      this.$wx(
        '/user/my/address',
        'GET',
        {},
        (res) => {
          if (res.data.code === 0) {
            that.list = res.data.data
          }
        }
      )
    },
    toDelete (id) {
      var that = this
      wx.showModal({
        title: '提示',
        content: '确定要删除吗',
        success: function (res) {
          if (res.confirm) {
            that.$wx(
              '/user/remove/address?id=' + id,
              'POST',
              {},
              (res) => {
                if (res.data.code === 0) {
                  that.getAddress()
                  that.$toast('删除成功')
                }
              }
            )
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    toAdd () {
      const url = '../addAddress/main'
      wx.navigateTo({ url })
    },
    toEdit (id) {
      const url = `../editAddress/main?id=${id}`
      wx.navigateTo({ url })
    }
  }
}
</script>

<style scoped>
.address {
  width:100%;
  height: 100%;
  overflow: hidden;
}
.address  .btn {
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
.address  .btn .iconfont {
  margin-right: 5px;
}
.address .iconfont-group {
  display: flex;
  align-items: center;
}
.address .list-group {
  width: 100%;
  height: 100%;
  overflow: auto;
  margin-bottom: 60px;
}
.address .list-group .list {
  height: 71px;
  border-bottom:1px solid #ccc;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px 0 9px;
  box-sizing: border-box;
}
.address .list-group .list .iconfont{
  font-size: 21px;
  margin: 0 3px;
} 
.address .list-group .list .name-info {
  font-size: 14px;
  color:#101010;
  display: flex;
  flex-direction: column;
}
.address .list-group .list .name-info .name {
  margin-right: 10px;
}
.address .list-group .list .name-info .default {
  width: 50px;
  height: 30px;
  font-size: 12px;
  text-align: center;
  border-radius: 4px;
  border:1px solid #268be5;
  color:#268be5;
  line-height: 30px;
  margin-right: 10px;
  padding: 0 5px;
}
.address .list-group .list .name-info .addressInfo {
  font-size: 12px;
  color: #847C7C;
  text-decoration: underline;
}
</style>
