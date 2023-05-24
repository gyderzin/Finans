<template>
    <v-card>
        <v-row justify="center" class="pa-0 ma-0 success">
            <v-card-title class="pa-2 ma-0 white--text">
                Deseja pagar esta despesa?
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
                                    Cartão
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
                                            <v-chip class="pa-4" small
                                                :color="categoriaProps(despesaFixa.categoria, 'color')" text-color="white">
                                                <v-icon left>
                                                    {{ categoriaProps(despesaFixa.categoria, 'icon') }}
                                                </v-icon>
                                                {{ despesaFixa.categoria }}
                                            </v-chip>
                                        </v-col>
                                    </v-row>
                                </td>
                                <td>{{ parseFloat(despesaFixa.valor) | dinheiro }}</td>
                                <td>
                                    <span v-show="selecionarCartão == false">
                                        {{ cartões }}
                                    </span>

                                    <v-select @change="selecionarCartão = false" @blur="selecionarCartão = false"
                                        v-show="selecionarCartão == true" :id="'cartão' + idDespesa"
                                        class="ma-0 pa-0 mt-5 selectAddDF" v-model="cartões" :items="['Inter', 'Nubank']"
                                        label="Cartões" dense></v-select>

                                    <v-btn v-show="selecionarCartão == false" text icon color="blue lighten-2"
                                        @click="ativarSelect">
                                        <v-icon small>mdi-pencil</v-icon>
                                    </v-btn>
                                </td>
                                <td>
                                    <Date :alterarData="alterarData" :tipo="'addDespesaFixa'">
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
                            <v-btn color="success" text @click="alterarDespesaFixa(idDespesa)">
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
        addDespesaFixa: {
            type: Function,
            required: true
        },
        idDespesa: {
            required: true
        }
    },
    data() {
        return {
            data: undefined,
            selecionarCartão: false,
            cartões: 'Inter',
            tipoData: undefined
        }
    },
    methods: {
        alterarDespesaFixa(id) {
            let despesa = this.despesaFixa
            let valor = this.filtrarMoney('', despesa.valor)
            valor = valor.replace('.', '').replace(',', '.')
            let data = this.data.split('/')
            data = data[2] + '-' + data[1] + '-' + data[0]
            despesa.valor = valor
            despesa.data = data
            despesa.descrição = 'Despesa fixa.'
            this.addDespesaFixa(id, despesa)
        },
        alterarData(val) {
            this.data = val
        },
        ativarSelect() {
            this.selecionarCartão = true
            let select = document.getElementById('cartão' + this.idDespesa)
            select.click()
        },
    },
    computed: {
        despesaFixa() {
            let despesas = this.$store.getters.despesasFixas
            let despesaAtual = undefined
            despesas.forEach(element => {
                if (element.id == this.idDespesa) {
                    despesaAtual = element
                    despesaAtual.cartão = this.cartões
                    despesaAtual.fixo = 'true'
                    despesaAtual.data = this.data
                }
            })
            return despesaAtual
        },
    },
    watch: {
        cartões(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.selecionarCartão = false
            }
        }
    }
}
</script>

<style>
.selectAddDF {
    width: 75px;
}
</style>