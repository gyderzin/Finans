<template>
    <v-card>
        <v-row justify="center" class="pa-0 ma-0 warning">
            <v-card-title class="pa-2 ma-0 white--text">
                Deseja tornar essa despesa pendente?
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
                                    <v-chip class="pa-4" small :color="categoriaProps(despesaFixa.categoria, 'color')"
                                        text-color="white">
                                        <v-icon left>
                                            {{ categoriaProps(despesaFixa.categoria, 'icon') }}
                                        </v-icon>
                                        {{ despesaFixa.categoria }}
                                    </v-chip> 
                                </td>
                                <td> {{ parseFloat(despesaFixa.valor) | dinheiro }} </td>
                                <td> {{ despesaFixa.cartão }} </td>
                                <td> {{ despesaFixa.data | data }} </td>
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
                            <v-btn color="success" text @click="removerDespesaFixa(idDespesa)">
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
export default {
    props: {
        closeDialog: {
            required: true,
            type: Function
        },
        idDespesa: {
            required: true
        },
        removerDespesaFixa: {
            type: Function,
            required: true
        }
    },
    computed: {
        despesaFixa() {
            let despesas = this.$store.getters.despesasPagas
            let despesaAtual = undefined
            despesas.forEach(element => {
                if (element.id == this.idDespesa) {
                    despesaAtual = element
                }
            })
            return despesaAtual
        },
    },
}
</script>
<style ></style>