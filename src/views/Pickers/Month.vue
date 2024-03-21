<template>
    <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date"
        transition="scale-transition" offset-y max-width="290px" min-width="auto">
        <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="mes" :label="label" prepend-icon="mdi-calendar" readonly v-bind="attrs"
                v-on="on"></v-text-field>
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
</template>

<script>
export default {
    props: {
        changeMes: {
            type: Function,
            required: true
        },
        tipoDespesa: {
            required: true,
            type: String
        },
        editDespesaFixa: {
            required: false,
        },
        editProventoFixo: {
            required: false
        }
    },
    created() {
        if (this.tipoDespesa == 'fixa') {
            if (this.mesFixo !== undefined) {
                this.date = this.mesFixo
            }
        }
        else if (this.tipoDespesa == 'editDespesaFixa') {
            this.date = this.mesEditDespesaFixa
        }
        else if (this.tipoDespesa == 'editProventoFixo') {
            this.date = this.mesEditProventoFixo            
        }
        else if (this.tipoDespesa == 'avulsa') {
            if (this.mesAvulso !== undefined) {
                this.date = this.mesAvulso
            }
        }
        else if (this.tipoDespesa == 'fixoProvento') {
            if (this.mesFixoProventos !== undefined) {
                this.date = this.mesFixoProventos
            }
        }
        if (this.tipoDespesa !== 'editDespesaFixa' && this.tipoDespesa !== 'editProventoFixo') {
            this.changeMes(this.date)
        } else {
            if (this.tipoDespesa == 'editDespesaFixa') {
                this.changeMes(this.date, this.editDespesaFixa.indice)
            } else {
                this.changeMes(this.date, this.editProventoFixo.indice)
            }

        }
    },
    data: () => ({
        date: new Date().toISOString().substr(0, 7),
        menu: false,
        modal: false,
    }),
    methods: {
        saveMonth() {
            this.$refs.menu.save(this.date)
            if (this.tipoDespesa !== 'editDespesaFixa') {
                this.changeMes(this.date)
            } else {
                this.changeMes(this.date, this.editDespesaFixa.indice)
            }
        }
    },
    computed: {
        label() {
            let retorno = undefined
            if (this.tipoDespesa == 'novaDespesaFixa' || this.tipoDespesa == 'editDespesaFixa' || this.tipoDespesa !== 'editProventoFixo') {
                retorno = 'Começar a pagar a partir de'
            } else if (this.tipoDespesa == 'fixoNovoProvento') {
                retorno = 'Começou a receber em'
            } else {
                retorno = 'Selecione o mês'
            }
            return retorno
        },
        mesEditDespesaFixa() {
            let mes = this.editDespesaFixa.data.split('-')
            return mes[0] + '-' + mes[1]
        },
        mesEditProventoFixo() {
            let mes = this.editProventoFixo.data.split('-')
            return mes[0] + '-' + mes[1]
        },
        mesFixo() {
            return this.$store.getters.mesFixo
        },
        mesAvulso() {
            return this.$store.getters.mesAvulso
        },
        mesFixoProventos() {
            return this.$store.getters.mesFixoProventos
        },
        mesAvulsoProventos() {
            return this.$store.getters.mesAvulsoProventos
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
        editDespesaFixa() {
            this.date = this.mesEditDespesaFixa
            this.changeMes(this.date, this.editDespesaFixa.indice)
        }
    }
}
</script>

<style></style>