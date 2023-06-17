<template>
  <td @click.prevent="sort" class="sortable-column">
    <span><slot></slot></span>
    <span class="sort-icon" v-if="sortIcon">{{sortIcon}}</span>
  </td>
</template>

<script setup lang="ts">

import {computed, defineEmits, ref, watch} from "vue";

interface SortableInterface {
  column:string;
  sortType: string;
  sortKey: string
}

const props = defineProps<SortableInterface>()
const emits = defineEmits<{
  (e:'update:sortType', value:string ):void ,
  (e:'update:sortKey', value:string ):void ,
}>()
const sort_type = ref<string>(props.sortType);
const sort_key = ref<string>(props.sortKey);

function sort(){

  if( props.column != sort_key.value) {
    sort_type.value = 'asc';
    sort_key.value = props.column;
  }else {
    sort_key.value = sort_type.value == 'desc' ? '':props.column;
    if( sort_key.value ) {
      sort_type.value = sort_type.value == 'asc' ? 'desc':'asc';
    }
  }
}

const sortIcon = computed<string>(() =>{
  return props.column === sort_key.value ? ( sort_type.value === 'asc' ? 'a-z':'z-a' ):'';
})

watch( sort_type, (t) => emits('update:sortType', t ))
watch( () => props.sortType, (t) => sort_type.value = t)

watch( sort_key, (t) => emits('update:sortKey', t ))
watch( () => props.sortKey, (t) => sort_key.value = t)

</script>

<style scoped>

</style>