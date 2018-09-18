<template>
  <div class='findMedicine'>
    <div class="search-box" @click='toSearch'>
      <i class="iconfont">&#xe787;</i>
      <span>输入药品名称或症状</span>
    </div>
    <div class="title">找药排名</div>
    <div class="nav-tab">
      <span class='nav' :class="{ actived: Active === 1 }" @click='BeActive(1)'>稀缺程度</span>
      <span class='nav' :class="{ actived: Active === 2 }" @click='BeActive(2)'>关注程度</span>
      <span class='nav' :class="{ actived: Active === 3 }" @click='BeActive(3)'>成功率</span>
    </div>
    <div class="list" v-if='Active === 1'>
       <div class="info" v-for='(item, index) in rareList' :key='index'>
         <!-- <i class="iconfont">&#xe781;</i> -->
         <img :src="item.img" class='img'>
         <span class="info-box">
           <span>{{item.drugName}} {{item.specifications}}</span>
           <span>{{item.manufacturer}}</span>
           <span class='number'>已成交：{{item.rank}}</span>
         </span>
         <span class="choose" @click='findDetail(item.drugId)'>选择</span>
       </div>
    </div>
    <div class="list" v-if='Active === 2'>
       <div class="info" v-for='(item, index) in hotList' :key='index'>
         <!-- <i class="iconfont">&#xe781;</i> -->
         <img :src="item.img" class='img'>
         <span class="info-box">
           <span>{{item.drugName}} {{item.specifications}}</span>
           <span>{{item.manufacturer}}</span>
           <span class='number'>已成交：{{item.rank}}</span>
         </span>
         <span class="choose" @click='findDetail(item.drugId)'>选择</span>
       </div>
    </div>
    <div class="list" v-if='Active === 3'>
       <div class="info" v-for='(item, index) in successList' :key='index'>
         <!-- <i class="iconfont">&#xe781;</i> -->
         <img :src="item.img" class='img'>
         <span class="info-box">
           <span>{{item.drugName}} {{item.specifications}}</span>
           <span>{{item.manufacturer}}</span>
           <span class='number'>已成交：{{item.rank}}</span>
         </span>
         <span class="choose" @click='findDetail(item.drugId)'>选择</span>
       </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      Active: 1,
      rareList: [],
      hotList: [],
      successList: [],
      hotPage: 1,
      successPage: 1,
      rarePage: 1,
      hotFlag: true,
      successFlag: true,
      rareFlag: true
    }
  },
  mounted () {
    this.Active = 1
    this.rareList = []
    this.hotList = []
    this.successList = []
    this.hotPage = 1
    this.successPage = 1
    this.rarePage = 1
    this.hotFlag = true
    this.successFlag = true
    this.rareFlag = true
    this.getHot()
    this.getSuccess()
    this.getrare()
  },
  onReachBottom () {
    if (this.Active === 1) {
      this.rarePage = this.rarePage + 1
      this.getrare()
    } else if (this.Active === 2) {
      this.hotPage = this.hotPage + 1
      this.getHot()
    } else if (this.Active === 3) {
      this.successPage = this.successPage + 1
      this.getSuccess()
    }
  },
  methods: {
    getHot () {
      var that = this
      that.$wx(
        '/user/common/hot/drug?page=' + that.hotPage,
        'GET',
        {},
        (res) => {
          if (res.data.code === 0) {
            res.data.data.forEach(e => {
              e.img = 'https://p2.maiyaole.com/img/item/1535016117014139.jpg'
            })
            if (res.data.data.length < 10) {
              that.hotFlag = false
            }
            that.hotList = [...that.hotList, ...res.data.data]
            // console.log(res)
          }
        }
      )
    },
    getrare () {
      var that = this
      that.$wx(
        '/user/common/rare/drug?page=' + that.rarePage,
        'GET',
        {},
        (res) => {
          if (res.data.code === 0) {
            res.data.data.forEach(e => {
              e.img = 'https://p2.maiyaole.com/img/item/1535016117014139.jpg'
            })
            if (res.data.data.length < 10) {
              that.rareFlag = false
            }
            that.rareList = [...that.rareList, ...res.data.data]
            // console.log(res)
          }
        }
      )
    },
    getSuccess () {
      var that = this
      that.$wx(
        '/user/common/success/drug?page=' + that.hotPage,
        'GET',
        {},
        (res) => {
          if (res.data.code === 0) {
            res.data.data.forEach(e => {
              e.img = 'https://p2.maiyaole.com/img/item/1535016117014139.jpg'
            })
            if (res.data.data.length < 10) {
              that.successFlag = false
            }
            that.successList = [...that.successList, ...res.data.data]
            // console.log(res)
          }
        }
      )
    },
    toSearch () {
      const url = '../search/main'
      wx.navigateTo({ url })
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
            wx.navigateTo({ url })
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
  .findMedicine {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .findMedicine .search-box {
    margin: 5px 0 0 8px;
    width: calc(100% - 16px);
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #A6A3A3;
    border:1px solid #ccc;
    border-radius:  9px;
    font-size: 14px;
    margin-bottom: 5px;
  }
  .findMedicine .search-box .iconfont {
    margin-right: 5px;
    font-size: 19px;
  }
  .findMedicine .title {
    margin:  7px 0 12px 10px;
    font-size: 16px;
    font-weight: bold;
  }
  .findMedicine .nav-tab {
    width: 100%;
    display: flex;
    align-items: center;
    height: 36px;
  }
  .findMedicine .nav-tab .nav {
    width: 25%;
    margin: 0 4%;
    line-height: 35px;
    height: calc(100% - 3px);
    font-size: 14px;
    color: #101010;
    text-align: center;
    border-bottom: 1px solid transparent;
  }
  .findMedicine .nav-tab .nav.actived {
    border-bottom: 3px solid #268be5;
    color:#268be5;
  }
  .findMedicine .list {
    width: 100%;
    padding:  0 11px;
    box-sizing: border-box;
  }
  .findMedicine .info {
    width: 100%;
    height:95px;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    position: relative;
  }
  .findMedicine .info .iconfont {
    font-size: 17px;
    margin-right: 10px;
  }
  .findMedicine .info .img {
    width: 66px;
    height: 70px;
    margin-right: 18px;
  }
  .findMedicine .info .info-box {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    color: #101010;
    line-height: 23px;
  }
  .findMedicine .info .info-box .number {
    color: #847C7C;
  }
  .findMedicine .info .choose {
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
