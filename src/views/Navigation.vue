<template>
  <v-card class="mt-3" tile height="100%" width="25%">
    <v-navigation-drawer v-model="drawer" permanent dark width="100%">
      <v-list>
        <v-list-item>
          <v-list-item-avatar size="70">
            <v-img :src="perfilUsuario">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="">
              {{ usuario.nome }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ usuario.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>


      <v-divider></v-divider>

      <v-list dense>
        <v-list-item :key="items[0].title" link :to="items[0].to" exact exact-active-class="light--text">
          <v-list-item-icon>
            <v-icon>{{ items[0].icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ items[0].title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group :key="items[1].title" v-model="items[1].active" :prepend-icon="items[1].icon"
          no-action>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="items[1].title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item v-for="child in items[1].childs" :key="child.title" :to="child.to" exact exact-active-class="light--text">
            <v-list-item-content>
              <v-list-item-title v-text="child.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-group :key="items[2].title" v-model="items[2].active" :prepend-icon="items[2].icon"
          no-action>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="items[2].title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item v-for="child in items[2].childs" :key="child.title" :to="child.to" exact exact-active-class="light--text">
            <v-list-item-content>
              <v-list-item-title v-text="child.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item :key="items[3].title" link :to="items[3].to" exact exact-active-class="light--text">
          <v-list-item-icon>
            <v-icon>{{ items[3].icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ items[3].title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item :key="items[4].title" link :to="items[4].to" exact exact-active-class="light--text">
          <v-list-item-icon>
            <v-icon>{{ items[4].icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ items[4].title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item :key="items[5].title" link :to="items[5].to" exact exact-active-class="light--text">
          <v-list-item-icon>
            <v-icon>{{ items[5].icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ items[5].title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('recuperarFotoPerfil', {
      id: this.usuario.id,
      tipo: 'base64'
    })
  },
  data() {
    return {
      drawer: true,
      items: [
        { title: 'Painel Geral', icon: 'mdi-timetable', to: '/home/' },
        { title: 'Despesas', icon: 'mdi-cash-minus',
          childs: [            
            {
              title: 'Avulsas', icon: 'mdi-cash-minus', to: '/home/despesas/'
            },
            {
              title: 'Fixas', icon: 'mdi-cash-minus', to: '/home/despesas/fixas'
            },
          ]
        },
        { title: 'Proventos', icon: 'mdi-cash-plus',
          childs: [            
            {
              title: 'Extra', icon: 'mdi-cash-plus', to: '/home/proventos/'
            },
            {
              title: 'Fixas', icon: 'mdi-cash-plus', to: '/home/proventos/fixos'
            },
          ]
        },        
        { title: 'Cartões', icon: 'mdi-credit-card-multiple-outline', to: '/home/cartões' },
        { title: 'Categorias', icon: 'mdi-shape-outline', to: '/home/categorias' },
        { title: 'Perfil', icon: 'mdi-account', to: '/home/perfil' },
      ]
    }
  },
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

<style scoped>

</style>