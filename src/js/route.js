import vue from 'vue';
import vueRouter from 'vue-router';
import login from "../component/login";
import chat from "../component/chat";

vue.use(vueRouter)
var router = new vueRouter({
   //history: true,
   // hashbang:false
})

router.map({
    '/':{
        name:'index',
        component:login
    },
    '/signin': {
    	name: 'login', 
        component: login
    },
     '/chat': {
     	name :'chat',
        component: chat
    },
})

export { router }
