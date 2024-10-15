<script setup>
import { onMounted, ref, watch } from 'vue'

// Define props and emit
const props = defineProps({
  items: Object,
  data: Array,
  store: Object
});
const emit = defineEmits(['response' , 'product-removed']);

// Reactive references
const addNumberOfProduct = ref(1);


// Function to remove the product from the list
function removeFunction() {
  const index = props.data.indexOf(props.items);
  if (index > -1) {
    props.store.spliceData(index);
    localStorage.setItem('product', JSON.stringify(props.data));
    emit('product-removed', props.items);
  }
}

// Function to increase the number of products
function increaseNumberOfProduct() {
  addNumberOfProduct.value++;
}

// Function to decrease the number of products
function decreaseNumberOfProduct() {
  if (addNumberOfProduct.value > 1) {
    addNumberOfProduct.value--;
  }
}

// Function to update price


// Watch changes in number of products
watch(addNumberOfProduct, () => {
  const numberOfProductsIndex = props.data.indexOf(props.items);
  console.log(numberOfProductsIndex)
  props.items.numberOfProducts = addNumberOfProduct.value;
  props.store.spliceDataAndSetData(numberOfProductsIndex, props.items);
  localStorage.setItem('product', JSON.stringify(props.data));
  emit('response', props.items);
});

// Watch changes in the price and emit changes


// Set initial value on mount
onMounted(() => {
  addNumberOfProduct.value = props.items.numberOfProducts;
  emit('response', props.items);
});
</script>

<template>
  <div class="informationOfProduct">
    <span>{{ props.items.attributes.display_price }}</span>
    <h6>{{ props.items.attributes.name }}</h6>
    <img :src="props.items.img" alt="Product Image" />
    <div @click="() => { removeFunction() }" class="xMark">
      <span>×</span>
    </div>
  </div>
  <div class="numberOfProduct">
    <button @click="decreaseNumberOfProduct" class="minus">-</button>
    <span class="numbers">{{ addNumberOfProduct }}</span>
    <button @click="increaseNumberOfProduct" class="plus">+</button>
  </div>
</template>