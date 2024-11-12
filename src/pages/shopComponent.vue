<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import renderProducts from '@/components/renderProducts.vue'
import headerCp from '@/components/header/headerCp.vue'
import { usePiniaStore } from '@/stores/makeStoreWithPinia'
import axios from 'axios'
import qs from 'qs'
import _ from 'lodash'

let infoValue = ref([])
let pageCountValue = ref({})
let img = ref([])
let options = ref([])
let setClass = ref(false)
let staticValueFilters = ref({
  in_stock: false,
  minPrice: null,
  maxPrice: null,
  setQueryOptions: {},
})
let handleOptions = ref({
  showInputsForPrice: false,
  loading: false,
  page: 1,
  sortBy: '',
})
let store = usePiniaStore()
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
  if(!handleOptions.value.loading) {
    staticValueFilters.value.minPrice = null
  staticValueFilters.value.maxPrice = null
  Object.keys(staticValueFilters.value.setQueryOptions).forEach((value) => {
    delete staticValueFilters.value.setQueryOptions[value]
  })

  if (pr.filter && pr.sort) {
    router.push(`?page=1&sort=${route.query.sort}`)
    clearArray()
  } else if (pr.filter) {
    router.push(`?page=1`)
    handleOptions.value.page = 1
    clearArray()
  }
  }
  
}

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
    handleOptions.value.sortBy = sortOption
  }
}

function getPriceDataFromquery() {
  let replaceS = prQuery().filter?.price
  if (typeof replaceS === 'string') {
    const priceArray = replaceS.split(',')
    if (priceArray.length === 2) {
      const minPrice = parseInt(priceArray[0])
      const maxPrice = parseInt(priceArray[1])
      staticValueFilters.value.minPrice = minPrice
      staticValueFilters.value.maxPrice = maxPrice
    } else {
      const price = parseInt(priceArray[0], 10)
      staticValueFilters.value.minPrice = price
    }
  }
}

function submitQueryOptions() {
  let colorOptions = {
    filter: {
      options: {}
    }
  }
  Object.keys(staticValueFilters.value.setQueryOptions).forEach((key) => {
    const value = staticValueFilters.value.setQueryOptions[key]
    if (value) {
      colorOptions.filter.options[key] = value
    }
  })
  return colorOptions
}

function in_stock() {
  let filterParams = {
    filter: {
      in_stock: staticValueFilters.value.in_stock
    }
  }
  return filterParams
}

function priceFilter() {
  if (staticValueFilters.value.minPrice && staticValueFilters.value.maxPrice) {
    let filterParams = {
      filter: {
        price: `${staticValueFilters.value.minPrice},${staticValueFilters.value.maxPrice}`
      }
    }
    return filterParams
  } else {
    let filterParams = {
      filter: {
        price: undefined
      }
    }
    return filterParams
  }
}
function setQueryInUrl() {
  let p = prQuery()
  handleOptions.value.page = 1
  p.page = handleOptions.value.page
  const colorOptions = submitQueryOptions()
  const stockOptions = in_stock()
  const priceOptions = priceFilter()


  let mergedQuery = _.merge(p, colorOptions, stockOptions, priceOptions)
  if (
    Object.keys(colorOptions.filter.options).length > 0 ||
    priceOptions.filter.price !== undefined ||
    stockOptions.filter.in_stock !== undefined
  ) {
    let previousQuery = qs.parse(location.search, { ignoreQueryPrefix: true })
    let obj = previousQuery.filter?.options === undefined ? {} : previousQuery.filter?.options
    if (((mergedQuery.filter.in_stock || previousQuery.filter?.in_stock) !== undefined) && mergedQuery.filter.in_stock !== previousQuery.filter?.in_stock) {
      console.log('in_stock&&inif' , mergedQuery.filter.in_stock , previousQuery.filter?.in_stock)
        clearArray()
    }else if(((mergedQuery.filter?.price || previousQuery.filter?.price) !== undefined) && mergedQuery.filter.price !== previousQuery.filter?.price) {
      console.log('priceinif')
        clearArray()
    } else if( !_.isEqual(mergedQuery.filter?.options, obj)) {
      console.log('optionsinif' , mergedQuery.filter?.options, obj)
      clearArray()
    }else {
      console.log("else")
      console.log("in_stock", mergedQuery.filter.in_stock , previousQuery.filter?.in_stock)
      console.log('price', mergedQuery.filter.price, previousQuery.filter?.price)
      console.log('options', mergedQuery.filter.options, obj)
    }
    pushQuery(mergedQuery)
  }
}

// ------------------------------------watchs-------------------------------------//

watch(
  () => handleOptions.value.page,
  () => {
    let filterParams = {
      page: Number(handleOptions.value.page)
    }
    if (handleOptions.value.page == 1) {
      return
    } else {
      pushQuery(filterParams)
    }
  }
)

watch(
  () => route.query,
  () => {
    let p = prQuery()
    staticValueFilters.value.in_stock = p.filter?.in_stock
    Object.assign(staticValueFilters.value.setQueryOptions, p.filter?.options || {})
    productApi()
  }
)

watch(
  () => handleOptions.value.sortBy,
  (newVal) => {
    if (!handleOptions.value.loading) {
      let currentQuery = prQuery()
      if (newVal === 'home') {
        delete currentQuery.sort
        currentQuery.page = 1
        handleOptions.value.page = 1
      } else {
        currentQuery.sort = newVal
        currentQuery.page = 1
        handleOptions.value.page = 1
      }
      let stringQuery = qs.stringify(currentQuery)
      router.push(`?${stringQuery}`)
      clearArray()
    }
  }
)

// ------------------------------------onMounted-------------------------------------//

onMounted(() => {
  let p = prQuery()
  Object.assign(staticValueFilters.value.setQueryOptions, p.filter?.options || {})
  staticValueFilters.value.in_stock = p.filter?.in_stock
  let filterParams = {
    page: p.page ? Number(p.page) : Number(handleOptions.value.page)
  }
  document.addEventListener('scroll', handleScroll)
  scrollTo(0, 0)
  getPriceDataFromquery()
  productApi()
  pushQuery(filterParams)
  store.getDataFromLocalStorage()
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
            <renderProducts v-for="items in infoValue" :key="items.id" :items="items" :img="img" :store="store"   />
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
                v-model="staticValueFilters.setQueryOptions[option.name]"
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
                v-model="staticValueFilters.in_stock"
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
              <input v-model="staticValueFilters.minPrice" type="number" placeholder="حد اقل" />
              <input v-model="staticValueFilters.maxPrice" type="number" placeholder="حد اکثر" />
            </div>
          </div>
          <button @click="setQueryInUrl">اعمال فیلتر ها</button>
        </div>
      </div>
    </div>
  </div>
</template>
