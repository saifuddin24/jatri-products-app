<script lang="ts" setup>
  import {computed, defineEmits, defineExpose, defineProps, ref, watch} from "vue";

  interface PaginationPropsInterface {
    modelValue: number;
    itemsPerPage: number;
    totalPages: number;
    maxVisibleLinks: number;
    totalItems: number
  }

  const props = defineProps<PaginationPropsInterface>();

  const emit = defineEmits<{
    (e:'update:modelValue', value:number):void
    (e:'update:itemsPerPage', value:number):void
    (e:'update:totalPages', value:number):void
  }>();

  const currentPage = ref<number>(0);
  const perPage = ref<number>(0);
  const firstPage = ref<number>();
  const endPage = ref<number>();
  currentPage.value = props.modelValue || 1;
  perPage.value = props.itemsPerPage || 5;

  const pagesCount = computed<number>(() => {
    return  Math.floor(props.totalItems / props.itemsPerPage) + ((props.totalItems%props.itemsPerPage) > 0?1:0);
  })

  function makePages():[]{
    const result = [];
    const maxVisibleLinks = props.maxVisibleLinks || 6;

    const maxPageCount = ( pagesCount.value < maxVisibleLinks )
        ? pagesCount.value
        : maxVisibleLinks

    const middlePoint = Math.floor(maxPageCount / 2);

    if( (currentPage.value + middlePoint) >= pagesCount.value ) {

      endPage.value = pagesCount.value + 1;
      firstPage.value = endPage.value - maxPageCount;

    } else {
      firstPage.value = currentPage.value < maxPageCount
          ? 1
          : ( currentPage.value -  middlePoint );

      endPage.value = firstPage.value + maxPageCount;
    }

    for (let i = firstPage.value; i< endPage.value; i++){
      result.push(i);
    }

    return result;
  }

  const totalLinks = computed<[]>(():[] => {
    return  makePages( ) ;
  })

  watch( currentPage, (page) => emit('update:modelValue', page ) )
  watch( () => props.modelValue, (page) => currentPage.value = page || 1);

  watch( perPage, (value) => emit('update:itemsPerPage', value ) )
  watch( () => props.itemsPerPage, (value) => perPage.value = value || 5 )

  watch( pagesCount, (value) => emit('update:totalPages', value ) )


  function goTo( page ){
    currentPage.value = page;
  }

  function goToPrevious(){
    if( currentPage.value > 1 ) {
      currentPage.value--;
    }
  }

  function goToNext(){
    if( currentPage.value < pagesCount.value) {
      currentPage.value++;
    }
  }

  const slotProps = computed(() => {
    return {
      totalItems: props.totalItems,
      totalPages: pagesCount.value,
      perPage: perPage.value,
      currentPage : currentPage.value,
      goToNext,
      goToPrevious,
      goTo
    }
  })

  defineExpose({
    goToNext, goToPrevious, goTo
  })

</script>

<template>
  <div>

    <slot name="prepend" v-bind="slotProps"></slot>

    <ul v-show="totalLinks.length > 1">
      <li class="start">
        <a @click.prevent="goTo(1)" href="">&laquo; Start</a>
      </li>

      <li class="prev">
        <a href="" @click.prevent="goToPrevious">
          &laquo;
        </a>
      </li>

      <li v-for="page in totalLinks"
          :key="page"
          :class="page === currentPage? 'active':''"
      >
        <a href="" @click.prevent="goTo(page)">
          {{page}}
        </a>
      </li>

      <li class="next">
        <a @click.prevent="goToNext" href="">&raquo;</a>
      </li>

      <li class="end">
        <a @click.prevent="goTo(pagesCount)" href="">End &raquo;</a>
      </li>
    </ul>

    <slot name="append" v-bind="slotProps"></slot>

  </div>
</template>


<style scoped>

  ul {
    @apply select-none
  }

  ul li {
    @apply inline-block border cursor-pointer
  }

  ul li.active {
    @apply bg-sky-600 text-white
  }

  ul li a {
    @apply py-1 px-2
  }

  ul li.prev,
  ul li.next {
    @apply bg-green-500
  }

  ul li.prev {
    @apply mx-1
  }

  ul li.prev a,
  ul li.next a{
    @apply text-green-100 font-semibold mx-1
  }

  ul li.next {
    @apply mx-1
  }

  ul li.active a {
    @apply cursor-default text-white
  }


</style>