<script setup>
import { ref } from 'vue'

let show = ref(false);

    function shoElement() {
      show.value = !show.value;
      
    }



</script>

<template>
  <button @click="shoElement">click here to apeare element center of screen</button>
  <teleport v-if="show" to="body"><h3>salam</h3></teleport>
</template>
