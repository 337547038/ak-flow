import {createRouter, createWebHashHistory} from 'vue-router'
import routesPage from '~pages'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 根据条件提取路由

const routes: any = [
    /*{
      path: '/docs',
      redirect: '/docs',
      name: 'docs',
      component: () => import('../docs/components/layout.vue'),
      children: filterRoutePage('docs')
    }*/
]
const routesList = [...routes, ...routesPage]

// 配置路由
const router = createRouter({
    //history: createWebHistory(),
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'layout',
            component: () => import('../components/layout/index.vue'),
            children: routesList
        }
    ]
})


router.beforeEach(async (_to: any, _from: any, next: any) => {
    NProgress.start()
    next()
})
router.afterEach((to: any) => {
    document.title = (to.meta?.title || '') + 'ak流程管理系统'
    NProgress.done()
})
export default router
