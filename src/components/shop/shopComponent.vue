<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import renderProducts from './renderProducts/renderProducts.vue'
import headerCp from '../header/headerCp.vue'
import axios from 'axios'
import qs from 'qs'
import _ from 'lodash'

let infoValue = ref([])
let pageCountValue = ref({})
let img = ref([])
let options = ref([])
let setClass = ref(false)
let handleOptions = ref({
  in_stock: false,
  minPrice: null,
  maxPrice: null,
  setQueryOptions: {},
  submitQuery: false,
  showInputsForPrice: false,
  loading: false,
  recognizeSort: false,
  page: 1,
  sortBy: '',
  updateClearFilter: 1
})

const router = useRouter()
const route = useRoute()

// ------------------------------------------functions------------------------------------------//

async function productApi() {
  handleOptions.value.loading = true
  await axios
    .get(`https://demo.spreecommerce.org/api/v2/storefront/products?include=images`, {
      params: route.query
    })
    .then((response) => {
      const newProducts = response.data.data
      const newImagesProducts = response.data.included
      pageCountValue.value = response.data.meta
      infoValue.value.push(...newProducts)
      img.value.push(...newImagesProducts)
      options.value = response.data.meta.filters.option_types
    })
    .catch((e) => {
      console.log(e)
    })
    .finally(() => {
      handleOptions.value.loading = false
    })
}

function clearFilters() {
  let pr = prQuery()
  handleOptions.value.minPrice = null
  handleOptions.value.maxPrice = null
  Object.assign(handleOptions.value.setQueryOptions, pr.filter?.options || {})

  if (pr.filter && pr.sort) {
    router.push(`?page=1&sort=${route.query.sort}`)
    clearArray()
  } else if (pr.filter) {
    router.push(`?page=1`)
    handleOptions.value.page = 1
    clearArray()
  }
}

// const toggleQuery = () => {
//   handleOptions.value.submitQuery = !handleOptions.value.submitQuery;
// };

function loadMore() {
  ++handleOptions.value.page
}

function handleScroll() {
  const scrollHeight = window.innerHeight + window.scrollY
  const offsetHeight = document.body.offsetHeight
  const distanceToBottom = offsetHeight - scrollHeight
  if (distanceToBottom.toFixed(0) <= 1) {
    if (handleOptions.value.loading) {
      return
    } else {
      if (pageCountValue.value.total_count < 25) {
        return
      } else {
        if (route.query.page >= pageCountValue.value.total_pages) {
          return
        } else {
          loadMore()
        }
      }
    }
  }
}

function clearArray() {
  infoValue.value = []
  img.value = []
}

function prQuery() {
  return qs.parse(location.search, { ignoreQueryPrefix: true })
}

function pushQuery(props) {
  let qqs1 = prQuery()
  let currentQuery = _.merge(qqs1, props)
  let qqs = qs.stringify(currentQuery)
  router.push(`?${qqs}`)
}

function giveValueToTheSort(sortOption) {
  if (!handleOptions.value.loading) {
    handleOptions.value.sortBy = sortOption // This triggers the watcher
  }
}

function getPriceDataFromquery() {
  let replaceS = prQuery().filter?.price
  if (typeof replaceS === 'string') {
    const priceArray = replaceS.split(',')
    if (priceArray.length === 2) {
      const minPrice = parseInt(priceArray[0])
      const maxPrice = parseInt(priceArray[1])
      handleOptions.value.minPrice = minPrice
      handleOptions.value.maxPrice = maxPrice
    } else {
      const price = parseInt(priceArray[0], 10)
      handleOptions.value.minPrice = price
    }
  }
}

