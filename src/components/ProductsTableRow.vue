<script setup lang="ts">

  import {defineEmits, defineProps, ref} from "vue";
  import ProductItem from "@/types/ProductItem";

  const emit = defineEmits<({e:'click:detail', type:number})>();

  interface PropsInterface {
    product: ProductItem;
    serial:number;
    detailsShowing: boolean;
  }

  const props = defineProps<PropsInterface>();

  const detailsShown = ref<boolean>(false);

</script>

<template>
  <tr class="row">
    <td class="serial">{{props.serial}}</td>
    <td class="title">{{ props.product.title }} {{props.product.id}}</td>
    <td class="rating">{{props.product.rating}}</td>
    <td class="price">{{props.product.price}}</td>
    <td class="action">
      <button
          class="btn"
          :class="props.detailsShowing ? 'btn-secondary':'btn-primary'"
          @click.prevent="emit('click:detail', props.product.id )">
        {{ props.detailsShowing ? "Close":"Show" }}
      </button>
    </td>
  </tr>

  <tr v-if="props.detailsShowing">
    <td colspan="5">
      <slot name="detail" :id="props.product.id"></slot>
    </td>
  </tr>

</template>

<style scoped>
  .price, .rating {
    @apply text-center
  }

</style>
