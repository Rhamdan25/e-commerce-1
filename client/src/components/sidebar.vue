<template>
    <b-menu >
        <b-menu-list>
            <!-- <b-menu-item icon="information-outline" label="Info"></b-menu-item>
            <b-menu-item icon="account" label="My Account">
            </b-menu-item> -->
        </b-menu-list>
        <b-menu-list v-if="$store.state.loggedUser">
            <b-menu-item @click.prevent="logout()" label="Logout" icon="logout"></b-menu-item>
        </b-menu-list>
    </b-menu>
</template>

<script>
export default {
    name: "sidebar",
    methods:{
        logout(){
            localStorage.clear()
            this.$store.commit('logout')
        }
    }
}
</script>

<style>

</style>