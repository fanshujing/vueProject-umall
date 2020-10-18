<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="title" label="活动名称" width="180">
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1" type="primary"
            >启用</el-button
          >
          <el-button v-else type="info">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)"
            >编辑</el-button
          >
          <del-btn @confirm="dele(scope.row.id)"></del-btn>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alert";
import { reqSeckDel } from "../../../utils/request";
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
       
      list: "seck/list",
    }),
  },
  methods: {
    ...mapActions({
      requestSeckList: "seck/requestSeckList",
    }),
    //编辑
    edit(id) {
      this.$emit("edit", id);
    },
    //删除2
    dele(id) {
      //点了确定按钮
      reqSeckDel(id).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.requestSeckList();
        } else {
          warningAlert(res.data.msg);
        }
      });
      
    },
  },
  mounted() {
    this.requestSeckList();
  },
};
</script>
<style scoped>
</style>