<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加角色' : '编辑角色'"
      :visible.sync="info.isshow"
      @closed="close"
      @opened="opened"
    >
      <el-form ref="form" :model="form" label-width="80px">
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
          <el-select v-model="form.second_cateid">
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="form.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="市场价格">
          <el-input v-model="form.market_price"></el-input>
        </el-form-item>

        <el-form-item label="图片" v-if="form.pid != 0">
          <div class="my-upload">
            <h3>+</h3>
            <img :src="imgUrl" alt="" v-if="imgUrl" class="img" />
            <input type="file" class="my-input" v-if="info.isshow" @change="getFile"/>
          </div>
        </el-form-item>




        <el-form-item label="商品规格">
          <el-select v-model="form.specsid" @change="changeSpecs">
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品属性">
          <el-select v-model="form.specsattr" multiple>
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in goodsAttrList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="是否新品">
          <el-radio v-model="form.isnew" :label="1">是</el-radio>
          <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="是否热卖">
          <el-radio v-model="form.ishot" :label="1">是</el-radio>
          <el-radio v-model="form.ishot" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>

        <el-form-item label="商品描述">
          <!-- 富文本 -->
          <div v-if="info.isshow" id="editor"></div>
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
  reqCateList,
  reqGoodsAdd,
  reqGoodsDetail,
  reqGoodsUpdate,
} from "../../../utils/request";
import { warningAlert, successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      // 二级分类列表
      secondCateList: [],
    // 图片地址
      imgUrl: "",
      //商品属性list
      goodsAttrList: [],
      form: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //后端要的 '[]',所以 记得在请求前 转换格式
        isnew: 1,
        ishot: 1,
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      //商品分类list
      cateList: "cate/list",
      //商品规格list
      specsList: "space/list",
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
      //请求商品分类list
      reqCateList: "cate/requestCateList",
      //商品规格list
      reqSpecsList: "space/requestSpaceList",
      // 请求goods的列表
      requestGoodsList: "goods/requestGoodsList",
      // 请求goods的count
      reqTotalAction:'goods/reqTotalAction'
    }),
    // 一级分类修改，获取而立list
    changeFirst() {
      
      // 一级分类变了，二级分类的值应该置空
      this.form.second_cateid = "";
      this.getSecondList();
    },
    // 获取二级分类的列表
    getSecondList() {
      reqCateList({ pid: this.form.first_cateid }).then((res) => {
        //二级分类list
        this.secondCateList = res.data.list;
      });
    },
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


    //商品规格发生了改变，计算商品属性的数组
    changeSpecs(){
      // 商品规格发生改变，商品属性先置空
      this.form.specsattr=[];
      this.getAttrsArr();
    },
    // 获得商品属性数组
    getAttrsArr(){
      // 在specsList中找到，那一条的id和当前this.form.specsid是一样的
      let obj=this.specsList.find((item)=> item.id == this.form.specsid)
      // 把这条数据的attrs赋值给goodsAttrList;
      this.goodsAttrList = obj.attrs;
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
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //后端要的 '[]',所以 记得在请求前 转换格式
        isnew: 1,
        ishot: 1,
        status: 1,
      };
      //二级分类的list
      this.secondCateLis = [];
      //图片地址
      this.imgUrl = "";
      //商品属性list
      this.goodsAttrList = [];
    },
    // 检验数据是否合格
    // checkedData() {
    //   //验证规格名称
    //   if (this.form.specsname == "") {
    //     warningAlert("规格名称不能为空");
    //     return false;
    //   }

      // //验证每一个属性值都不能为空
      // if (this.attrArr.some((item) => item.value == "")) {
      //   warningAlert("所有的属性值都必填");
      //   return false;
      // }
      // return true;
    // },
    //点击了添加按钮
    add() {
      console.log(1);
      // 将富文本编辑器的内容取出来赋值给this.form.description
      this.form.description=this.editor.txt.html();
      // let data=this.form;
      // data.specsattr=JSON.stringify(this.form.specsattr)
      // 简写
      let data={
        ...this.form,
        specsattr:JSON.stringify(this.form.specsattr),
      }
      reqGoodsAdd(data).then((res) => {
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
          this.requestGoodsList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //获取菜单详情 （1条）
    look(id) {
      //发请求
      reqGoodsDetail(id).then((res) => {
        if (res.data.code == 200) {
          //这个时候form是没有id的
          console.log(res.data);
          this.form = res.data.list;

          // 补id 
          this.form.id=id;
          // 需要请求一下二级分类列表
          this.getSecondList();
          // 图片
          this.imgUrl=this.$imgPre+this.form.img;
          // 商品属性从字符串转换为数组
          this.form.specsattr=JSON.parse(this.form.specsattr);
          // 获取商品的数组
          this.getAttrsArr();
          // 给富文本编辑器复制


        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //修改
    update() {
      // if (!this.checkedData()) {
      //   return;
      // }
       this.form.description = this.editor.txt.html();
      let data = {
        ...this.form,
        specsattr: JSON.stringify(this.form.specsattr),
      };
      reqGoodsUpdate(data).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.requestGoodsList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    //如果商品一级分类没有请求过，就请求一次
    if (this.cateList.length == 0) {
      this.reqCateList();
    }
    // 由于使用了分页，但是商品管理模块需要所有的商品规格，不要分野，所以多传递一个参数，用来判断是否需要分页
    this.reqSpecsList(true);
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