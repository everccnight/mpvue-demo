<template>
  <div class="pharmacist">
    <div class="list" v-for='(item, index) in list' :key='index'>
      <div class="user">
        <div class="user-info">
          <img :src="item.avatar" class='avatar'>
          <span class="name">{{item.name}}</span>
          <!-- <span class="percent">成功率{{item.percent}}%</span>    -->
        </div>
        <div class="btn" @click='toSearch'>找药</div>
      </div>
      <div class="work-info">
        <span class="address">{{item.storeName}}</span>
        <span class='times'>帮我找药{{item.gender}}次</span>
      </div>
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
    this.getList()
  },
  methods: {
    getList () {
      this.list = []
      var that = this
      that.$wx(
        '/user/my/pharmacist',
        'GET',
        {},
        (res) => {
          if (res.data.code === 0) {
            that.list = res.data.data
          }
        }
      )
    },
    toSearch () {
      const url = '../search/main'
      wx.navigateTo({ url })
    }
  }
}
</script>

<style scoped>
.pharmacist {
  width:100%;
  height: 100%;
  overflow: hidden;
}
.pharmacist .list {
    margin: 5px 5px 8px 5px;
    width: calc(100% - 10px);
    height: 79px;
    border: 1px solid #bbb;
    line-height: 20px;
    border-radius: 10px;
    font-size: 12px;
    color:#101010;
}
.pharmacist .list .user {
    width: 100%;
    height: 54px;
    padding: 0 28px 0 11px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.pharmacist .list .user .btn {
    width: 59px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color:#fff;
    border-radius: 4px;
    background: #5bacff;
}
.pharmacist .list .user .user-info {
    display: flex;
    align-items: center;
}
.pharmacist .list .user .avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: #5bacff;
    margin-right: 12px;
}
.pharmacist .list .user .name {
    font-size: 14px;
    margin-right: 6px;
}
.pharmacist .list .user .percent {
    color:#847C7C;
}
.pharmacist .list .work-info {
    width: 100%;
    height: 34px;
    border-top:1px solid #bbb;
    display: flex;
}
.pharmacist .list .work-info .address{
    width: 65%;
    height: 25px;
    border-right: 1px solid #bbb;
    display: flex;
    align-items: center;
    padding-left: 10px;
    box-sizing: border-box;
    font-weight: bold;
}
.pharmacist .list .work-info .times {
    text-align: center;
    width: 35%;
    height: 25px;
    line-height: 25px;
}
</style>
