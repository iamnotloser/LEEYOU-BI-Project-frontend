﻿export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' },
              { name: '注册', path: '/user/register', component: './User/Register' },
    ] ,
  },

  { path: '/', redirect: '/add_chart'  },
  { path: '/add_chart', name:'数据分析' ,icon: 'AreaChart', component: './AddChart' },
  { path: '/add_chart_async', name:'数据分析(异步)' ,icon: 'AreaChart', component: './AddChartAsync' },
  { path: '/my_chart', name:'我的图表' ,icon: 'Crown', component: './MyChart' },

  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '二级管理页', component: './Admin' },
    ],
  },

  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
