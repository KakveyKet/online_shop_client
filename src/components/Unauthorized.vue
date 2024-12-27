<template>
  <v-container class="text-center">
    <h1>Unauthorized Access</h1>
    <p>You do not have permission to view this page.</p>
    <v-btn color="primary" @click="$router.push('/dashboard')">Go Back</v-btn>
  </v-container>
</template>

<script>
export default {
  name: "Unauthorized",
};
</script>
