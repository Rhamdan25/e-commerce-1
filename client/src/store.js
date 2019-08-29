import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseUrl: 'http://35.226.193.153',
    loggedUser: '',
    products:[],
    usersCart: [],
    isAdmin: false
  },
  mutations: {
    login(state, payload){
      state.loggedUser = payload
    },
    getAllProducts(state, payload){
      state.products = payload
    },
    getUsersCart(state,payload){
      state.usersCart = payload
    },
    isAdmin(state, payload){
      state.isAdmin = payload
    },
    logout(state,payload){
      state.loggedUser = ''
      state.isAdmin = false
    }
  },
  actions: {
    getAllProducts({state,commit,dispatch}, payload){
      axios({
        url:`${state.baseUrl}/products/all`,
        method: 'GET',
      })
      .then(({ data })=>{
        console.log(data)
        commit('getAllProducts', data)
      })
      .catch(err=>{
        console.log(err)
      })
    },
    getUsersCart({state,commit,dispatch}, payload){
      axios({
        url:`${state.baseUrl}/carts/all`,
        method: 'GET',
        headers:{
          token: localStorage.getItem('access_token')
        },
      })
      .then(({ data })=>{
        commit('getUsersCart', data)
      })
      .catch(err=>{
        console.log(err)
      })
    }
  }
})
