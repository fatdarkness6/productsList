<script setup>
// import addNumberToList from './components/addNumberToList.vue'
// import formBinding from './components/formBinding.vue'
// import giveDataToComponent from './components/giveDataToComponent.vue'
// import tl from './components/teleport.vue'
// import createCardShoping from './components/cart/createCardShoping.vue'
// import shopComponentVue from './components/shop/shopComponent.vue'

// import { ref } from 'vue'

// const groceryList = ref([
//   { id: 0, text: 'Vegetables' },
//   { id: 1, text: 'Cheese' },
//   { id: 2, text: 'Whatever else humans are supposed to eat' }
// ])
</script>
<template>
  <!-- <addNumberToList />
    <formBinding />
    <giveDataToComponent v-for="items of groceryList" :key="items.id" :groceryList="items" />
    <tl/> -->
  <!-- <createCardShoping/> -->
   <!-- <loginPage/> -->
   <RouterView/>
  <!-- <shopComponentVue /> -->

</template>
<!-- <style>
.giveStyle {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 50px;
}
</style> -->
