import axios from "axios"
import qs from "qs"
import Vue from "vue"
import store from "../store"
import {warningAlert} from "./alert"
import router from "../router"

// 开发环境下使用
Vue.prototype.$imgPre="http://localhost:3000"
let baseUrl = "/api";

// 打包
// Vue.prototype.$imgPre=""
// let baseUrl = "";



// 请求拦截，后台app.js后端登录拦截打开
axios.interceptors.request.use(req=>{
    // console.log("---请求拦截----");
    // console.log(req);
    if(req.url!=baseUrl+"/api/userlogin"){
        req.headers.authorization=store.state.userInfo.token;
    }
    return req;
})

// 响应拦截
axios.interceptors.response.use(res => {
    console.group("=====本次请求路径是:" + res.config.url)
    console.log(res);
    console.groupEnd()

    // 测试
    // if(res.config.url==baseUrl+"/api/menulist"){
    //     res.data.msg="登录已过期或访问权限受限"
    // }

    //用户掉线了
    if(res.data.msg=='登录已过期或访问权限受限'){
        warningAlert(res.data.msg)
        router.push("/login")
    }
    return res;
})

// 添加
export const reqMenuAdd = (params) => {
    return axios({
        url: baseUrl + "/api/menuadd",
        method: "post",
        data: qs.stringify(params)
    })
}


// 列表
export const reqMenuList = () => {
    return axios({
        url: baseUrl + "/api/menulist",
        methods: "get",
        params: {
            istree: true
        }

    })
}
// 删除

export const reqMenuDel = (id) => {
    return axios({
        url: baseUrl + "/api/menudelete",
        method: "post",
        data: qs.stringify({
            id: id,
        })
    })
}
//1条
export const reqMenuDetail = (id) => {
    return axios({
        url: baseUrl + "/api/menuinfo",
        method: "get",
        params: {
            id: id
        }
    })
}
//修改
export const reqMenuUpdate = (params) => {
    return axios({
        url: baseUrl + "/api/menuedit",
        method: "post",
        data: qs.stringify(params)
    })
}
// ***************角色管理************
// 添加
export const reqRoleAdd = (params) => {
    return axios({
        url: baseUrl + "/api/roleadd",
        method: "post",
        data: qs.stringify(params)
    })
}
// 请求列表
export const reqRoleList = () => {
    return axios({
        url: baseUrl + "/api/rolelist",
    })
}
// 删除
export const reqRoleDel = (id) => {
    return axios({
        url: baseUrl + "/api/roledelete",
        method: "post",
        data: {
            id: id
        }
    })
}
// 获取一条角色数据
export const reqRoleInfo = (id) => {
    return axios({
        url: baseUrl + "/api/roleinfo",
        method: "get",
        params: {
            id: id
        }
    })
}
// 修改
export const reqRoleUpdate = (params) => {
    return axios({
        url: baseUrl + "/api/roleedit",
        method: "post",
        data: qs.stringify(params)
    })
}
// ***************管理员管理************
//添加
export const reqManageAdd = (params) => {
    return axios({
        url: baseUrl + "/api/useradd",
        method: "post",
        data: qs.stringify(params)
    })
}
//列表 params={page:1,size:10}
export const reqManageList = (params) => {
    return axios({
        url: baseUrl + "/api/userlist",
        method: "get",
        params: params
    })
}
//管理员总数
export const reqManageCount = () => {
    return axios({
        url: baseUrl + "/api/usercount",
    })
}
//删除
export const reqManageDel=(uid)=>{
    return axios({
        url:baseUrl+"/api/userdelete",
        method:"post",
        data:qs.stringify({uid:uid})
    })
}
//1条
export const reqManageDetail=(uid)=>{
    return axios({
        url:baseUrl+"/api/userinfo",
        method:"get",
        params:{
            uid:uid
        }
    })
}
//修改
export const reqManageUpdate=(params)=>{
    return axios({
        url:baseUrl+"/api/useredit",
        method:"post",
        data:qs.stringify(params)
    })
}
// 管理员登录
export const reqManageLogin=(params)=>{
    return axios({
        url:baseUrl+"/api/userlogin",
        method:"post",
        data:qs.stringify(params)
    })
}
// ***************商品分类管理************
// 添加
export const reqCateAdd=(params)=>{
    let data=new FormData()
    for(let i in params){
        data.append(i,params[i])
    }
    return axios({
        url:baseUrl+"/api/cateadd",
        method:"post",
        data:data
    })
}
// 列表 params={istree:true}  
export const reqCateList=(params)=>{
    
    return axios({
        url:baseUrl+"/api/catelist",
        method:"get",
        params:params
    })
}
// 删除
export const reqCateDel=(id)=>{
    return axios({
        url:baseUrl+"/api/catedelete",
        method:"post",
        data:{
            id:id
        }
    })
}
// 1条
export const reqCateDetail=(id)=>{
    return axios({
        url:baseUrl+"/api/cateinfo",
        method:"get",
        params:{
            id:id
        }
    })
}
// 修改
export const reqCateUpdate=(params)=>{
    let data=new FormData()
    for(let i in params){
        data.append(i,params[i])
    }
    return axios({
        url:baseUrl+"/api/cateedit",
        method:"post",
        data:data
    })
}
/*********商品规格管理***************/
//添加
export const reqSpecsAdd = (params) => {
    return axios({
        url: baseUrl + "/api/specsadd",
        method: "post",
        data: qs.stringify(params)
    })
}
export const reqSpecsCount = () => {
    return axios({
        url: baseUrl + "/api/specscount",
    })
}
// 列表 params={page:1,size:10} 
export const reqSpecsList=(params)=>{
    return axios({
        url:baseUrl+"/api/specslist",
        method:"get",
        params:params
    })
}
// 删除
export const reqSpecsDel=(id)=>{
    return axios({
        url:baseUrl+"/api/specsdelete",
        method:"post",
        data:{ id: id }
    })
}
//1条
export const reqSpecsDetail = (id) => {
    return axios({
        url: baseUrl + "/api/specsinfo",
        method: "get",
        params: {
            id: id
        }
    })
}

