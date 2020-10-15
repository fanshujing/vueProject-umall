<template>
<div>
    <el-button type="primary" @click="add()">添加</el-button>
    <!-- 表格 -->
    <v-list @edit="edit"></v-list>
    <v-add :info="info" ref="add"></v-add>
  </div>
  <!-- <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="角色名称">
      <el-input v-model="form.name"></el-input>
    </el-form-item>

    <el-form-item label="状态">
      <el-switch v-model="form.delivery"></el-switch>
    </el-form-item>

    <el-form-item>
      <el-button type="primary">添加</el-button>
    </el-form-item>
  </el-form> -->
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vAdd from "./components/add";
import vList from "./components/list";

export default {
  props: [],
  components: {
    vList,
    vAdd,
  },
  data() {
    return {
      // 传递给add的数据
      info:{
        // 添加弹框的状态
        isshow:false,
        // 添加还是编辑的状态，true添加，false编辑
        isAdd:true
      }
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    // 点击添加按钮，add框弹出
    add(){
      this.info.isshow=true;
      this.info.isAdd=true;
    },
    // 编辑
    edit(id){
      this.info.isshow=true;
      this.info.isAdd=false;
       //让add组件发起获取详情的请求
      this.$refs.add.look(id)
    }
  },
  mounted() {},
};
</script>
<style scoped>
</style>