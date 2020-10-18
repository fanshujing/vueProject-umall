<template>
  <el-dialog
    :title="info.isAdd ? '添加角色' : '编辑角色'"
    :visible.sync="info.isshow"
    @closed="close"
  >
    <el-form ref="form" :model="form" label-width="80px" size="mini">
      <el-form-item label="角色名称">
        <el-input v-model="form.rolename"></el-input>
      </el-form-item>

      <!-- 树形控件 -->
      <!-- data要展示的数组 -->
      <!-- props 配置 ：children 用来判断是否有下一层的字段；label用来展示在页面中的字段 -->
      <el-tree
        ref="tree"
        :data="list"
        show-checkbox
        node-key="id"
        :props="{ children: 'children', label: 'title' }"
      >
      </el-tree>

      <el-form-item label="状态">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="2"
        ></el-switch>
      </el-form-item>

      <el-form-item size="large">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd">添加</el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alert";
import { reqRoleAdd,reqRoleInfo,reqRoleUpdate } from "../../../utils/request";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      form: {
        rolename: "",
        menus: "[]",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      // menu的list
      list: "menu/list",
    }),
  },
  methods: {
    ...mapActions({
      // menu的list
      reqListAction: "menu/reqListAction",
      //角色的list
      requestRoleList: "role/requestRoleList",
    }),
    //取消
    cancel() {
      this.info.isshow = false;
    },
    //弹框消失完成
    close() {
      //如果是添加开的弹框，就什么都不做；如果是编辑开的弹框，就清除form
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    // 数据重置
    empty() {
      this.form = {
        rolename: "",
        menus: "[]",
        status: 1,
      };
      //树形控件设置值
      this.$refs.tree.setCheckedKeys([]);
    },
    examine(){
      if(this.form.rolename==""){
        warningAlert("角色名称不能为空")

        return false
      }
      if(this.$refs.tree.getCheckedKeys()==""){
        warningAlert("权限不能为空")
        return false
      }
      return true;
    },
    add() {
      if(this.examine()==false){
        return
      }
      //树形控件取值 this.$refs.tree.getCheckedKeys()
      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      reqRoleAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          //   成功
          successAlert(res.data.msg);
          // 数据重置
          this.empty();
          // 弹框消失
          this.cancel();
          // list数据刷新
          this.requestRoleList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    // 获取菜单详情一条
    look(id){
      reqRoleInfo(id).then((res)=>{
        if(res.data.code==200){
          this.form=res.data.list;
          this.form.id=id;
          this.$refs.tree.setCheckedKeys(JSON.parse(this.form.menus))
        }else{
          warningAlert(res.data.msg)
        }
      })
    },
    // 修改
    update(){
      if(this.examine()==false){
        return
      }
      this.form.menus=JSON.stringify(this.$refs.tree.getCheckedKeys())
      reqRoleUpdate(this.form).then((res)=>{
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.requestRoleList();
        } else {
          warningAlert(res.data.msg);
        }
      })
    }
  },
  mounted() {
    if(this.list.length==0){
      this.reqListAction();
    }

    
  },
};
</script>
<style scoped>
</style>