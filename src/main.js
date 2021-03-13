import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import axios from 'axios'

const app = createApp(App)
installElementPlus(app)
app.use(store).use(router).mount('#app')

<<<<<<< HEAD
axios.defaults.baseURL = 'http://localhost:8888';
=======
// app.prototype.$base_url = 'http://localhost:8888';
axios.defaults.baseURL = 'http://localhost:8888';
>>>>>>> parent of ca4cdfa (0.0.9 封装axios请求，未完成)
