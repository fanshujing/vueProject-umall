<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加角色' : '编辑角色'"
      :visible.sync="info.isshow"
      @closed="close"
      @opened="opened"
    >
      <el-form ref="form" :model="form" label-width="80px">
       
        
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        
        <el-form-item label="图片" v-if="form.pid != 0">
          <div class="my-upload">
            <h3>+</h3>
            <img :src="imgUrl" alt="" v-if="imgUrl" class="img" />
            <input type="file" class="my-input" v-if="info.isshow" @change="getFile"/>
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
import E from "wangeditor";
import { mapGetters, mapActions } from "vuex";
import {
  reqBannerAdd,
  reqBannerDel,
  reqBannerInfo,
  reqBannerUpdate,
} from "../../../utils/request";
import { warningAlert, successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
    // 图片地址
      imgUrl: "",
      //商品属性list
      goodsAttrList: [],
      form: {
        title:"",
        img: null,
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      
    }),
  },
  methods: {

    //弹框打开完成
    opened() {
      //富文本
      this.editor = new E("#editor");
      this.editor.create();
      //编辑器创建完成以后再赋值
      this.editor.txt.html(this.form.description);
    },
    ...mapActions({
      //请求list
      reqBannerList: "banner/requestBannerList",
    }),
    // 图片操作
    getFile(e){
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
        title:"",
        img: null,
        status: 1,
      };
      //图片地址
      this.imgUrl = "";
    },
    //点击了添加按钮
    add() {
      reqBannerAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          //成功
          successAlert(res.data.msg);

          //数据重置
          this.empty();

          //弹框消失
          this.cancel();

          //list数据要刷新
          this.requestGoodsList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //获取菜单详情 （1条）
    look(id) {
      //发请求
      reqBannerInfo(id).then((res) => {
        if (res.data.code == 200) {
          //这个时候form是没有id的
          console.log(res.data);
          this.form = res.data.list;

        //   // 补id 
          this.form.id=id;
        //   // 图片
          this.imgUrl=this.$imgPre+this.form.img;


        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //修改
    update() {
      
      reqBannerUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqBannerList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    
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
</style>