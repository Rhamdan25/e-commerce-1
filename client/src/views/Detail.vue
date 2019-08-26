<template>
  <div>
    <b-loading :is-full-page="isFullPage" :active.sync="loading" :can-cancel="false"></b-loading>
    <div class="columns is-multiline">
      <div class="column is-full" >
        <h1>
          {{product.title}}
        </h1>
      </div>
      <div class="column is-full columns">
        <div class="column two-fifths ">
          <img :src="product.image" alt="Placeholder image">
          <b-button @click.prevent="addToCart" type="is-primary"> <i class="fas fa-shopping-cart"> add to cart</i>  </b-button>
        </div>
        <b-tabs class="column is-three-fifths" type="is-boxed">
          <b-tab-item label="Description" icon="book" >
            <div>
              from the Show : {{product.show}}
            </div>
            <div>
              {{product.description}}
            </div>
            <div>
              stock: {{product.stock}}
            </div>
          </b-tab-item>
          <!-- <b-tab-item label="About the Show" icon="library-music" ></b-tab-item> -->
        </b-tabs>
      </div>
      <div class="column is-full columns">
        
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'detail',
  data(){
    return {
      loading:false,
      isFullPage:true
    }
  },
  methods:{
    addToCart(){
      this.loading=true
      axios({
        method:'POST',
        url: `${this.$store.state.baseUrl}/carts/add`,
        headers:{
          token: localStorage.getItem('access_token')
        },
        data:{
          product : this.product._id,
          quantity : 1
        }
      })
      .then(({ data })=>{
        this.loading=false
        this.$store.dispatch('getUsersCart')
        Swal.fire('Added to Cart')
      })
      .catch(err=>{
        this.loading=false
        Swal.fire(err)
      })
    }
    
  },
  computed:{
    product(){
      return this.$store.state.products.find((e)=>{
        return e._id == this.$route.params.id
      })
    }
  }
}
</script>

<style>

</style>
