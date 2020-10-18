<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加角色' : '编辑角色'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="活动期限">
          <el-date-picker
            v-model="value"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="一级分类">
          <el-select v-model="form.first_cateid" @change="changeFirst">
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="form.second_cateid" @change="changeSecond">
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in secondList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品">
          <el-select v-model="form.goodsid">
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in thirdList"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
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
  reqGoodsList,
  reqSeckAdd,
  reqSeckUpdate,
  reqSeckInfo,
} from "../../../utils/request";
import { warningAlert, successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      //规格属性数组
      //二级分类list
      secondList: [],
      // 商品list
      thirdList: [],
      form: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "未来一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "未来一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "未来三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      value: [],
    };
  },
  computed: {
    ...mapGetters({
      //一级分类list
      cateList: "cate/list",
    }),
  },
  methods: {
    ...mapActions({
      requestCateList: "cate/requestCateList",
      requestSeckList: "seck/requestSeckList",
    }),
    // 一级分类修改，获取二级list
    changeFirst() {
      // 一级分类变了，二级分类的值应该置空
      this.form.second_cateid = "";

      this.getSecondList();
    },
    // 获取二级分类的列表
    getSecondList() {
      let obj = this.cateList.find((item) => item.id == this.form.first_cateid);

      this.secondList = obj.children;
    },

    // 二级分类修改
    changeSecond() {
      this.form.goodsid = "";
      this.getThirdList();
    },
    getThirdList() {
      reqGoodsList({ pid: this.form.second_cateid }).then((res) => {
        //二级分类list
        this.thirdList = res.data.list.filter(
          (item) => item.second_cateid == this.form.second_cateid
        );
      });
      // 用for of实现
      // for(let i of goodsList){
      //   console.log(i);
      //   if(i.second_cateid==this.form.second_cateid){
      //     this.thirdList.push(i);
      //   }
      // }
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
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
      this.secondList = [];
      this.thirdList = [];
      this.value = [];
    },
    // 检验数据是否合格
    checkedData() {
      if (this.form.title == "") {
        warningAlert("活动名称不能为空");
        return false;
      }
      console.log(this.value);
      if (this.value=="") {
        warningAlert("起始时间不能为空");
        return false;
      }
       if (this.form.first_cateid == "") {
        warningAlert("一级分类不能为空");
        return false;
      }
       if (this.form.second_cateid == "") {
        warningAlert("二级分类不能为空");
        return false;
      }
       if (this.form.goodsid == "") {
        warningAlert("商品不能为空");
        return false;
      }
      return true;
    },
    //点击了添加按钮
    add() {
      if (!this.checkedData()) {
        return;
      }
      this.form.begintime = new Date(this.value[0]).getTime();
      this.form.endtime = new Date(this.value[1]).getTime();
      
      reqSeckAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          //成功
          successAlert(res.data.msg);
          // this.form.id = id;
          //数据重置
          this.empty();

          //弹框消失
          this.cancel();

          //list数据要刷新
          this.requestSeckList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //获取菜单详情 （1条）
    look(id) {
      //发请求
      reqSeckInfo(id).then((res) => {
        if (res.data.code == 200) {
          // console.log(res.data.list);
          this.form = res.data.list;
          this.form.id = id
          this.value = [
            new Date(parseInt(res.data.list.begintime)),
            new Date(parseInt(res.data.list.endtime)),
          ];
          this.getSecondList();
          this.getThirdList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //修改
    update() {
      if (!this.checkedData()) {
        return;
      }

      this.form.begintime = new Date(this.value[0]).getTime();
      this.form.endtime = new Date(this.value[1]).getTime();
      reqSeckUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.requestSeckList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    this.requestCateList();
    //如果菜单list没有请求过，就请求一下，如果请求过了，就不用请求了
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