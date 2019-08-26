<template>
<div>
  <!-- <div class="panel-block">
    <p class="control has-icons-left">
      <input class="input is-small" type="text" placeholder="search">
      <span class="icon is-small is-left">
        <i class="fas fa-search" aria-hidden="true"></i>
      </span>
    </p>
  </div> -->
  <b-tabs type="is-boxed">    
    <b-tab-item label="All Products" icon="star">
        <div class="columns is-multiline">
          <card 
          class="column is-one-quarter"
          v-for="product in products"
          :key="product._id"
          :product="product"
          :admin= false 
          ></card>
        </div>

    </b-tab-item>
    <!-- <b-tab-item label="Shop by Show" icon="library-music">

      <div class="columns is-multiline">
              <card class="column is-one-third"></card>
              <card class="column is-one-third"></card>
              <card class="column is-one-third"></card>
      </div>

    </b-tab-item> -->
  </b-tabs>

</div>
</template>

<script>
import card from '@/components/card'
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    card
  },
  computed:{
    products(){
      return this.$store.state.products
    }
  }
}
</script>

<style scoped>
  
</style>