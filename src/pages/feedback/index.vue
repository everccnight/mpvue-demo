<template>
  <div class="feedback">
    <div class="tab">
        <span :class="{ actived: Active === 1 }" @click='BeActive(1)'>提反馈</span>
        <span :class="{ actived: Active === 2 }" @click='BeActive(2)'>我的反馈</span>
    </div>
    <div class="listbox" v-if='Active === 1'>
      <textarea placeholder="您的建议与反馈是我们前进的动力" name="textarea" class='textarea' v-model='give' maxlength='300'/>
      <div class="addImg" @click='chooseImg' v-if='chooseInfo'>
        <i class="iconfont">&#xe6a4;</i>
      </div>
      <img class="Imgs" :src="imgSrc" v-if='!chooseInfo' @click='chooseImg'>
      <div class="btn">发送</div>
    </div>
    <div class="listbox" v-if='Active === 2'>
      <div class="list" v-for='(item,index) in list' :key='index' @click='toFeedBackDetail'>
        <span class='title'>{{item.title}}</span>
        <span class='Time-type-box'>
          <span class='time'>{{item.time}}</span>
          <span class="type">{{item.type}}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      Active: 1,
      give: '',
      chooseInfo: true,
      imgSrc: '',
      list: [
        {
          title: '我要找格列卫，为啥一直找不到',
          time: '2018年9月1日 00:38',
          type: '未处理'
        },
        {
          title: '我要找格列卫，为啥一直找不到',
          time: '2018年9月1日 00:38',
          type: '未处理'
        },
        {
          title: '我要找格列卫，为啥一直找不到',
          time: '2018年9月1日 00:38',
          type: '未处理'
        },
        {
          title: '我要找格列卫，为啥一直找不到',
          time: '2018年9月1日 00:38',
          type: '未处理'
        },
        {
          title: '我要找格列卫，为啥一直找不到',
          time: '2018年9月1日 00:38',
          type: '未处理'
        }
      ]
    }
  },
  methods: {
    BeActive (val) {
      this.Active = val
    },
    toFeedBackDetail () {
      const url = '../feedbackd/main'
      wx.navigateTo({ url })
    },
    chooseImg () {
      var that = this
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.imgSrc = res.tempFilePaths
          that.chooseInfo = false
        }
      })
    }
  }
}
</script>

<style scoped>
.feedback {
  width:100%;
  height: 100%;
  overflow: hidden;
}
.feedback .tab {
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 16px;
  color:#0D0C0C;
  border-bottom: 1px solid #ccc;
}
.feedback .actived {
  color:#268be5;
}
.feedback .listbox {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.feedback .listbox .textarea {
  height: 94px;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 2px solid #ccc;
  color:#847C7C;
  font-size: 14px;
}
.feedback .listbox .addImg {
  margin-top: 18px;
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
.feedback .listbox .Imgs {
  margin-top: 18px;
  width: 100px;
  height: 100px;
}
.feedback .listbox .btn {
  margin-top: 20px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 10px;
  width: calc(100% - 30px);
  background: #268be5;
  color:#fff;
}
.feedback .listbox .list {
  height: 61px;
  width: 100%;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding:0 9px 0 15px;
  box-sizing: border-box;
  font-size:14px;
  color:#0D0C0C;
}
.feedback .listbox .list .Time-type-box {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}
.feedback .listbox .list .Time-type-box .time {
  color:#847C7C;
}
</style>
