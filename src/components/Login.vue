<!-- <template>
  <v-container fluid fill-height class="login-background">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="4">
        <v-card elevation="12" class="rounded-lg">
          <v-card-title class="text-center pa-6">
            <h1 class="text-h4 font-weight-bold primary--text">Login</h1>
          </v-card-title>
          <v-card-text>
            <v-form
              @submit.prevent="handleLogin"
              ref="form"
              v-model="isFormValid"
            >
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                prepend-icon="mdi-email"
                type="email"
                required
                autocomplete="username"
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                prepend-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                required
                autocomplete="current-password"
              ></v-text-field>

              <v-checkbox
                v-model="rememberMe"
                label="Remember me"
                color="primary"
              ></v-checkbox>

              <v-btn
                type="submit"
                color="primary"
                block
                x-large
                :loading="loading"
                :disabled="!isFormValid || loading"
                class="mt-4"
              >
                Log In
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center pb-6">
            <v-btn text color="primary" @click="forgotPassword">
              Forgot Password?
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import url from "@/composible/api";
export default {
  name: "Login",
  setup() {
    const email = ref("");
    const password = ref("");
    const rememberMe = ref(false);
    const showPassword = ref(false);
    const isFormValid = ref(false);
    const loading = ref(false);

    const snackbar = ref(false);
    const snackbarText = ref("");
    const snackbarColor = ref("");

    const emailRules = [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ];

    const passwordRules = [
      (v) => !!v || "Password is required",
      (v) => v.length >= 6 || "Password must be at least 8 characters",
    ];

    const handleLogin = async () => {
      loading.value = true;
      try {
        const response = await axios.post(`${url}/api/login`, {
          email: email.value,
          password: password.value,
        });
        const { token, user } = response.data;

        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(user));

        snackbarText.value = "Login successful!";
        snackbarColor.value = "success";
        snackbar.value = true;

        setTimeout(() => {
          loading.value = false;
          window.location.href = "/dashboard";
        }, 1000);
      } catch (error) {
        snackbarText.value = error.response?.data?.message || "Login failed!";
        snackbarColor.value = "error";
        snackbar.value = true;
        loading.value = false;
      }
    };

    const forgotPassword = () => {
      snackbarText.value = "Forgot Password? Contact support.";
      snackbarColor.value = "info";
      snackbar.value = true;
    };

    return {
      email,
      password,
      rememberMe,
      showPassword,
      isFormValid,
      loading,
      snackbar,
      snackbarText,
      snackbarColor,
      emailRules,
      passwordRules,
      handleLogin,
      forgotPassword,
    };
  },
};
</script>

<style scoped>
.login-background {
  background-color: #f5f5f5;
}
</style> -->
<template>
  <v-container fluid>
    <div>
      <h2>this barkong qr</h2>
      <v-btn @click="handleGenerate">
        <v-icon>mdi-printer</v-icon>
      </v-btn>
      <img v-if="qrImg" :src="qrImg" alt="qrImg" />
    </div>
  </v-container>
</template>
<script>
import { BakongKHQR, khqrData, IndividualInfo } from "bakong-khqr";
import QRCode from "qrcode";
import { ref } from "vue";
export default {
  components: {
    QRCode,
  },
  setup() {
    const qrImg = ref(null);
    const handleGenerate = async () => {
      const optionalData = {
        currency: khqrData.currency.khr,
        amount: 100,
        billNumber: "#0001",
        mobileNumber: "855967637609",
        storeLabel: "KAKVEY KET",
        terminalLabel: "KAKVEY KET",
      };

      const individualInfo = new IndividualInfo(
        "kakvey_ket1@aclb",
        "KAKVEY KET",
        "Battambang",
        optionalData
      );
      const KHQR = new BakongKHQR();
      const individual = KHQR.generateIndividual(individualInfo);
      console.log("individual", individual);
      const qrData = await QRCode.toDataURL(individual.data.qr);
      qrImg.value = qrData;
      console.log("qr", qr.value);
    };

    return {
      qrImg,
      handleGenerate,
    };
  },
};
</script>
