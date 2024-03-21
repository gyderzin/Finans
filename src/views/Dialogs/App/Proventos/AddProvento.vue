<template>
    <v-card>
        <v-row justify="center" class="pa-0 ma-0 success">
            <v-card-title class="pa-2 ma-0 white--text">
                Você recebeu este provento?
            </v-card-title>
        </v-row>
        <v-divider></v-divider>
        <v-row class="pa-0 ma-0">
            <v-col cols="12" class="mt-1 pa-0">
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Categoria
                                </th>
                                <th class="text-left">
                                    Valor
                                </th>
                                <th class="text-left">
                                    Data
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <v-row>
                                        <v-col cols="12" class="d-flex justify-center pa-0 ma-0">
                                            <v-chip class="pa-4" small text-color="white" color="primary">
                                                <v-icon left>
                                                    mdi-cash-multiple
                                                </v-icon>
                                                {{ proventoFixo.categoria }}
                                            </v-chip>
                                        </v-col>
                                    </v-row>
                                </td>
                                <td>{{ parseFloat(proventoFixo.valor) | dinheiro }}</td>
                                <td>
                                    <Date :alterarData="alterarData" :tipo="'addProventoFixo'">
                                    </Date>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
            <v-col cols="12" class="ma-0 pa-0 mt-2">
                <v-card-actions>
                    <v-row class="pa-0 ma-0">
                        <v-col cols="6" class="pa-0 ma-0">
                            <v-btn color="primary" text @click="closeDialog">
                                Cancelar
                            </v-btn>
                        </v-col>

                        <v-col cols="6" class="d-flex justify-end pa-0 ma-0">
                            <v-btn color="success" text @click="alterarProvento(idProvento)">
                                Confirmar
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import Date from '@/views/Pickers/Date.vue'
export default {
    components: {
        Date
    },
    props: {
        closeDialog: {
            type: Function,
            required: true
        },
        addProvento: {
            type: Function,
            required: true
        },
        idProvento: {
            required: true
        }
    },
    data() {
        return {
            data: undefined,
            tipoData: undefined
        }
    },
    methods: {
        alterarProvento(id) {
            let provento = this.proventoFixo
            let valor = this.filtrarMoney('', provento.valor)
            valor = valor.replace('.', '').replace(',', '.')
            let data = this.data.split('/')
            data = data[2] + '-' + data[1] + '-' + data[0]
            provento.valor = valor
            provento.data = data
            provento.descrição = 'Provento fixo.'
            this.addProvento(id, provento)
        },
        alterarData(val) {
            this.data = val
        },
    },
    computed: {
        proventoFixo() {
            let proventos = this.$store.getters.proventosAReceber
            let proventoAtual = undefined
            proventos.forEach(element => {
                if (element.id == this.idProvento) {
                    proventoAtual = element
                    proventoAtual.fixo = 'true'
                    proventoAtual.data = this.data
                }
            })
            return proventoAtual
        },
    },
}
</script>

<style>
.selectAddDF {
    width: 75px;
}
</style>