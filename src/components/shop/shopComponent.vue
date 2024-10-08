<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import renderProducts from './renderProducts/renderProducts.vue';
import headerCp from '../header/headerCp.vue';
import axios from 'axios';
import qs from 'qs';
import _ from 'lodash';

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
  recognizeSort: false,
  page:1,
  sortBy:"",
  updateClearFilter: 1,
});


const router = useRouter();
const route = useRoute();

// ------------------------------------------functions------------------------------------------//

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
  clearArray();
  let parseQuery = qs.parse(location.search, { ignoreQueryPrefix: true });

  if (handleOptions.value.recognizeSort) {
    router.push({ query: { page: 1 } });
  } else {
    const newQuery = { page: 1 };
    if (parseQuery.sort) {
      newQuery.sort = parseQuery.sort; 
    }
    router.push({ query: newQuery });
  }


  if (parseQuery.filter) {
    return; 
  } else {
    
    clearArray();
    productApi(); 
  }
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
    if(distanceToBottom.toFixed(0) <= 1) {
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
  if(!handleOptions.value.loading){
  handleOptions.value.page = 1;
  handleOptions.value.recognizeSort = true
  
    if (route.query.sort) {
      clearFilters()
      router.push(`?page=1`)
      clearArray(); 
    }
  }
}

function prQuery() {
  return qs.parse(location.search, { ignoreQueryPrefix: true });
}

function pushQuery(props) {
  let qqs1 = prQuery();
   
  let currentQuery = _.merge(qqs1, props)
  let qqs = qs.stringify(currentQuery);
  router.push(`?${qqs}`);
}


function giveValueToTheSort(props) {
  if(handleOptions.value.loading) {
    return
  }else {
    clearFilters()
    handleOptions.value.sortBy = props
    router.push({ query: { page: 1 } })
  }
  
}

function getPriceDataFromquery() {
  let replaceS = prQuery().filter?.price;

  if (typeof replaceS === 'string') {
  const priceArray = replaceS.split(',');

  if (priceArray.length === 2) {
    
    const minPrice = parseInt(priceArray[0]);
    const maxPrice = parseInt(priceArray[1]);
 
    handleOptions.value.minPrice = minPrice;
    handleOptions.value.maxPrice = maxPrice;
  } else {
    const price = parseInt(priceArray[0], 10);
    handleOptions.value.minPrice = price; 
  }
} 
}

// ------------------------------------watchs-------------------------------------//

watch([() => handleOptions.value.updateClearFilter, () => handleOptions.value.recognizeSort], () => {

  let parseQuery = qs.parse(location.search, { ignoreQueryPrefix: true })
  
  if(handleOptions.value.recognizeSort) {
    router.push(`?page=1`);
  }else {
    if(parseQuery.sort) {
      router.push(`?page=1&sort=${parseQuery.sort}`);
    }else {
      router.push(`?page=1`);
    }
  }
  
  
  if ((parseQuery.sort || parseQuery.page)) {
    return; 
  }else {
    console.log("console")
    clearArray();
  }
});


watch(() => handleOptions.value.itemsIsExistInput, () => {
  
  let filterParams = {
    filter: {
        in_stock: handleOptions.value.itemsIsExistInput
      },
      
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
    let parseQuery = prQuery()
    if(parseQuery?.filter?.options?.color ||parseQuery?.filter?.options?.size || parseQuery?.filter?.options?.in_stock || parseQuery?.page &&  pageCountValue.value.total_count>25) {
      
      route.query.page = 1
      scrollTo(0 , 0)

      if(parseQuery?.filter?.price){
        delete parseQuery.filter.price
        pushQuery(filterParams)
      }else {
        pushQuery(filterParams)
      }

    }else {
      console.log("err in 194")
    }
  }
});

watch(() => route.query?.filter?.price, (newPrice) => {
  if (newPrice) {
    const [minPrice, maxPrice] = newPrice.split(',').map(Number);
    handleOptions.value.minPrice = minPrice;
    handleOptions.value.maxPrice = maxPrice;
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

  let parseQuery = prQuery()

  if (!parseQuery.filter) {
    parseQuery.filter = {};
  }
  if (!parseQuery.filter.options) {
    parseQuery.filter.options = {};
  }

  if ((parseQuery.filter?.price || parseQuery.filter?.in_stock) && pageCountValue.value.total_count > 25) {
    handleOptions.value.page = 1;
    scrollTo(0, 0);

    parseQuery.filter.options.color = null;
    parseQuery.filter.options.size = null;

    Object.keys(colorOptions.filter.options).forEach((optionKey) => {
      parseQuery.filter.options[optionKey] = colorOptions.filter.options[optionKey];
    });

    pushQuery(parseQuery);

  } else {
    if (Object.keys(colorOptions.filter.options).length > 0) {
      pushQuery(colorOptions);
    }
  }
});

// ------------------------------------onMounted-------------------------------------//

onMounted(() => {
  handleOptions.value.itemsIsExistInput = route.query.in_stock === 'true';
  document.addEventListener("scroll" , handleScroll)
  scrollTo(0 , 0)
  getPriceDataFromquery()
  productApi();
})
</script>

<template>
  <div class="products">
    <div class="wrapper">
      <div class="part1">
        <headerCp />
      </div>
      <div class="part3">
        <div class="product-items">
          <div class="the-best">
            <h3 :class="[route.query.sort == 'price' ? 'redBorder' : 'textColor']" @click="(() => {
              giveValueToTheSort('price')
            })">ارزان ترین</h3>
            <h3 :class="[route.query.sort == '-price' ? 'redBorder' : 'textColor']" @click="() => {
              giveValueToTheSort('-price')
            } ">گران ترین</h3>
            <h3 @click="(() => {
              giveValueToTheSort('updated_at')
            })" :class="[route.query.sort == 'updated_at' ? 'redBorder' : 'textColor']">جدید ترین</h3>
            <h3 @click="clearSort" :class="[!route.query.sort && 'redBorder']">پر بازدید ترین</h3>
          </div>
          <div class="render">
            <renderProducts  v-for="items in infoValue" :key="items.id" :items="items" :img="img" />
          </div>
          <h1 style="margin: 10px 0 200px 0;" v-if="handleOptions.loading">loading...</h1>
          <h1 v-else style="margin: 10px 0 200px 0;">{{ route.query.page >= pageCountValue.total_pages ? "محصول دیگری وجود ندارد" : infoValue.length >0 ? 'بارگذاری بیشتر محصولات' : "" }}</h1>
        </div>
        <div class="navbar">
          <div class="intro">
            <button  @click="clearFilters"><h4 class="redColor">حذف فیلتر</h4></button>
            <h3>فیلترها</h3>
          </div>
          <div class="color">
            <div @click="setClass = !setClass" class="p1 flx">
              <i :id="[setClass && 'rotate']" class="fa-solid fa-sort-down"></i>
              <h4>رنگ ها و سایز ها</h4>
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
            <div class="form-check form-switch">
              <input v-model="handleOptions.itemsIsExistInput" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked>
            </div>
            <h4>محصولات موجود</h4>
          </div>
          <div class="priceRange">
            <div @click="handleOptions.showInputsForPrice = !handleOptions.showInputsForPrice" class="info flx">
              <i :id="[handleOptions.showInputsForPrice && 'rotate']" class="fa-solid fa-sort-down"></i>
              <h4>رنج قیمت</h4>
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