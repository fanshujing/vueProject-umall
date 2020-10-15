import {reqMenuList} from "../../utils/request"
const state={
// 菜单的list
list:[]
}
const mutations={
    changeList(state,arr){
        state.list=arr;
    }
}
const actions={
    reqListAction(context){
        reqMenuList().then(res=>{
            context.commit("changeList",res.data.list);
            console.log(context.state.list);
        })
    }
}
const getters={
    list(state){
        return state.list;
    }
}
export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true

}