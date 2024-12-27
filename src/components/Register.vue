<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Register</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleRegister" ref="form">
              <v-text-field
                v-model="name"
                :rules="[(v) => !!v || 'Name is required']"
                label="Full Name"
                prepend-icon="mdi-account"
                required
              ></v-text-field>
              <v-text-field
                v-model="email"
                :rules="[
                  (v) => !!v || 'E-mail is required',
                  (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                ]"
                label="Email"
                prepend-icon="mdi-email"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[
                  (v) => !!v || 'Password is required',
                  (v) =>
                    v.length >= 8 || 'Password must be at least 8 characters',
                ]"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                prepend-icon="mdi-lock"
                @click:append="togglePassword"
                required
              ></v-text-field>
              <v-progress-linear
                :value="passwordStrength"
                :color="passwordStrengthColor"
                height="7"
              ></v-progress-linear>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :loading="loading" color="primary" @click="handleRegister">
              Register
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-snackbar v-model="showError" color="error" timeout="3000">
          {{ error }}
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed } from "vue";
import axios from "axios";
import url from "@/composible/api";
export default {
  setup() {
    // State variables
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const loading = ref(false);
    const error = ref("");
    const showError = ref(false);

    // Computed properties for password strength
    const passwordStrength = computed(() => {
      if (password.value.length >= 12) return 100;
      if (password.value.length >= 8) return 70;
      if (password.value.length >= 4) return 40;
      return 10;
    });

    const passwordStrengthColor = computed(() => {
      if (passwordStrength.value === 100) return "green";
      if (passwordStrength.value === 70) return "yellow";
      return "red";
    });

    // Toggle password visibility
    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    // Handle form submission
    const handleRegister = async () => {
      if (!name.value || !email.value || !password.value) {
        error.value = "Please fill out all required fields.";
        showError.value = true;
        return;
      }

      loading.value = true;

      try {
        const response = await axios.post(`${url}/api/register`, {
          name: name.value,
          email: email.value,
          password: password.value,
          role: "user",
        });

        const { token } = response.data;

        // Save the token to local storage
        localStorage.setItem("token", token);

        // Redirect or show success message
        // Replace '/dashboard' with your actual route
        window.location.href = "/dashboard";
      } catch (err) {
        error.value =
          err.response?.data?.error || "An error occurred during registration.";
        showError.value = true;
      } finally {
        loading.value = false;
      }
    };

    return {
      name,
      email,
      password,
      showPassword,
      loading,
      error,
      showError,
      passwordStrength,
      passwordStrengthColor,
      togglePassword,
      handleRegister,
    };
  },
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
