<template>
  <div class="reset-password-container">
    <h2>Reset Your Password</h2>
    <form @submit.prevent="resetPassword">
      <div>
        <label for="password">New Password</label>
        <input
          type="password"
          id="password"
          v-model="newPassword"
          placeholder="Enter new password"
          required
        />
      </div>
      <div>
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
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

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
          `http://localhost:5000/api/reset-password/${token}`, // Send token in the URL
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
.reset-password-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

div {
  margin-bottom: 15px;
}

input {
  padding: 8px;
  margin-top: 5px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
}

.error-message {
  color: red;
  text-align: center;
}

.success-message {
  color: green;
  text-align: center;
}
</style>
