<script setup>
import { ref, onMounted, watch, computed, onUpdated } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import renderProducts from './renderProducts/renderProducts.vue';
import headerCp from '../header/headerCp.vue';
import axios from 'axios';
import qs from 'qs';

let infoValue = ref([]);
let img = ref([]);
let showInputsForPrice = ref(false);
let options = ref([]);
const submitQuery = ref(false);
let handleOptions = ref({
  itemsIsExistInput : false,
  minPrice : null,
  maxPrice : null,
})


let setClass = ref(false);

let setQueryOptions = ref({}); // Store selected options as an object

const router = useRouter();
const route = useRoute();

async function productApi() {
 
  
  try {
    console.log(route.query)
    const qu = JSON.parse(JSON.stringify(route.query))
    const response = await axios.get(
      `https://demo.spreecommerce.org/api/v2/storefront/products?include=images`, {
        params: qu
      }
      
    );
    infoValue.value = response.data.data;
    img.value = response.data.included;
    options.value = response.data.meta.filters.option_types;

  } catch (error) {
    console.log(error)
  }
}

function handleCheckboxChange(event) {
  handleOptions.value.itemsIsExistInput= event.target.checked;
}

function clearFilters() {
  handleOptions.value.itemsIsExistInput = false;
  handleOptions.value.minPrice = null;
  handleOptions.value.maxPrice = null;
  setQueryOptions.value = {}; 
  router.replace({ query: {} });
}
const toggleQuery = () => {
  submitQuery.value = !submitQuery.value; 
};
watch(handleOptions.value.itemsIsExistInput, () => {

  router.push({ query: { ...route.query, onlyExist: handleOptions.value.itemsIsExistInput }});

});
watch( submitQuery, () => {
 
  if (handleOptions.value.minPrice !== null && handleOptions.value.maxPrice !== null && submitQuery.value ) {
    let filterParams ={
    filter : {
      // in_stock : route.query.onlyExist ? route.query.onlyExist : null,
      price :  `${handleOptions.value.minPrice},${handleOptions.value.maxPrice}`
    },
  }
  let qqs = qs.stringify(filterParams);
    router.push(`?${qqs}`);
  }
});

watch(() => route.query, (from, to) =>  {
  console.log({ from, to })
  console.log('route changed')
  productApi();
});

watch( setQueryOptions.value, () => {
 
  let colorOptions = {
    filter:{
      options:{}
    }
  }
  Object.keys(setQueryOptions.value).forEach((key) => {
      if (setQueryOptions.value[key]) {
        colorOptions.filter.options[key] = setQueryOptions.value[key];
      }
    });
    let qqs = qs.stringify(colorOptions);
  router.push(`?${qqs}`);
});

// onMounted(() => {
  
  
//     productApi();
  
// });
</script>

<template>
  <div class="products">
    <div class="wrapper">
      <div class="part1">
        <headerCp />
      </div>
      <div class="part2">
        <h3>adadad</h3>
        <h3>adadada</h3>
        <h3>dadada</h3>
        <h3>dadadadad</h3>
        <h3>dadadad</h3>
      </div>
      <div class="part3">
        <div class="product-items">
          <div class="the-best">
            <h3>fafafa</h3>
            <h3>faffa</h3>
            <h3>fafafa</h3>
            <h3>fafaf</h3>
          </div>
          <div class="render">
            <renderProducts v-for="items in infoValue" :key="items.id" :items="items" :img="img" />
          </div>
        </div>
        <div class="navbar">
          <div class="intro">
            <h3>Filters</h3>
            <button @click="clearFilters"><h4>Clear filters</h4></button>
          </div>
          <div class="color">
            <div @click="setClass = !setClass" class="p1 flx">
              <h4>Color</h4>
              <i :id="[setClass && 'rotate']" class="fa-solid fa-sort-down"></i>
            </div>
            <div id="divStyle" :class="[setClass ? 'p2' : 'dontShow']">
              <select v-for="option in options" :key="option.id" v-model="setQueryOptions[option.name]">
                <option value="">Select {{ option.name }}</option>
                <option v-for="optionValue in option.option_values" :key="optionValue.id" :value="optionValue.name">
                  {{ optionValue.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="existProducts flx">
            <h4>Exist Products</h4>
            <input :checked="handleOptions.itemsIsExistInput" @change="handleCheckboxChange" type="checkbox" />
          </div>
          <div class="priceRange">
            <div @click="showInputsForPrice = !showInputsForPrice" class="info flx">
              <h4>Price Range</h4>
              <i :id="[showInputsForPrice && 'rotate']" class="fa-solid fa-sort-down"></i>
            </div>
            <div id="input" :class="[showInputsForPrice ? 'show' : 'dontShow']">
              <input v-model="handleOptions.minPrice" type="number" placeholder="Min" />
              <input v-model="handleOptions.maxPrice" type="number" placeholder="Max" />
              <button @click="toggleQuery">click</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
