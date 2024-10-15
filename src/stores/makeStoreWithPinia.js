
import { defineStore } from 'pinia';

let usePiniaStore = defineStore('product', {

  state: () => ({
    data: []  
  }),
  actions: {
    getDataFromLocalStorage() {
      this.data = JSON.parse(localStorage.getItem('product') ) || []; 
    },
    addItemToData(props) {
      this.data.push(props)
    },
    spliceData(index) {
      this.data.splice(index, 1)
    },
    spliceDataAndSetData(index , val) {
      this.data.splice(index, 1, val)
    }
  },
  getters: {
    getProductsFromLocalStorage: (state) => state.data,
    getProductsFromLocalStorageLength: (state) => state.data.length
  }
});

export { usePiniaStore };