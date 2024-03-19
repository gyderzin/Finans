<template>
  <transition name="custom-classes"
    :enter-active-class="transitionEnter"
    :leave-active-class="transitionLeave"
    mode="out-in"
  >
    <div class='d-flex justify-center' v-if="alert">
      <v-alert
        v-model="alert"
        :type="typeAlert"        
        dense
        width="95%"                          
      >
        <span style='font-size: small;'> {{ messageAlert }} </span>
      </v-alert>
    </div>
  </transition>
</template>

<script>
export default {
  computed: {
    alert() {
      return this.$store.getters.alert.stateAlert
    },
    typeAlert() {
      return this.$store.getters.alert.typeAlert
    },
    messageAlert() {
      return this.$store.getters.alert.messageAlert
    },
    icone() {
      return this.$store.getters.alert.typeAlert == 'error' ? 'mdi-alert' : ''
    },
    transitionEnter() {
      return this.$route.path == '/' ? 'animate__animated animate__backInRight' : ' animate__animated animate__backInDown'
    },
    transitionLeave() {
      return this.$route.path == '/' ? 'animate__animated animate__backOutRight' : ' animate__animated animate__backOutUp'
    }
  },
  watch: {
    alert(newVal) {
        if(newVal == true) {        
        let temporizador = this.typeAlert != 'error' ? 3000 : 10000
        setTimeout(() => {
          this.$store.commit("alternarAlert", false);
        }, temporizador);
      }
    }
  },
  
};
</script>

<style scoped>

</style>