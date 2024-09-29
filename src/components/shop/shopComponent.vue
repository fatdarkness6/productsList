<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import renderProducts from './renderProducts/renderProducts.vue';
import headerCp from '../header/headerCp.vue';
import axios from 'axios';
import qs from 'qs';

let infoValue = ref([]);
let pageCountValue = ref({});
let img = ref([]);
let options = ref([]);
let setClass = ref(false);
let handleOptions = ref({
  itemsIsExistInput: false,
  minPrice: null,
  maxPrice: null,
  setQueryOptions: {},
  submitQuery: false,
  showInputsForPrice: false,
  loading: false,
  page:1,
  sortBy:"",
  updateClearFilter: 1,
});


const router = useRouter();
const route = useRoute();

async function productApi() {
  handleOptions.value.loading = true; 

  await axios.get(
    `https://demo.spreecommerce.org/api/v2/storefront/products?include=images`, {
      params: route.query
    }
  ).then((response) => {
    const newProducts = response.data.data;
    const newImagesProducts = response.data.included;
    pageCountValue.value = response.data.meta;
    infoValue.value.push(...newProducts);
    img.value.push(...newImagesProducts);
    options.value = response.data.meta.filters.option_types;
  }).catch((e) => {
    console.log(e);
  }).finally(() => {
    handleOptions.value.loading = false;
  });
}

function clearFilters() { 
  handleOptions.value.itemsIsExistInput = false;
  handleOptions.value.minPrice = null;
  handleOptions.value.maxPrice = null;
  options.value.forEach(option => {
    delete handleOptions.value.setQueryOptions[option.name];
  });
  let q = Object.keys(route.query);
  if(q.length >= 1 && route.query.page > 1) {
    handleOptions.value.page = 1;
    clearArray()
  }
    ++handleOptions.value.updateClearFilter
}


const toggleQuery = () => {
  handleOptions.value.submitQuery = !handleOptions.value.submitQuery;
};

function loadMore() {
  ++handleOptions.value.page
}

function handleScroll() {
    const scrollHeight = window.innerHeight + window.scrollY; 
    const offsetHeight = document.body.offsetHeight; 
    const distanceToBottom = offsetHeight - scrollHeight;
    if(distanceToBottom.toFixed(0) <= 0) {
      if(handleOptions.value.loading) {
        return
      }else {
        if(pageCountValue.value.total_count<25) {
          return
        }else {
          if( route.query.page >= pageCountValue.value.total_pages){
            return
          }else {
            loadMore()
          }
        }
      }
    }
}

function clearArray() {
  infoValue.value = [];
  img.value = [];
}

function clearSort() {
  router.push({ query: { ...route.query, sort: undefined } })
  clearArray()
}

function pushQuery(props) {
  let currentQuery = { ...route.query , ...props };
  let qqs = qs.stringify(currentQuery);
  router.push(`?${qqs}`);
}

watch(() => handleOptions.value.updateClearFilter, () => {

  const queryKeys = Object.keys(route.query);

  router.push({ query: { page: 1 } });
  
  if (queryKeys.length === 1 && (queryKeys[0] === 'page')) {
    return; 
  }else {
    clearArray();
  }
});

watch(() => handleOptions.value.itemsIsExistInput, () => {
  
  let filterParams = {
      onlyExist: handleOptions.value.itemsIsExistInput
  }
  pushQuery(filterParams)
  clearArray()
});

watch(() => handleOptions.value.submitQuery, () => {
  if (handleOptions.value.minPrice !== null && handleOptions.value.maxPrice !== null && handleOptions.value.submitQuery) {
    let filterParams = {
      filter: {
        price: `${handleOptions.value.minPrice},${handleOptions.value.maxPrice}`
      },
    };
    clearArray()
    if(route.query["filter[options][color]"] ||route.query["filter[options][size]"] || route.query.onlyExist || route.query.page &&  pageCountValue.value.total_count>25) {
      route.query.page = 1
      scrollTo(0 , 0)
      if(route.query["filter[price]"]){
        delete route.query["filter[price]"]
        pushQuery(filterParams)
      }else {
        pushQuery(filterParams)
      }
    }else {
      delete route.query.page
      let qqs = qs.stringify(filterParams);
      router.push(`?${qqs}`);
    }
  }
});

watch(() => handleOptions.value.page , () => {
    let filterParams = {
        page: `${handleOptions.value.page}`
    };
    pushQuery(filterParams)
})

watch(() => route.query, () => {
  productApi();
  handleOptions.value.itemsIsExistInput = route.query.onlyExist === 'true';
});

