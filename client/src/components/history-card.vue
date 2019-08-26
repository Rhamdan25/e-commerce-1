<template>
<div class="column is-full">
    <b-loading :is-full-page="isFullPage" :active.sync="loading" :can-cancel="false"></b-loading>
    <div class="card columns">
        <div class="column card-content">
            <div class="media">
                <div class="media-left">
                    <figure class="image is-48x48">
                    <img :src="cart.product.image" alt="Placeholder image">
                    </figure>
                </div>
                <div class="media-content">
                    <p class="title is-4">{{cart.product.title}}</p>
                    <p class="subtitle is-6">${{cart.product.price}}</p>
                </div>
                <div class="media-content">
                    <p>ordered by: {{cart.userId.username}}</p>
                </div>
                <div class="media-content">
                    <p>status: {{cart.status}}</p>
                </div>
                
                <div v-if="cart.status=='ordered'" class="media-right">
                    <b-button @click.prevent="confirm()" type="is-success">Confirm Delivered</b-button>
                </div>
            </div>
        </div>
        
   </div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'history-card',
  props: ['cart','admin'],
  data(){
        return {
            loading : false,
            isFullPage : true
        } 
    },
  methods:{
      confirm(){
          if(this.admin){
              this.loading = true
            axios({
                method: 'PATCH',
                url:`${this.$store.state.baseUrl}/carts/transactions/admin`,
                headers:{
                    token: localStorage.getItem('access_token')
                },
                data:{
                    id:this.cart._id,
                    status:'delivered'
                }
            })
            .then(({ data })=>{
                this.loading = false
                Swal.fire('Successfully confirmed your item deliverance')
                this.$store.dispatch('getUsersCart')
                this.$store.dispatch('getAllProducts')
            })
            .catch(err=>{
                this.loading = false
                Swal.fire(err)
            })
          }else{
            this.loading = true
            axios({
                method: 'PATCH',
                url:`${this.$store.state.baseUrl}/carts/transactions/complete`,
                headers:{
                    token: localStorage.getItem('access_token')
                },
                data:{
                    id:this.cart._id,
                    status:'delivered'
                }
            })
            .then(({ data })=>{
                this.loading = false
                Swal.fire('Successfully confirmed your item deliverance')
                this.$store.dispatch('getUsersCart')
                this.$store.dispatch('getAllProducts')
            })
            .catch(err=>{
                this.loading = false
                Swal.fire(err)
            })
          }

      }
  }

}
</script>

<style>

</style>
