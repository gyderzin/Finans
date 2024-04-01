<template>
  <v-card height="97%" width="100%" class="mt-7" elevation="0">
    <v-row justify="center">
      <v-card-title>
        <h2>Proventos</h2>
      </v-card-title>
    </v-row>
    <v-card elevation="0">
      <v-row justify="center" class="pb-0 mb-0">
        <v-col cols="5" class="pb-0 mb-0">

          <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date"
            transition="scale-transition" offset-y max-width="290px" min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="mes" label="Filtrar por mês de " prepend-icon="mdi-calendar" readonly
                v-bind="attrs" v-on="on"></v-text-field>
            </template>
            <v-date-picker persistent v-model="date" type="month" no-title scrollable locale="br">
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="saveMonth">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>

        </v-col>
        <v-col cols="5" class="mt-4 pb-0 mb-0">

          <SelectCategoria :items="categoriasProventos" :label="'Selecione as categorias para filtrar'"
            :changeCategoria="changeCategoria"></SelectCategoria>

        </v-col>
      </v-row>

      <v-dialog v-model="dialogNovoProvento" width="700" persistent>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="indigo darken-2" fab dark absolute top right v-bind="attrs" v-on="on">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <AdicionarProventoExtra :closeDialog="closeDialogNew"></AdicionarProventoExtra>
      </v-dialog>


      <v-row class="ma-0 pa-0">
        <v-col cols="12" class="pt-0 mt-2">
          <v-data-table :headers="dessertHeaders" :items="dataTable" :single-expand="singleExpand"
            :expanded.sync="expanded" item-key="id" show-expand class="elevation-12" hide-default-footer height="390px"
            fixed-header>

            <template v-slot:top>

            </template>

            <template v-slot:[`header.data-table-expand`]="{ }">
              <span class="body-1 font-weight-bold black--text">
                <!-- {{ parseFloat(valorTotal) | dinheiro }}  -->
                R$ 500
              </span>
            </template>

            <template v-slot:[`item.categoria`]="{ item }">
              <v-chip class="pa-4" small text-color="white" color="primary">
                <v-icon left>
                  mdi-cash-multiple
                </v-icon>
                {{ item.categoria }}
              </v-chip>
            </template>

            <template v-slot:[`item.valor`]="{ item }">
              {{ parseFloat(item.valor) | dinheiro }}
            </template>



            <template v-slot:[`item.action`]="{ item }">
              <v-speed-dial v-model="item.action" direction="left" :open-on-hover="true" transition="scale-transition"
                v-if="item.fixo == 'false'">
                <template v-slot:activator>
                  <v-btn v-model="item.action" color="blue darken-2" dark fab small outlined>
                    <v-icon v-if="item.action">
                      mdi-close
                    </v-icon>
                    <v-icon v-else>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </template>

                <v-btn fab dark x-small color="green" @click="dialogEdit(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>

                <v-btn fab dark x-small color="red" @click="dialogDelet(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>

              </v-speed-dial>
              <v-tooltip left v-else color="warning">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="warning" dark v-bind="attrs" v-on="on" large>
                    mdi-information
                  </v-icon>
                </template>
                <span>Naõ é possivel alterar um provento fixo nesta página.</span>
              </v-tooltip>
            </template>


            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                {{ item.descrição }}
              </td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>

  </v-card>
</template>

<script>
import SelectCategoria from '@/views/Selects/SelectCategoria.vue'
import AdicionarProventoExtra from '@/views/Dialogs/App/Proventos/AdicionarProvento.vue'
export default {
  components: {
    SelectCategoria, AdicionarProventoExtra,
  },
  created() {
    this.$store.commit('changeMesAvulsoProventos', this.date)
  },
  data() {
    return {
      categoria: [],
      categoriasProventos: ['Alugueis', 'Investimentos', 'Pensão', 'Salário', 'Outros'],
      dessertHeaders: [
        {
          text: 'Categoria',
          align: 'start',
          sortable: false,
          value: 'categoria',
        },
        { text: 'Data', value: 'data' },
        { text: 'Valor', value: 'valor' },
        { text: 'Ações', value: 'action', sortable: false },
        { text: '', value: 'data-table-expand', sortable: false },
      ],
      dialogNovoProvento: false,
      date: new Date().toISOString().substr(0, 7),
      menu: false,
      modal: false,
    }
  },
  methods: {
    saveMonth() {
      this.$refs.menu.save(this.date)
      this.$store.commit('changeMesAvulsoProventos', this.date)
      let dia = this.date.split('-')
      dia = dia[0] + '-' + dia[1] + '-01'
      this.$store.dispatch('getProventos', {
        data: dia,
        tipo: 'update'
      })
    },
    changeCategoria(newVal) {
      this.categoria = newVal
    },
    closeDialogNew() {
      this.dialogNovoProvento = false
    }
  },
  computed: {
    proventos() {
      return this.$store.getters.proventos
    },
    dataTable() {
      let dataTable = undefined
      if (this.categoria.length == 0) {
        dataTable = this.proventos
      }
      else {
        dataTable = this.filtroDespesas
      }
      return dataTable
    },
    mes() {
      var meses = {
        '01': "Janeiro",
        '02': "Fevereiro",
        '03': "Março",
        '04': "Abril",
        '05': "Maio",
        '06': "Junho",
        '07': "Julho",
        '08': "Agosto",
        '09': "Setembro",
        '10': "Outubro",
        '11': "Novembro",
        '12': "Dezembro"
      };
      let data = this.date.split('-')
      return meses[data[1]] + ' de ' + data['0']
    }
  },
  watch: {
    date() {
      this.$store.commit('changeMesAvulsoProventos', this.date)
    }
  },
}
</script>
<style lang="">

</style>