function submitQueryOptions() {
  let colorOptions = {
    filter: {
      options: {}
    }
  }
  Object.keys(handleOptions.value.setQueryOptions).forEach((key) => {
    const value = handleOptions.value.setQueryOptions[key]
    if (value) {
      colorOptions.filter.options[key] = value
    }
  })

  return colorOptions
  // let parseQuery = prQuery()
  // if (!parseQuery.filter) {
  //   parseQuery.filter = {};
  // }
  // if (!parseQuery.filter.options) {
  //   parseQuery.filter.options = {};
  // }
  // if ((parseQuery.filter?.price || parseQuery.filter?.in_stock) && pageCountValue.value.total_count > 25) {

  //   // handleOptions.value.page = 1;
  //   // scrollTo(0, 0);
  //   // parseQuery.filter.options.color = null;

  //   Object.keys(colorOptions.filter.options).forEach((optionKey) => {
  //     parseQuery.filter.options[optionKey] = colorOptions.filter.options[optionKey];
  //   });
  //   options.value.forEach((e) => {
  //     if(handleOptions.value.setQueryOptions[e.name] == "") {
  //       return
  //     }else {
  //       pushQuery(parseQuery);
  //     }

  // })

  // } else {
  //   if (Object.keys(colorOptions.filter.options).length > 0) {
  //     pushQuery(colorOptions);
  //   }
  // }
}
function in_stock() {
  let filterParams = {
    filter: {
      in_stock: handleOptions.value.in_stock
    }
  }
  return filterParams
}
function priceFilter() {
  if(handleOptions.value.minPrice && handleOptions.value.maxPrice) {

    let filterParams = {
      filter: {
        price: `${handleOptions.value.minPrice},${handleOptions.value.maxPrice}`
      }
    }
    return filterParams
  }else {
    let filterParams = {
      filter: {
        price: undefined
      }
    }
    return filterParams
  }
}
function setQueryInUrl() {
  
  let merge = _.merge(submitQueryOptions(), in_stock(), priceFilter())
  let obj = Object.values(merge.filter.options)
  if( obj.length > 0 || merge.filter?.in_stock !==false || merge.filter?.price !== undefined) {
    clearArray()
    
    pushQuery(merge)
  }
}

// ------------------------------------watchs-------------------------------------//

// watch(() => handleOptions.value.itemsIsExistInput, () => {
//   let filterParams = {
//     filter: {
//       in_stock: handleOptions.value.itemsIsExistInput
//     },
//   };

//   // Clear the array only if it's a new filter being applied.
//   if (handleOptions.value.page === 1) {

//     clearArray();  // This clears the products only when the filter changes
//   }
//   pushQuery(filterParams);
// });

// watch(() => handleOptions.value.submitQuery, () => {
//   if (handleOptions.value.minPrice !== null && handleOptions.value.maxPrice !== null && handleOptions.value.submitQuery) {
//     let filterParams = {
//       filter: {
//         price: `${handleOptions.value.minPrice},${handleOptions.value.maxPrice}`
//       },
//     };
//     clearArray()
//     let parseQuery = prQuery()
//     if(parseQuery?.filter?.options?.color ||parseQuery?.filter?.options?.size || parseQuery?.filter?.options?.in_stock || parseQuery?.page &&  pageCountValue.value.total_count>25) {
//       route.query.page = 1
//       scrollTo(0 , 0)
//       if(parseQuery?.filter?.price){
//         delete parseQuery.filter.price
//         pushQuery(filterParams)
//       }else {
//         pushQuery(filterParams)
//       }
//     }else {
//       console.log("214")
//     }
//   }
// });

// watch(() => route.query?.filter?.price, (newPrice) => {
//   if (newPrice) {
//     const [minPrice, maxPrice] = newPrice.split(',').map(Number);
//     handleOptions.value.minPrice = minPrice;
//     handleOptions.value.maxPrice = maxPrice;
//   }
// });

watch(
  () => handleOptions.value.page,
  () => {
    let filterParams = {
      page: Number(handleOptions.value.page)
    }

    pushQuery(filterParams)
  }
)

watch(
  () => route.query,
  () => {
    let p = prQuery()
    handleOptions.value.itemsIsExistInput = p.filter?.in_stock
    Object.assign(handleOptions.value.setQueryOptions, p.filter?.options || {})
    productApi()
  }
)

watch(
  () => handleOptions.value.sortBy, 
  (newVal) => {
    if (!handleOptions.value.loading) {
      let currentQuery = prQuery() // Parse the current URL query

      if (newVal === 'home') {
        delete currentQuery.sort // Remove the sort key
        currentQuery.page = 1 // Reset the page to 1
      } else {
        currentQuery.sort = newVal // Set the new sort value
      }

      // Convert the modified query object back to a query string
      let updatedQueryString = qs.stringify(currentQuery)
      
      // Push the new query string to the router
      router.push(`?${updatedQueryString}`)

      clearArray()
    }
  }
)

// watch(handleOptions.value.setQueryOptions, (newVal) => {
//   let colorOptions = {
//     filter: {
//       options: {},
//     }
//   };
//   Object.keys(handleOptions.value.setQueryOptions).forEach((key) => {
//     const value = handleOptions.value.setQueryOptions[key];
//     if (value) {
//       colorOptions.filter.options[key] = value;
//     }
//   });
// if((newVal.color && newVal.size) !=="" ) {
//   clearArray()
// }else{
//   return
// }

