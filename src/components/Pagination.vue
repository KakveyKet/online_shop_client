<template>
  <div>
    <div class="d-flex justify-center align-center ga-3 mt-5">
      <v-btn @click="handlePrev">Prev</v-btn>
      <v-btn v-for="i in totalPages" :key="i" @click="handlePage(i)">{{
        i
      }}</v-btn>
      <v-btn v-if="currentPage !== totalPages" @click="handleNext">Next</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    page: {
      type: Number,
      required: false,
    },
  },
  setup(props, { emit }) {
    const handlePrev = () => {
      emit("prev");
    };
    const handleNext = () => {
      emit("next");
    };
    const handlePage = (page) => {
      emit("page", page);
    };
    return {
      handlePrev,
      handleNext,
      handlePage,
    };
  },
};
</script>

<style lang="scss" scoped></style>
