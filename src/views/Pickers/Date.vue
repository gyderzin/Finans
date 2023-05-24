<template>
  <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
    min-width="auto">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field :class="tipo == 'addDespesaFixa' ? 'tfDespesaFixa' : ''" flat
        :prepend-icon="tipo !== 'addDespesaFixa' ? 'mdi-calendar' : ''" v-model="dataBR" label="Data da despesa" readonly
        v-bind="attrs" v-on="on"></v-text-field>
    </template>
    <v-date-picker v-if="tipo == 'add' || tipo == 'addDespesaFixa'" v-model="date" @input="menu = false" locale="pt-br"
      :min="tipo == 'addDespesaFixa' ? mes + '-01' : ''"
      :max="tipo == 'addDespesaFixa' ? mes + '-31' : ''"></v-date-picker>
    <v-date-picker v-if="tipo == 'edit'" v-model="dataEdit" @input="menu = false" locale="pt-br"></v-date-picker> 
  </v-menu>
</template>

<script>

export default {
  props: {
    alterarData: {
      type: Function,
      required: true
    },
    tipo: {
      type: String,
      required: true
    },
    dateEditDespesaFixa: {
      type: Object,
      required: false
    }
  },
  created() {
    if (this.tipo !== 'editDespesaFixa') {
      this.alterarData(this.dataBR)
      let mesAtual = this.date.split('-')[1]
      let mesDespesa = this.dataBR.split('/')
      if (mesAtual !== mesDespesa[1]) {
        this.date = mesDespesa[2] + '-' + mesDespesa[1] + '-' + mesDespesa[0]
      }
    }
  },
  data() {
    return {
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      diferençaMes: false
    }
  },
  computed: {
    mes() {
      return this.$store.getters.mesFixo
    },
    dataBR() {
      let data = undefined
      if (this.tipo == 'add') {
        data = this.date.split('-')
      }
      else if (this.tipo == 'addDespesaFixa') {
        data = this.date.split('-')
        let mes = this.mes.split('-')
        if (data[1] != mes[1]) {
          data[2] = '01'
          data[1] = mes[1]
          data[0] = mes[0]
        }
      }     
      else if (this.tipo == 'edit') {
        data = this.dataEdit.split('-')
      }
      return data[2] + '/' + data[1] + '/' + data[0]
    },    
    dataEdit: {
      get() {
        let data = this.$store.getters.despesaEdited.data
        data = data.split('/')
        return data[2] + '-' + data[1] + '-' + data[0]
      },
      set(newData) {
        let data = newData.split('-')
        data = data[2] + '/' + data[1] + '/' + data[0]
        this.$store.commit('setDateEdit', data)
      }
    },
  },
  watch: {
    dataBR() {
      if (this.tipo !== 'editDespesaFixa') {
        let mesAtual = this.date.split('-')[1]
        let mesDespesa = this.dataBR.split('/')
        if (mesAtual !== mesDespesa[1]) {
          this.date = mesDespesa[2] + '-' + mesDespesa[1] + '-' + mesDespesa[0]
        }
      }
    },
    date() {
      if (this.tipo !== 'editDespesaFixa') {
        this.alterarData(this.dataBR)
      } else {
        this.alterarData(this.dataBR, this.dateEditDespesaFixa.indice)
      }
    }
  }
}
</script>

<style>
.tfDespesaFixa {
  width: 85px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: 20px;
  margin-bottom: 0px;
}
</style>