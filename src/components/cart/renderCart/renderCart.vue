<script setup>
import { ref, computed } from 'vue'
let props = defineProps({
  items: Object,
  img: Object
})
let value = ref([])
value.value = props.items.attributes.description

const productImages = computed(() => {
  return props.img.filter((image) => image.id === props.items.relationships.images.data[0].id)
})
</script>

<template>
  <div class="card">
    <div class="cardName-and-price">
      <div v-for="image in productImages" :key="image.id">
        <img :src="image.attributes.styles[0].url" alt="Product Image" />
      </div>
      <h3>NameItem : {{ props.items.attributes.name }}</h3>
      <h3>Price : {{ props.items.attributes.price }}$</h3>
    </div>
    <div v-html="value" class="description"></div>
  </div>
</template>

<style>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  padding: 20px;
  width: 50%;
}
.card .cardName-and-price {
  display: flex;
  justify-content: start;
  gap: 20px;
  width: 100%;
}
</style>
