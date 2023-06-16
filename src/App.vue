<script setup lang="ts">
  import ProductTable from './components/ProductsTable.vue'
  import MinMaxFilterInput from "@/components/MinMaxFilterInput.vue";
  import {ref} from "vue";
  import {FilterInterface, MinMaxInterface} from "@/components/filter-interfaces";

  const ratingFilter = ref<FilterInterface<MinMaxInterface>>(
    {
      key:'rating',
      value:{ min:0, max: 5}
    }
  );

  const priceFilter = ref<FilterInterface<MinMaxInterface>>(
    {
      key:'price',
      value:{ min:0, max: 10000}
    }
  );

</script>

<template>
  <div>

    <div class="header">

      <h2 class="title">Products List</h2>

      <div class="filters">

        <min-max-filter-input
            v-model:min="ratingFilter.value.min"
            v-model:max="ratingFilter.value.max"
            label="Rating"
        >
        </min-max-filter-input>
        <min-max-filter-input
            v-model:min="priceFilter.value.min"
            v-model:max="priceFilter.value.max"
            label="Price Range"
        >
        </min-max-filter-input>

      </div>

    </div>

    <product-table :filters="[ratingFilter,priceFilter]"></product-table>
  </div>
</template>

<style scoped>
  .header {
    @apply flex flex-col md:flex-row justify-between mb-4 gap-4 items-start md:items-center
  }

  .header .title {
    @apply font-semibold text-lg text-sky-800
  }

  .filters {
    @apply flex flex-col md:flex-row justify-center gap-3 md:gap-2
  }
</style>
