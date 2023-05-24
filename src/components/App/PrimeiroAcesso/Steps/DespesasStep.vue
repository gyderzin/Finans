<template>
  <v-card height="382px">
    <v-row>
      <v-col cols="12" class="d-flex justify-center pb-0 mb-0">
        <v-card-text>
          Agora, utilizando das suas categorias, nos informe suas despesas fixas mensais, aquelas que devem ser pagas
          todo mês, como aluguel, internet, parcela de carro, etc.
        </v-card-text>

        <v-tooltip bottom color="indigo">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="mx-2" @click="dialog = true" small fab dark color="indigo">
              <v-icon dark v-bind="attrs" v-on="on">
                mdi-plus
              </v-icon>
            </v-btn>
          </template>
          <span>Adicionar Despesas</span>
        </v-tooltip>

        <v-dialog v-model="dialog" max-width="700px">
          <AdicionarDespesa :changeDialog="changeDialog"> </AdicionarDespesa>
        </v-dialog>
      </v-col>
    </v-row>

    <v-col cols="12" class="pt-0 mt-0">
      <v-simple-table fixed-header height="255">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Categoria
              </th>
              <th class="text-center">
                Valor
              </th>
              <th class="text-right black--text body-2 font-weight-bold">
                Total: {{ somaDespesasFixas | dinheiro }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(despesa, i) in despesasFixas" :key="i">
              <td>
                <v-chip class="pa-4" small :color=" categoriaProps(despesa.categoria, 'color')" text-color="white">
                  <v-icon left>
                    {{ categoriaProps(despesa.categoria, 'icon') }}
                  </v-icon>
                  {{ despesa.categoria }}
                </v-chip>
              </td>
              <td class="text-center"> {{ parseFloat(despesa.valor) | dinheiro }} </td>
              <td class="text-right">
                <v-btn class="mx-2" icon color="dark" @click="deleteDespesaFixa(i)">
                  <v-icon light>
                    mdi-delete
                  </v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>

    <v-col class="pt-0 mt-2">
      <v-card-actions>
        <v-row>
          <v-col cols="6" class="d-flex justify-start pt-0 mt-0">
            <v-btn text color="primary" @click="alternar(3)">
              Voltar
            </v-btn>
          </v-col>
          <v-col cols="6" class="d-flex justify-end pt-0 mt-0">
            <v-btn text color="primary" :disabled="despesasFixas.length <= 0" @click="alternar(5)">
              Avançar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-col>

  </v-card>
</template>

<script>
import AdicionarDespesa from '@/views/Dialogs/PrimeiroAcesso/AdicionarDespesa.vue';
export default {
  components: { AdicionarDespesa },
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
  computed: {
    despesasFixas() {
      return this.$store.getters.despesasFixas
    },
    somaDespesasFixas() {
      return this.$store.getters.somaDespesasFixas
    }
  },
  methods: {    
    changeDialog(value) {
      this.dialog = value
    },
    deleteDespesaFixa(i) {
      this.$store.commit('deleteDespesaFixa', i)
    }
  }
}
</script>

<style></style>