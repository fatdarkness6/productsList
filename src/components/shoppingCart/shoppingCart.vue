<script setup>
import HeaderCp from '../header/headerCp.vue';
import { computed, ref } from 'vue';
import RenderCart from './renderingCart/renderCart.vue';

let getDataFromLocalStorage = ref(JSON.parse(localStorage.getItem('product')));
let priceArray = ref([])
let allProductsPrices = ref({
    allPrices : 0,
    deliveryPrice : 15
})

function calculateTotalPrice(props) {
    
    let productIndex = props.id ? priceArray.value.findIndex(item => item.id === props.id) : -1;
    let totalPriceForProduct = props.attributes.price * props.numberOfProducts;

    if (productIndex !== -1) {
        console.log("Product found at index:", productIndex);
        priceArray.value[productIndex].price = totalPriceForProduct;
    } else {
        priceArray.value.push({
            id: props.id,
            price: totalPriceForProduct
        });
    }
    let total = priceArray.value.reduce((prev, next) => prev + next.price, 0);
    allProductsPrices.value.allPrices = parseFloat(total.toFixed(2));
}

let finalyPrice = computed(() => {
    return Object.values(allProductsPrices.value)?.reduce((pre , next) => {
        return pre + next
    })
})

</script>

<template>
    <div class="shoppingCart">
        <div class="wrapper">
            <div class="part1">
                <HeaderCp/>
            </div>
            <div class="part2-shoppingCart">
                <div class="together">
                    <div class="sh">
                        <i class="fa-solid fa-dollar-sign paleRed"></i>
                        <span class="paleRed">پرداخت</span>
                    </div> 
                    <div class="line">
                        <div class="circle paleRedBackground"></div>
                        <span class="paleRed">--------------</span>
                        <div class="circle paleRedBackground"></div>
                    </div>    
                </div>
                <div class="together">
                    <div class="sh">
                        <i  class="fa-solid fa-location-dot paleRed"></i>
                        <span class="paleRed"> اطلاعات ادرس</span>
                    </div>
                    <div class="line">
                        <div class="circle paleRedBackground"></div>
                        <span class="paleRed">--------------</span>
                        <div class="circle paleRedBackground"></div>
                    </div>    
                </div>
                <div class="together">
                    <div class="sh">
                        <i class="fa-solid fa-cart-shopping redColor"></i>
                        <span class="redColor">سبد خرید</span>
                    </div>
                </div>
            </div>
            <div class="part3-shoppingCart">
                <div class="part3-1">
                    <div class="part3-1-1 margin-top-23">
                        <div class="takhfifCode">
                            <h6>کد تخفیف</h6>
                            <p>کد تخفیف کد معرف کارت هدیه خود را در زیر وارد کرده و دکمه ثبت رو بزنید تا در صورت داشتن اعتبار به سفارش شما اعمال شود</p>    
                        </div>
                        <div class="kodeTakhfif">
                            <button class="redColor">ثبت</button>
                            <input :class="[allProductsPrices.allPrices> 0 ? 'enable' : 'disable']" type="text"/>
                        </div>
                    </div>
                    <div class="onePart">
                            <div class="part3-1-2 margin-top-23">
                            <div class="productPrice">
                                <span>${{ allProductsPrices.allPrices }}</span>
                            </div>
                            <div class="gheymatKala">
                                <h6>قیمت کالاها</h6>
                                <h6>تعداد کالاها</h6>
                            </div>
                        </div>
                        <div class="part3-1-3 margin-top-23">
                            <div class="takhfifPrice">
                                <span>0$</span>
                            </div>
                            <div class="takhfif">
                                <h6>مجموع تخفیف روی کالا ها</h6>
                                <i class="fa-solid fa-percent"></i>
                            </div>
                        </div>
                        <div class="part3-1-4 margin-top-23 flex-spaceBetween">
                            <span>0$</span>
                            <h6>سود شما از خرید</h6>
                        </div>
                        <div class="part3-1-5 margin-top-23 flex-spaceBetween">
                            <span>{{ allProductsPrices.allPrices > 0 ? `$${allProductsPrices.deliveryPrice = 15}` : `$${allProductsPrices.deliveryPrice = 0}` }}</span>
                            <h6>هزینه ارسال</h6>
                        </div>
                    </div>
                    <div class="part3-1-6 margin-top-23 ">
                        <div class="totaly flex-spaceBetween">
                            <span>${{ finalyPrice }}</span>
                            <h6>جمع مبلغ قابل پرداخت</h6>
                        </div>
                        <button  class="redColorBackground">
                            <i class="fa-solid fa-chevron-left"></i>
                            <h6>ثبت سفارش</h6>
                        </button>
                    </div>
                </div>
                <div class="part3-2">
                    <div class="title">
                        <h6>سبد خرید </h6>
                    </div>
                    <div class="product">
                        <div v-for="items in getDataFromLocalStorage" :key="items.id" class="productInfo">
                            <RenderCart :key="items.id" :items="items" :data="getDataFromLocalStorage" :cal="calculateTotalPrice" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>