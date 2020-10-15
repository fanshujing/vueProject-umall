<template>
  <div class="login">
    <div class="box">
      <h3 class="center">登录</h3>
      <div class="line">
        <el-input placeholder="情输入账号" clearable v-model="form.username"></el-input>
      </div>
      <div class="line">
        <el-input placeholder="情输入密码" clearable show-password v-model="form.password"></el-input>
      </div>
      <div class="center line">
        <el-button type="primary" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { reqManageLogin } from "../../utils/request";
import {successAlert,warningAlert} from "../../utils/alert"
export default {
  props: [],
  components: {},
  data() {
    return {
      form:{
        username:"",
        password:"",
      }
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      changeUserInfoAction:"changeUserInfoAction"
    }),
    //登录
    login() {
      reqManageLogin(this.form).then((res)=>{
        if(res.data.code==200){
          //登录成功
          
          successAlert('登录成功')
          // res.data.list 用户信息存起来，供更多组件使用
          this.changeUserInfoAction(res.data.list)
          this.$router.push("/")
          
        }else{
          warningAlert(res.data.msg)
        }
      })
    },
  },
  mounted() {},
};
</script>
<style scoped>
.login {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, #553443, #303d60);
  position: relative;
}
.box {
  width: 400px;
  padding: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  border-radius: 20px;
}
.center {
  text-align: center;
}
.line {
  margin-top: 20px;
}
</style>