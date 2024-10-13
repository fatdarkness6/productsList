<script setup>
import { onMounted, ref, watch } from 'vue';
let props = defineProps({
    items : Object,
    data: Array,
})
let emit = defineEmits(['response'])

let addNumberOfProduct = ref(1)

function removeFunction() {
    let index = props.data.indexOf(props.items)
    props.data.splice(index, 1)
    localStorage.setItem('product', JSON.stringify(props.data))
    location.reload()
}
function increaseNumberOfProduct() {
    ++addNumberOfProduct.value
}

function decreaseNumberOfProduct() {
    if(addNumberOfProduct.value == 1) {
        return
    }else {
        --addNumberOfProduct.value
    }
}

watch(addNumberOfProduct, () => {
    let numberOfProducts = props.data.indexOf(props.items)
    props.items.numberOfProducts = addNumberOfProduct.value
    props.data.splice(numberOfProducts, 1 , props.items)
   localStorage.setItem('product', JSON.stringify(props.data))
  emit('response', props.items)
})



onMounted(() => {
    addNumberOfProduct.value = props.items.numberOfProducts
    emit('response', props.items)
})
</script>

<template>

<div class="informationOfProduct">
    <span>{{ props.items.attributes.display_price }}</span>
    <h6>{{ props.items.attributes.name }}</h6>
        <img :src="props.items.img" alt="Product Image">
    <div @click="removeFunction" class="xMark">
        <span>×</span>
    </div>
</div>
<div class="numberOfProduct">
    <button @click="decreaseNumberOfProduct" class="minus">
        -
    </button>
    <span class="numbers">{{ addNumberOfProduct }}</span>
    <button @click="increaseNumberOfProduct" class="plus">
        +
    </button>
</div>
</template>