import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import Axios from 'axios'

createApp(App).use(store).use(router).mount('#app')


// Vue.prototype.axios = Axios