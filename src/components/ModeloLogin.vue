<template>
     <v-row>
          <div class="w-100 d-flex justify-end">
               <v-col cols="6" class="justify-center">
                    <v-card class="orange darken-2 white--text mx-auto" max-width="600" height="570">

                         <v-row>
                              <v-col cols="12">
                                   <div class="d-flex justify-center mt-3">
                                        <v-img :src="logoNSG" max-height="" max-width="225"
                                             v-animate-css="animateLogoCard">
                                        </v-img>
                                   </div>
                              </v-col>
                              <v-col cols="12" class="d-flex justify-center">
                                   <transition name="custom-classes"
                                        enter-active-class="animate__animated animate__zoomIn"
                                        leave-active-class="animate__animated animate__zoomOut" mode="out-in">
                                        <router-view> </router-view>
                                   </transition>

                              </v-col>

                              <transition name="custom-classes" enter-active-class="animate__animated animate__zoomIn"
                                   leave-active-class="animate__animated animate__zoomOut" mode="out-in">
                                   <v-col v-if="$route.path == '/inscreverse' && $store.getters.getStep == 1" cols="12"
                                        class="d-flex justify-center btn-login" @click="$router.push('/')">
                                        <v-btn>
                                             Voltar a tela de login
                                        </v-btn>
                                   </v-col>
                              </transition>

                         </v-row>

                    </v-card>
               </v-col>
               <v-col cols="3" class="alertLogin">
                    <alert>
                    </alert>
               </v-col>
          </div>
     </v-row>
</template>

<script>
import Alert from '@/views/FeedBack/Alert.vue'
export default {
     components: { Alert },    
}
</script>

<style scoped>
.alertLogin {
     position: relative;
     bottom: 10px;
}

.btn-login {
     position: relative;
     top: 100px
}

.w-100 {
     width: 100%;
}
</style>