<template>
    <div class="container">
        <div class="nav">
            <div @click="homePage">首页</div>
            <div>
                <n-popselect @update:value="searchByCategory" v-model:value="selectCategory" :options="categoryOptions" trigger="click">
                    <div>
                        分类
                        <span style="color:blue;font-size: 15px;" >
                            {{ categoryName }}
                        </span>
                    </div>
                </n-popselect>
            </div>
            <div @click="dashboard">后台</div>
        </div>
        <n-divider />
        
        <n-space class="search">
            <n-input v-model:value="pageInfo.keyword" :style="{width:'500px'}" placeholder="请输入关键词" />
            <n-button type="primary" ghost @click="loadBlogs">搜索</n-button>
        </n-space>

        <div v-for="(blog,index) in blogListInfo" :key="index">
                <n-card :title="blog.title" @click="toDetail(blog)" size="huge" style="min-width: 80%; cursor:pointer">
                    {{ contentShow[index] }}
                    <template #footer>
                        <n-space align="center">
                            <div>发布时间:{{ blog.create_time }}</div>
                            <div>更新时间:{{ blog.update_time }}</div>
                        </n-space>
                    </template>
                </n-card>
        </div>
        <n-space style="margin-top: 20px;">
                <n-pagination v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" size="large"/>
                <span style="font-size: 20px;">每页数量：</span><n-input-number v-model:value="pageInfo.pageSize" type="text" placeholder="5" />
            </n-space>

        <n-divider />
        <div class="footer">
            <div>Powerd by il</div>
        </div>
    </div>
</template>

<script setup>
import { AdminStore } from '../stores/AdminStore';
import {ref,reactive,inject,onMounted,computed,watch} from 'vue'
import { defineComponent } from 'vue'
import { useRouter,useRoute } from 'vue-router';
import Category from './dashboard/Category.vue';

const axios = inject("axios");
const adminStore=AdminStore();
const message = inject("message");
const dialog = inject("dialog");

const router = useRouter();
const route = useRoute();

const selectCategory = ref(0);
const categoryOptions = ref([]);

onMounted(()=>{
    loadCategories();
    loadBlogs();
});

const loadCategories = async ()=>{
    let res= await axios.get("/category/list");
    categoryOptions.value = res.data.rows.map((item)=>{
        return {
            label:item.name,
            value:item.id,
        };
    });
    categoryOptions.value.push({ label: "无", value: 0 });
}

const homePage = ()=>{
    router.push("/homepage");
}

const dashboard = ()=>{
    router.push("/login");
}

const categoryName = computed(()=>{
    let selectedOption=categoryOptions.value.find((option)=>{
        return option.value == selectCategory.value;
    });
    return selectedOption ? ('('+selectedOption.label+')') : "";
});

const blogListInfo = ref([]);

const pageInfo = reactive({
    page:1,
    pageSize:5,
    pageCount:0,
    count:0,
    keyword:"",
    category_id:0
})

const contentShow = ref([]);
const loadBlogs = async ()=>{
    let res = await axios.get(`/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&category_id=${pageInfo.category_id}`);
    blogListInfo.value = res.data.data.rows;
    for(let index = 0 ; index < blogListInfo.value.length ; index++){
        let d = new Date(blogListInfo.value[index].create_time);
        blogListInfo.value[index].create_time = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日${d.getHours()}:${d.getMinutes()}`;
        d = new Date(blogListInfo.value[index].update_time);
        blogListInfo.value[index].update_time = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日${d.getHours()}:${d.getMinutes()}`;
        if(blogListInfo.value[index].content.length>100){
            contentShow.value[index] = blogListInfo.value[index].content.substring(0,100)+"...";
        }else{
            contentShow.value[index] = blogListInfo.value[index].content;
        }
        console.log(contentShow.value[index]);
    }
    pageInfo.count = res.data.data.count;
    pageInfo.pageCount =parseInt( pageInfo.count / pageInfo.pageSize )+ (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0);
}

const toDetail=(blog)=>{
    router.push({path:"/detail",query:{id:blog.id}});
}

const searchByCategory=(category_id)=>{
    pageInfo.category_id = category_id;
    loadBlogs();
}

watch(
    () => pageInfo.page,
    async(newPage, oldPage) => {
        loadBlogs();
    }
);
watch(
    () => pageInfo.pageSize,
    async (newPage,oldPage) =>{
        loadBlogs();
    }
);


</script>

<style lang="scss" scoped>
.container {
    width: 1200px;
    margin: 0 auto;
}
.nav{
    display: flex;
    font-size: 20px;
    padding-top: 20px;
    color: #64676a;
    div{
        cursor: pointer ;
        margin-right: 15px;

        &:hover{
            color: #f60;
        }
    }
}

.footer{
    text-align: right;
    line-height: 25px;
    color: gray;
}

.search {
    margin-bottom: 15px;
}
</style>