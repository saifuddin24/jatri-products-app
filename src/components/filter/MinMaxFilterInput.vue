<script setup lang="ts">
import {defineEmits, defineProps, ref, watch} from "vue";


  interface MinMaxPropsInterface {
    label: string;
    min:number,
    max:number,
    incrementBy:number
  }

  const props = defineProps<MinMaxPropsInterface>();

  const emit = defineEmits<{
    (e: 'update:min', value: number): void
    (e: 'update:max', value: number): void
  }>();


  const slider_min = ref(props.min);
  const slider_max = ref(props.max);

  const input_min = ref(props.min);
  const input_max = ref(props.max);

  watch(
      () => [input_min.value, input_max.value],
    (minMax) =>{
        emit('update:min', Number(minMax[0]))
        emit('update:max', Number(minMax[1]))
    }
  )

  watch(
      () => [props.min, props.max],
      (minMax) =>{
        input_min.value = minMax[0];
        input_max.value = minMax[1];
      }
  )

</script>

<template>
  <div>

    <label class="block">{{props.label}}</label>

    <div class="filter-inputs">

      <div class="flex gap-1">

        <div class="min-text-box min-text-box-min">
          <label>Min</label>
          <input type="number" :min="slider_min"
                 :max="slider_max"
                 :step="props.incrementBy ||0.1"
                 v-model="input_min"
                 class="w-16 text-sm border text-right"
          >
        </div>

        <input type="range"
               :min="slider_min"
               :max="slider_max"
               :step="props.incrementBy ||0.1"
               v-model="input_min"
               class="range-slider"
        >
      </div>

      <div class="flex gap-1">

        <input type="range"
               :min="slider_min"
               :max="slider_max"
               :step="props.incrementBy ||0.1"
               v-model="input_max"
               class="range-slider"
        >

        <div class="min-text-box min-text-box-max">
          <label>Max</label>
          <input type="number"
                 :min="slider_min"
                 :max="slider_max"
                 :step="props.incrementBy ||0.1"
                 v-model="input_max"
                 class="w-16 text-sm border"
          >
        </div>

      </div>

    </div>
  </div>

</template>

<style scoped>

  .filter-inputs {
    @apply flex gap-3 items-end border p-2 bg-gray-100 rounded shadow
  }

  .min-text-box {
    @apply flex flex-col
  }

  .min-text-box label {
    @apply text-xs leading-none
  }

  .min-text-box.min-text-box-min {
    @apply text-right
  }


</style>