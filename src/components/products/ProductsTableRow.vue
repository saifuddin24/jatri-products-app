<script setup lang="ts">

import {computed, defineEmits, defineProps, ref} from "vue";
  import ProductItem from "@/types/ProductItem";

  const emits = defineEmits<{(e:'click:detail', value:number):void }>();

  interface PropsInterface {
    product: ProductItem;
    serial:number;
    detailsShowing: boolean;
    page: number,
    perPage: number,
  }

  const props = defineProps<PropsInterface>();

  const detailsShown = ref<boolean>(false);
  const loading = ref<boolean>(false);

  const serial = computed<number>(() =>{
    if(props.page > 1) {
      return ((props.page -1) * props.perPage) + (props.serial);
    }
    return props.serial;
  })

  function onClickDetail(){
    emits('click:detail', props.product.id );
  }

</script>

<template>
  <tr class="row">
    <td class="serial">{{ serial }}</td>
    <td class="title">{{ props.product.title }}</td>
    <td class="rating">{{props.product.rating}}</td>
    <td class="price">{{props.product.price}}</td>
    <td class="action">
      <button
          class="btn"
          :class="props.detailsShowing ? 'btn-secondary':'btn-primary'"
          @click.prevent="onClickDetail">
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
  .price, .rating, .serial {
    @apply text-center
  }

</style>
