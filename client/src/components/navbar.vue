<template>
    <b-navbar>
        <template slot="brand">
            <b-navbar-item>
                <router-link to="/"> E-Commerce</router-link>
            </b-navbar-item>
        </template>
        <template slot="start">
        </template>

        <template slot="end">
            <a class="navbar-item" @click.prevent="displayCart()">
                <b-icon pack="fa" icon="shopping-cart"  ></b-icon>
            </a>

            <div v-if="!$store.state.loggedUser">

            <b-dropdown position="is-bottom-left" aria-role="menu">
                    <a
                        class="navbar-item"
                        slot="trigger"
                        role="button">
                        <span>Log In</span>
                        <b-icon icon="menu-down"></b-icon>
                    </a>

                    <b-dropdown-item
                        aria-role="menu-item"
                        custom
                        paddingless>
                        <form @submit.prevent="login()">
                            <div class="modal-card" style="width:300px;">
                                <section class="modal-card-body">

        

                                    <b-field label="Email">
                                        <b-input
                                            v-model="loginEmail"
                                            type="email"
                                            placeholder="Your email"
                                            required>
                                        </b-input>
                                    </b-field>

                                    <b-field label="Password">
                                        <b-input
                                            v-model="loginPassword"
                                            type="password"
                                            password-reveal
                                            placeholder="Your password"
                                            required>
                                        </b-input>
                                    </b-field>
                                </section>
                                <footer class="modal-card-foot">
                                    <button class="button is-primary">Login</button>
                                </footer>
                            </div>
                        </form>
                    </b-dropdown-item>

                </b-dropdown>

                <b-dropdown position="is-bottom-left" aria-role="menu">
                    <a
                        class="navbar-item"
                        slot="trigger"
                        role="button">
                        <span>Sign Up</span>
                        <b-icon icon="menu-down"></b-icon>
                    </a>

                    <b-dropdown-item
                        aria-role="menu-item"
                        custom
                        paddingless>
                        <form @submit.prevent="signup()">
                            <div class="modal-card" style="width:300px;">
                                <section class="modal-card-body">
                                    <b-field label="username">
                                        <b-input
                                            v-model="signupName"
                                            type="text"
                                            placeholder="Your username"
                                            required>
                                        </b-input>
                                    </b-field>  
                                    <b-field label="Email">
                                        <b-input
                                            v-model="signupEmail"
                                            type="email"
                                            placeholder="Your email"
                                            required>
                                        </b-input>
                                    </b-field>

                                    <b-field label="Password">
                                        <b-input
                                            v-model="signupPassword"
                                            type="password"
                                            password-reveal
                                            placeholder="Your password"
                                            required>
                                        </b-input>
                                    </b-field>
                                </section>
                                <footer class="modal-card-foot">
                                    <button class="button is-primary">Sign Up</button>
                                </footer>
                            </div>
                        </form>
                    </b-dropdown-item>

                </b-dropdown>
            </div>

        </template>
    </b-navbar>

</template>

<script>
import axios from 'axios'
export default {
  name: 'navbar',
  data(){
      return {
          loginEmail: "",
          loginPassword: "",
          signupName: "",
          signupEmail: "",
          signupPassword: ""
      }
  },
  methods:{
      displayCart(){
          console.log("triggered")
          this.$router.push('/cart/itemList')
      },
      login(){
          axios({
            method: 'POST',
            data: {
                email: this.loginEmail,
                password: this.loginPassword
            },
            url: `${this.$store.state.baseUrl}/users/login`
          })
          .then(({data})=>{
              localStorage.setItem('access_token', data.access_token)
              localStorage.setItem('userId', data._id)
              if(data.admin == true){
                  localStorage.setItem('admin', true)
                  this.$store.commit('isAdmin', true)
              }
              this.$store.commit('login', data._id)
              this.$store.dispatch('getUsersCart')
              Swal.fire('Succcessfully Logged-In')
          })
            .catch(err=>{
                Swal.fire('Something went wrong', err)
            })
      },
      signup(){
          axios({
            method: 'POST',
            data: {
                username: this.signupName,
                email: this.signupEmail,
                password: this.signupPassword
            },
            url: `${this.$store.state.baseUrl}/users/register`
          })
          .then(({data})=>{
              Swal.fire('Succcessfully Registered')
          })
          .catch(err=>{
                Swal.fire('Something went wrong', err)
            })
      } 
  }
}
</script>

<style>

</style>
