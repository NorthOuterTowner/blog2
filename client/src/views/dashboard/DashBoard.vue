<template>
    <div class="main-panel">
        <div class="menus">
            <div v-for="(menu,index) in menus" @click="toPage(menu)" style="min-width: 200px;">
                {{ menu.name }}
            </div>
        </div>
        <!--二级路由-->
        <div style="padding: 20px;">
            <router-view></router-view>
        </div>
        <div class="title">后台管理系统</div>
    </div>
</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore';
import {ref,reactive,inject} from 'vue'
import { defineComponent } from 'vue'
import { useRouter,useRoute } from 'vue-router';

/** Here:依赖注入 */
const axios = inject("axios");
const adminStore=AdminStore();
const message = inject("message");

const router = useRouter();
const route = useRoute();

let menus=[
    {name:"文章管理",href:"/dashboard/article"},
    {name:"分类管理",href:"/dashboard/category"},
    {name:"退出",href:"logout"},
];
router.push("/dashboard/article");
function toPage(menu){
    if(menu.href == 'logout'){
        router.push("/login");
    }else{
        router.push(menu.href);
    }
}
</script>

<style lang="scss" scoped>
.main-panel{
    display: flex;
    color: #64676a;
    max-width: 1500px;
    margin: 0 auto;
}
.menus{
    padding: 20px 0;
    box-sizing: border-box;
    line-height: 55px;
    text-align: center;
    width: 180px;
    height: 95vh;
    border-right:1px solid #dadada;
    
    div{
        cursor: pointer;
        &:hover{
            color: #fd760e;
        }
    }
}
.title{
    font-size: 65px;
    font-weight: bold;
    text-align: fixed;
    position: fixed;
    color: rgba(0,0,0,20%);
    right:calc((100vw - 1450px) / 2);
    bottom: 20px;
}
</style>