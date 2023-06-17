<script setup lang="ts">

import { ref, watch, defineEmits} from "vue";

import {FilterInterface, MinMaxInterface} from "@/components/filter/filter-interfaces";
import MinMaxFilterInput from "@/components/filter/MinMaxFilterInput.vue";


const emits = defineEmits<{
  (e: 'filters:update', value: FilterInterface<MinMaxInterface>[]): void
}>();


const ratingFilterMin = ref(0)
const ratingFilterMax = ref(5)

const priceFilterMin = ref(0)
const priceFilterMax = ref(8000)


watch(
  [
      ratingFilterMin,
      ratingFilterMax,
      priceFilterMin,
      priceFilterMax
  ],
  (value) => {
    const filters =[
      {
        key:'rating', value: {min:value[0], max: value[1]}
      },
      {
        key:'price', value: {min:value[2], max: value[3]}
      },
    ];

    emits('filters:update', filters )
  }
)

</script>

<template>
  <div>
    <min-max-filter-input
        v-model:min="ratingFilterMin"
        v-model:max="ratingFilterMax"
        label="Rating"
        :increment-by="0.1"
    >
    </min-max-filter-input>

    <min-max-filter-input
        v-model:min="priceFilterMin"
        v-model:max="priceFilterMax"
        label="Price Range"
        :increment-by="1"
    >
    </min-max-filter-input>
  </div>

</template>
