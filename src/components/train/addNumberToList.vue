<script setup>
import {ref} from 'vue';


let array = ref([1,2,3]);

</script>
<template>
    <button @click="() => {
        array.push(array.length + 1)
    }">click here to add numbers</button>
    <ul>
        <li v-for="items of array" :key="items.key">{{items}}</li>
        
    </ul>
</template>
