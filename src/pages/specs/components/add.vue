<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加角色' : '编辑角色'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="规格名称">
          <el-input v-model="form.specsname"></el-input>
        </el-form-item>


        <el-form-item
          label="规格属性"
          v-for="(item, index) in attrArr"
          :key="index"
        >
          <div class="con">
            <div class="input-wrap">
              <el-input v-model="item.value"></el-input>
            </div>
            <el-button type="primary" v-if="index == 0" @click="addAttr"
              >新增规格属性</el-button
            >
            <el-button type="danger" v-else @click="del(index)">删除</el-button>
          </div>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd"
          >添 加</el-button
        >
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqSpecsAdd,
  reqSpecsDetail,
  reqSpecsUpdate,
} from "../../../utils/request";
import { warningAlert, successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      //规格属性数组
      attrArr: [{ value: "" }, { value: "" }],
      form: {
        specsname: "",
        attrs: "",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      //菜单list
      list: "role/list",
    }),
  },
  methods: {
    ...mapActions({
      //角色的list
      requestSpaceList: "space/requestSpaceList",
      reqTotalAction:'space/reqTotalAction'
    }),
    // 新增规格属性
    addAttr(){
        this.attrArr.push({value:""});
    },
    // 删除规格属性
    del(index){
        this.attrArr.splice(index,1)
    },
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
    //数据重置
    empty() {
      this.form = {
        specsname: "",
        attrs: "",
        status: 1,
      };
      this.attrArr=[{ value: "" }, { value: "" }];
    },
    // 检验数据是否合格
    checkedData(){
      //验证规格名称
      if (this.form.specsname == "") {
        warningAlert("规格名称不能为空");
        return false;
      }

      //验证每一个属性值都不能为空
      if (this.attrArr.some((item) => item.value == "")) {
        warningAlert("所有的属性值都必填");
        return false;
      }
      return true
    },
    //点击了添加按钮
    add() {
      if(!this.checkedData()){
        return;
      }
       this.form.attrs = JSON.stringify(this.attrArr.map((item) => item.value));
      reqSpecsAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          //成功
          successAlert(res.data.msg);

          //数据重置
          this.empty();

          //弹框消失
          this.cancel();
          //重新获取总数
          this.reqTotalAction();

          //list数据要刷新
          this.requestSpaceList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //获取菜单详情 （1条）
    look(id) {
      //发请求
      reqSpecsDetail(id).then((res) => {
        if (res.data.code == 200) {
          //这个时候form是没有id的
          this.form = res.data.list[0];

          this.attrArr=JSON.parse(this.form.attrs).map((item)=>({
            value:item,
          }))
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //修改
    update() {
      if(!this.checkedData()){
        return;
      }
      this.form.attrs = JSON.stringify(this.attrArr.map((item) => item.value));
      reqSpecsUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.requestSpaceList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    //如果菜单list没有请求过，就请求一下，如果请求过了，就不用请求了
    if (this.list.length == 0) {
      this.requestSpaceList();
    }
  },
};
</script>
<style scoped>
.con {
  display: flex;
}
.input-wrap {
  flex: 1;
}
</style>