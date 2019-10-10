import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import App from './components/App.vue';
import md5 from 'js-md5';
import 'element-ui/lib/theme-chalk/index.css'; //修改element-ui样式
import storeData from './tools/vuex-store';
import router from './tools/routes';
// import api from './server/api';
import api from './http/api';
import global from './tools/global';
import setTime from '../static/js/getTime';
import validate from '../static/js/Validate'
import axios from 'axios'
import VueClipboard from 'vue-clipboard2'

import FormMaking from 'form-making-advanced'
import 'form-making-advanced/dist/FormMaking.css'

Vue.use(VueClipboard);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(FormMaking);
Vue.prototype.global = global
Vue.prototype.$md5 = md5;
Vue.prototype.$api = api;
Vue.prototype.setTime = setTime;
Vue.prototype.valid = validate;
Vue.config.productionTip = false;
axios.get('../static/js/websocket.json').then((res) => {
  console.log(res.data, '获取ws');
  Vue.prototype.$webSocket = res.data.ws;
});
String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
  if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
    return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
  } else {
    return this.replace(reallyDo, replaceWith);
  }
};
const store = new Vuex.Store(storeData);
new Vue({
  el: '#app',
  router,
  store,
  components: { App }
});
router.beforeEach((to, from, next) => {
  if (sessionStorage.getItem('token')) {
    next()
  } else {
    console.log("11112121")
    if (to.path === "/Login") {
      next()
    } else {
      next('/Login')
    }
  }
});

