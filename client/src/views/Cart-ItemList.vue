<template>
  <b-tabs type="is-boxed" @input="changeToHistory">    
      <b-loading :is-full-page="isFullPage" :active.sync="loading" :can-cancel="false"></b-loading>
            <b-tab-item class="columns is-multiline " label="Your Cart" icon="cart">
                <b-button @click.prevent="checkout()" class="level-right" type="is-danger"><i class="fas fa-sign-out-alt"> Checkout</i>  </b-button>
                    <cartCard
                    v-for="cart in cart"
                    :key="cart._id"
                    :cart="cart"
                    ></cartCard>
            </b-tab-item>
            <b-tab-item label="Transaction History" icon="history"></b-tab-item>
    </b-tabs>
</template>

<script>
import cartCard from '@/components/cart-card.vue'
import axios from 'axios'

export default {
    data(){
        return {
            loading : false,
            isFullPage : true
        } 
    },
    methods:{
        changeToHistory(index){
            if(index==1){
                this.$router.push('/cart/history')
            }
        },
        checkout(){
            this.loading = true
            axios({
                method: 'PUT',
                url:`${this.$store.state.baseUrl}/carts/updatestatus`,
                headers:{
                    token: localStorage.getItem('access_token')
                },  
            })
            .then(({ data })=>{
                this.loading = false
                Swal.fire('Successfully checked-out your purchases')
                this.$store.dispatch('getUsersCart')
                this.$store.dispatch('getAllProducts')
            })
            .catch(err=>{
                this.loading = false
                Swal.fire(err)
            })
        }
    },
    components:{
        cartCard
    },
    computed:{
        cart(){
            return this.$store.state.usersCart.filter(cart=>{
                return cart.status=='cart'
            })
        }
    }
}
</script>

<style>

</style>