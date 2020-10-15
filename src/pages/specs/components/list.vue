<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="id" label="规格编号" width="180">
      </el-table-column>
      <el-table-column prop="specsname" label="规格名称" width="180">
      </el-table-column>

      <el-table-column label="所属角色">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.attrs" :key="item">{{
            item
          }}</el-tag>
        </template>
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

    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="changePageAction"
    >
    </el-pagination>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alert";
import { reqSpecsDel } from "../../../utils/request";
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "space/list",
      total: "space/total",
      size: "space/size",
    }),
  },
  methods: {
    ...mapActions({
      requestSpaceList: "space/requestSpaceList",
      changePageAction: "space/changePageAction",
      reqTotalAction:'space/reqTotalAction'
    }),
    //编辑
    edit(id) {
      this.$emit("edit", id);
    },
    //删除2
    dele(id) {
      //点了确定按钮
      reqSpecsDel(id).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.requestSpaceList();
          this.reqTotalAction()
        } else {
          warningAlert(res.data.msg);
        }
      });
      
    },
    // 修改了当前页码
    changePage(e) {
      this.changePageAction(e);
    },
  },
  mounted() {
    this.requestSpaceList();
    this.reqTotalAction()
  },
};
</script>
<style scoped>
</style>