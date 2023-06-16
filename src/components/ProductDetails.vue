<script setup lang="ts">
 import {defineProps, ref} from "vue";
  import ProductDetails from "@/types/ProductItem";

  interface ProductDetailProps {
    product:  ProductDetails
  }

  const props = defineProps<ProductDetailProps>();


</script>

<template>
  <div class="product-details">

    <div class="text-center pb-1 border-b border-dashed text-xl font-semibold">Product Details</div>

    <div class="my-5">


      <div class="text-xl">
        <span>Name: </span>
        <span class="font-semibold">{{ props.product?.title}}</span>
      </div>

      <div>
        <span>Price: </span>
        <span>{{ props.product?.price}}</span>
      </div>

      <div>
        <span>Rating: </span>
        <span>{{ props.product?.rating}}</span>
      </div>

      <div class="mt-2">
        <span>Description: </span>
        <span class="text-sky-800">{{ props.product?.description}}</span>
      </div>
    </div>

  </div>
</template>

<style scoped>
  .product-details {
    @apply border p-4 rounded-3xl shadow
  }
</style>