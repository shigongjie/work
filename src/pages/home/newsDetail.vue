<template>
  <div class="no-slider">
    <div class="container">
      <div class="sec-hd">
        <p class="head to-back" @click="$router.go(-1)">
          <i class="el-icon-refresh-left"></i>
          返回上一级
        </p>
        <div>发布时间：{{new Date(data.publishTime).getTime() | datetimeFormat('yyyy-MM-dd hh:mm')}}</div>
      </div>
      <div class="title">{{data.title}}</div>
      <div class="subTitle">{{data.summary}}</div>
      <!--      <b-img :src="data.indexImageUrl"></b-img>-->
      <div class="detail" v-html="data.content"></div>
      <div class="detail-bottom" v-if="data.attachmentJa &&data.attachmentJa.length >0">
        <p>点击下载>>></p>
        <p
          :title="item.fileName"
          @click="downNews(item.url)"
          class="down-item"
          v-for="(item,index) in data.attachmentJa"
          :key="index"
        >{{item.fileName}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "newsDetail",
  data() {
    return {
      data: {}
    };
  },
  mounted() {
    this.getNews();
  },
  methods: {
    downNews(url) {
      window.open(url);
    },
    async getNews() {
      const d = await this.post(this.$api.home.getNews, {
        id: this.$route.query.id
      });
      if (d.code === 0) {
        this.data = d.data;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.no-slider {
}
.container {
  width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}
.title {
  font-size: 34px;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 500;
}
.subTitle {
  line-height: 28px;
  font-size: 14px;
  color: #999;
  margin-bottom: 15px;
  text-align: center;
}
img {
  width: 100%;
  margin-bottom: 15px;
}
.detail {
  line-height: 28px;
  font-size: 16px;
}
.detail-bottom {
  margin: 50px 0;
  font-size: 18px;
}
.down-item {
  color: #007be9;
  cursor: pointer;
  font-size: 18px;
  margin: 7px 0;
}
.sec-hd {
  padding: 30px 0 20px;
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  border-bottom: 1px dashed #ddd;
  color: #999;
}
.to-back {
  color: #ffa000;
  display: flex;
  align-items: center;
}
.head {
  color: #409eff;
  cursor: pointer;
}
</style>
