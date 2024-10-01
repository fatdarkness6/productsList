<script setup>
import { computed } from 'vue'
let props = defineProps({
  items: Object,
  img: Object,
})

let it = computed(() => {
  return props.img.filter((image) => image?.id == props.items?.relationships.images?.data[0]?.id)
})
</script>

<template>
  <div class="card">
    <div v-for="items in it" :key="items.id" class="img">
      <img :src="items.attributes.original_url" alt="Product Image" />
    </div>
    <div class="cardName-and-info">
      <i class="fa-regular fa-heart"></i>
        <h3>{{ items.attributes.name }}</h3>
    </div>
    <div class="price">
        <h3>{{ items.attributes.price }} $</h3>
    </div>
  </div>
</template>