//修改
export const reqSpecsUpdate = (params) => {
    return axios({
        url: baseUrl + "/api/specsedit",
        method: "post",
        data: qs.stringify(params)
    })
}
/*==========商品管理=================*/
// 添加
export const reqGoodsAdd = (form) => {
    let data= new FormData()
    for(let i in form){
        data.append(i,form[i])
    }
    return axios({
        url: baseUrl + "/api/goodsadd",
        method: "post",
        data: data
    })
}
// 总数
export const reqGoodsCount = () => {
    return axios({
        url: baseUrl + "/api/goodscount",
    })
}
// 列表
export const reqGoodsList = (params) => {
    return axios({
        url: baseUrl + "/api/goodslist",
        method: "get",
        params: params
    })
}
// 一条
export const reqGoodsDetail = (id) => {
    return axios({
        url: baseUrl + "/api/goodsinfo",
        method: "get",
        params: {
            id:id
        }
    })
}
// 修改
export const reqGoodsUpdate = (form) => {
    let data=new FormData;
    for(let i in form){
        data.append(i,form[i])
    }
    return axios({
        url: baseUrl + "/api/goodsedit",
        method: "post",
        data: data
    })
}
// 删除
export const reqGoodsDel = (id) => {
    return axios({
        url: baseUrl + "/api/goodsdelete",
        method: "post",
        data: {
            id:id
        }
    })
}
// ***************轮播管理************
// 添加title,img文件，status
export const reqBannerAdd = (form) => {
    let data=new FormData;
    for(let i in form){
        data.append(i,form[i])
    }
    return axios({
        url: baseUrl + "/api/banneradd",
        method: "post",
        data: data
    })
}
// 请求列表
export const reqBannerList = () => {
    return axios({
        url: baseUrl + "/api/bannerlist",
    })
}
// 获取一条角色数据
export const reqBannerInfo = (id) => {
    return axios({
        url: baseUrl + "/api/bannerinfo",
        method: "get",
        params: {
            id: id
        }
    })
}
// 删除
export const reqBannerDel = (id) => {
    console.log(id);
    return axios({
        url: baseUrl + "/api/bannerdelete",
        method: "post",
        data: {
            id: id
        }
    })
}

// 修改
export const reqBannerUpdate = (form) => {
    let data=new FormData;
    for(let i in form){
        data.append(i,form[i])
    }
    return axios({
        url: baseUrl + "/api/banneredit",
        method: "post",
        data: data
    })
}
// ==========会员管理==============
// 请求列表
export const reqMemberList = () => {
    return axios({
        url: baseUrl + "/api/memberlist",
    })
}
// 获取一条角色数据
export const reqMemberInfo = (uid) => {
    return axios({
        url: baseUrl + "/api/memberinfo",
        method: "get",
        params: {
            uid: uid
        }
    })
}

// 修改
export const reqMemberUpdate = (data) => {
    return axios({
        url: baseUrl + "/api/memberedit",
        method: "post",
        data: data
    })
}
// ==============秒杀=====================
// 添加
export const reqSeckAdd = (data) => {
    return axios({
        url: baseUrl + "/api/seckadd",
        method: "post",
        data: data
    })
}
// 请求列表
export const reqSeckList = () => {
    return axios({
        url: baseUrl + "/api/secklist",
    })
}
// 获取一条角色数据
export const reqSeckInfo = (id) => {
    return axios({
        url: baseUrl + "/api/seckinfo",
        method: "get",
        params: {
            id: id
        }
    })
}
// 删除
export const reqSeckDel = (id) => {
    console.log(id);
    return axios({
        url: baseUrl + "/api/seckdelete",
        method: "post",
        data: {
            id: id
        }
    })
}

// 修改
export const reqSeckUpdate = (data) => {
    return axios({
        url: baseUrl + "/api/seckedit",
        method: "post",
        data: data
    })
}