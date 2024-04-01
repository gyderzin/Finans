<template>
  <v-card height="97%" width="100%" class="mt-7" elevation="0">
    <v-row justify="center">
      <v-card-title>
        <h2>Proventos Fixos</h2>
      </v-card-title>
    </v-row>
    <v-card elevation="0">
      <v-row justify="center" class="pb-0 mb-0">
        <v-col cols="5" class="pb-0 mb-0">

          <MouthPicker :changeMes="changeMes" :tipoDespesa="'fixoProvento'"> </MouthPicker>

        </v-col>

        <v-tooltip right color="primary">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="warning" @click="dialogEditarProvento = true" fab dark absolute top left v-bind="attrs"
              v-on="on">
              <v-icon>mdi-cog-outline</v-icon>
            </v-btn>
          </template>
          <span>Configurar proventos fixos</span>
        </v-tooltip>

        <v-dialog width="670" persistent v-model="dialogEditarProvento">
          <EditarProvento :closeDialog="closeDialogEditarProvento"></EditarProvento>
        </v-dialog>

        <v-tooltip left color="primary">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="indigo darken-2" fab dark absolute top right v-bind="attrs" v-on="on"
              @click="dialogNovoProvento = true">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Adicionar provento fixo</span>
        </v-tooltip>
        <v-dialog width="570" v-model="dialogNovoProvento">
          <NovoProvento :closeDialog="closeDialogNovoProventos"></NovoProvento>
        </v-dialog>

      </v-row>

      <v-row class="ma-0 pa-0" justify="center">
        <v-col cols="5" class="pt-0 mt-2 mr-5">
          <v-card elevation="8">
            <v-card-title class="ma-0 pa-2 d-flex justify-center">
              <v-chip color="orange" text-color="white">
                A receber
              </v-chip>
            </v-card-title>
            <v-data-table v-model="selected" :items="proventosAReceber" :headers="dessertHeaders" item-key="id"
              hide-default-footer height="330px" fixed-header>

              <template v-slot:top>
                <v-dialog v-model="dialogAddProvento" width="430">
                  <AddProvento :closeDialog="closeDialogAddProvento" :addProvento="addProvento"
                    :idProvento="idProventoAtual">
                  </AddProvento>
                </v-dialog>

                <v-dialog width="430" v-model="dialogDeleteProventoFixo">
                  <DeleteProvento :closeDialog="closeDialogDeleteProvento" :idProvento="idProventoAtual"
                    :removerProventoFixo="removerProventoFixo"></DeleteProvento>
                </v-dialog>

              </template>

              <template v-slot:body="{ items }">

                <tbody v-if="items.length == 0">
                  <tr class="v-data-table__empty-wrapper">
                    <td colspan="3">
                      <span>
                        Nenhum pagamento a receber.
                      </span>
                    </td>
                  </tr>
                </tbody>

                <v-slide-y-transition group tag="tbody" mode="out-in">
                  <tr v-for="item in items" :key="item.id">

                    <td class="text-start" :key="item.categoria">
                      <v-chip class="pa-4" small text-color="white" color="primary">
                        <v-icon left>
                          mdi-cash-multiple
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
                            @click="changeModal(item.id, 'add')"
                            @mouseout="item.ico = 'mdi-clock-alert-outline'; item.color = 'orange'" fab dark x-small
                            :color="item.color" v-bind="attrs" v-on="on">
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
                Recebidos
              </v-chip>
            </v-card-title>
            <v-data-table v-model="selected" :items="proventosRecebidos" :headers="dessertHeaders" item-key="id"
              hide-default-footer height="330px" fixed-header>

              <template v-slot:body="{ items }">
                <tbody v-if="items.length == 0">
                  <tr class="v-data-table__empty-wrapper">
                    <td colspan="3">
                      <span>
                        Nenhuma pagamento recebido.
                      </span>
                    </td>
                  </tr>
                </tbody>

                <v-slide-y-transition group tag="tbody" mode="out-in">
                  <tr v-for="item in items" :key="item.id">

                    <td class="text-start" :key="item.categoria">
                      <v-chip class="pa-4" small text-color="white" color="primary">
                        <v-icon left>
                          mdi-cash-multiple
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
import NovoProvento from '@/views/Dialogs/App/ProventosFixos/NovoProvento.vue'
import EditarProvento from '@/views/Dialogs/App/ProventosFixos/EditarProventos.vue'
import AddProvento from '@/views/Dialogs/App/ProventosFixos/AddProvento.vue'
import DeleteProvento from '@/views/Dialogs/App/ProventosFixos/DeleteProvento.vue'
export default {
  components: {
    MouthPicker, NovoProvento, EditarProvento, AddProvento, DeleteProvento
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
      dialogNovoProvento: false,
      dialogEditarProvento: false,
      dialogAddProvento: false,
      idProventoAtual: undefined,
      dialogDeleteProventoFixo: undefined
    }
  },
  methods: {
    changeMes(newVal) {
      this.mes = newVal
    },
    addProvento(id, provento) {
      this.proventosAReceber.forEach((element, i) => {
        if (element.id == id) {
          this.$store.dispatch('receberProvento', provento).then((res) => {
            element.id = res
            this.$store.commit('addProventoRecebido', element)
            this.proventosAReceber.splice(i, 1)
            let alert = {
              state: true,
              type: 'success',
              message: 'Provento recebido com sucesso!',
            }
            this.$store.commit('changeAlert', alert)
            this.dialogAddProvento = false
          })
        }
      });
    },
    removerProventoFixo(idProventoFixo) {
      this.$store.dispatch('removerProventoRecebido', idProventoFixo).then(() => {
        let alert = {
          state: true,
          type: 'success',
          message: 'Provento devolvido com sucesso!',
        }
        this.$store.commit('changeAlert', alert)
        this.dialogDeleteProventoFixo = false
      })
    },
    changeModal(id, dialog) {
      if (dialog == 'add') {
        this.dialogAddProvento = true
      }
      else if (dialog == 'remove') {
        this.dialogDeleteProventoFixo = true
      }
      this.idProventoAtual = id
    },
    closeDialogNovoProventos() {
      this.dialogNovoProvento = false
    },
    closeDialogEditarProvento() {
      this.dialogEditarProvento = false
    },
    closeDialogAddProvento() {
      this.dialogAddProvento = false
    },
    closeDialogDeleteProvento() {
      this.dialogDeleteProventoFixo = false
    }
  },
  computed: {
    proventosAReceber() {
      let provento = this.$store.getters.proventosAReceber
      provento.forEach(element => {
        element['ico'] = 'mdi-clock-alert-outline'
        element['color'] = 'orange'
      })
      return provento
    },
    proventosRecebidos() {
      let provento = this.$store.getters.proventosRecebidos
      provento.forEach(element => {
        element['ico'] = 'mdi-check'
        element['color'] = 'success'
      })
      return provento
    }
  },
  watch: {
    mes(newVal, oldVal) {
      this.$store.commit('changeMesFixoProventos', newVal)
      if (oldVal !== undefined) {
        let data = newVal.split('-')
        let dia = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
        dia = dia.split('-')
        data = data[0] + '-' + data[1] + '-' + dia[2]
        this.$store.dispatch('getProventosAReceber', {
          data: data,
          tipo: 'update'
        })
        this.$store.dispatch('getProventosRecebidos', {
          data: data,
          tipo: 'update'
        })
      }
    }
  }
}

</script>

<style></style>