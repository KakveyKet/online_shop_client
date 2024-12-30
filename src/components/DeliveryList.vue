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
          Delivery List
          <v-spacer></v-spacer>
        </v-card-title>
        <v-text-field
          v-model="filters.search"
          max-width="300"
          append-icon="mdi-magnify"
          label="Search"
          placeholder="Search by name"
          single-line
          hide-details
        ></v-text-field>
        <v-btn color="primary" @click="handleAdd">Add New </v-btn>
      </div>
    </v-card>
    <table border="1" cellspacing="0" cellpadding="10" class="mt-10">
      <thead>
        <tr>
          <th>No .</th>
          <th>Name</th>
          <th>Image</th>
          <!-- <th>Status</th> -->
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data.data" :key="item._id">
          <td>
            {{ index + 1 }}
          </td>
          <td>{{ item.name }}</td>
          <td>
            <img :src="item.image" alt="category" width="50" />
          </td>
          <td>
            <div class="d-flex ga-3 item-center">
              <v-btn color="primary" @click="handleUpdae(item)">Update</v-btn>
              <v-btn color="red" @click="handleDelete(item)">Delete</v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @prev="handlePrev"
      @next="handleNext"
      @page="handlePage"
    />
    <v-snackbar v-model="showError" color="error" timeout="3000">
      {{ error }}
    </v-snackbar>
  </v-container>
  <v-dialog v-model="dialog">
    <DeliveryForm
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
import DeliveryForm from "./DeliveryForm.vue";
export default {
  components: {
    DeliveryForm,
    Pagination,
  },
  setup() {
    const handleClose = () => {
      dialog.value = false;
    };
    const dialog = ref(false);
    const datatoedit = ref(null);
    const page = ref(1);
    const limit = ref(5);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const totalItems = ref(0);

    const collection = ref("deliveries");
    const { data, loading, error, fetchData, deleteUser } = useFetch(
      collection.value
    );
    const filters = ref({
      page: page.value,
      limit: limit.value,
      search: "",
      searchColumn: ["name"],
    });

    const handlePagination = async () => {
      filters.value.page = page.value;
      filters.value.limit = limit.value;
      await fetchData(filters.value);
    };
    const handleNext = () => {
      page.value++;
      handlePagination();
    };
    const handlePrev = async () => {
      page.value--;
      handlePagination();
      await fetchData(filters.value);
    };

    const handlePage = async (p) => {
      page.value = page;
      await fetchData(filters.value);
    };
    const handleDelete = async (doc) => {
      await deleteUser(doc._id);
      await fetchData(filters.value);
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
    const handleDatabaseUpdate = async () => {
      await fetchData(filters.value);
      updateSearch(filters.value.search);
    };

    onMounted(async () => {
      socket.on("database_realTime", handleDatabaseUpdate);
      await fetchData(filters.value);
      currentPage.value = data.value.currentPage;
      totalPages.value = data.value.totalPages;
      totalItems.value = data.value.totalItems;
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
    };
  },
};
</script>
