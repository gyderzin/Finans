<template>
  <v-card height="97%" width="100%" class="mt-7" elevation="0">
    <v-row justify="center">
      <v-card-title>
        <h2>Despesas Fixas</h2>
      </v-card-title>
    </v-row>
    <v-card elevation="0">
      <v-row justify="center" class="pb-0 mb-0">
        <v-col cols="5" class="pb-0 mb-0">

          <MouthPicker :changeMes="changeMes" :tipoDespesa="'fixa'"> </MouthPicker>

        </v-col>

        <v-tooltip right color="primary">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="warning" fab dark absolute top left v-bind="attrs" v-on="on"
              @click="dialogEditarDespesasFixas = true">
              <v-icon>mdi-cog-outline</v-icon>
            </v-btn>
          </template>
          <span>Configurar despesas fixas</span>
        </v-tooltip>

        <v-dialog v-model="dialogEditarDespesasFixas" width="670" persistent>
          <DialogEditarDespesasFixas :closeDialog="closeDialogEditDespesa">
          </DialogEditarDespesasFixas>
        </v-dialog>

        <v-tooltip left color="primary">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="indigo darken-2" fab dark absolute top right v-bind="attrs" v-on="on"
              @click="dialogNovaDespesaFixa = true">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Adicionar despesa fixa</span>
        </v-tooltip>
        <v-dialog v-model="dialogNovaDespesaFixa" width="570">
          <DialogNovaDespesa :closeDialog="closeDialogNovaDespesa">
          </DialogNovaDespesa>
        </v-dialog>

      </v-row>

      <v-row class="ma-0 pa-0" justify="center">
        <v-col cols="5" class="pt-0 mt-2 mr-5">
          <v-card elevation="8">
            <v-card-title class="ma-0 pa-2 d-flex justify-center">
              <v-chip color="orange" text-color="white">
                Pendentes
              </v-chip>
            </v-card-title>
            <v-data-table v-model="selected" :headers="dessertHeaders" :items="despesasFixas" item-key="id"
              hide-default-footer height="330px" fixed-header>

              <template v-slot:top>
                <v-dialog v-model="dialogAddDespesaFixa" width="430">
                  <DialogAddDespesa :closeDialog="closeDialog" :addDespesaFixa="adicionarDespesaFixa"
                    :idDespesa="idDespesaAtual">
                  </DialogAddDespesa>
                </v-dialog>

                <v-dialog v-model="dialogDeleteDespesaFixa" width="430">
                  <DialogDeleteDespesa :closeDialog="closeDialogDD" :idDespesa="idDespesaAtual"
                    :removerDespesaFixa="removerDespesaFixa">
                  </DialogDeleteDespesa>
                </v-dialog>

              </template>

              <template v-slot:body="{ items }">

                <tbody v-if="items.length == 0">
                  <tr class="v-data-table__empty-wrapper">
                    <td colspan="3">
                      <span>
                        Nenhuma despesa pendente.
                      </span>
                    </td>
                  </tr>
                </tbody>

                <v-slide-y-transition group tag="tbody" mode="out-in">
                  <tr v-for="item in items" :key="item.id">

                    <td class="text-start" :key="item.categoria">
                      <v-chip class="pa-4" small :color="categoriaProps(item.categoria, 'color')" text-color="white">
                        <v-icon left>
                          {{ categoriaProps(item.categoria, 'icon') }}
                        </v-icon>
                        {{ item.categoria }}
                      </v-chip>
                    </td>

                    <td class="text-start" :key="item.valor">
                      {{ parseFloat(item.valor) | dinheiro }}
                    </td>

                    <td class="text-start" :key="item.action">
                      <v-tooltip top color="success">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn @mouseenter="item.ico = 'mdi-check'; item.color = 'success'"
                            @mouseout="item.ico = 'mdi-clock-alert-outline'; item.color = 'orange'" fab dark x-small
                            :color="item.color" @click="changeModal(item.id, 'add')" v-bind="attrs" v-on="on">
                            <v-icon @mouseenter="item.ico = 'mdi-check'; item.color = 'success'"
                              @mouseout="item.ico = 'mdi-clock-alert-outline'; item.color = 'orange'" dark>
                              {{ item.ico }}
                            </v-icon>
                          </v-btn>
                        </template>
                        <span>Alternar para pago</span>
                      </v-tooltip>
                    </td>

                  </tr>
                </v-slide-y-transition>
              </template>
            </v-data-table>

          </v-card>
        </v-col>

        <v-col cols="5" class="pt-0 mt-2 ml-5">
          <v-card elevation="8">
            <v-card-title class="ma-0 pa-2 d-flex justify-center">
              <v-chip color="success" text-color="white">
                Pagos
              </v-chip>
            </v-card-title>
            <v-data-table v-model="selected" :headers="dessertHeaders" :items="despesasPagas" item-key="id"
              hide-default-footer height="330px" fixed-header>

              <template v-slot:body="{ items }">
                <tbody v-if="items.length == 0">
                  <tr class="v-data-table__empty-wrapper">
                    <td colspan="3">
                      <span>
                        Nenhuma despesa paga.
                      </span>
                    </td>
                  </tr>
                </tbody>

                <v-slide-y-transition group tag="tbody" mode="out-in">
                  <tr v-for="item in items" :key="item.id">

                    <td class="text-start" :key="item.categoria">
                      <v-chip class="pa-4" small :color="categoriaProps(item.categoria, 'color')" text-color="white">
                        <v-icon left>
                          {{ categoriaProps(item.categoria, 'icon') }}
                        </v-icon>
                        {{ item.categoria }}
                      </v-chip>
                    </td>

                    <td class="text-start" :key="item.valor">
                      {{ parseFloat(item.valor) | dinheiro }}
                    </td>

                    <td class="text-start" :key="item.action">

                      <v-tooltip top color="orange">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn @mouseenter="item.ico = 'mdi-clock-alert-outline'; item.color = 'orange'"
                            @mouseout="item.ico = 'mdi-check'; item.color = 'success'" class="mx-2" fab dark x-small
                            :color="item.color" v-bind="attrs" v-on="on" @click="changeModal(item.id, 'remove')">
                            <v-icon @mouseenter="item.ico = 'mdi-clock-alert-outline'; item.color = 'orange'"
                              @mouseout="item.ico = 'mdi-check'; item.color = 'success'" dark>
                              {{ item.ico }}
                            </v-icon>
                          </v-btn>
                        </template>
                        <span>Alternar para pendente.</span>
                      </v-tooltip>

                    </td>

                  </tr>
                </v-slide-y-transition>
              </template>

            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

  </v-card>
