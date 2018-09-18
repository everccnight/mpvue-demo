<template>
  <div class="search">
    <input type="text" placeholder="输入药品名称或症状" confirm-type='search' adjust-position='false' class='search-input' v-model='searchKey' @confirm='confirmChange'>
    <p class="history-title" v-if='!searching'>
      <span>历史搜索</span>
      <i class="iconfont" @click='cleanHis()'>&#xe602;</i>
    </p>
    <p class="history-list" v-for='(item, index) in list' :key='index' v-if='!searching' @click='searchInfo(item)'>{{item}}</p>
    <!-- <div class="address-box">
      <div class="address">
        <i class="iconfont">&#xe603;</i>
        <span>{{address}}</span>
      </div>
      <i class="iconfont">&#xe634;</i>
    </div> -->
    <!-- <div class="nav-tab" v-if='searching'>
      <span class='nav' :class="{ actived: Active === 1 }" @click='BeActive(1)'>综合排序</span>
      <span class='nav' :class="{ actived: Active === 2 }" @click='BeActive(2)'>销量优先</span>
      <span class='nav' :class="{ actived: Active === 3 }" @click='BeActive(3)'>价格优先</span>
    </div> -->
    <div class="list" v-if='Active === 1&&searching'>
       <div class="info" v-for='(item, index) in onlyList' :key='index'>
         <!-- <i class="iconfont">&#xe781;</i> -->
         <img :src="item.img" class='img'>
         <span class="info-box">
           <span>{{item.name}} </span>
           <span>{{item.specifications}}</span>
           <span>{{item.manufacturer}}</span>
           <!-- <span class='number'>已成交：{{item.rank}}</span> -->
         </span>
         <span class="choose" @click='findDetail(item.id)'>选择</span>
       </div>
    </div>
    <!-- <scroll-view class="list" v-if='Active === 2&&searching'>
       <div class="info" v-for='(item, index) in lookList' :key='index'>
         <i class="iconfont">&#xe781;</i>
         <img :src="item.img" class='img'>
         <span class="info-box">
           <span>{{item.name}} {{item.specifications}}</span>
           <span>{{item.manufacturer}}</span>
           <span class='number'>已成交：{{item.rank}}</span>
         </span>
         <span class="choose" @click='findDetail(item.drugId)'>选择</span>
       </div>
    </scroll-view> -->
    <!-- <scroll-view class="list" v-if='Active === 3&&searching'>
       <div class="info" v-for='(item, index) in successList' :key='index'>
         <img :src="item.img" class='img'>
         <span class="info-box">
           <span>{{item.name}} {{item.specifications}}</span>
           <span>{{item.manufacturer}}</span>
           <span class='number'>已成交：{{item.rank}}</span>
         </span>
         <span class="choose" @click='findDetail(item.drugId)'>选择</span>
       </div>
    </scroll-view> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchKey: '',
      address: '北京市海淀区学清路  大参林大药房100m',
      searching: false,
      list: [],
      page: 1,
      moreFlag: true,
      Active: 1,
      onlyList: [],
      lookList: [],
      successList: []
    }
  },
  mounted () {
    var that = this
    wx.getStorage({
      key: 'searchList',
      success: function (res) {
        if (res.data === undefined) {
          that.list = []
        } else {
          that.list = res.data
        }
      },
      fail: function (res) {
        that.list = []
      }
    })
  },
  onShow () {
    this.searching = false
    this.searchKey = ''
  },
  onReachBottom () {
    this.loadmoreList()
  },
  methods: {
    searchInfo (item) {
      this.searchKey = item
      this.startSearchIng(1)
    },
    cleanHis () {
      var that = this
      wx.showModal({
        title: '请确认？',
        content: '确定要删除历史记录吗',
        success: function (res) {
          if (res.confirm) {
            wx.removeStorage({
              key: 'searchList',
              success: function (res) {
                that.list = []
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    loadmoreList () {
      if (this.moreFlag) {
        var page = this.page + 1
        this.startSearchIng(page)
      }
    },
    confirmChange () {
      this.onlyList = []
      this.startSearchIng(1)
    },
    ArrayRep (array) {
      var temp = [] // 一个新的临时数组
      for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) === -1) {
          temp.push(array[i])
        }
      }
      return temp
    },
    startSearchIng (page) {
      var that = this
      that.page = page
      that.$wx(
        '/user/common/search',
        'GET',
        {
          name: that.searchKey,
          page: that.page
        },
        (res) => {
          if (res.data.code === 0) {
            that.list.push(that.searchKey)
            that.list = that.ArrayRep(that.list)
            wx.setStorage({
              key: 'searchList',
              data: that.list
            })
            that.searching = true
            if (res.data.data.length < 10) {
              that.moreFlag = false
            } else {
              that.moreFlag = true
            }
            console.log(that.moreFlag)
            res.data.data.forEach(e => {
              e.img = 'https://p2.maiyaole.com/img/item/1535016117014139.jpg'
            })
            that.onlyList = [...that.onlyList, ...res.data.data]
          }
        }
      )
    },
    findDetail (val) {
      var that = this
      that.$wx(
        '/user/new/cart',
        'POST',
        {
          drugId: val
        },
        (res) => {
          if (res.data.code === 0) {
            const url = '../findDetail/main'
            wx.reLaunch({ url })
          }
        }
      )
    },
    BeActive (val) {
      this.Active = val
    }
  }
}
</script>

<style scoped>
.search {
  width:100%;
  height: 100%;
}
.search .search-input {
  height: 38px;
  border-radius: 5px;
  margin-left: 8px;
  width: calc(100% - 16px);
  font-size:14px;
  padding-left: 20px;
  box-sizing: border-box;
  border:1px solid #268be5;
}
.search .history-title {
  height: 27px;
  margin-left:10px;
  width: calc(100% - 20px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #847C7C;
  font-size: 14px; 
  border-bottom: 1px solid #ccc;
}
.search .history-list {
  height: 27px;
  margin-left:10px;
  width: calc(100% - 20px);
  display: flex;
  align-items: center;
  color: #101010;
  font-size: 14px; 
  border-bottom: 1px solid #ccc;
}
.search .address-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 5px;
  border-bottom: 9px solid #268be5;
  width: 100%;
  height: 27px;
  font-size: 14px;
  color: #847C7C;
}
.search .address-box .iconfont {
  font-size: 17px;
  margin-right: 5px;
  color:#268be5;
}
.search .address-box .address {
  display: flex;
  align-items: center;
}
.search .nav-tab {
  width: 100%;
  display: flex;
  align-items: center;
  height: 36px;
}
.search .nav-tab .nav {
  width: 25%;
  margin: 0 4%;
  line-height: 35px;
  height: calc(100% - 3px);
  font-size: 14px;
  color: #101010;
  text-align: center;
  border-bottom: 1px solid transparent;
}
.search .nav-tab .nav.actived {
  border-bottom: 3px solid #268be5;
  color:#268be5;
}
.search .list {
  width: 100%;
  padding:  0 11px;
  box-sizing: border-box;
}
.search .info {
  width: 100%;
  height:95px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  position: relative;
}
.search .info .iconfont {
  font-size: 17px;
  margin-right: 10px;
}
.search .info .img {
  width: 66px;
  height: 70px;
  margin-right: 18px;
}
.search .info .info-box {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #101010;
  line-height: 23px;
}
.search .info .info-box .number {
  color: #847C7C;
}
.search .info .choose {
  width: 68px;
  height: 22px;
  line-height: 22px;
  text-align: center;
  color: #fff;
  background: #268be5;
  position: absolute;
  right: 10px;
  bottom: 15px;
  font-size: 14px;
  border-radius: 5px;
}
</style>
