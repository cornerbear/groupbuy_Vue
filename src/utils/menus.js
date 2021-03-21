import { getRequest } from "./request";

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }
    getRequest("/system/menu").then(data => {
        if (data) {
            store.commit('initRoutes', data);
            routerPackag(data, router);
            // store.dispatch('connect');
        }
    })
}
export const routerPackag = (routes, router) => {
    routes.filter(itemRouter => {
        if (itemRouter.component != "Layout") {
            router.addRoute("Index", {
                path: `${itemRouter.path}`,
                name: itemRouter.name,
                component: () => import(`../views/${itemRouter.component}.vue`)
            });
        }
        // 是否存在子集
        if (itemRouter.children && itemRouter.children.length) {
            routerPackag(itemRouter.children,router);
        }
        return true;
    });
}