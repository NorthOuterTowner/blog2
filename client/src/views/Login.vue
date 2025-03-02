<template>
    <div class="login-panel">
        <n-card title="管理后台登录">
            <n-form :rules="rules" :model="admin">
                <n-form-item path="account" label="账号">
                    <n-input v-model:value="admin.account" placeholder="请输入账号" size="large"></n-input>
                </n-form-item>
                <n-form-item path="password" label="密码">
                    <n-input v-model:value="admin.password" placeholder="请输入密码" size="large"></n-input>
                </n-form-item>
            </n-form>
            <template #footer>
                <n-checkbox v-model:checked="admin.rember" label="记住我"></n-checkbox>
                <n-button @click="login">登录</n-button>
            </template>
        </n-card>
    </div>
</template>

<script setup>
import { AdminStore } from '../stores/AdminStore';
import {ref,reactive,inject} from 'vue'
import { defineComponent } from 'vue'
import { useRouter,useRoute } from 'vue-router';

/** Here:依赖注入 */
const axios = inject("axios");
const adminStore=AdminStore();
const message = inject("message");

const router = useRouter();
const route = useRoute();

let rules = {
    account:[
    {required:true,message:"请输入账号",trigger:"blur"},
    {min:3,max:12,message:"账号长度在3-12",trigger:"blur"},
    ],
    password:[
        {required:true,message:"请输入密码",trigger:"blur"},
        {min:6,max:18,message:"密码长度在6-18",trigger:"blur"},
    ]
};

const admin = reactive({
    account:localStorage.getItem("account")||"",
    password:localStorage.getItem("password")||"",
    rember:localStorage.getItem("rember") == 1
});

const login = async ()=>{
    //console.log(admin);
    let result = await axios.post("/admin/login",{
        account:admin.account,
        password:admin.password,
    });
    if(result.data.code == 200){
        /**Record current ID certification in admin store*/
        adminStore.token = result.data.data.token;
        adminStore.account = result.data.data.account;
        adminStore.id = result.data.data.id;

        /**Use local storage to store info in browser */
        if(admin.rember){
            localStorage.setItem("account",admin.account);
            localStorage.setItem("password",admin.password);
            localStorage.setItem("rember",admin.rember?1:0);
        }
        router.push("/dashboard");
        message.info("Success");
    }else{
        message.error("error");
    }
    console.log(result);
}
</script>

<style lang="scss" scoped>
.login-panel{
    width: 500px;
    margin: 0 auto;
    margin-top: 130px;
}
</style>