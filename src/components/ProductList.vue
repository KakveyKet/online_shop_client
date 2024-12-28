<template>
  <v-container class="mt-10">
    <!-- add new user btn-->
    <v-card>
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
        "
      >
        <v-card-title>
          Product List
          <v-spacer></v-spacer>
        </v-card-title>
        <v-text-field
          v-model="filters.search"
          max-width="300"
          append-icon="mdi-magnify"
          placeholder="Search by name and email"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-btn color="primary" @click="handleAdd">Add New</v-btn>
      </div>
    </v-card>
    <table border="1" cellspacing="0" cellpadding="10" class="mt-10">
      <thead>
        <tr>
          <th>No .</th>
          <th>Name</th>
          <th>Category</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data.data" :key="item._id">
          <td>
            {{ index + 1 }}
          </td>
          <td>{{ item.name }}</td>
          <td>{{ item.category }}</td>
          <td>
            <img :src="item.image" alt="" width="50" />
          </td>
          <td>
            <div class="d-flex ga-3">
              <!-- add to cart -->
              <v-btn @click="handleAddToCart(item)">
                <v-icon>mdi-cart</v-icon>
              </v-btn>
              <v-btn color="primary" @click="handleUpdae(item)">Update</v-btn>

              <v-btn color="red" @click="handleDelete(item)">Delete</v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="d-flex justify-center align-center gap-3 mt-5">
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @prev="handlePrev"
        @next="handleNext"
        @page="handlePage"
      />
    </div>
    <v-snackbar v-model="showError" color="error" timeout="3000">
      {{ error }}
    </v-snackbar>
  </v-container>
  <v-dialog v-model="dialog">
    <ProductForm
      @close="handleClose"
      :datatoedit="datatoedit"
      @socket="handleDatabaseUpdate"
    />
  </v-dialog>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useFetch } from "../composible/useFetch";
import socket from "@/composible/socket";
import Pagination from "./Pagination.vue";
import ProductForm from "./ProductForm.vue";
import axios from "axios";
import useAuth from "@/composible/useAuth";
import url from "@/composible/api";
export default {
  components: {
    ProductForm,
    Pagination,
  },
  setup() {
    const dialog = ref(false);
    const datatoedit = ref(null);
    const page = ref(1);
    const limit = ref(50);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const totalItems = ref(0);
    const handleClose = () => {
      dialog.value = false;
    };
    const { user } = useAuth();
    const collection = ref("products");
    const { data, loading, error, fetchData, deleteUser } = useFetch(
      collection.value
    );
    const filters = ref({
      page: page.value,
      limit: limit.value,
      search: "",
      searchColumn: ["name"],
    });

    const handlePagination = () => {
      filters.value.page = page.value;
      filters.value.limit = limit.value;
      fetchData(filters.value);
    };
    const handleNext = () => {
      page.value++;
      handlePagination();
    };
    const handlePrev = () => {
      page.value--;
      handlePagination();
    };

    const handlePage = (p) => {
      page.value = page;
      handlePagination();
    };
    watch(
      () => filters.value.search,
      async (newSearch) => {
        await fetchData({ ...filters.value, search: newSearch });
      }
    );
    const updateSearch = (searchTerm) => {
      filters.value.search = searchTerm;
    };

    const handleDelete = async (doc) => {
      await deleteUser(doc._id);
      await fetchData(filters.value);
    };
    const handleDatabaseUpdate = async () => {
      await fetchData(filters.value);
      updateSearch(filters.value.search);
    };
    const handleAddToCart = async (doc) => {
      try {
        const req = {
          userId: user.value?.id,
          productId: doc._id,
          quantity: 1,
        };

        if (!user.value) {
          console.error("User ID is not available. Please log in.");
          return;
        }

        // Make the API request to add the product to the cart
        const response = await axios.post(`${url}/api/carts`, {
          ...req,
        });
        console.log("req", req);

        if (response.status === 200) {
          alert("Product added to cart successfully!");
        } else {
          console.error("Failed to add product to cart:", response.data);
          alert("Failed to add product to cart.");
        }
      } catch (error) {
        console.error("Error adding product to cart:", error);
        alert("Error adding product to cart. Please try again.");
      }
    };
    onMounted(async () => {
      socket.on("database_realTime", handleDatabaseUpdate);
      await fetchData(filters.value);
      currentPage.value = data.value.currentPage;
      totalPages.value = data.value.totalPages;
      totalItems.value = data.value.totalItems;
      // user log
      console.log("====================================");
      console.log("user", user.value);
      console.log("====================================");
      updateSearch(filters.value.search);
    });
    const handleAdd = () => {
      dialog.value = true;
      datatoedit.value = null;
    };
    const handleUpdae = (doc) => {
      datatoedit.value = doc;
      dialog.value = true;
    };
    return {
      data,
      loading,
      error,
      dialog,
      handleClose,
      handleUpdae,
      datatoedit,
      handleAdd,
      handleDatabaseUpdate,
      handleDelete,
      page,
      limit,
      handlePagination,
      handleNext,
      handlePrev,
      currentPage,
      totalPages,
      totalItems,
      handlePage,
      filters,
      handleAddToCart,
      user,
    };
  },
};
</script>
