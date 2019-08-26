<template>  
    <div class="columns is-multiline">      
        <div class="column is-full" >
            <b-dropdown >
                <a  
                slot="trigger"
                role="button">
                    <span>Add a New Product</span>
                    <b-icon icon="menu-down"></b-icon>
                </a>
                <b-dropdown-item
                    custom
                    paddingless>
                    <createForm></createForm>
                </b-dropdown-item>
            </b-dropdown>   
        </div>  

        <div class="column is-full">
            <b-tabs type="is-boxed">    
                <b-tab-item label="Manage Products" icon="folder">   
                    <div class="columns is-multiline">
                    <card 
                    class="column is-one-quarter"
                    v-for="product in products"
                    :key="product._id"
                    :product="product"
                    :admin= admin 
                    ></card>
                    </div>

                </b-tab-item>
                <b-tab-item label="Transactions" icon="history">

                <div class="columns is-multiline">
                    <div class="column is-full">
                        <historyCard
                                v-for="cart in transactions"
                                :key="cart._id"
                                :cart="cart"
                                :admin="admin"
                                ></historyCard>
                    </div>
                        <!-- <card class="column is-one-third"></card>
                        <card class="column is-one-third"></card>
                        <card class="column is-one-third"></card> -->
                </div>

                </b-tab-item>
            </b-tabs>
        </div>

        
        
  

    </div>
</template>

<script>
import axios from 'axios'
import createForm from '@/components/createForm'
import historyCard from '@/components/history-card'
import card from '@/components/card'
export default {
    data(){
        return{
            transactions:[],
            admin: true
        }
    },
    methods:{
        getTransactios(){
            axios({
                method: 'GET',
                url: `${this.$store.state.baseUrl}/carts/transactions/admin`,
                headers:{
                    token: localStorage.getItem('access_token')
                }
            })
            .then(({ data })=>{
                this.transactions = data
            })
            .catch(err=>{
                Swal.fire('error getting transactions!'+err)
                this.$router.push('/')
            })
        },
    },
    components: {
        createForm,
        historyCard,
        card
    },
    created(){
        this.getTransactios()

    },
    computed:{
        products(){
            return this.$store.state.products
        }
    }
}
</script>

<style>

</style>