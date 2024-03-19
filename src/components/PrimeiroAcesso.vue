<template>
  <v-row>
    <div class="divCard" >
      <alert> </alert>
    </div>
    <v-col class="d-flex justify-center">
      <v-card width="70%" class="orange darken-2 white--text mx-auto" height="600">
        <v-col cols="12">
          <div class="d-flex justify-center mt-3">
            <v-img :src="logoNSG" max-height="" max-width="225" v-animate-css="animateLogoCard">
            </v-img>
          </div>
        </v-col>
        <v-col cols="12">
          <v-stepper v-model="e1" max-height="1000" >
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1">
                Bem Vindo!
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 2" step="2">
                Proventos
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 3" step="3">
                Categorias
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 4" step="4">
                Despesas fixas
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 5" step="5">
                Perfil
              </v-stepper-step>

              <v-divider></v-divider>
              
              <v-stepper-step :complete="e1 > 6" step="6">
                Tudo pronto?
              </v-stepper-step>

            </v-stepper-header>
            <Windonw :usuario="usuario" :alternar="alternar" :perfilRevisão="perfilRevisão"></Windonw>
          </v-stepper>
        </v-col>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Windonw from '@/components/App/PrimeiroAcesso/WindownsPrimeiroAcesso.vue'
import Alert from "@/views/FeedBack/Alert.vue";
export default {
  components: { Windonw, Alert},
  data() {
    return {
      e1: 1,
      perfilRevisão: false,
    }
  },
  methods: {
    alternar(value) {
      this.e1 = value
    }
  },
  watch: {
      e1(newVal) {
        if(newVal == 6) {
          this.perfilRevisão = true          
        } else if(newVal !== 6) {
          this.perfilRevisão = false          
        }
      }
  }
}
</script>

<style>
.divCard {
  position: fixed;
  left: 40%;
  top: 2%;
  width: 20%;
  height: 5%;
  z-index: 5;
}
</style>