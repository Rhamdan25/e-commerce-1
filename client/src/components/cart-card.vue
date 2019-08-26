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
            </div>
        </div>
        <div class="column card-content">
            <p>Total: ${{cart.product.price*cart.quantity}}</p>
        </div>
        <div class="column card-content level-right">
            <b-field>
            <b-numberinput v-model="quantity" style="width:50vh"></b-numberinput>
            </b-field> 
        </div>
        <div class="column card-content">
            <b-button @click.prevent="deleteItem()"><i class="fas fa-trash"> Delete</i></b-button> 

        </div>
   </div>
</div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'cart-card',
    props: ['cart'],
    data(){
        return {
            loading : false,
            isFullPage : true,
            quantity: this.cart.quantity
        } 
    },
    methods:{
        deleteItem(){
            this.loading=true
            axios({
                method:'DELETE',
                url: `${this.$store.state.baseUrl}/carts/delete/${this.cart._id}`,
                headers:{
                    token: localStorage.getItem('access_token')
                }
            })
            .then(({ data })=>{
                this.$store.dispatch('getUsersCart')
                this.loading=false
                Swal.fire("deleted an item")
            })
            .catch(err=>{
                this.loading=false
                Swal.fire(err)
            })
        }
    },
    watch:{
        quantity(newVal,OldVal){
            this.loading=true
            axios({
                method:'PUT',
                url: `${this.$store.state.baseUrl}/carts/updatequantity`,
                headers:{
                    token: localStorage.getItem('access_token')
                },
                data:{
                    _id: this.cart._id,
                    quantity: this.quantity
                }
            })
            .then(({ data })=>{
                this.$store.dispatch('getUsersCart')
                this.loading=false
            })
            .catch(err=>{
                this.loading=false
                Swal.fire(err)
            })
        }
    },
    computed:{
    }


}
</script>

<style>

</style>
