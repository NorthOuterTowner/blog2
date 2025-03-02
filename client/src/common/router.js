import {createRouter,createWebHashHistory} from "vue-router"

let routes = [
    {path:"/",component:()=>import("../views/start.vue")},
    {path:"/homepage",component:()=>import("../views/HomePage.vue")},
    {path:"/test",component : ()=>import("../views/Test.vue")},
    {path:"/login",component :()=>import("../views/Login.vue")},
    {path:"/dashboard",component :()=>import("../views/dashboard/DashBoard.vue"),
        children:[
            {path:"/dashboard/category",component:()=>import("../views/dashboard/Category.vue")},
            {path:"/dashboard/article",component:()=>import("../views/dashboard/Article.vue")}
        ]
    },
    {path:"/detail",component:()=>import("../views/Detail.vue")}
];

const router = createRouter({
    history:createWebHashHistory(),
    routes,
})

export { router,routes }