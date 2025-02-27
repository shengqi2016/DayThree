const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "Infp",
        component: () => import("pages/InformationPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "nrp",
        component: () => import("pages/NewRecordPage.vue"),
        meta: { requiresAuth: true },
      },
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
