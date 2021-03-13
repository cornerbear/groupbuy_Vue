import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import axios from 'axios'

const app = createApp(App)
installElementPlus(app)
app.use(store).use(router).mount('#app')

import { getRequest } from './utils/request'
import {postRequest} from './utils/request'
import {deleteRequest} from './utils/request'
import {putRequest} from './utils/request'


app.config.globalProperties.getRequest = getRequest;
app.config.globalProperties.postRequest = postRequest;
app.config.globalProperties.deleteRequest = deleteRequest;
app.config.globalProperties.putRequest = putRequest;

// app.prototype.$base_url = 'http://localhost:8888';
axios.defaults.baseURL = 'http://localhost:8888';
