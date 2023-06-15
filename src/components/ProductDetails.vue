<script setup lang="ts">
 import {defineProps, ref} from "vue";
  import ProductDetails from "@/types/ProductItem";

  interface ProductDetailProps {
    product:  ProductDetails
  }

  const props = defineProps<ProductDetailProps>();

  // const product = ref<ProductItem>({});
  //
  // props.product.then( p => product.value = p)

</script>

<template>
  <div class="product-details">

    <div>Product Details</div>

    <div>
      <span>Name: </span>
      <span>{{ props.product?.title}}</span>
    </div>

    <div>
      <span>Price: </span>
      <span>{{ props.product?.price}}</span>
    </div>

    <div>
      <span>Rating: </span>
      <span>{{ props.product?.rating}}</span>
    </div>

    <div>
      <span>Description: </span>
      <span>{{ props.product?.description}}</span>
    </div>


  </div>
</template>

<style scoped>
  .product-details {
    border: 1px solid #c1c1c1;
    padding: 1rem;
    border-radius: 2rem;
  }
</style>