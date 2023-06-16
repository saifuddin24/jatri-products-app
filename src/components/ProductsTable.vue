<script setup lang="ts">
import {computed, defineProps, onMounted, ref, watch} from "vue";
import ProductsTableRow from './ProductsTableRow.vue';
import ProductItem from "@/types/ProductItem";
import ProductDetails from "@/components/ProductDetails.vue";
import {FilterInterface, MinMaxInterface} from "@/components/filter-interfaces";
import Pagination from "@/components/Pagination.vue";

interface TableProps {
  filters:FilterInterface<MinMaxInterface|any>[]
}

// eslint-disable-next-line vue/no-setup-props-destructure
const {filters} = defineProps<TableProps>();


const products = ref<ProductItem[]>([]);
const productsDetailsLoaded = ref<ProductDetails[]>([]);

interface ProductListResultInterface {
  products: ProductItem[];
  limit:number;
  skip:number;
  total:number
}

const sortKey = ref<string>('');
const sortType = ref<string>('');
const page = ref<number>(1);
const items_per_page = ref<number>(5);
const total_pages = ref<number>(0);

interface FilterItem {
  key: string;
  value: string|number
}

function sortItems( key ){

  if( key != sortKey.value) {
    sortType.value = 'asc';
    sortKey.value = key;
  }else {
    sortKey.value = sortType.value == 'desc' ? '':key;
    if( sortKey.value ) {
      sortType.value = sortType.value == 'asc' ? 'desc':'asc';
    }
  }

}

async function loadProducts(){
  try {
    const result:ProductListResultInterface =
        await fetch('https://dummyjson.com/products?limit=100')
            .then( ( r ) => r.json( ) )
    products.value = result.products

  }catch ( err ){
    console.warn( err );
  }
}

const getProducts = computed<ProductItem[]>(() => {

  let productsList = products.value;

  if(sortKey.value) {
    productsList = productsList.sort((a:ProductItem, b:ProductItem) => {
      if( sortType.value === 'asc' ) {
        return a[ sortKey.value ] - b[ sortKey.value ];
      } else {
        return b[ sortKey.value ] - a[ sortKey.value ];
      }
    });
  } else {
    productsList = productsList.sort((a:ProductItem,b:ProductItem) => a.id-b.id )
  }

  if( filters.length ) {
    productsList = productsList.filter(product => {
      return filters.map(
          f => {
            return (
                product[f.key] >= f.value.min &&
                product[f.key] <= f.value.max
            )
          }
      ).indexOf( false ) === -1
    });
  }

  return productsList;
});

const getPaginatedProducts = computed<ProductItem[]>(() => {
  const sliceFrom = ((page.value - 1) * items_per_page.value);
  return getProducts.value.slice( sliceFrom, (items_per_page.value || 5) + sliceFrom);
})

async function loadSingleProduct(id){

  let detail = productsDetailsLoaded.value.find(p=>p.id === id) ;

  if( !detail ) {
     detail = await fetch(`https://dummyjson.com/products/${id}`)
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

const sortIcon = ( key ) => {
  return sortKey.value === key ? ( sortType.value === 'asc' ? 'a-z':'z-a' ):'';
};

watch(  filters, () => {
  page.value = 1
})


</script>

<template>
   <table class="product-table">
    <thead>
      <tr>
        <td>Sl</td>
        <td>Name</td>

        <td @click.prevent="sortItems('rating')" class="sortable-column">
          <span>Rating</span>
          <span class="sort-icon" v-if="sortIcon('rating')">{{sortIcon('rating')}}</span>
        </td>

        <td @click.prevent="sortItems('price')" class="sortable-column">
          <span>Price</span>
          <span class="sort-icon" v-if="sortIcon('price')">{{sortIcon('price')}}</span>
        </td>

        <td>Action</td>
      </tr>
    </thead>

    <tbody>

      <products-table-row
          v-for="(product,index) in getPaginatedProducts"
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

  <pagination v-model="page"
              v-model:items-per-page="items_per_page"
              v-model:total-pages="total_pages"
              :total-items="getProducts.length"
              class="pagination"
  >

    <template #prepend>
      <div>Showing page {{page}} of {{total_pages}} of total {{ getProducts.length }} items</div>
    </template>

  </pagination>
</template>

<style>
  .product-table {
    border-collapse: collapse;
    @apply w-full
  }

  .product-table .row {
    @apply text-gray-800
  }

  .product-table thead tr td {
    @apply text-center bg-gray-100
  }

  .product-table .row .action {
    @apply  text-green-600 text-base text-center
  }

  .product-table tr td {
    @apply px-3 py-2 border-b border-gray-300
  }

  .sortable-column {
    @apply cursor-pointer
  }

  .sortable-column .sort-icon {
    @apply border px-2 ml-1 text-xs
  }

  .pagination {
    @apply flex flex-col md:flex-row items-center justify-between mt-1
  }

</style>