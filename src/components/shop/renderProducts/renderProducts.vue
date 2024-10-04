<script setup>
import { computed, ref } from 'vue'
let props = defineProps({
  items: Object,
  img: Object,
})

let dsButton = ref(false)
let getDataFromLocalStorage = ref(JSON.parse(localStorage.getItem('product')) || []);


let it = props.img.find((image) => image?.id == props.items?.relationships.images?.data[0]?.id)


function addProductToLocalHost(product) {
  let storedProducts = localStorage.getItem("product");
  let productsArray = JSON.parse(storedProducts);
    
    dsButton.value = true
    if (storedProducts) {
      console.log(product)
        product["img"] = it.attributes.original_url
        product["numberOfProducts"] = 1
              productsArray.push(product);
              localStorage.setItem("product", JSON.stringify(productsArray));
        } else {
            product["img"] = it.attributes.original_url
              localStorage.setItem("product", JSON.stringify([product]));
        }
}
let console1 = computed(() => {
  return getDataFromLocalStorage.value.filter((pr) => {
    if(pr.id == props.items.id) {
      dsButton.value = true
    }
  })
})
console.log(console1.value)
</script>

<template>
  <div class="card">
      <img :src="it?.attributes.original_url" alt="Product Image" />
    <div class="cardName-and-info">
      <i class="fa-regular fa-heart"></i>
        <h3>{{ items.attributes.name }}</h3>
    </div>
    <div class="price">
        <h3>{{ items.attributes.price }} $</h3>
        <button :disabled="dsButton" @click="addProductToLocalHost(items)" class="add-to-cart">
          <h3>اضافه کردن به سبد خرید</h3>
          <span></span>
        </button>
    </div>
  </div>
</template>
