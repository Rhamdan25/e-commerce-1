<template>
  <div class="card" >
    <div @click.prevent="details()"  >
      <div class="card-image">
        <figure class="image is-4by3">
          <img :src="product.image" alt="Placeholder image">
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4">{{product.title}}</p>
            <p class="subtitle is-6">${{product.price}}</p>
          </div>
        </div>

    </div>

      <footer class="card-footer">
        <p>{{product.show}}</p>
      </footer>
      
    </div>
    <b-button v-if="admin" @click.prevent="deleteProduct()" type="is-danger"> Delete </b-button>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'card',
  props:['product', 'admin'],
  methods:{
    details(){
      this.$router.push(`/detail/${this.product._id}`)
    },
    deleteProduct(){
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          axios({
            method:'DELETE',
            url: `${this.$store.state.baseUrl}/products/delete/${this.product._id}`,
            headers:{
              token: localStorage.getItem('access_token')
            }
          })
          .then(({ data })=>{
            this.$store.dispatch('getAllProducts')
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )            
          })
          .catch(err=>{
            Swal.fire('Error deleting product', err)
          })
          
        }
      })
      
    }
  }
}
</script>

<style>
    .card:hover{
    transform: scale(1.05) ;
    z-index:10
  }
</style>
