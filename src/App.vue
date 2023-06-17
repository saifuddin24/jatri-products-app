<script setup lang="ts">
  import {ref} from "vue";

  import ProductTable from './components/products/ProductsTable.vue'
  import {FilterInterface, MinMaxInterface} from "@/components/filter/filter-interfaces";
  import ProductFiltering from "@/components/products/ProductFiltering.vue";


  const filters = ref<FilterInterface<MinMaxInterface>[]>([]);

  function update_filters(filter_values){
    filters.value = filter_values;
  }

</script>

<template>
  <div>
    <div class="header">
      <h2 class="title">Products List</h2>
      <product-filtering
          class="filters"
          @filters:update="update_filters"
      ></product-filtering>
    </div>

    <product-table :filters="filters"></product-table>
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
    @apply flex flex-col sm:flex-row justify-center gap-3 md:gap-2
  }
</style>
