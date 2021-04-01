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

import { postKeyValueRequest } from "./utils/request";
import { postRequest } from "./utils/request";
import { putKeyValueRequest } from "./utils/request";
import { putRequest } from "./utils/request";
import { deleteRequest } from "./utils/request";
import { getRequest } from "./utils/request";

app.config.globalProperties.postRequest = postRequest;
app.config.globalProperties.postKeyValueRequest = postKeyValueRequest;
app.config.globalProperties.putRequest = putRequest;
app.config.globalProperties.putKeyValueRequest = putKeyValueRequest;
app.config.globalProperties.deleteRequest = deleteRequest;
app.config.globalProperties.getRequest = getRequest;



import { initMenu } from "./utils/menus";

router.beforeEach((to, from, next) => {
    if (to.path == '/') {
        next();
    } else {
        if (window.sessionStorage.getItem("user")) {
            initMenu(router, store);
            next();
        } else {
            // '/?redirect=' + to.path
            next();
        }
    }
})

import {
    message
} from './utils/resetMessage';

app.config.globalProperties.message = message;