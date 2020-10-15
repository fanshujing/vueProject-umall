import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)
import { state, getters, mutations } from "./mutations"
import { actions } from "./actions";
import menu from "./moudules/menu"
import role from "./moudules/role"
import manage from "./moudules/manages"
import cate from "./moudules/cate"
import space from "./moudules/space"
import goods from "./moudules/goods"
import banner from "./moudules/banner"
export default new Vuex.Store({
    state,
    mutations,
    actions, 
    getters,
    modules:{
        menu,
        role,
        manage,
        cate,
        space,
        goods,
        banner,
    }
})