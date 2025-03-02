<template>
    <div class="container">
        <!-- 返回按钮 -->
        <n-button type="primary" @click="toHome" class="back-button">返回</n-button>
        
        <!-- 标题 -->
        <n-h1 class="blog-title">{{ blogInfo.title }}</n-h1>

        <!-- 内容详情 -->
        <div class="blog-content" v-html="blogInfo.content"></div>
        <n-space align="center">
            <div class = "footer">
                <div>发布时间:{{ blogInfo.create_time }}</div>
                <div>更新时间:{{ blogInfo.update_time }}</div>
            </div>
        </n-space>
    </div>
</template>

<script setup>
import { ref, onMounted ,inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const axios = inject("axios");
const blogInfo = ref({});

onMounted(() => {
    loadBlog();
});

const toHome = () => {
    router.push("/homepage");
};

const loadBlog = async () => {
    const res = await axios.get("/blog/detail?id=" + route.query.id);
    blogInfo.value = res.data.rows[0];
    let d = new Date(blogInfo.value.create_time);
    blogInfo.value.create_time = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日${d.getHours()}:${d.getMinutes()}`;
    console.log("time"+blogInfo.value.update_time);
    if(blogInfo.value.update_time!=null){
        console.log("right");
        d=new Date(blogInfo.value.update_time);
    }
    blogInfo.value.update_time = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日${d.getHours()}:${d.getMinutes()}`;
};
</script>

<style>
/* 全局样式 */
.blog-content img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 16px 0;
}

.blog-content p {
    line-height: 1.8;
    font-size: 16px;
    color: #333;
    margin-bottom: 16px;
}

.blog-content h2,
.blog-content h3 {
    margin-top: 24px;
    margin-bottom: 16px;
    color: #2c3e50;
}

.blog-content a {
    color: #3498db;
    text-decoration: none;
}

.blog-content a:hover {
    text-decoration: underline;
}
</style>

<style lang="scss" scoped>
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
    box-sizing: border-box;
}

.back-button {
    margin-bottom: 24px;
}

.blog-title {
    font-size: 32px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 24px;
    text-align: center;
}

.blog-content {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    line-height: 1.8;
    font-size: 16px;
    color: #333;
}

.footer{
    margin-top: 10px;
    div{
        margin: 10px;
    }
}
</style>