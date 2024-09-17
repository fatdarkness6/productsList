<script setup>
defineProps({
  groceryList: Object
});
</script>
<template>
  <ul>
    <li :key="groceryList.id">
      {{ groceryList.text }}
    </li>
  </ul>
</template>
