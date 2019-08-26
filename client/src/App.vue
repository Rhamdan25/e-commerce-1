<template>
  <div id="app">
    <div class="columns is-multiline">
      <div class="column is-full">
        <navbar ></navbar>
      </div>
      <div class="column is-full">
        <div class="columns">
          <sidebar class="column is-one-fifth"></sidebar>
          <router-view class="column"/>
        </div>
      </div>            
    </div>         

  

  </div>

</template>

<script>
import navbar from '@/components/navbar'
import sidebar from '@/components/sidebar'


export default {
  name: 'App',
  data () {
    return {

    }
  },
  components: {
    navbar,
    sidebar
  },
  methods: {
    photoss () {
      console.log('photos')
    }
  },
  created(){
    if(localStorage.getItem('userId')){
      this.$store.commit('login', localStorage.getItem('userId'))
      this.$store.dispatch('getUsersCart')
      if(localStorage.getItem('admin')){
        this.$store.commit('isAdmin', true)
      }
    }
    this.$store.dispatch('getAllProducts')
  }
}
</script>

<style>

</style>
