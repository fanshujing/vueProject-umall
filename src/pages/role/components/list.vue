<template>
  <el-table
    :data="list"
    border
    style="width: 100%; margin-bottom: 20px"
  >
    <el-table-column prop="id" label="角色编号" width="180"> </el-table-column>
    <el-table-column prop="rolename" label="角色名称" width="180">
    </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">
        <el-button v-if="scope.row.status == 1" type="primary">启用</el-button>
        <el-button v-else type="info">禁用</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="status" label="操作">
      <template slot-scope="scope">
        <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
        <del-btn @confirm="del(scope.row.id)"></del-btn>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import loginVue from '../../login/login.vue';
import {reqRoleDel} from "../../../utils/request"
import { successAlert, warningAlert } from '../../../utils/alert';
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "role/list",
    }),
  },
  methods: {
    ...mapActions({
      requestRoleList: "role/requestRoleList",
    }),
    del(id) {
      reqRoleDel(id).then((res)=>{
        if(res.data.code==200){
          successAlert(res.data.msg);
          this.requestRoleList();
        }else{
          warningAlert(res.data.msg)
        }

      })
    },
    edit(id) {
      this.$emit("edit",id)
    },
  },
  mounted() {
    this.requestRoleList();
  },
};
</script>
<style scoped>
</style>