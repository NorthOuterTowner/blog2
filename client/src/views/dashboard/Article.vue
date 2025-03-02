<template>
    <n-tabs v-model:value="tabValue" type="line" animated size="large" justify-content="start" :bar-width="100">
        <n-tab-pane name="list" tab="文章列表">
            <div v-for="(blog,index) in blogListInfo" :key="index">
                <n-card :title="blog.title" size="huge" style="min-width: 80%;">
                    {{ contentShow[index] }}
                    <template #footer>
                        <n-space align="center">
                            <div>发布时间:{{ blog.create_time }}</div>
                            <n-button @click="toUpdate(blog)">修改</n-button>
                            <n-button @click="toDelete(blog)">删除</n-button>
                        </n-space>
                    </template>
                </n-card>
            </div>
            <n-space style="margin-top: 20px;">
                <n-pagination v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" size="large"/>
                <span style="font-size: 20px;">每页数量：</span><n-input-number v-model:value="pageInfo.pageSize" type="text" placeholder="5" />
            </n-space>
        </n-tab-pane>
        <n-tab-pane name="add" tab="添加文章">
            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="addArticle.title" placeholder="请输入标题" size="large"></n-input>
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="addArticle.category_id" :options="categoryOptions" />
                </n-form-item>
                <n-form-item label="内容" style="max-width: 80%;">
                    <RichTextEditor v-model="addArticle.content"></RichTextEditor>
                </n-form-item>
                <n-form-item label="">
                    <n-button @click="add">提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>
        <n-tab-pane name="update" tab="修改">
            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="updateArticle.title" placeholder="请输入标题" size="large"></n-input>
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="updateArticle.category_id" :options="categoryOptions" />
                </n-form-item>
                <n-form-item label="内容" style="max-width: 80%;">
                    <RichTextEditor v-model="updateArticle.content"></RichTextEditor>
                </n-form-item>
                <n-form-item label="">
                    <n-button @click="update">提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>
    </n-tabs>
    
</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore';
import {ref,reactive,inject,onMounted,onBeforeMount,watch} from 'vue'
import { defineComponent } from 'vue'
import { useRouter,useRoute } from 'vue-router';
import RichTextEditor from '../../components/RichTextEditor.vue';

/** Here:依赖注入 */
const axios = inject("axios");
const adminStore=AdminStore();
const message = inject("message");
const dialog = inject("dialog");

const tabValue = ref("list");
/**Used when the web of showing blogs */
const addArticle = reactive({
    category_id:0,
    title:"",
    content:"",
});

/**Used when user change their blog */
const updateArticle = reactive({
    id:0,
    category_id:0,
    title:"",
    content:"",
});

const categoryOptions = ref([]);
const blogListInfo = ref([]);

const pageInfo = reactive({
    page:1,
    pageSize:5,
    pageCount:0,
    count:0,
})
onMounted(()=>{
    loadBlogs();
    loadCategories();
});
const contentShow = ref([]);
const loadBlogs = async ()=>{
    let res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`);
    blogListInfo.value = res.data.data.rows;
    for(let index = 0 ; index < blogListInfo.value.length ; index++){
        let d = new Date(blogListInfo.value[index].create_time);
        blogListInfo.value[index].create_time = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日${d.getHours()}:${d.getMinutes()}`;
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

const loadCategories = async ()=>{
    let res= await axios.get("/category/list");
    categoryOptions.value = res.data.rows.map((item)=>{
        return {
            label:item.name,
            value:item.id
        };
    });
}
const add = async ()=>{
    let res = await axios.post("/blog/_token/add",addArticle);
    if(res.data.code==200){
        message.info(res.data.msg);
        addArticle.title="";
        addArticle.content="";
    }else{
        message.error(res.data.msg);
    }
}

const toUpdate = (blog)=>{
    tabValue.value = "update";
    updateArticle.id = blog.id;
    updateArticle.title = blog.title;
    updateArticle.content = blog.content;
    updateArticle.category_id = blog.category_id;
    
}

const update = async ()=>{
    let res = await axios.put("/blog/_token/update",updateArticle);
    if(res.data.code==200){
        message.info(res.data.msg);
        tabValue.value = "list";
        loadBlogs();
    }else{
        message.error(res.data.msg);
    }
}

const toDelete = async(blog)=>{
    dialog.warning({
        title:"提示",
        content:"确定删除？",
        positiveText:"确定",
        negativeText:"取消",
        onPositiveClick:async ()=>{
            let res = await axios.delete(`/blog/_token/delete?id=${blog.id}`);
            if(res.data.code == 200){
                loadBlogs();
                message.info(res.data.msg);
            }else{
                message.error(res.data.msg);
            }
        },
        onNegativeClick:()=>{
            message.error("取消");
        }
    });
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
)
</script>

<style lang="scss" scoped>

</style>