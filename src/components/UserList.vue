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
          User List
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
        <v-btn color="primary" @click="handleAdd">Add New User</v-btn>
      </div>
    </v-card>
    <table border="1" cellspacing="0" cellpadding="10" class="mt-10">
      <thead>
        <tr>
          <th>No .</th>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
          <th>Reminder</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data.data" :key="item._id">
          <td>
            {{ index + 1 }}
          </td>
          <td>{{ item.name }}</td>
          <td>{{ item.email }}</td>
          <td>
            <span :style="{ color: item.status ? 'green' : 'red' }">
              {{ item.status ? "Active" : "Inactive" }}
            </span>
          </td>
          <td>
            <span :style="{ color: item.is_reminder ? 'green' : 'red' }">
              {{ item.is_reminder ? "Yes" : "No" }}
            </span>
          </td>
          <td class="d-flex ga-3">
            <v-btn color="primary" @click="handleUpdae(item)">Update</v-btn>
            <v-btn color="red" @click="handleDelete(item)">Delete</v-btn>
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
    <RegiserForm
      @close="handleClose"
      :datatoedit="datatoedit"
      @socket="handleDatabaseUpdate"
    />
  </v-dialog>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useFetch } from "../composible/useFetch";
import RegiserForm from "./CreateUser.vue";
import socket from "@/composible/socket";
import Pagination from "./Pagination.vue";
export default {
  components: {
    RegiserForm,
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
    const collection = ref("users");
    const { data, loading, error, fetchData, deleteUser } = useFetch(
      collection.value
    );
    const filters = ref({
      status: true,
      page: page.value,
      limit: limit.value,
      search: "",
      searchColumn: ["name", "email"],
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
