<template>
  <v-app-bar app v-if="this.$route.path != '/' && this.$route.path != '/inscreverse' && this.$route.path != '/primeiroAcesso'" class="bg orange darken-2" height="60%">
    <v-row>     
      <v-col cols="2" class="">
        <v-img :src="logoNSG" height="55px" contain position="start"> </v-img>
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="4" class="d-flex justify-end align-center">        
            <v-tooltip bottom color="light">
              <template v-slot:activator="{ on, attrs }">                
                <v-btn v-bind="attrs" v-on="on" icon>
                  <v-badge dot color="info">
                    <v-icon size="27" color="white"> mdi-email </v-icon>
                  </v-badge>
                </v-btn>
              </template>
              <span>Notificações</span>
            </v-tooltip>

            <v-tooltip bottom color="light">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="Logout" class="ml-3">
                  <v-icon size="27" color="white"> mdi-exit-to-app </v-icon>
                </v-btn>
              </template>
              <span>Logout</span>
            </v-tooltip>     

      </v-col>

    </v-row>
  </v-app-bar>
</template>

<script>
export default {  
  methods: {
    Logout() {
      this.$store.dispatch("logout")
      this.$store.commit('deleteAllInfo')
    },
  },
};
</script>

<style scoped>
.border {
  border: 1px solid red
}
#baseUser {
  padding-bottom: 0;
  padding-top: 15px;
  margin-bottom: 5px;
  height: 20px;
}
</style>