//   let parseQuery = prQuery()
//   if (!parseQuery.filter) {
//     parseQuery.filter = {};
//   }
//   if (!parseQuery.filter.options) {
//     parseQuery.filter.options = {};
//   }
//   if ((parseQuery.filter?.price || parseQuery.filter?.in_stock) && pageCountValue.value.total_count > 25) {

//     handleOptions.value.page = 1;
//     scrollTo(0, 0);
//     parseQuery.filter.options.color = null;

//     Object.keys(colorOptions.filter.options).forEach((optionKey) => {
//       parseQuery.filter.options[optionKey] = colorOptions.filter.options[optionKey];
//     });
//     options.value.forEach((e) => {
//       if(handleOptions.value.setQueryOptions[e.name] == "") {
//         return
//       }else {
//         pushQuery(parseQuery);
//       }

//   })

//   } else {
//     if (Object.keys(colorOptions.filter.options).length > 0) {
//       pushQuery(colorOptions);
//     }
//   }
// });

// ------------------------------------onMounted-------------------------------------//

onMounted(() => {
  let p = prQuery()
  Object.assign(handleOptions.value.setQueryOptions, p.filter?.options || {})
  // handleOptions.value.itemsIsExistInput = p.filter?.in_stock === 'true'
  document.addEventListener('scroll', handleScroll)
  scrollTo(0, 0)
  getPriceDataFromquery()
  productApi()
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
            <h3
              :class="[route.query.sort == 'price' ? 'redBorder' : 'textColor']"
              @click="
                () => {
                  giveValueToTheSort('price')
                }
              "
            >
              ارزان ترین
            </h3>
            <h3
              :class="[route.query.sort == '-price' ? 'redBorder' : 'textColor']"
              @click="
                () => {
                  giveValueToTheSort('-price')
                }
              "
            >
              گران ترین
            </h3>
            <h3
              @click="
                () => {
                  giveValueToTheSort('updated_at')
                }
              "
              :class="[route.query.sort == 'updated_at' ? 'redBorder' : 'textColor']"
            >
              جدید ترین
            </h3>
            <h3 @click="giveValueToTheSort('home')" :class="[!route.query.sort && 'redBorder']">
              پر بازدید ترین
            </h3>
          </div>
          <div class="render">
            <renderProducts v-for="items in infoValue" :key="items.id" :items="items" :img="img" />
          </div>
          <h1 style="margin: 10px 0 200px 0" v-if="handleOptions.loading">loading...</h1>
          <h1 v-else style="margin: 10px 0 200px 0">
            {{
              route.query.page >= pageCountValue.total_pages
                ? 'محصول دیگری وجود ندارد'
                : infoValue.length > 0
                  ? 'بارگذاری بیشتر محصولات'
                  : ''
            }}
          </h1>
        </div>
        <div class="navbar">
          <div class="intro">
            <button @click="clearFilters"><h4 class="redColor">حذف فیلتر</h4></button>
            <h3>فیلترها</h3>
          </div>
          <div class="color">
            <div @click="setClass = !setClass" class="p1 flx">
              <i :id="[setClass && 'rotate']" class="fa-solid fa-sort-down"></i>
              <h4>رنگ ها و سایز ها</h4>
            </div>
            <div v-if="options.length > 0" id="divStyle" :class="[setClass ? 'p2' : 'dontShow']">
              <select
                v-for="option in options"
                :key="option.id"
                v-model="handleOptions.setQueryOptions[option.name]"
              >
                <option value="">Select {{ option.name }}</option>
                <option
                  v-for="optionValue in option.option_values"
                  :key="optionValue.id"
                  :value="optionValue.name"
                >
                  {{ optionValue.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="existProducts flx">
            <div class="form-check form-switch">
              <input
                v-model="handleOptions.in_stock"
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckChecked"
                checked
              />
            </div>
            <h4>محصولات موجود</h4>
          </div>
          <div class="priceRange">
            <div
              @click="handleOptions.showInputsForPrice = !handleOptions.showInputsForPrice"
              class="info flx"
            >
              <i
                :id="[handleOptions.showInputsForPrice && 'rotate']"
                class="fa-solid fa-sort-down"
              ></i>
              <h4>رنج قیمت</h4>
            </div>
            <div id="input" :class="[handleOptions.showInputsForPrice ? 'show' : 'dontShow']">
              <input v-model="handleOptions.minPrice" type="number" placeholder="حد اقل" />
              <input v-model="handleOptions.maxPrice" type="number" placeholder="حد اکثر" />
            </div>
          </div>
          <button @click="setQueryInUrl">اعمال فیلتر ها</button>
        </div>
      </div>
    </div>
  </div>
</template>
