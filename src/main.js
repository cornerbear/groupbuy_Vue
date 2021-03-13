import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import axios from 'axios'

const app = createApp(App)
installElementPlus(app)
app.use(store).use(router).mount('#app')

// axios.defaults.baseURL = 'http://localhost:8888';

import {postRequest} from "./utils/request";
import {putRequest} from "./utils/request";
import {deleteRequest} from "./utils/request";
import {getRequest} from "./utils/request";

app.config.globalProperties.postRequest = postRequest;
app.config.globalProperties.putRequest = putRequest;
app.config.globalProperties.deleteRequest = deleteRequest;
app.config.globalProperties.getRequest = getRequest;