<template>
  <el-dialog
    :title="info.isAdd ? '添加菜单' : '编辑菜单'"
    :visible.sync="info.isshow"
    @closed="close"
  >
    <el-form :model="form" ref="form" label-width="80px">
      <el-form-item label="上级分类">
        <el-select v-model="form.pid" placeholder="请选择上级分类">
          <el-option label="顶级分类" :value="0"></el-option>
          <el-option
            v-for="item in list"
            :key="item.id"
            :label="item.catename"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="分类名称">
        <el-input v-model="form.catename"></el-input>
      </el-form-item>
      <!-- 原生 -->
      <el-form-item label="图片" v-if="form.pid!=0">
        <div class="my-upload">
          <h3>+</h3>
          <img :src="imgUrl" alt="" v-if="imgUrl" class="img">
          <input type="file" class="my-input" @change="getFile" v-if="info.isshow"> 
        </div>
      </el-form-item>
      <!-- #### element-ui 上传文件 -->
      <!-- <el-form-item label="图片">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="getFile2"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->

      <el-form-item label="状态">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="2"
        ></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="add" v-if="info.isAdd">添加</el-button>
      <el-button type="primary" @click="update" v-else>修 改</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { indexRoutes } from "../../../router/index";
import {
  reqCateAdd,
  reqCateDetail,
  reqCateUpdate,
} from "../../../utils/request";
import { warningAlert, successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      // 图片地址
      imgUrl: "",
      form: {
        pid: 0,
        catename: "",
        img: "",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      list: "cate/list",
    }),
  },
  methods: {
    ...mapActions({
      requestCateList: "cate/requestCateList",
    }),
    // 取消
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
        pid: 0,
        catename: "",
        img: null,
        status: 1,
      };
      this.imgUrl="";
    },
    // 获取文件
    getFile(e) {
      let file = e.target.files[0];
      // 1大小不超过2M 1M=1024kb 1kb=1024b
      if (file.size > 2 * 1024 * 1024) {
        warningAlert("文件不能超过2M");
        return;
      }
      // 2是图片
      let imgExtArr = [".jpg", ".png", ".jpeg", ".gif"];
      // imgExtArr.some(item=>{
      //   return item==extname
      // })
      let extname = file.name.slice(file.name.lastIndexOf(".")); //截取文件后缀名

      if (!imgExtArr.some((item) => item == extname)) {
        warningAlert("文件格式不正确");
        return;
      }
      // URL.createObjectURL() 可以通过文件生成一个地址
      this.imgUrl = URL.createObjectURL(file);
      // 将文件保存在form.img
      this.form.img = file;
    },
    getFile2(e) {
      let file = e.raw;
      // 1大小不超过2M 1M=1024kb 1kb=1024b
      if (file.size > 2 * 1024 * 1024) {
        warningAlert("文件不能超过2M");
        return;
      }
      // 2是图片
      let imgExtArr = [".jpg", ".png", ".jpeg", ".gif"];
      // imgExtArr.some(item=>{
      //   return item==extname
      // })
      let extname = file.name.slice(file.name.lastIndexOf(".")); //截取文件后缀名

      if (!imgExtArr.some((item) => item == extname)) {
        warningAlert("文件格式不正确");
        return;
      }
      //URL.createObjectURL() 可以通过文件生成一个地址
      this.imgUrl = URL.createObjectURL(file);

      //将文件保存在form.img
      this.form.img = file;
    },
    // 点击了添加按钮
    add() {
      reqCateAdd(this.form).then((res) => {
        if ((res.data.code = 200)) {
          // 成功
          successAlert(res.data.msg);
          //数据重置
          this.empty();

          //弹框消失
          this.cancel();
          //   list数据要刷新
          this.requestCateList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    // 修改pid
    changePid() {
      if (this.form.pid == 0) {
        this.form.type = 1;
      } else {
        this.form.type = 2;
      }
    },
    // 获取菜单详情1条
    look(id) {
      reqCateDetail(id).then((res) => {
        if (res.data.code == 200) {
          //这个时候form是没有id的
          this.form = res.data.list;
          this.form.id = id;
          this.imgUrl = this.$imgPre + this.form.img;
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    // 修改
    update() {
      reqCateUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.requestCateList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    this.requestCateList()
  },
};
</script>
<style scoped>
.my-upload {
  width: 150px;
  height: 150px;
  border: 1px dashed #ccc;
  position: relative;
}
.my-upload h3 {
  text-align: center;
  line-height: 150px;
  font-size: 30px;
  font-weight: 400;
}
.my-upload .my-input {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
  opacity: 0;
}
.my-upload .img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
/* element-ui */
.add >>> .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>