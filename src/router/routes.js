const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "hworkp",
        component: () => import("pages/HouseWorksPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "purpop",
        component: () => import("pages/PurposePage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "findcal",
        component: () => import("pages/FindCalPage.vue"),
      },
      {
        path: "sellp",
        component: () => import("pages/SellingListPage.vue"),
        meta: { requiresAuth: true },
      },
      { path: 'expense', component: () => import('pages/ExpensePage.vue') }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