watch(() => handleOptions.value.sortBy , () => {
  router.push(`?page=1&sort=${handleOptions.value.sortBy}`)
  clearArray()
})


watch(handleOptions.value.setQueryOptions, () => {
  let colorOptions = {
    filter: {
      options: {},
    }
  };

    Object.keys(handleOptions.value.setQueryOptions).forEach((key) => {
      const value = handleOptions.value.setQueryOptions[key];
      if (value) {
        colorOptions.filter.options[key] = value;
      }
    });

    clearArray();

    const newQuery = { ...route.query };

    if ((newQuery["filter[price]"] || newQuery.onlyExist || newQuery.page) && pageCountValue.value.total_count > 25) {
      handleOptions.value.page = 1; 
      scrollTo(0, 0);

      delete newQuery["filter[options][color]"];
      delete newQuery["filter[options][size]"];

      Object.keys(colorOptions.filter.options).forEach((optionKey) => {
        newQuery[`filter[options][${optionKey}]`] = colorOptions.filter.options[optionKey];
      });

      pushQuery(newQuery);
    } else {
      if (Object.keys(colorOptions.filter.options).length > 0) {
        
        const colorQuery = { filter: { options: colorOptions.filter.options } };
        let qqs = qs.stringify(colorQuery);
        router.push(`?page=1&${qqs}`);
      }
    }
});

onMounted(() => {
  handleOptions.value.itemsIsExistInput = route.query.onlyExist === 'true';
  document.addEventListener("scroll" , handleScroll)
  scrollTo(0 , 0)
})
</script>

<template>
  <div class="products">
    <div class="wrapper">
      <div class="part1">
        <headerCp />
      </div>
      <div class="part2">
        <h3 v-for="category in ['جشن مهمانی', 'کارت پستر', 'مدرسه و اداره', 'اکسسوری', 'قاب موبایل', 'لوازم خانه', 'پوشاک']" :key="category">
          {{ category }}
        </h3>
      </div>
      <div class="part3">
        <div class="product-items">
          <div class="the-best">
            <h3 :class="[route.query.sort == 'price' && 'redBorder']" @click="(() => {
              handleOptions.sortBy = 'price'
               router.push({ query: { ...route.query, page: 1 } })
            })">ارزان ترین</h3>
            <h3 :class="[route.query.sort == '-price' && 'redBorder']" @click="() => {
              handleOptions.sortBy = '-price'
               router.push({ query: { ...route.query, page: 1 } })
            } ">گران ترین</h3>
            <h3 @click="(() => {
              handleOptions.sortBy = 'updated_at'
              router.push({ query: { ...route.query, page: 1 } })
            })" :class="[route.query.sort == 'updated_at' && 'redBorder']">جدید ترین</h3>
            <h3 @click="clearSort" :class="[!route.query.sort && 'redBorder']">پر بازدید ترین</h3>
          </div>
          <div class="render">
            <renderProducts  v-for="items in infoValue" :key="items.id" :items="items" :img="img" />
          </div>
          <h1 style="margin: 10px 0 200px 0;" v-if="handleOptions.loading">loading...</h1>
          <h1 v-else style="margin: 10px 0 200px 0;">{{ route.query.page >= pageCountValue.total_pages ? "" : 'loadMore' }}</h1>
        </div>
        <div class="navbar">
          <div class="intro">
            <h3>فیلترها</h3>
            <button @click="clearFilters"><h4>حذف فیلتر</h4></button>
          </div>
          <div class="color">
            <div @click="setClass = !setClass" class="p1 flx">
              <h4>رنگ ها و سایز ها</h4>
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
            <h4>محصولات موجود</h4>
            <input v-model="handleOptions.itemsIsExistInput"  type="checkbox" />
          </div>
          <div class="priceRange">
            <div @click="handleOptions.showInputsForPrice = !handleOptions.showInputsForPrice" class="info flx">
              <h4>رنج قیمت</h4>
              <i :id="[handleOptions.showInputsForPrice && 'rotate']" class="fa-solid fa-sort-down"></i>
            </div>
            <div id="input" :class="[handleOptions.showInputsForPrice ? 'show' : 'dontShow']">
              <input v-model="handleOptions.minPrice" type="number" placeholder="حد اقل" />
              <input v-model="handleOptions.maxPrice" type="number" placeholder="حد اکثر" />
              <button @click="toggleQuery">اعمال فیلتر برای قیمت</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

// quera سوالات مسابقه ای