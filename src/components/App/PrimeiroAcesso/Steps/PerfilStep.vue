<template>
  <v-card height="382px">
    <v-row>
      <v-window v-model="step" class="window">
        <v-col cols="12" class="d-flex justify-center pt-0 mt-0 pb-0 mb-0">
          <v-window-item :value="1" class="window">
            <v-row>
              <v-col class="d-flex justify-center">
                <v-navigation-drawer permanent width="50%" dark>
                  <v-list>
                    <v-list-item>
                      <v-row class="ma-0 mt-1 pa-0" justify="center">
                        <v-list-item-avatar size="90" dense>
                          <img src="@/assets/bighead.svg" v-if="avatar == undefined && select == false" />

                          <img id="img" src="" v-show="avatar != undefined && select == false">

                          <v-img id="img2" :src="imagemPerfil" v-show="avatar == undefined &&select == true" aspect-ratio="1">
                          </v-img>

                        </v-list-item-avatar>
                      </v-row>
                    </v-list-item>

                    <v-list-item dense>
                      <v-list-item-content>
                        <v-list-item-title class="text-h6">
                          {{ usuario.nome }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ usuario.email }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-navigation-drawer>
              </v-col>
              <v-col cols="12" class="d-flex justify-start pt-0 mt-0">
                <v-card dark width="100%" height="100%" class="d-flex flex-row">
                  <v-sheet class="mx-auto" elevation="5" max-width="100%">
                    <v-slide-group v-model="model" class="pa-4" center-active show-arrows>
                      <v-slide-item>
                        <v-card color="indigo lighten-1" class="ma-4" height="75" width="75" @click="ativarFile">
                          <v-tooltip left color="primary">
                            <template v-slot:activator="{ on, attrs }">
                              <v-row class="fill-height" justify="center" v-bind="attrs" v-on="on">
                                <v-scale-transition>
                                  <v-col class="pa-0 ma-0 d-flex justify-center mt-7">
                                    <v-icon color="white" size="45" v-text="'mdi-camera'"></v-icon>
                                    <v-file-input hide-input prepend-icon="mdi-camera" accept="image/*" dark
                                      v-model="avatar" class="d-none" value="" id="inputFile">
                                    </v-file-input>
                                  </v-col>
                                </v-scale-transition>
                              </v-row>
                            </template>
                            <span>Carregar foto</span>
                          </v-tooltip>
                        </v-card>
                      </v-slide-item>

                      <v-slide-item v-for="(n, i) in imagensPefil" :key="n" v-slot="{ active, toggle }"
                        class="fotoPerfil">
                        <v-card :class="active ? 'ativo' : ''" class="ma-4" height="75" width="75" @click="toggle">
                          <v-row class="fill-height pa-0 ma-0" @click="carregarAvatar(i)">
                            <v-img :class="active ? 'fotoAtiva' : ''" :src="n" width="10" aspect-ratio="1">
                              <template v-slot:placeholder>
                                <v-row class="fill-height ma-0" align="center" justify="center">
                                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                </v-row>
                              </template>
                            </v-img>
                          </v-row>
                        </v-card>
                      </v-slide-item>
                    </v-slide-group>
                  </v-sheet>
                </v-card>
              </v-col>
              
              <v-col cols="12" class="mb-2 p-0">
                <v-card-actions>
                  <v-row>
                    <v-col cols="6" class="d-flex justify-start pt-0 mt-0">
                      <v-btn color="primary" text @click="alternar(4)">
                        Voltar
                      </v-btn>
                    </v-col>

                    <v-col cols="6" class="d-flex justify-end pt-0 mt-0">
                      <v-btn color="primary" text @click="uploadPerfil">
                        Avançar
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-col>
            </v-row>          
          </v-window-item>
        </v-col>        
      </v-window>
    </v-row>
  </v-card>
</template>

<script>
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000/api/'
export default {
  props: {
    alternar: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      step: 1,
      icon: [],
      avatar: undefined,
      loading: false,
      model: null,
      select: false,
      imagemPerfil: undefined
    }
  },
  computed: {
    imagensPefil() {
      return this.$store.getters.getImagensPefil
    },
    perfilUser() {
      return this.$store.getters.getPerfilUsuario
    }
  },
  methods: {
    carregarAvatar(novo) {
      if (isNaN(novo) == true) {
        this.imagemPerfil = undefined
        this.select = false
        this.loading = true
        let reader = new FileReader()
        let img = document.getElementById('img')
        if (novo) {
          reader.readAsDataURL(novo)
          this.loading = false
        } else {
          img.src = ''
          this.loading = false
        }
        var store = this.$store
        reader.onloadend = function () {
          img.src = reader.result
          store.commit('changePerfilUsuario', reader.result)
        }

      } else {
        this.select = true
        this.avatar = undefined
        this.imagemPerfil = this.imagensPefil[novo]
      }
    },
    async createBlob(base64) {
      let res = await fetch(base64)
      let myBlob = await res.blob()
      return myBlob
    },
    uploadPerfil() {
      var imagem = undefined
      if (this.avatar == undefined && this.imagemPerfil == undefined) {
        this.$store.commit('changeAlert', {
          state: true,
          type: 'error',
          message: 'Selecione ou carregue alguma imagem de perfil para prosseguir',
        })
      }
      else if (this.avatar !== undefined && this.imagemPerfil == undefined) {
        imagem = this.avatar
        this.$store.dispatch('uploadFotoPerfil', {
          foto: imagem,
          id: this.usuario.id
        })
        this.alternar(6)
      }
      else if (this.imagemPerfil !== undefined && this.avatar == undefined) {
        this.$store.commit('changePerfilUsuario', this.imagemPerfil)
        this.createBlob(this.imagemPerfil).then(res => {
          imagem = res
          this.$store.dispatch('uploadFotoPerfil', {
            foto: imagem,
            id: this.usuario.id
          })
          this.alternar(6)
        })
      }
    },
    ativarFile() {
      document.getElementById('inputFile').click()
    }
  },
  watch: {
    avatar(novo) {
      if (novo !== undefined) {
        this.carregarAvatar(novo)
      }
    }
  }
}
</script>


<style>
.fotoPerfil {
  border: none;
  transition-property: all;
  transition-duration: 2s;
}

.ativo {
  position: relative;
  bottom: 8px;
}

.fotoAtiva {
  border: 1px solid darkgrey;
  opacity: 0.8;
}

.fotoPerfil:hover {
  position: relative;
  bottom: 8px;

}

.icoSobFoto {
  float: right;
  z-index: auto;
}

#bigHead {
  height: 150px;
  width: 100;
}

.cameraPerfil {
  position: relative;
  bottom: 5px;
  left: 3px;
}

.window {
  width: 100%;
}

.border {

  border: 1px solid red
}

.col-100 {
  height: 500px;
  border: 1px solid red;
}

.btn-continuar {
  float: inline-end;
  position: relative;
  top: 15px;
  left: 12px;
}
</style>