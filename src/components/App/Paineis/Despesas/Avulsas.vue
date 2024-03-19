<template>
  <v-card height="97%" width="100%" class="mt-7" elevation="0">
    <v-row justify="center">
      <v-card-title>
        <h2>Despesas</h2>
      </v-card-title>
    </v-row>
    <v-card elevation="0">
      <v-row justify="center" class="pb-0 mb-0">
        <v-col cols="5" class="pb-0 mb-0">

          <MouthPicker :changeMes="changeMes" :tipoDespesa="'avulsa'"> </MouthPicker>

        </v-col>
        <v-col cols="5" class="mt-4 pb-0 mb-0">

          <SelectCategoria :items="categoriasSelects" :label="'Selecione as categorias para filtrar'"
            :changeCategoria="changeCategoria"></SelectCategoria>

        </v-col>
      </v-row>

      <v-dialog v-model="dialogNewDespesa" width="700" persistent>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="indigo darken-2" fab dark absolute top right v-bind="attrs" v-on="on">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <AdicionarDespesaVue :closeDialog="closeDialogNew"></AdicionarDespesaVue>
      </v-dialog>


      <v-row class="ma-0 pa-0">
        <v-col cols="12" class="pt-0 mt-2">
          <v-data-table :headers="dessertHeaders" :items="dataTable" :single-expand="singleExpand"
            :expanded.sync="expanded" item-key="id" show-expand class="elevation-12" hide-default-footer height="390px"
            fixed-header>

            <template v-slot:top>
              <v-dialog v-model="dialogEditDespesa" width="700">
                <EditDespesa :closeDialog="closeDialogEdit" :dialog="dialogEditDespesa">
                </EditDespesa>
              </v-dialog>

              <v-dialog v-model="dialogDeletarDespesa" width="450">
                <DeletarDespesa :closeDialog="closeDialogDelet" :dialog="dialogDeletarDespesa">
                </DeletarDespesa>
              </v-dialog>

            </template>

            <template v-slot:[`header.data-table-expand`]="{}">
              <span class="body-1 font-weight-bold black--text"> {{ parseFloat(valorTotal) | dinheiro }} </span>
            </template>

            <template v-slot:[`item.categoria`]="{ item }">
              <v-chip class="pa-4" small :color="categoriaProps(item.categoria, 'color')" text-color="white">
                <v-icon left>
                  {{ categoriaProps(item.categoria, 'icon') }}
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
                <span>Naõ é possivel alterar uma despesa fixa nesta página.</span>
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
import MouthPicker from '@/views/Pickers/Month.vue'
import SelectCategoria from '@/views/Selects/SelectCategoria.vue'
import AdicionarDespesaVue from '@/views/Dialogs/App/Despesas/AdicionarDespesa.vue'
import EditDespesa from '@/views/Dialogs/App/Despesas/EditDespesa.vue'
import DeletarDespesa from '@/views/Dialogs/App/Despesas/DeletarDespesa.vue'
export default {
  components: {
    MouthPicker, SelectCategoria, AdicionarDespesaVue, EditDespesa, DeletarDespesa
  },
  data() {
    return {
      fab: false,
      dialogNewDespesa: false,
      dialogEditDespesa: false,
      dialogDeletarDespesa: false,
      expanded: [],
      singleExpand: true,
      dessertHeaders: [
        {
          text: 'Categoria',
          align: 'start',
          sortable: false,
          value: 'categoria',
        },
        { text: 'Data', value: 'data' },
        { text: 'Cartão', value: 'cartão' },
        { text: 'Valor', value: 'valor' },
        { text: 'Ações', value: 'action', sortable: false },
        { text: '', value: 'data-table-expand', sortable: false },
      ],
      mes: undefined,
      categoria: [],
      filtroDespesas: [],
      despesasEdited: undefined
    }
  },
  computed: {
    despesas() {
      return this.$store.getters.despesas
    },
    valorTotalDespesas() {
      return this.$store.getters.somaDespesas
    },
    valorTotalFiltro() {
      var soma = 0
      this.filtroDespesas.forEach(element => {
        let n1 = element.valor
        soma = parseFloat(n1) + parseFloat(soma)
      });
      return soma
    },
    valorTotal() {
      let valorTotal = undefined
      if (this.categoria.length == 0) {
        valorTotal = this.valorTotalDespesas
      }
      else {
        valorTotal = this.valorTotalFiltro
      }
      return valorTotal
    },
    categoriasDespesas() {
      let categoriasDespesas = []
      this.despesas.forEach(element => {
        categoriasDespesas.push(element.categoria)
      })
      return categoriasDespesas
    },
    dataTable() {
      let dataTable = undefined
      if (this.categoria.length == 0) {
        dataTable = this.despesas
      }
      else {
        dataTable = this.filtroDespesas
      }
      return dataTable
    }
  },
  methods: {
    filtrarDespesas(val) {
      let filtro = []
      this.despesas.forEach((despesa) => {
        val.forEach((categoria) => {
          if (despesa.categoria == categoria) {
            filtro.push(despesa)
          }
        })
      })
      this.filtroDespesas = filtro
      return filtro
    },
    changeMes(newVal) {
      this.mes = newVal
    },
    changeCategoria(newVal) {
      this.categoria = newVal
    },
    closeDialogNew() {
      this.dialogNewDespesa = false
    },
    dialogEdit(edit) {
      this.$store.dispatch('changeDespesaEdited', edit).then(() => {
        this.dialogEditDespesa = true
      })
    },
    dialogDelet(delet) {
      this.$store.dispatch('changeDespesaEdited', delet).then(() => {
        this.dialogDeletarDespesa = true
      })
    },
    closeDialogEdit() {
      this.dialogEditDespesa = false
    },
    closeDialogDelet() {
      this.dialogDeletarDespesa = false
    }
  },
  watch: {
    categoria(newVal) {
      this.filtrarDespesas(newVal)
    },
    categoriasDespesas: {
      handler() {
        this.filtrarDespesas(this.categoria)
      },
      deep: true
    },
    mes(newVal, oldVal) {
      this.$store.commit('changeMesAvulso', newVal)
      if (oldVal !== undefined) {
        let dia = newVal.split('-')
        dia = dia[0] + '-' + dia[1] + '-01'
        this.$store.dispatch('getDespesas', {
          data: dia,
          tipo: 'update'
        })
      }
    }
  }
}
</script>
  
<style>
.border {
  border: 1px solid red;
}
</style>