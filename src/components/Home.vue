<template>
  <v-row class="rowHome">
    <div class="divCard" >
      <alert> </alert>
    </div>
    <navigation> </navigation>
    <v-spacer></v-spacer>
    <v-col cols="9" id="colPaineis" class="indigo darken-2">
      <transition
          enter-active-class="animate__animated animate__fadeInRight"
          leave-active-class="animate__animated animate__fadeOutRight"
          mode="out-in"
      >
        <router-view></router-view>
      </transition>
    </v-col>
  </v-row>
</template>

<script>
import Navigation from "@/views/Navigation.vue";
import Alert from "@/views/FeedBack/Alert.vue";
export default {
  components: { Navigation, Alert },
  beforeRouteEnter(to, from, next) {    
    next(vm => {      
      if (vm.$store.getters.tentativaLogin == false) {
        vm.$store.commit('alternarAlert', false)
      }
    })
  },
  beforeCreate() {
    this.$store.dispatch('getAllInfo')
  },
  mounted() {        
    if (this.$store.getters.tentativaLogin == false) {      
      setTimeout(() => {
        let nome = this.usuario.nome.split(' ')
        let alert = {
          state: true,
          type: "info",
          message: "Bem vindo " + nome[0] + "!",
        };
        this.$store.commit("changeAlert", alert)
      }, 1000)
    }
  },
};

</script>

<style scoped>
.animate__animated.animate__fadeInLeft, .animate__animated.animate__fadeOutRight {
  --animate-duration: 1s;
  --animate-delay: 0s;
}
.divCard {
  position: fixed;
  left: 40%;
  top: 2%;
  width: 17%;
  height: 10%;
  z-index: 5;
}
.border {
  border: 1px solid red;
}

.rowHome {
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
}
</style>
