<template>
  <v-card height="97%" width="100%" class="mt-7" elevation="0">
    <v-row justify="center">
      <v-card-title>
        <h2>Perfil</h2>
      </v-card-title>
    </v-row>
    <v-row justify="center">
      <v-col cols="6">
        <v-card class="grey darken-4" height="400px">
          <v-row justify="center">
            <v-avatar size="100" class="mt-2">
              <v-img :src="perfilUsuario">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-avatar>
          </v-row>
          <v-row justify="center" >
            <v-col cols="6" class="py-0 my-0">
              <v-list-item color="rgba(0, 0, 0, .4)" dark class="text-center">
                <v-list-item-content>
                  <v-list-item-title class="text-h6">
                    {{ usuario.nome }}
                  </v-list-item-title>                
                </v-list-item-content>
              </v-list-item>            
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>
  
<script>
export default {
  computed: {
    base64() {
      return this.$store.getters.perfilUsuario
    },
    perfilUsuario() {
      return this.base64 == undefined ? '' : 'data:image/png;base64,' + this.base64
    }
  }
}
</script>
  
<style>
.aa {
border: 1px solid red;
}
</style>