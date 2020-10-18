<template>
  <el-table
    :data="list"
    style="width: 100; margin-bottom: 20px%"
    row-key="id"
    border
  >
    <el-table-column prop="uid" label="用户编号" width="180"> </el-table-column>
    <el-table-column prop="nickname" label="昵称" width="180"> </el-table-column>
    <el-table-column prop="phone" label="手机号"> </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">
        <el-button v-if="scope.row.status == 1" type="primary">启用</el-button>
        <el-button v-else type="info">禁用</el-button>
      </template>
    </el-table-column>
     <el-table-column prop="status" label="操作">
      <template slot-scope="scope">
        <el-button type="primary" @click="edit(scope.row.uid)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from '../../../utils/alert';
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "member/list",
    }),
  },
  methods: {
    ...mapActions({
      requestMemberList: "member/requestMemberList",
    }),
    // 编辑
    edit(id){
      this.$emit("edit",id)
    },
  },
  mounted() {
    this.requestMemberList();
  },
};
</script>
<style scoped>
</style>