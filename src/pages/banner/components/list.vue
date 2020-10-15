<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="id" label="编号" width="180">
      </el-table-column>


      <el-table-column prop="title" label="轮播图标题" width="180">
      </el-table-column>


    <el-table-column label="图片">
      <template slot-scope="scope">
       <img :src="$imgPre+scope.row.img" alt="" v-if="scope.row.pid!==0">
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
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alert";
import { reqBannerDel } from "../../../utils/request";
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "banner/list",
    }),
  },
  methods: {
    ...mapActions({
      requestBannerList: "banner/requestBannerList",
    }),
    //编辑
    edit(id) {
      this.$emit("edit", id);
    },
    //删除2
    dele(id) {
      //点了确定按钮
      reqBannerDel(id).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.requestBannerList();
        } else {
          warningAlert(res.data.msg);
        }
      });
      
    },
  },
  mounted() {
    this.requestBannerList();
  },
};
</script>
<style scoped>
img {
  width: 80px;
  height: 50px;
}
</style>