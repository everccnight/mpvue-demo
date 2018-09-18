
<template>
  <div class="personShare">
    <div class="title">
     你的好友【{{user.name}}】推荐
    </div>
    <div class="intitle">万能找药</div>
    <div class="help-box">
        <img :src="user.avatar" class='avatar'>
        <div class="info-box">
            <span>{{pharmacist.address}}</span>
            <span>
                <span class='names'>{{pharmacist.name}}</span>
                成功找药{{pharmacist.times}}次 成功率{{pharmacist.percnet}}%</span>
            <span>最快{{pharmacist.fast}}分钟找药成功！</span>
            <span>结交一下，以备不时之需！</span>
        </div>
    </div>
    <div class="help-btn" @click='tohelp'>
       <span class='helper'>结交万能找药 {{pharmacist.name}}</span>
       <span>平日问药 急时找药 常备重要</span>
    </div>
    <div class="btn-group">
        <div class="btn index-btn" @click='toIndex'>
            万能找药
        </div>
        <div class="btn other-btn">
            我是药神
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        name: 'aaa',
        avatar: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=759961887,190875110&fm=27&gp=0.jpg',
        help: 5
      },
      pharmacist: {
        name: '黄药师',
        address: '北京 大参林大药房（学清路店）',
        percnet: 99,
        times: 42,
        fast: 7
      }
    }
  },
  methods: {
    tohelp () {},
    toIndex () {
      const url = '../index/main'
      wx.switchTab({ url })
    }
  }
}
</script>

<style scoped>
.personShare {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #7285f3;
}
.personShare .title {
  font-size: 20px;
  color: #fff;
  margin-top: 50px;
}
.personShare .intitle{
  font-size: 20px;
  color: #fff;
  margin-top: 5px;
  margin-bottom: 24px;
}
.personShare .title .name {
    font-weight: bold;
}
.personShare .help-box {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.personShare .help-box .avatar {
    width: 62px;
    height: 62px;
    border-radius: 50%;
    z-index:50;
    position: relative;
}
.personShare .help-box .info-box{
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
.personShare .help-box .info-box .names {
    color: red;
}
.personShare .help-btn {
    width: 275px;
    height: 80px;
    font-size: 14px;
    background: #FF9800;
    color:#101010;
    margin-top: 26px;
    border-radius: 4px;
    border:1px solid #ccc;
    margin-bottom: 90px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}
.personShare .help-btn .helper {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 10px;
}
.personShare .btn-group {
    width: 275px;
    height: 36px;
    display: flex;
    justify-content: space-between;
}
.personShare .btn-group .btn {
    font-size: 16px;
    font-weight: bold;
    width: 123px;
    height: 36px;
    text-align: center;
    line-height: 36px;
    color:#fff;
    background: #268be5;
    border-radius: 4px;
    border:1px solid #268be5;
}
.personShare .btn-group .other-btn {
    background:#fff;
    color: #268be5;
    border:1px solid #fff;
}
</style>
 