import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./components/HomeView.vue";
import UserList from "./components/UserList.vue";
import Dashboard from "./components/Dashboard.vue";
import Register from "./components/Register.vue";
import Login from "./components/Login.vue";
import Unauthorized from "./components/Unauthorized.vue"; // Create this component for unauthorized access
import CategoryList from "./components/CategoryList.vue";
import ProductList from "./components/ProductList.vue";
import ResetPassword from "./components/ResetPassword.vue";
import Profile from "./components/Profile.vue";
const routes = [
    {
        path: "/",
        component: HomeView,
        redirect: "/dashboard",
        children: [
            {
                path: "/users",
                component: UserList,
                name: "users",
                meta: { requiresAuth: true },
            },
            {
                path: "/dashboard",
                component: Dashboard,
                name: "dashboard",
                meta: { requiresAuth: true },
            },
            {
                path: "/categories",
                component: CategoryList,
                name: "categories",
                meta: { requiresAuth: true },
            },
            {
                path: "/product",
                component: ProductList,
                name: "product",
                meta: { requiresAuth: true },
            },
            {
                path: "/profile",
                component: Profile,
                name: "profile",
                meta: { requiresAuth: true },
            },
        ],
    },
    {
        path: "/register",
        component: Register,
    },
    {
        path: "/login",
        component: Login,
    },
    {
        path: "/unauthorized",
        component: Unauthorized, // Show unauthorized message if role mismatch
    },
    {
        path: "/reset-password/:token",
        component: ResetPassword,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guard to protect routes that require authentication
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("authUser"));

    // Check if the route requires authentication
    if (to.meta.requiresAuth && !token) {
        return next({ path: "/login" }); // Redirect to login if not authenticated
    }

    // Check if the route has role restrictions
    if (to.meta.role && user?.role !== to.meta.role) {
        return next({ path: "/unauthorized" }); // Redirect to unauthorized if role mismatch
    }

    next(); // Proceed to the route if everything is fine
});

export { router };
