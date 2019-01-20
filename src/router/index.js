import Vue from 'vue'
import Router from 'vue-router'

// 导入login组件
import Login from '@/components/Login.vue'
// 导入home组件
import Home from '@/components/Home.vue'
// 导入users组件
import Users from '@/components/Users.vue'
// 导入权限组件
import Roles from '@/components/Roles.vue'
// 导入角色组件
import Rights from '@/components/Rights.vue'
// 导入商品分类组件
import Categories from '@/components/Categories.vue'
// 导入商品分类参数
import Params from '@/components/Params.vue'
// 导入商品列表组件
import Goods from '@/components/Goods.vue'
// 导入订单列表组件
import Orders from '@/components/Orders.vue'
// 导入数据列表组件
import Reports from '@/components/Reports.vue'
// 导入添加商品组件
import Addgoods from '@/components/Addgoods.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/users',
          component: Users
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/orders',
          component: Orders
        },
        {
          path: '/reports',
          component: Reports
        },
        {
          path: '/addgoods',
          component: Addgoods
        }
      ]
    }
  ]
})

// 给路由对象设置导航守卫
// to:去哪儿
// from: 从哪来
// next(): 指定要跳转到哪个组件  => next():表示放行  next(false):终止跳转  next('/login'):指定要跳转到哪里
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    // 有token
    // 放行
    next()
  } else {
    // 没有token
    next('./login')
  }
})

// 导出路由对象
export default router
