<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import ProductsTableRow from './ProductsTableRow.vue';
import ProductItem from "@/types/ProductItem";
import ProductDetails from "@/components/ProductDetails.vue";

const products = ref<ProductItem[]>();
const productsDetailsLoaded = ref<ProductDetails[]>([]);

interface ProductListResultInterface {
  products: ProductItem[];
  limit:number;
  skip:number;
  total:number
}

async function loadProducts(){
  const result:ProductListResultInterface =
      await fetch('https://dummyjson.com/products')
          .then((r) => r.json())
  products.value = result.products;
}


async function loadSingleProduct(id){
  let detail = productsDetailsLoaded.value.find(p=>p.id === id);

  if( !detail ) {
    const detail = await fetch(`https://dummyjson.com/products/${id}`)
            .then((r) => r.json())
    detail.showing = true;
    productsDetailsLoaded.value.push(detail)
  } else {
    detail.showing = !detail.showing;
  }
}

function getProductDetails(id):ProductDetails{
  return productsDetailsLoaded.value.find(p=>p.id === id);
}

onMounted(async () =>  {
    await loadProducts();
})


</script>

<template>

  <table class="product-table">
    <thead>
      <tr>
        <td>Sl</td>
        <td>Name</td>
        <td>Rating</td>
        <td>Price</td>
        <td>Action</td>
      </tr>
    </thead>

    <tbody>
      <products-table-row
          v-for="(product,index) in products"
          :product="product"
          :key="product.id"
          :serial="index+1"
          :details-showing="getProductDetails(product.id)?.showing"
          @click:detail="loadSingleProduct(product.id)"
      >
        <template #detail v-if="getProductDetails(product.id)?.showing">
          <product-details :product="getProductDetails(product.id)"></product-details>
        </template>
      </products-table-row>
    </tbody>

  </table>
</template>

<style>
  .product-table {
    width: 100%;
    border-collapse: collapse;
  }

  .product-table tr td {
    border-bottom: #b5b5b5 1px solid;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

</style>