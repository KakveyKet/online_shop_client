<template>
  <v-container>
    <v-card class="mx-auto pa-6" max-width="800">
      <v-card-title class="text-h5 font-weight-bold mb-4">
        Create Product
      </v-card-title>
      <v-form @submit.prevent="handleSubmit">
        <v-row>
          <!-- Product Name -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.name"
              label="Product Name"
              required
              outlined
              dense
            ></v-text-field>
          </v-col>

          <!-- Category -->
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.category"
              :items="data.data ? data.data.map((item) => item.name) : []"
              label="Category"
              required
              outlined
              dense
            ></v-select>
          </v-col>

          <!-- Price -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.price"
              label="Price"
              type="number"
              required
              outlined
              dense
              prefix="$"
            ></v-text-field>
          </v-col>

          <!-- Stock -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.stock"
              label="Stock"
              type="number"
              required
              outlined
              dense
            ></v-text-field>
          </v-col>

          <!-- Rating -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.rating"
              label="Rating"
              type="number"
              required
              outlined
              dense
            ></v-text-field>
          </v-col>

          <!-- capacity -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.capacity"
              label="capacity"
              type="text"
              required
              outlined
              dense
            ></v-text-field>
          </v-col>

          <!-- Description -->
          <v-col cols="12">
            <v-textarea
              v-model="formData.description"
              label="Description"
              required
              outlined
              dense
            ></v-textarea>
          </v-col>

          <!-- Image Upload -->
          <v-col cols="12">
            <div class="mb-4">
              <label
                for="image"
                class="text-subtitle-1 font-weight-medium d-block mb-2"
                >Image</label
              >
              <input
                id="image"
                type="file"
                @change="handleFileChange"
                accept="image/*"
                required
                class="v-file-input"
              />
            </div>
          </v-col>

          <!-- Submit Button -->
          <v-col cols="12">
            <v-btn type="submit" color="primary" block large>
              Create Product
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
import { ref, reactive, onMounted } from "vue";
import { useFetch } from "@/composible/useFetch"; // Update the path to your helper

export default {
  props: ["datatoedit"],
  setup(props, { emit }) {
    const { postData, updateData, loading, error } = useFetch("products");
    const collection = ref("categories");
    const { data, fetchData } = useFetch(collection.value);

    const isValid = ref(false);

    const formData = reactive({
      name: "",
      image: "",
      price: 0,
      stock: 0,
      description: "",
      category: "",
      code: "",
      capacity: "",
      rating: 1,
    });

    const rules = {
      required: (value) => !!value || "This field is required",
      image: (value) => {
        if (!value) return true; // Allow optional image upload
        const allowedTypes = ["image/jpeg", "image/png"];

        // Handle single file or array of files
        const files = Array.isArray(value) ? value : [value];
        const invalidFile = files.find(
          (file) => file && !allowedTypes.includes(file.type)
        );

        return invalidFile ? "Only JPG and PNG files are allowed" : true;
      },
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        formData.image = file;
      }
    };

    const handleSubmit = async () => {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("category", formData.category);
      payload.append("price", formData.price);
      payload.append("stock", formData.stock);
      payload.append("description", formData.description);
      payload.append("code", formData.code);
      payload.append("capacity", formData.capacity);
      payload.append("rating", formData.rating);

      if (formData.image) {
        payload.append("image", formData.image);
      }

      try {
        if (props.datatoedit) {
          await updateData(payload, props.datatoedit._id);
          emit("socket");
          emit("close");
          return;
        } else {
          await postData(payload);
          emit("socket");
          emit("close");
        }
        console.log("product created successfully!");
      } catch (err) {
        console.error("Error creating category:", error.value);
      }
    };

    const resetForm = () => {
      formData.name = "";
      formData.image = null;
    };

    onMounted(async () => {
      await fetchData();
      if (props.datatoedit) {
        formData.name = props.datatoedit.name;
        formData.image = props.datatoedit.image;
        formData.category = props.datatoedit.category;
        formData.stock = props.datatoedit.stock;
        formData.price = props.datatoedit.price;
        formData.description = props.datatoedit.description;
        formData.code = props.datatoedit.code;
        formData.capacity = props.datatoedit.capacity;
        formData.rating = props.datatoedit.rating;
        console.log("props.datatoedit?._id", props.datatoedit?._id);
      }
    });

    return {
      isValid,
      formData,
      rules,
      handleSubmit,
      resetForm,
      loading,
      handleFileChange,
      data,
    };
  },
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
