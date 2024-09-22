<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import renderProducts from './renderProducts/renderProducts.vue';
import headerCp from '../header/headerCp.vue';
import axios from 'axios';
import qs from 'qs';

let infoValue = ref([]);
let img = ref([]);
let options = ref([]);
let handleOptions = ref({
  itemsIsExistInput: false,
  minPrice: null,
  maxPrice: null,
  setQueryOptions: {},
  submitQuery: false,
  showInputsForPrice: false,
  loading: false
});

let setClass = ref(false);

const router = useRouter();
const route = useRoute();

async function productApi() {
  handleOptions.value.loading = true;

  await axios.get(
    `https://demo.spreecommerce.org/api/v2/storefront/products?include=images`, {
      params: route.query
    }
  ).then((response) => {
    infoValue.value = response.data.data;
    img.value = response.data.included;
    options.value = response.data.meta.filters.option_types;
  }).catch((e) => {
    console.log(e);
  }).finally(() => {
    handleOptions.value.loading = false;
  });
}

function handleCheckboxChange(event) {
  handleOptions.value.itemsIsExistInput = event.target.checked;
}

function clearFilters() {
  handleOptions.value.itemsIsExistInput = false;
  handleOptions.value.minPrice = null;
  handleOptions.value.maxPrice = null;

  // Reset each filter option in setQueryOptions
  options.value.forEach(option => {
    console.log(option.name)
    handleOptions.value.setQueryOptions[option.name] = null; // or ''
  });

  router.replace({ query: {} });
}

const toggleQuery = () => {
  handleOptions.value.submitQuery = !handleOptions.value.submitQuery;
};

watch(() => handleOptions.value.itemsIsExistInput, () => {
  router.push({ query: { ...route.query, onlyExist: handleOptions.value.itemsIsExistInput } });
});

watch(() => handleOptions.value.submitQuery, () => {
  if (handleOptions.value.minPrice !== null && handleOptions.value.maxPrice !== null && handleOptions.value.submitQuery) {
    let filterParams = {
      filter: {
        price: `${handleOptions.value.minPrice},${handleOptions.value.maxPrice}`
      },
    };
    let qqs = qs.stringify(filterParams);
    router.push(`?${qqs}`);
  }
});

watch(() => route.query, () => {
  productApi();
});

watch(handleOptions.value.setQueryOptions, () => {
  let colorOptions = {
    filter: {
      options: {}
    }
  };
  Object.keys(handleOptions.value.setQueryOptions).forEach((key) => {
    if (handleOptions.value.setQueryOptions[key]) {
      colorOptions.filter.options[key] = handleOptions.value.setQueryOptions[key];
    }
  });
  let qqs = qs.stringify(colorOptions);
  router.push(`?${qqs}`);
});
</script>

<template>
  <div class="products">
    <div class="wrapper">
      <div class="part1">
        <headerCp />
      </div>
      <div class="part2">
        <h3>جشن مهمانی</h3>
        <h3>کارت پستر</h3>
        <h3>مدرسه و اداره</h3>
        <h3>اکسسوری</h3>
        <h3>قاب موبایل</h3>
        <h3>لوازم خانه</h3>
        <h3>پوشاک</h3>
      </div>
      <div class="part3">
        <div class="product-items">
          <div class="the-best">
            <h3>ارزان ترین</h3>
            <h3>گران ترین</h3>
            <h3>پر فروش ترین</h3>
            <h3>جدید ترین</h3>
            <h3 class="redBorder">پر بازدید ترین</h3>
          </div>
          <div class="render">
            <h1 v-if="handleOptions.loading">loading...</h1>
            <h1 v-else-if="infoValue.length === 0">No products found.</h1>
            <renderProducts v-else v-for="items in infoValue" :key="items.id" :items="items" :img="img" />
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
              <select v-for="option in options" :key="option.id" v-model="handleOptions.setQueryOptions[option.name]">
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
            <div @click="handleOptions.showInputsForPrice = !handleOptions.showInputsForPrice" class="info flx">
              <h4>Price Range</h4>
              <i :id="[handleOptions.showInputsForPrice && 'rotate']" class="fa-solid fa-sort-down"></i>
            </div>
            <div id="input" :class="[handleOptions.showInputsForPrice ? 'show' : 'dontShow']">
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