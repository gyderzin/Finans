<template>
  <v-app>
    <transition name="custom-classes" enter-active-class="animate__animated animate__zoomIn"
      leave-active-class="animate__animated animate__zoomOut" mode="out-in">
      <AppBar> </AppBar>
    </transition>

    <v-main :class="bgMain">
      <transition name="custom-classes" enter-active-class="animate__animated animate__zoomIn"
        leave-active-class="animate__animated animate__zoomOut" mode="out-in">
        <router-view> </router-view>
      </transition>
    </v-main>
  </v-app>
</template>

<script>
import AppBar from '@/views/AppBar'
export default {
  components: { AppBar },
  created() {
    let alert = this.$store.getters.alert.stateAlert
    if (alert == true) {
      setTimeout(() => {
        this.$store.commit('alternarAlert', false)
      }, 5000)
    }
  },
  data() {
    return {
      request: "",
    };
  },
  computed: {
    bgMain() {
      if (this.$route.path == "/" || this.$route.path == '/inscreverse' || this.$route.path == '/primeiroAcesso') {
        return "blue-grey darken-4 d-flex align-center h-100";
      } else {
        return "";
      }
    }    
  },
  watch: {
    usuarioAutenticado(newVal, oldVal) {
      if (oldVal == true && newVal == false) {
        this.$router.push('/')
      }
    }
  }
};
</script>

<style>
.h-100 {
  height: 100%;
}
</style>