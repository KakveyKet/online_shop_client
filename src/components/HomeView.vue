<template>
  <v-app>
    <!-- Navbar -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Management System</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn to="/profile" text v-bind="attrs" v-on="on">
            <v-icon left>mdi-account</v-icon>
            {{ user.name }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Sidebar -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list class="">
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          link
        >
          <v-list-item-content style="display: flex; align-items: center">
            <v-list-item-icon class="mr-2">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import useAuth from "@/composible/useAuth";
const drawer = ref(true);
const userName = ref("John Doe");
const router = useRouter();
const { user } = useAuth();
console.log(user.value);

const menuItems = [
  { title: "Dashboard", icon: "mdi-view-dashboard", path: "/dashboard" },
  { title: "Users", icon: "mdi-account", path: "/users" },
  { title: "Category", icon: "mdi-shape", path: "/categories" },
  { title: "Product", icon: "mdi-package-variant-closed", path: "/product" },
  { title: "Delivery Method", icon: "mdi-truck-delivery", path: "/delivery" },
  { title: "Order", icon: "mdi-cart", path: "/order" },
  { title: "Report", icon: "mdi-file-chart", path: "/report" },
];
</script>

<style scoped></style>
