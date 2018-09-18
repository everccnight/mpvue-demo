<template>
  <div class="order">
    <div class="nav-tab">
      <div class="nav" :class="{ actived: Active === 1 }" @click='BeActive(1)'>待接单</div>
      <div class="nav" :class="{ actived: Active === 2 }" @click='BeActive(2)'>待确认</div>
      <div class="nav" :class="{ actived: Active === 3 }" @click='BeActive(3)'>待收货</div>
      <div class="nav" :class="{ actived: Active === 4 }" @click='BeActive(4)'>已完成</div>
    </div>
    <div class="List-box" v-if='Active === 1'>
      <div class="list" v-for='(item, index) in waitingList' :key='index' v-if='waitingList.length > 0'>
        <div class="medicine-info">
          <div class="askFor">已通知所有药仓,请等候......</div>
          <div class="medicine" v-for='(items, indexs) in item.drugs' :key='indexs'>
            <span v-if='items.drugId === 0'>{{indexs + 1}}、{{items.remark}}</span>
            <span v-else>{{indexs + 1}}、{{items.manufacturer}} {{items.drugName}} {{items.specifications}}</span>
            <span class='quantity'>{{items.quantity}}盒</span>
          </div>
        </div>
        <div class="price">药品价格：待确认</div>
        <div class="btn-group">
          <span class='btn' @click='cancleOrder(item, index)'>取消订单</span>
          <span class='btn lookInfo' @click='pendingOrder(item.id)'>查看订单</span>
        </div>
      </div>
      <div class='no-order' v-if='waitingList.length === 0'>暂无订单</div>
    </div>
    <div class="List-box" v-if='Active === 2'>
      <div class="list" v-for='(item, index) in unconfirmedList' :key='index'>
        <div class="medicine-info">
          <div class="askFor">已有{{item.sellerNum}}个商家响应，请您查看详情……</div>
          <div class="medicine" v-for='(items, indexs) in item.drugs' :key='indexs'>
            <span v-if='items.drugId === 0'>{{indexs + 1}}、{{items.remark}}</span>
            <span v-else>{{indexs + 1}}、{{items.manufacturer}} {{items.drugName}} {{items.specifications}}</span>
            <span class='quantity'>{{items.quantity}}盒</span>
          </div>
        </div>
        <div class="price">药品价格：待确认</div>
        <div class="btn-group">
          <span class='btn' @click='cancleOrder(item, index)'>取消订单</span>
          <span class='btn lookInfo' @click='waitOrder(item.id)'>查看订单</span>
        </div>
      </div>
      <div class='no-order' v-if='unconfirmedList.length === 0'>暂无订单</div>
    </div>
    <div class="List-box" v-if='Active === 3'>
      <div class="list" v-for='(item, index) in confirmedList' :key='index'>
        <div class="medicine-info">
          <div class="askFor">国药商业已发货，请耐心等候~</div>
          <div class="medicine" v-for='(items, indexs) in item.drugs' :key='indexs'>
            <span v-if='items.drugId === 0'>{{indexs + 1}}、{{items.remark}}</span>
            <span v-else>{{indexs + 1}}、{{items.manufacturer}} {{items.drugName}} {{items.specifications}}</span>
            <span class='quantity'>{{items.quantity}}盒</span>
          </div>
        </div>
        <div class="Newprice">
          <span>已支付</span>
          <span>总费用：{{item.payAmount}}元</span>
        </div>
        <div class="btn-group">
          <!-- <span class='btn'>查看物流</span> -->
          <!-- <span class='btn lookInfo' @click='ComfirmOrder'>确认收货</span> -->
        </div>
      </div>
      <div class='no-order' v-if='confirmedList.length === 0'>暂无订单</div>
    </div>
    <div class="List-box" v-if='Active === 4'>
      <div class="list" v-for='(item, index) in completedList' :key='index'>
        <div class="medicine-info">
          <div class="askFor">订单详情</div>
          <div class="medicine" v-for='(items, indexs) in item.drugs' :key='indexs'>
            <span v-if='items.drugId === 0'>{{indexs + 1}}、{{items.remark}}</span>
            <span v-else>{{indexs + 1}}、{{items.manufacturer}} {{items.drugName}} {{items.specifications}}</span>
            <span class='quantity'>{{items.quantity}}盒</span>
          </div>
        </div>
        <div class="Newprice">
          <span>已支付</span>
          <span>总费用：{{item.payAmount}}元</span>
        </div>
        <div class="btn-group">
          <!-- <span class='btn lookInfo'>查看详情</span> -->
        </div>
      </div>
      <div class='no-order' v-if='completedList.length === 0'>暂无订单</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      Active: 1,
      waitingList: [],
      unconfirmedList: [],
      confirmedList: [],
      completedList: [],
      waitingFlag: false,
      unconfirmedFlag: false,
      confirmedFlag: false,
      completedFlag: false,
      waitingPage: 1, // 待接单列表
      unconfirmedPage: 1, // 待确认列表
      confirmedPage: 1, // 待收货列表
      completedPage: 1, // 已完成列表
      initFlag: false
    }
  },
  mounted () {
    this.getWaitingList()
    this.getunconfirmedList()
    this.getConfirmedList()
    this.getcompletedList()
    this.initFlag = true
  },
  onShow () {
    if (this.initFlag) {
      this.waitingList = []
      this.unconfirmedList = []
      this.confirmedList = []
      this.completedList = []
      this.waitingFlag = false
      this.unconfirmedFlag = false
      this.confirmedFlag = false
      this.completedFlag = false
      this.waitingPage = 1 // 待接单列表
      this.unconfirmedPage = 1 // 待确认列表
      this.confirmedPage = 1 // 待收货列表
      this.completedPage = 1 // 已完成列表
      this.getWaitingList()
      this.getunconfirmedList()
      this.getConfirmedList()
      this.getcompletedList()
    }
  },
  onReachBottom () {
    if (this.Active === 1) {
      if (!this.waitingFlag) {
        this.waitingPage = this.waitingPage + 1
        this.getWaitingList()
      }
    } else if (this.Active === 2) {
      if (!this.unconfirmedFlag) {
        this.unconfirmedPage = this.unconfirmedPage + 1
        this.getunconfirmedList()
      }
    } else if (this.Active === 3) {
      if (!this.confirmedFlag) {
        this.confirmedPage = this.confirmedPage + 1
        this.getConfirmedList()
      }
    } else if (this.Active === 4) {
      if (!this.completedFlag) {
        this.completedPage = this.completedPage + 1
        this.getcompletedList()
      }
    }
  },
  methods: {
    getWaitingList () { // 获取待接单订单
      var that = this
      that.$wx(
        '/user/order/waiting',
        'GET',
        {
          page: that.waitingPage
        },
        (res) => {
          if (res.data.code === 0) {
            if (res.data.data.length < 10) {
              that.waitingFlag = true
            }
            that.waitingList = [...that.waitingList, ...res.data.data]
          }
        }
      )
    },
    getunconfirmedList () { // 获取待确认列表
      var that = this
      that.$wx(
        '/user/order/unconfirmed',
        'GET',
        {
          page: that.unconfirmedPage
        },
        (res) => {
          if (res.data.code === 0) {
            if (res.data.data.length < 10) {
              that.unconfirmedFlag = true
            }
            that.unconfirmedList = [...that.unconfirmedList, ...res.data.data]
          }
        }
      )
    },
    getConfirmedList () { // 获取待收货列表
      var that = this
      that.$wx(
        '/user/order/confirmed',
        'GET',
        {
          page: that.confirmedPage
        },
        (res) => {
          if (res.data.code === 0) {
            if (res.data.data.length < 10) {
              that.confirmedFlag = true
            }
            that.confirmedList = [...that.confirmedList, ...res.data.data]
          }
        }
      )
    },
    getcompletedList () { // 获取已完成列表
      var that = this
      that.$wx(
        '/user/order/completed',
        'GET',
        {
          page: that.completedPage
        },
        (res) => {
          if (res.data.code === 0) {
            if (res.data.data.length < 10) {
              that.completedFlag = true
            }
            that.completedList = [...that.completedList, ...res.data.data]
          }
        }
      )
    },
    BeActive (val) {
      this.Active = val
    },
    pendingOrder (orderId) {
      const url = '../pendingOrder/main?orderId=' + orderId
      wx.navigateTo({ url })
    },
    waitOrder (orderId) {
      const url = '../waitOrder/main?orderId=' + orderId
      wx.navigateTo({ url })
    },
    cancleOrder (item, index) {
      var that = this
      wx.showModal({
        title: '请确认？',
        content: '确定要取消订单吗',
        success: function (res) {
          if (res.confirm) {
            that.$wx(
              '/user/cancel-order?orderId=' + item.id,
              'POST',
              {},
              (res) => {
                if (res.data.code === 0) {
                  that.$toast('取消成功')
                  if (that.Active === 1) {
                    that.waitingList.splice(index, 1)
                  } else if (that.Active === 2) {
                    that.unconfirmedList.splice(index, 1)
                  }
                }
              }
            )
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    ComfirmOrder () {
      wx.showModal({
        title: '请确认？',
        content: '确认要收货吗？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
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
.order {
  width:100%;
  height: 100%;
  overflow: hidden;
}
.order .nav-tab {
  width: 100%;
  display: flex;
  align-items: center;
  height: 36px;
}
.order .nav-tab .nav {
  width: 17%;
  margin: 0 4%;
  line-height: 35px;
  height: calc(100% - 3px);
  font-size: 14px;
  color: #101010;
  text-align: center;
  border-bottom: 1px solid transparent;
}
.order .nav-tab .nav.actived {
  border-bottom: 3px solid #268be5;
  color:#268be5;
}
.order .List-box  {
  display: flex;
  width: 100%;
  flex-direction: column;
}
.order .List-box .no-order {
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 24px;
  justify-content: center;
}
.order .List-box .list {
  width: calc(100% - 15px);
  min-height:120px;
  margin-left: 15px;
  padding: 0 15px 0 0;
  box-sizing: border-box;
  border-bottom: 1px #ccc solid;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 5px;
}
.order .List-box .list:last-child{
  border:none;
}
.order .List-box .list .medicine-info {
  width: 100%;
  min-height:60px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 14px;
  line-height: 20px;
}
.order .List-box .list .medicine-info .askFor {
  color:#888;
}
.order .List-box .list .medicine-info .medicine {
  color:#101010;
  width: 100%;
  word-break: break-all;
}
.order .List-box .list .medicine-info .medicine .quantity {
  margin-left: 30px;
}
.order .List-box .list .price {
  font-size: 14px;
  color:#847C7C;
  margin:6px 0 10px 0;
}
.order .List-box .list .Newprice {
  font-size: 14px;
  color:#847C7C;
  margin:6px 0 10px 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.order .List-box .list .btn-group {
  display: flex;
  margin-bottom: 7px;
}
.order .List-box .list .btn-group .btn {
  background: #847C7C;
  border:1px solid #BBBBBB;
  color:#fff;
  font-size: 14px;
  width: 74px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  margin-left: 20px;
  border-radius: 5px;
}
.order .List-box .list .btn-group .btn.lookInfo {
  background: #268be5;
}
</style>
