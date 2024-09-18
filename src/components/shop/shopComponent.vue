<!-- <script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import renderProducts from './renderProducts/renderProducts.vue'
import headerCp from '../header/headerCp.vue'
import axios from 'axios'

let infoValue = ref([])
let img = ref([])
let itemsIsExistInput = ref(false)
let showInputsForPrice = ref(false)

const router = useRouter()
const route = useRoute()

async function productApi() {
  await axios
    .get(`https://demo.spreecommerce.org/api/v2/storefront/products?include=images`, {
      params: {
        'filter[in_stock]': route.query.onlyExist ? route.query.onlyExist : null,
        'filter[price]': `${'22'} , ${'24'}`
      }
    })
    .then((e) => {
      infoValue.value = e.data.data
      img.value = e.data.included
      console.log(e.data.data)
    })
}
function handleCheckboxChange(event) {
  itemsIsExistInput.value = event.target.checked
}
watch(itemsIsExistInput, () => {
  if (itemsIsExistInput.value) {
    router.push({ query: { onlyExist: itemsIsExistInput.value } })
  } else {
    router.replace({ query: { ...route.query , onlyExist:undefined  } })
  }
})

watch(
  () => route.query,
  () => {
    if (route.query) {
      productApi()
    }
  }
)


onMounted(() => {
  productApi()
})

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
            <button><h4>Clear filters</h4></button>
          </div>
          <div class="color flx">
            <h4>color</h4>
            <i class="fa-solid fa-sort-down"></i>
          </div>
          <div class="existProducts flx">
            <h4>existProducts</h4>
            <input :checked="itemsIsExistInput" @change="handleCheckboxChange" type="checkBox" />
          </div>
          <div class="justGraphicProducts flx">
            <h4>justGraphicProducts</h4>
            <input type="checkBox" />
          </div>
          <div  class="priceRange">
            <div @click="showInputsForPrice = !showInputsForPrice" class="info flx">
              <h4>priceRange</h4>
              <i class="fa-solid fa-sort-down"></i>
            </div>
            <div v-if="showInputsForPrice">
              <input type="number" placeholder="min" />
              <input type="number" placeholder="max" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> -->
<script setup>
import { ref, onMounted, watch , computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import renderProducts from './renderProducts/renderProducts.vue'
import headerCp from '../header/headerCp.vue'
import axios from 'axios'

let infoValue = ref([])
let img = ref([])
let itemsIsExistInput = ref(false)
let showInputsForPrice = ref(false)
let minPrice = ref(null)
let maxPrice = ref(null)
let updateWithFilter = ref(1)
let options = ref([])
let setClass = ref(false)
let setQueryOptionsColor = ref("")
let setQueryOptionsSize = ref("")

const router = useRouter()
const route = useRoute()

async function productApi() {
  try {
    const response = await axios.get(
      `https://demo.spreecommerce.org/api/v2/storefront/products?include=images`,
      {
        params: {
          'filter[in_stock]': route.query.onlyExist ? route.query.onlyExist : null,
          'filter[price]':route.query.minPrice  && route.query.maxPrice  ? `${route.query.minPrice },${route.query.maxPrice }` : null,
        }
      }
    )
    infoValue.value = response.data.data
    img.value = response.data.included
    options.value = response.data.meta.filters.option_types
  
  } catch (error) {
    console.error('API Request failed:', error)
  }
}

function handleCheckboxChange(event) {
  itemsIsExistInput.value = event.target.checked
}

function clearFilters() {
  itemsIsExistInput.value = false
  minPrice.value = null
  maxPrice.value = null
  router.replace({ query: {} })
  // updateWithFilter.value = ++updateWithFilter.value
}



watch( itemsIsExistInput, () => {
  if (itemsIsExistInput.value) {
    router.push({ query: { ...route.query, onlyExist: itemsIsExistInput.value } })
  } else {
    router.replace({ query: { ...route.query, onlyExist: undefined } })
  }
})

watch([minPrice, maxPrice], () => {
  if (minPrice.value !== null && maxPrice.value !== null) {
    router.push({ query: { ...route.query, minPrice: minPrice.value, maxPrice: maxPrice.value } })
  }
})

watch(() =>route.query  ,
  () => {
    productApi()
  }
)
watch([setQueryOptionsColor , setQueryOptionsSize] , () => {
  
 
   router.push({query: {...route?.query , tshirtColor: setQueryOptionsColor.value , tshirtSize :setQueryOptionsSize.value}})
 
})

onMounted(() => {
  productApi()
})

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
          <div  class="color ">
            <div @click="setClass = !setClass" class="p1 flx">
               <h4>color</h4>
            <i :id="[setClass && 'rotate']" class="fa-solid fa-sort-down"></i>
            </div>
            <div id="divStyle"  :class="[setClass ? 'p2' : 'dontShow']">
              <select v-model="setQueryOptionsColor">
                <option value="" >
                  choese your color
                </option>
                
                  <option  v-for="option in options[0]?.option_values" :key="option.id" :value="option.name">
                    {{ option.name }}
                  </option>
                
              </select>
              <select v-model="setQueryOptionsSize">
                <option value="" >
                  choese your size
                </option>
                
                  <option  v-for="option in options[1]?.option_values" :key="option.id" :value="option.name">
                    {{ option.name }}
                  </option>
                
              </select>
            </div>
          </div>
          <div class="existProducts flx">
            <h4>existProducts</h4>
            <input :checked="itemsIsExistInput" @change="handleCheckboxChange" type="checkBox" />
          </div>
          <div class="priceRange">
            <div @click="showInputsForPrice = !showInputsForPrice" class="info flx">
              <h4>priceRange</h4>
              <i :id="[showInputsForPrice && 'rotate']" class="fa-solid fa-sort-down"></i>
            </div>
            <div id="input" :class="[showInputsForPrice ? 'show' : 'dontShow']">
              <input v-model="minPrice" type="number" placeholder="min" />
              <input v-model="maxPrice" type="number" placeholder="max" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
