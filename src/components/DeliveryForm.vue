<template>
  <v-container>
    <v-card class="pa-5" max-width="600">
      <v-card-title class="text-h5">Create Delivery</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="isValid">
          <!-- Delivery method Name -->
          <v-text-field
            label="Delivery method Name"
            v-model="formData.name"
            :rules="[rules.required]"
            required
          ></v-text-field>

          <!-- Image Upload (Simple HTML file input) -->
          <div class="mb-4">
            <label for="image" class="v-btn v-btn--outlined v-btn--block">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              @change="handleFileChange"
              class="v-file-input__input"
            />
            <p v-if="formData.image" class="mt-2">
              Selected file: {{ formData.image.name }}
            </p>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          @click="handleSubmit"
          :disabled="!isValid || loading"
        >
          Submit
        </v-btn>
        <v-btn text @click="resetForm">Reset</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useFetch } from "@/composible/useFetch"; // Update the path to your helper

export default {
  props: ["datatoedit"],
  setup(props, { emit }) {
    const { postData, updateData, loading, error } = useFetch("deliveries");
    const isValid = ref(false);

    const formData = reactive({
      name: "",
      image: null,
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
      if (formData.image) {
        payload.append("image", formData.image);
      }

      try {
        if (props.datatoedit) {
          await updateData(payload, props.datatoedit._id);
          console.log("====================================");
          console.log("payload", payload, formData.image);
          console.log("====================================");
          emit("socket");
          emit("close");
          return;
        } else {
          await postData(payload);
          console.log("Delivery method created successfully!", payload);
          emit("socket");
          emit("close");
        }
        console.log("Delivery method created successfully!");
      } catch (err) {
        console.error("Error creating Delivery method:", error.value);
      }
    };

    const resetForm = () => {
      formData.name = "";
      formData.image = null;
    };

    onMounted(() => {
      if (props.datatoedit) {
        formData.name = props.datatoedit.name;
        formData.image = props.datatoedit.image;
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
    };
  },
};
</script>
