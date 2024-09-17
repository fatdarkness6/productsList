<script setup>
import { ref } from 'vue'
let input = ref(null)
let text = ref('')
let text2 = ref('')
const array = ref(['john'])

function addName() {
  array.value.push(text2.value)
  text2.value = ''
}
</script>
<template>
  <input v-model="text" />
  <p>{{ text }}</p>
  <br />
  <input
    ref="input"
    type="text"
    v-model="text2"
  />
  <button @click="addName">click here to add names</button>
  <ul>
    <li v-for="items of array" :key="items">{{ items }}</li>
  </ul>
</template>
