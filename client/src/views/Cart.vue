<template>
  <div >
      <div v-if="!nested">
        <b-button @click="toList()"><i class="fas fa-shopping-cart"></i></b-button>
        <b-button @click="toHistory()"><i class="fas fa-history"></i></b-button>

      </div>
      <router-view></router-view>
      
  </div>
</template>

<script>

export default {
    data(){
        return {
            nested: true
        }
    },
    created(){
        if(this.$route.path == "/cart"){
            this.nested = false
        }
    },
    methods:{
        toList(){
            this.$router.push('/cart/itemList')
        },
        toHistory(){
            this.$router.push('/cart/history')
        }
    },
    watch:{
        $route: function() {
            if (this.$route.path == "/cart") {
                this.nested = false;
            }else{
                this.nested = true
            }
        }
    }
}
</script>

<style>

</style>