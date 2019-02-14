import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);

Vue.config.productionTip = false

//登陆验证
router.beforeEach((to, from, next) => {
	// localStorage.token='siaM5Q1MR3ekrXceoynu7YRDkddu03L2';
    if(localStorage.getItem('token')){
      next()
    } else {
      next()
      // window.location.href="http://hotelmgr.test.lumous.cn/#/?channel=orderconduct";
    }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
