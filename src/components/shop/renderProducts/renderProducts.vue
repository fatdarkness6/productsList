<script setup>
import { ref } from 'vue';

// Define the props for the component
const props = defineProps({
  items: Object,
  img: Object,
});

// Reactive references
const dsButton = ref(false);
const getDataFromLocalStorage = ref(JSON.parse(localStorage.getItem('product')) || []);

// Find the image that matches the product
const productImage = props.img.find(image => image?.id === props.items?.relationships.images?.data[0]?.id);

// Add product to localStorage
function addProductToLocalStorage(product) {
  const storedProducts = JSON.parse(localStorage.getItem("product")) || [];

  // Set the button to disabled after adding
  dsButton.value = true;

  // Add image URL and initialize product count
  product.img = productImage?.attributes.original_url || '';
  product.numberOfProducts = 1;

  // Add product to localStorage
  storedProducts.push(product);
  localStorage.setItem("product", JSON.stringify(storedProducts));
}

// Check if the product is already in localStorage and disable the button
getDataFromLocalStorage.value.forEach(pr => {
  if (pr.id === props.items.id) {
    dsButton.value = true;
  }
});
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
      <button  :disabled="dsButton" @click="addProductToLocalStorage(items)" :class="[dsButton ? 'add-to-cart-dsb' : 'add-to-cart']">
        <h3>اضافه کردن به سبد خرید</h3>
      </button>
    </div>
  </div>
</template>
