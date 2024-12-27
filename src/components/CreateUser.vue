<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="mt-5 pa-5">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <v-card-title>
              <h1 class="text-h4 mb-2">User Registration</h1>
            </v-card-title>
            <v-btn color="primary" @click="handleClose">X</v-btn>
          </div>

          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="name"
                label="Name"
                required
                :rules="[(v) => !!v || 'Name is required']"
              ></v-text-field>

              <v-text-field
                v-model="fullName"
                label="Full Name"
                :rules="[(v) => !!v || 'Full Name is required']"
              ></v-text-field>

              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
                :rules="[
                  (v) => !!v || 'Email is required',
                  (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
                ]"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
                :rules="[(v) => !!v || 'Password is required']"
              ></v-text-field>

              <v-select
                v-model="role"
                :items="roles"
                label="Role"
                required
              ></v-select>

              <v-switch
                v-model="is_reminder"
                label="Receive Reminders"
              ></v-switch>

              <v-switch v-model="status" label="Active Status"></v-switch>

              <v-file-input
                @change="handleChange"
                label="Profile Image"
                accept="image/*"
                show-size
              ></v-file-input>

              <v-btn
                type="submit"
                color="primary"
                block
                :loading="loading"
                :disabled="loading"
              >
                Submit
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
          {{ snackbarText }}
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from "vue";
import { useFetch } from "../composible/useFetch";

export default {
  props: ["datatoedit"],
  setup(props, { emit }) {
    const collection = ref("users"); // The collection name
    const { updateUser, createUser, loading, error } = useFetch(
      collection.value
    );

    const name = ref("");
    const fullName = ref("");
    const email = ref("");
    const password = ref("");
    const role = ref("");
    const is_reminder = ref(true);
    const status = ref(true);
    const image = ref(null);
    const roles = ["superadmin", "admin", "user"]; // Example roles

    const handleChange = (e) => {
      image.value = e.target.files[0];
      console.log("image", image.value);
    };

    const snackbar = ref(false);
    const snackbarText = ref("");
    const snackbarColor = ref("success");

    const handleSubmit = async () => {
      if (image.value) {
        image.value = URL.createObjectURL(image.value);
      }
      const form = {
        name: name.value,
        fullName: fullName.value,
        email: email.value,
        password: password.value,
        role: role.value,
        is_reminder: is_reminder.value,
        status: status.value,
        image: image.value,
      };

      try {
        if (props.datatoedit) {
          await updateUser(form, props.datatoedit._id);
          snackbarText.value = "User updated successfully!";
          emit("socket");
          emit("close");
        } else {
          await createUser(form);
          emit("socket");
          emit("close");

          snackbarText.value = "User registered successfully!";
        }
        snackbarColor.value = "success";
        snackbar.value = true;
      } catch (err) {
        snackbarText.value = "Error registering user!";
        snackbarColor.value = "error";
        snackbar.value = true;
        console.error("Error registering user:", err);
      }
    };

    const handleClose = () => {
      emit("close");
    };

    onMounted(() => {
      if (props.datatoedit) {
        name.value = props.datatoedit.name;
        fullName.value = props.datatoedit.fullName;
        email.value = props.datatoedit.email;
        password.value = props.datatoedit.password;
        role.value = props.datatoedit.role;
        is_reminder.value = props.datatoedit.is_reminder;
        status.value = props.datatoedit.status;
        image.value = props.datatoedit.image;
        console.log("props", props.datatoedit);
      }
    });

    return {
      name,
      fullName,
      email,
      password,
      role,
      is_reminder,
      status,
      image,
      handleSubmit,
      loading,
      roles,
      snackbar,
      snackbarText,
      snackbarColor,
      error,
      handleClose,
      handleChange,
    };
  },
};
</script>
