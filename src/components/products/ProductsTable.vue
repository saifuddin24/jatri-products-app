<script setup lang="ts">
import {computed, defineProps, onMounted, ref, watch} from "vue";
import ProductsTableRow from './ProductsTableRow.vue';
import ProductItem from "@/types/ProductItem";
import ProductDetails from "@/components/products/ProductDetails.vue";
import {FilterInterface, MinMaxInterface} from "@/components/filter/filter-interfaces";
import Pagination from "@/components/pagination/Index.vue";
import TableSortableColumn from "@/components/products/TableSortableColumn.vue";
import {useProductResource} from "@/components/products/ProductResource";

interface TableProps {
  filters:FilterInterface<MinMaxInterface|any>[]
}

const props = defineProps<TableProps>();

const sortKey = ref<string>('');
const sortType = ref<string>('');
const page = ref<number>(1);
const items_per_page = ref<number>(5);
const total_pages = ref<number>(0);

const {
  products,
  productsDetailsLoaded,
  loadProducts,
  loadSingleProduct
} = useProductResource();

const productList = computed<ProductItem[]>(() => {

  let items = products.value;

  if( props.filters.length ) {
    items = items.filter(product => {
      return props.filters.map(
          f => {
            return (
                product[f.key] >= f.value.min &&
                product[f.key] <= f.value.max
            )
          }
      ).indexOf( false ) === -1
    });
  }

  if(sortKey.value) {
    items = items.sort((a:ProductItem, b:ProductItem) => {
      if( sortType.value === 'asc' ) {
        return a[ sortKey.value ] - b[ sortKey.value ];
      } else {
        return b[ sortKey.value ] - a[ sortKey.value ];
      }
    });
  } else {
    items = items.sort((a:ProductItem,b:ProductItem) => a.id-b.id )
  }

  return items;
});

const getPaginatedProducts = computed<ProductItem[]>(() => {
  const sliceFrom = ((page.value - 1) * items_per_page.value);
  return productList.value.slice( sliceFrom, (items_per_page.value || 5) + sliceFrom);
})

function getProductDetails(id):ProductDetails{
  return productsDetailsLoaded.value.find(p=>p.id === id);
}

onMounted(async () =>  {
    await loadProducts();
})

watch(  props.filters, () => {
  page.value = 1
})

</script>

<template>

  <div class="w-full block overflow-scroll">
    <table class="product-table">
      <thead>
      <tr>
        <td>Sl</td>
        <td>Name {{sortKey}} {{sortType}}</td>

        <TableSortableColumn column="rating"
                             v-model:sort-key="sortKey"
                             v-model:sort-type="sortType"
        >
          Rating
        </TableSortableColumn>

        <TableSortableColumn column="price"
                             v-model:sort-key="sortKey"
                             v-model:sort-type="sortType"
        >
          Price
        </TableSortableColumn>

        <td class="sticky right-0">Action</td>
      </tr>
      </thead>

      <tbody>

        <products-table-row
            v-for="(product,index) in getPaginatedProducts"
            :page="page"
            :per-page="items_per_page"
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

  </div>

  <pagination v-model="page"
              v-model:items-per-page="items_per_page"
              v-model:total-pages="total_pages"
              :total-items="productList.length"
              class="pagination"
  >

    <template #prepend>
      <div>Showing page {{page}} of {{total_pages}} of total {{ productList.length }} items</div>
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
    @apply flex flex-col md:flex-row items-center justify-between mt-3
  }

</style>