<template>
  <div class="feedbackd">
     <div class="info">{{detail.info}}</div>
     <img :src="detail.img" class='img' v-if="img !== ''">
     <div class="btn">返回</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      detail: {
        info: '我要找格列卫，为啥一直找不到,我要找格列卫，为啥一直找不到,我要找格列卫，为啥一直找不到我要找格列卫，为啥一直找不到,我要找格列卫，为啥一直找不到,我要找格列卫，为啥一直找不到',
        img: ''
      }
    }
  },
  methods: {}
}
</script>

<style scoped>
.feedbackd {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.feedbackd .info {
    font-size: 14px;
    color:#0D0C0C;
    text-indent: 28px;
    margin-top: 10px;
    line-height: 20px;
}
.feedbackd .img {
  margin-top: 18px;
  width: 100px;
  height: 100px;
}
.feedbackd .btn {
  margin-top: 20px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 10px;
  width: calc(100% - 30px);
  background: #268be5;
  color:#fff;
}
</style>
