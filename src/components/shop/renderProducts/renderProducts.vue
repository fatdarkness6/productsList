<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  items: Object,
  img: Object,
  store: Object,
})
const dsButton = ref(false)
let addNumberOfProduct = ref(1)
const getDataFromLocalStorage = ref([])
const productImage = props.img.find(
  (image) => image?.id === props.items?.relationships.images?.data[0]?.id
)

// ------------------------------------functions-------------------------------------//

function increaseNumberOfProduct() {
  ++addNumberOfProduct.value
}

function decreaseNumberOfProduct() {
  if (addNumberOfProduct.value == 1) {
    return
  } else {
    --addNumberOfProduct.value
  }
}

function addProductToLocalStorage(product) {
  const storedProducts = props.store.getProductsFromLocalStorage
  dsButton.value = true
  product.img = productImage?.attributes.original_url || ''
  product.numberOfProducts = 1
  props.store.addItemToData(product)
  localStorage.setItem('product', JSON.stringify(storedProducts))
  getDataFromLocalStorage.value = [...storedProducts]
}
function fnProducts() {
  if(getDataFromLocalStorage.value.length > 0) {
    return getDataFromLocalStorage.value.find((pr) => pr.id === props.items.id)
  }else {

    return props.store.getProductsFromLocalStorage.find((pr) => pr.id === props.items.id)
  }
}

// ------------------------------------watch-------------------------------------//

watch(addNumberOfProduct, () => {
  let fn = fnProducts()

  if (fn) {
    fn.numberOfProducts = addNumberOfProduct.value
    let fnIndex = getDataFromLocalStorage.value.indexOf(fn)
    getDataFromLocalStorage.value.splice(fnIndex, 1, fn)
    localStorage.setItem('product', JSON.stringify(getDataFromLocalStorage.value))
  } else {
    console.error('Product not found in local storage')
  }
})

// ------------------------------------onMounted-------------------------------------//
onMounted(() => {
  let fn = fnProducts()
  const storedProducts = props.store.getProductsFromLocalStorage
  getDataFromLocalStorage.value = storedProducts

  getDataFromLocalStorage.value.forEach((pr) => {
    if (pr.id === props.items.id) {
      dsButton.value = true
    }
  })
  if (fn !== undefined) {
    addNumberOfProduct.value = fn.numberOfProducts
  }
})
</script>

<template>
  <div class="card">
    <img :src="productImage?.attributes.original_url" alt="Product Image" />
    <div class="cardName-and-info">
      <i class="fa-regular fa-heart"></i>
      <h3>{{ items.attributes.name }}</h3>
    </div>
    <div class="price">
      <h3>{{ items.attributes.price }} $</h3>
      <div v-if="dsButton" class="numberOfProduct">
        <button @click="decreaseNumberOfProduct" class="minus">-</button>
        <span class="numbers">{{ addNumberOfProduct }}</span>
        <button @click="increaseNumberOfProduct" class="plus">+</button>
      </div>
      <button
        v-else
        @click="addProductToLocalStorage(items)"
        :class="[dsButton ? 'add-to-cart-dsb' : 'add-to-cart']"
      >
        <h3>اضافه کردن به سبد خرید</h3>
      </button>
    </div>
  </div>
</template>
