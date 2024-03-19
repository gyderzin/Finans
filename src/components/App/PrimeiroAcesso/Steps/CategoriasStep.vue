<template>
  <v-card height="382px">
    <v-row>
      <v-col cols="12" class="d-flex justify-center pb-0 mb-0">
        <v-card-text>
          Agora, vamos criar categorias para as suas despesas de acordo com sua realidade. Elas vão servir para que você
          tenha um controle de para onde vai o seu dinheiro.
        </v-card-text>

        <v-tooltip bottom color="indigo">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="mx-2" @click="dialog = true" small fab dark color="indigo">
              <v-icon dark v-bind="attrs" v-on="on">
                mdi-plus
              </v-icon>
            </v-btn>
          </template>
          <span>Adicionar Categorias</span>
        </v-tooltip>

        <v-dialog v-model="dialog" max-width="700px" persistent>
          <AdicionarCategoriaVue :changeDialog="changeDialog"> </AdicionarCategoriaVue>
        </v-dialog>
      </v-col>

      <v-col cols="12" class="py-0 my-0">
        <v-simple-table fixed-header height="245">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center"> Categorias </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in categorias" :key="i">
                <td class="body-2">
                  <v-row>
                    <v-col cols="12" >
                      <v-chip class="ma-2" :color="item.color" label close @click:close="deleteCategoria(i)">
                        <v-icon left>
                          {{ item.icon }}
                        </v-icon>
                        <span class="pr-2">
                          {{ item.categoria }}
                        </span>
                      </v-chip>
                    </v-col>

                  </v-row>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>

      <v-col class="pt-0 mt-4 mb-2">
        <v-card-actions>
          <v-row>
            <v-col cols="6" class="d-flex justify-start pt-0 mt-0">
              <v-btn text color="primary" @click="alternar(2)">
                Voltar
              </v-btn>
            </v-col>
            <v-col cols="6" class="d-flex justify-end pt-0 mt-0">
              <v-btn text color="primary" :disabled="categorias.length <= 0" @click="alternar(4)">
                Avançar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-col>

    </v-row>
  </v-card>
</template>

<script>
import AdicionarCategoriaVue from '@/views/Dialogs/PrimeiroAcesso/AdicionarCategoria.vue'
export default {
  components: {
    AdicionarCategoriaVue
  },
  props: {
    alternar: {
      required: true,
      type: Function
    }
  },
  data() {
    return {
      dialog: false
    }
  },
  methods: {
    deleteCategoria(i) {
      this.$store.commit('deleteCategoria', i)
    },
    changeDialog(value) {
      this.dialog = value
    },
  },
  computed: {
    categorias() {
      return this.$store.getters.categorias
    }
  },
}
</script>

<style></style>