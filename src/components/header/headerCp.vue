<script setup>
import {  ref } from 'vue';
import { RouterLink } from 'vue-router';
import "../../assets/base.css"

let getDataFromLocalStorage = ref(JSON.parse(localStorage.getItem('product')) || []);
let dataLength = ref(getDataFromLocalStorage.value?.length)

</script>

<template>
  <div class="father">
      <div class="header">
      <div class="header-option">
        <RouterLink to="/shoppingCart" class="shopping-cart flex-style-header">
          <h3>سبد خرید</h3>
          <div class="length-of-cart">
            <i class="fa-solid fa-cart-shopping"></i>
            <div class="border1">
              <span>{{ dataLength }}</span>
            </div>
          </div>
        </RouterLink>
        <div class="profile flex-style-header">
          <h3>حساب کاربری</h3>
          <i class="fa-solid fa-user"></i>
        </div>
      </div>
      <div class="searchInput">
        <i class="fa-solid fa-magnifying-glass redColor"></i>
        <input type="search" placeholder="استیکر" />
      </div>
      <div class="headerImg">
        <img src="../../../public/Untitled-removebg-preview.png"/>
      </div>
    </div>
    <div class="part2">
        <h3 v-for="category in ['جشن مهمانی', 'کارت پستر', 'مدرسه و اداره', 'اکسسوری', 'قاب موبایل', 'لوازم خانه', 'پوشاک']" :key="category">
          {{ category }}
        </h3>
      </div>
  </div>
  
</template>
