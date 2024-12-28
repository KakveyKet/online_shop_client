<template>
  <div
    style="
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    "
  >
    <div class="container">
      <div class="logo">
        <span>ip</span>
      </div>
      <div class="form-container">
        <h1>Reset Your Password</h1>
        <form @submit.prevent="resetPassword">
          <div class="input-group">
            <label for="password">New Password</label>
            <input
              type="password"
              id="password"
              v-model="newPassword"
              placeholder="Enter new password"
              required
            />
          </div>
          <div class="input-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              placeholder="Confirm new password"
              required
            />
          </div>
          <button type="submit" :disabled="isLoading">Reset Password</button>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success-message">
            {{ successMessage }}
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import url from "@/composible/api";
export default {
  setup() {
    const route = useRoute();
    const newPassword = ref("");
    const confirmPassword = ref("");
    const isLoading = ref(false);
    const errorMessage = ref(null);
    const successMessage = ref(null);

    const resetPassword = async () => {
      if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = "Passwords do not match.";
        return;
      }

      const token = route.params.token; // Get token from route params
      if (!token) {
        errorMessage.value = "Invalid or expired token.";
        return;
      }

      try {
        isLoading.value = true;
        const response = await axios.patch(
          `${url}/api/reset-password/${token}`, // Send token in the URL
          {
            token: token,
            newPassword: newPassword.value, // Send newPassword in the body
          }
        );

        successMessage.value = response.data.message;
        errorMessage.value = null; // Clear any previous errors
      } catch (error) {
        errorMessage.value =
          error.response?.data?.error || "An error occurred.";
        successMessage.value = null; // Clear any previous success message
      } finally {
        isLoading.value = false;
      }
    };

    return {
      newPassword,
      confirmPassword,
      isLoading,
      errorMessage,
      successMessage,
      resetPassword,
    };
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 400px;
}

.logo {
  text-align: center;
  margin-bottom: 32px;
}

.logo span {
  color: #f15a24;
  font-size: 48px;
  font-weight: bold;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

h1 {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  color: #666;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #f15a24;
  box-shadow: 0 0 0 4px rgba(241, 90, 36, 0.1);
}

input::placeholder {
  color: #999;
}

button {
  background-color: #f15a24;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 16px;
}

button:hover {
  background-color: #e04d17;
}

@media (max-width: 480px) {
  .container {
    width: 90%;
  }
}
</style>
