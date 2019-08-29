<template>
  <b-tabs type="is-boxed" @input="changeToList">    
            <b-tab-item class="columns is-multiline " label="Transaction History" icon="history">
                    <historyCard
                    v-for="cart in cart"
                    :key="cart._id"
                    :cart="cart"
                    :admin="admin"
                    ></historyCard>
            </b-tab-item>
            <b-tab-item class="columns is-multiline " label="Your Cart" icon="cart">
            </b-tab-item>
    </b-tabs>
</template>

<script>
import historyCard from '@/components/history-card'
export default {
    data(){
        return{
            admin:false
        }
    },
    components:{
        historyCard,
        
    },
    methods:{
        changeToList(index){
            console.log(index)
            if(index==1){
                this.$router.push('/cart/itemList')
            }
        }
    },
    computed:{
        cart(){
            return this.$store.state.usersCart.filter(cart=>{
                return cart.status !== 'cart'
            })
        }
    }
}
</script>

<style>

</style>