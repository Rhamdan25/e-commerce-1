<template>
    <section style="padding: 20px">
        <b-field horizontal label="Product Name" >
            <b-input v-model="title" name="title" expanded></b-input>
        </b-field>

        <b-field class="file" horizontal>
            <b-upload v-model="image">
                <a class="button is-primary">
                    <b-icon icon="upload"></b-icon>
                    <span>Click to upload an image</span>
                </a>
            </b-upload>
            <span class="file-name" v-if="image"> 
                {{ image.name }}
            </span>
        </b-field>

        <b-field horizontal label="Price">
            <b-input v-model="price" type="number" placeholder="Price"></b-input>
        </b-field>

        <b-field horizontal label="Description">
            <b-input v-model="description" type="textarea"></b-input>
        </b-field>
        

        <b-field horizontal label="Show">
            <b-select v-model="show" placeholder="Select a Show">
                <option value="Dear Evan Hansen">Dear Evan Hansen</option>
                <option value="HadesTown">HadesTown</option>
                <option value="Be More Chill">Be More Chill</option>
            </b-select>
        </b-field>

        <b-field horizontal label="Stock" >
            <p class="control" style="width:50vh" >
                <b-numberinput v-model="stock" placeholder="Stock"></b-numberinput>
            </p>
        </b-field>

        <b-field horizontal>
            <p class="control">
                <button @click="addProduct()" class="button is-primary">
                  Add Product
                </button>
            </p>
        </b-field>

    </section>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return {
            title:"",
            description:"",
            show:"",
            stock: 0,
            image: null,
            price: 0,
        }
    },
    methods:{
        addProduct(){
            let formData = new FormData()
                formData.append('title', this.title)
                formData.append('description', this.description)
                formData.append('image', this.image)
                formData.append('show', this.show)
                formData.append('stock', this.stock)
                formData.append('price', this.price)
                axios({
                    url:`${this.$store.state.baseUrl}/products/add`,
                    method: 'POST',
                    headers: {
                        token: localStorage.getItem('access_token')
                    },
                    data: formData
                })
                .then(({data})=>{
                    this.title= "",
                    this.description="",
                    this.show="",
                    this.stock= 0,
                    this.image= null,
                    this.price= 0,
                    this.$store.dispatch('getAllProducts')
                    
                    Swal.fire({
                        position: 'top-end',
                        type: 'success',
                        title: 'Your Product has been uploaded',
                        showConfirmButton: false,
                        timer: 1500
                        })
                })
                .catch(err=>{
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                        footer: err.message
                    })
                })
        }
    }
}
</script>

<style>

</style>