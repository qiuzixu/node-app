import axios from 'axios';
import { Message,Loading } from 'element-ui';
import router from './router/index'
let loading ;
function startLoading(){
    loading = Loading.service({
        lock:true,
        text:"拼命加载中...",
        background:'rgba(0,0,0,0,7)'
    })//(options);//options自己设置的一个对象
    return loading;
}
// console.log(loading);

function endLoading(){
    loading.close();
    // console.log(loading);
}
//请求拦截
axios.interceptors.request.use(
    config =>{
    //加载动画
    startLoading();

    if(localStorage.eleToken){
        //设置统一的请求header
        config.headers.Authorization = localStorage.eleToken;
    }
    return config;
},
    error =>{
        return Promise.reject(error)
    });


//响应拦截
axios.interceptors.request.use(response =>{
    //结束加载动画
    endLoading();
    return response;
}, error =>{
    //错误提醒
    endLoading();
    Message.error(error.response.data);

    //获取错误状态码
    const { status } = error.response;
    if(status == 401 ){
        Message.error('Token失效，请重新登录！');
        //清除token
        localStorage.removeItem('eleToken');
        //跳转到登录页面
        router.push('/login');
    }
    return Promise.reject(error);
})

export default axios;