</template>

<script>
import MouthPicker from '@/views/Pickers/Month.vue'
import DialogAddDespesa from '@/views/Dialogs/App/DespesasFixas/AddDespesa.vue'
import DialogDeleteDespesa from '@/views/Dialogs/App/DespesasFixas/DeleteDespesa.vue'
import DialogNovaDespesa from '@/views/Dialogs/App/DespesasFixas/NovaDespesa.vue'
import DialogEditarDespesasFixas from '@/views/Dialogs/App/DespesasFixas/EditarDespesa.vue'
export default {
  components: {
    MouthPicker, DialogAddDespesa, DialogDeleteDespesa, DialogNovaDespesa, DialogEditarDespesasFixas
  },
  data() {
    return {
      mes: undefined,
      date: new Date().toISOString().substr(0, 7),
      selected: [],
      dessertHeaders: [
        {
          text: 'Categoria',
          align: 'start',
          sortable: true,
          value: 'categoria',
        },
        { text: 'Valor', value: 'valor' },
        { text: 'Situação', value: 'action', sortable: false },
      ],
      dialogAddDespesaFixa: false,
      dialogDeleteDespesaFixa: false,
      dialogNovaDespesaFixa: false,
      dialogEditarDespesasFixas: false,
      dialogEditDespesaFixa: false,
      idDespesaAtual: undefined,
    }
  },
  methods: {
    changeMes(newVal) {
      this.mes = newVal
    },
    closeDialog() {
      this.dialogAddDespesaFixa = false
    },
    closeDialogDD() {
      this.dialogDeleteDespesaFixa = false
    },
    closeDialogNovaDespesa() {
      this.dialogNovaDespesaFixa = false
    },
    closeDialogEditDespesa() {
      this.dialogEditarDespesasFixas = false
    },
    adicionarDespesaFixa(id, despesa) {
      this.despesasFixas.forEach((element, i) => {
        if (element.id == id) {
          this.$store.dispatch('uploadDespesas', despesa).then(() => {
            this.$store.commit('addDespesasPagas', element)
            this.despesasFixas.splice(i, 1)
            let alert = {
              state: true,
              type: 'success',
              message: 'Despesa fixa paga com sucesso!',
            }
            this.$store.commit('changeAlert', alert)
            this.dialogAddDespesaFixa = false
          })
        }
      });
    },
    changeModal(id, dialog) {
      if (dialog == 'add') {
        this.dialogAddDespesaFixa = true
      }
      else if (dialog == 'remove') {
        this.dialogDeleteDespesaFixa = true
      }
      this.idDespesaAtual = id
    },
    removerDespesaFixa(id) {
      this.despesasPagas.forEach((element, i) => {
        if (element.id == id) {
          element.tipo = 'despesaFixa'
          this.$store.dispatch('deletDespesa', element).then(() => {
            this.despesasFixas.push(element)
            this.$store.commit('removeDespesaPagas', i)
            let alert = {
              state: true,
              type: 'warning',
              message: 'Despesa fixa pendente novamente.',
            }
            this.$store.commit('changeAlert', alert)
            this.dialogDeleteDespesaFixa = false
          })
        }
      });
    }
  },
  computed: {
    despesasFixas() {
      let despesasFixas = this.$store.getters.despesasFixas
      despesasFixas.forEach(element => {
        element['ico'] = 'mdi-clock-alert-outline'
        element['color'] = 'orange'
      })
      return despesasFixas
    },
    despesasPagas() {
      let despesasPagas = this.$store.getters.despesasPagas
      despesasPagas.forEach(element => {
        element['ico'] = 'mdi-check'
        element['color'] = 'success'
      })
      return despesasPagas
    },
  },
  watch: {
    mes(newVal, oldVal) {
      this.$store.commit('changeMesFixo', newVal)
      if (oldVal !== undefined) {
        let data = newVal.split('-')
        let dia = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
        dia = dia.split('-')
        data = data[0] + '-' + data[1] + '-' + dia[2]
        this.$store.dispatch('getDespesasFixasPendentes', {
          data: data,
          tipo: 'update'
        })
        this.$store.dispatch('getDespesasFixasPagas', {
          data: data,
          tipo: 'update'
        })
      }
    }
  }
}
</script>

<style></style>