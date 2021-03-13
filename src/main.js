import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
// import axios from 'axios'

const app = createApp(App)
installElementPlus(app)
app.use(store).use(router).mount('#app')

// axios.defaults.baseURL = 'http://localhost:8888';
