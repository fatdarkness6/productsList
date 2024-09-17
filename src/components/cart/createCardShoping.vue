<script setup>
import { ref, onMounted } from 'vue'
import renderCart from './renderCart/renderCart.vue'
const cart = ref([])
const img = ref([])

function fetchCartData() {
  fetch('https://demo.spreecommerce.org/api/v2/storefront/products?include=images')
    .then((e) => {
      return e.json()
    })
    .then((e) => {
      cart.value = e.data
      img.value = e.included
    })
}
onMounted(() => {
  fetchCartData()
})
</script>

<template>
  <renderCart v-for="items in cart" :key="items.id" :items="items" :img="img" />
</template>
