<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card
          v-for="user in data.data"
          :key="user._id"
          class="mx-auto"
          elevation="5"
        >
          <v-avatar
            class="profile-avatar"
            size="110"
            :color="online ? 'green' : 'grey'"
          >
            <v-img
              :src="user.image ? user.image : 'default-image-url.jpg'"
            ></v-img>

            <!-- Custom file input area -->
            <label class="custom-file-input">
              <input
                type="file"
                id="image"
                accept="image/*"
                @change="handleChange"
                class="v-file-input__input"
              />
              <div class="file-input-overlay">
                <span class="file-input-text">Change Avatar</span>
              </div>
            </label>
          </v-avatar>

          <v-card-text>
            <h2 class="ml-6 py-2">
              <v-text-field
                v-model="form.name"
                label="Name"
                outlined
                dense
              ></v-text-field>
            </h2>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-list-item>
                  <v-list-item-content>
                    <v-text-field
                      v-model="form.location"
                      label="Location"
                      outlined
                      dense
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="12" sm="6">
                <v-list-item>
                  <v-list-item-content>
                    <v-text-field
                      v-model="form.email"
                      label="Email"
                      outlined
                      dense
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <!-- phone number -->
              <v-col cols="12" sm="6">
                <v-list-item>
                  <v-list-item-content>
                    <v-text-field
                      v-model="form.phone"
                      label="Phone"
                      outlined
                      dense
                    ></v-text-field>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="12" sm="6">
                <v-list-item class="mt-4">
                  <v-list-item-content>
                    <v-list-item-title
                      v-for="user in data.data"
                      :key="user._id"
                    >
                      <v-chip class="ma-2" color="primary" label>
                        <v-icon icon="mdi-calendar" start></v-icon>
                        {{ formateDate(user.createdAt) }}
                      </v-chip>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>
            <v-btn color="primary" block large @click="handleUpdate">
              Save Changes
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import useAuth from "@/composible/useAuth";
import { useFetch } from "@/composible/useFetch";
import { formateDate } from "@/composible/formateDate";

// Using composables
const { user } = useAuth();
const { data, fetchData, updateUser } = useFetch("users");

// Filters for the data fetch
const filters = ref({
  page: 1,
  limit: 1,
  search: "",
  _id: user.value._id,
});

// Reactive variables for user details
const form = reactive({
  name: "",
  location: "",
  email: "",
  image: "",
  phone: "",
  location: "",
});
// const name = ref(null);
// const location = ref(null);
// const email = ref(null);
// const image = ref(null);
// const phone = ref(null);
// Handle profile image change (file upload)
const handleChange = (e) => {
  const file = e.target.files[0];
  form.image = file;
  console.log("image", form.image);
};
onMounted(async () => {
  try {
    await fetchData(filters.value);

    if (Array.isArray(data.value?.data)) {
      const item = data.value.data[0];

      form.name = item.name || "N/A";
      form.location = item.location || "N/A";
      form.email = item.email || "N/A";
      form.image = item.image || "default-image-url.jpg"; // Default fallback image
      form.phone = item.phoneNumber || "N/A";
    } else {
      console.error("No data found or invalid data structure!");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
const userId = ref(null);
const handleUpdate = async () => {
  const payload = new FormData();

  // Append other fields to FormData
  payload.append("name", form.name);
  payload.append("location", form.location);
  payload.append("email", form.email);
  payload.append("phoneNumber", form.phone);

  // Append the profile image if it exists
  if (form.image) {
    payload.append("image", form.image);
  }

  try {
    // Assuming updateUser expects FormData
    await updateUser(payload, data.value.data[0]?._id);
    console.log("====================================");
    console.log("User updated successfully");
    console.log("formData", payload);
    console.log("====================================");
  } catch (error) {
    console.error("Error updating user:", error);
  }
};
</script>

<style scoped>
.profile-avatar {
  border: 4px solid white;
  margin: auto;
  display: flex;
  margin-top: 20px;
}

.profile-avatar {
  position: relative;
  cursor: pointer;
}

.custom-file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.custom-file-input input[type="file"] {
  display: none;
  /* Hide the default file input */
}

.file-input-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Semi-transparent overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.file-input-overlay:hover {
  opacity: 1;
  /* Show overlay on hover */
}

.file-input-text {
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  pointer-events: none;
  /* Prevent text from blocking the hover effect */
}
</style>
