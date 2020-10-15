export const actions={
    // 组件触发修改userInfo
    changeUserInfoAction(context,info){
        console.log(2);
        context.commit("changeUserInfo",info)
    }
}