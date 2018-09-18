<template>
  <div class="paySuccess">
    <div class="find-box">
      <div class="tit">待收货……</div>
      <div class="spanName">
        <i class="iconfont">&#xe611;</i>
        <span class='name'>{{shop}}
          <span class='way'>({{way}}Km)</span>
        </span>
      </div>
      <div class="spanName">
        <i class="iconfont">&#xe603;</i>
        收货点:{{address}}
      </div>
    </div>
    <div class="find-title">找药清单</div>
    <div class="medicine-box">
      <div class="medicine" v-for='(item, index) in list' :key='index'>
        <img :src="item.image"  class='img'>
        <span class='name'>{{item.name}} {{item.number}}盒</span>
      </div>
    </div>
    <div class='give-Medicine'>
        支付已完成，正在快马加鞭取货~
    </div>
    <button class="share-box" open-type="share">
        <div class="info">
            <span>恭喜您！找药成功！</span>
            <span>您已结交：<span class='bold'>黄药师</span></span>
            <span>平日问药 急时找药 常备重要</span>
        </div>
        <div class="give">推荐给他人 得5元优惠</div>
        <span class="has">需要2个人结交他</span>
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      price: {
        total: 135,
        server: 15,
        go: 20,
        medicine: 100
      },
      shop: '国药商业第三营业部',
      way: '30.9',
      address: '北京市海淀区 大参林大药房（学清路店）',
      list: [
        {
          image: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=759961887,190875110&fm=27&gp=0.jpg',
          name: '气血康口服液 云南白药集团 10ml*10只',
          number: 4
        },
        {
          image: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=759961887,190875110&fm=27&gp=0.jpg',
          name: '气血康口服液 云南白药集团 10ml*10只',
          number: 4
        },
        {
          image: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=759961887,190875110&fm=27&gp=0.jpg',
          name: '气血康口服液 云南白药集团 10ml*10只',
          number: 4
        }
      ]
    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '请结交黄药师',
      path: '/pages/personShare/main'
    }
  },
  methods: {}
}
</script>

<style scoped>
.paySuccess {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.paySuccess .find-box {
  width: 100%;
  box-sizing: border-box;
  height: 91px;
  border-radius: 9px;
  border:1px solid #ccc;
  padding:5px 0 8px 15px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color:#101010;
}
.paySuccess .find-box .tit {
  line-height: 20px;
  font-weight: bold;
}
.paySuccess .find-box .spanName {
  color: #5bacff;
  display: flex;
  align-items: center;
  margin-top: 7px;
}
.paySuccess .find-box .spanName .name {
    color: #847C7C;
}
.paySuccess .find-box .spanName .way {
    color: #C8C5C5;
    font-size: 12px;
}
.paySuccess .find-box .spanName .iconfont {
  font-size: 19px;
  margin-right: 10px;
}
.paySuccess .find-title {
  color:#101010;
  font-size: 16px;
  font-weight: bold;
  width: 100%;
  padding-left: 15px;
  box-sizing: border-box;
  line-height: 24px;
  margin-top: 7px;
}
.paySuccess .medicine-box {
  margin-top: 7px;
  margin-bottom: 7px;
  width: 100%;
  padding:0 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.paySuccess .medicine-box .medicine {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.paySuccess .medicine-box .medicine .img {
  width: 46px;
  height: 46px;
  margin-right: 5px;
}
.paySuccess .medicine-box .medicine .name {
  color:#101010;
  font-size: 14px;
  line-height: 20px;
}
.paySuccess .give-Medicine {
    width: 100%;
    text-align: center;
    line-height: 29px;
    height: 29px;
    font-size: 18px;
    font-weight: bold;
    color:#fff;
    background: #5bacff;
}
.paySuccess .share-box {
    margin-top: 31px;
    width: 244px;
    height: 203px;
    background: #5bacff;
    border-radius: 5px;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 14px;
}
.paySuccess .share-box .info {
    background: #fff;
    color:#101010;
    border:1px solid #ccc;
    line-height: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    width: 205px;
    height: 100px;
    border-radius: 5px;
}
.paySuccess .share-box .info .bold {
    font-weight: bold;
}
.paySuccess .share-box .give {
    margin-top: 15px;
    width: 181px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color:#101010;
    background: #F7D705;
    border-radius: 5px;
}
.paySuccess .share-box .has {
    margin-top: 14px;
    line-height: 20px;
    color:#fff;
}
</style>
