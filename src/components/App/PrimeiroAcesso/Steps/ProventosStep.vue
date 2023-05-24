<template>
    <v-card class="mt-0 pt-0" height="382px">
        <v-row>
            <v-col cols="12" class="d-flex justify-center pb-0 mb-0">
                <v-card-text class="body-2">
                    Para começarmos, nos informe os seus proventos fixos mensais, como salário, pensão,
                    alugueis, etc.
                </v-card-text>
                <v-tooltip bottom color="indigo">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn class="mx-2" @click="dialog = true" small fab dark color="indigo">
                            <v-icon dark v-bind="attrs" v-on="on">
                                mdi-plus
                            </v-icon>
                        </v-btn>
                    </template>
                    <span>Adicionar provento</span>
                </v-tooltip>
                <v-dialog v-model="dialog" max-width="700px" persistent>
                    <AdicionarProventoVue :changeDialog="changeDialog"> </AdicionarProventoVue>
                </v-dialog>
            </v-col>

            <v-col cols="12" class="pb-0 mb-0 pt-0 mt-0">
                <v-simple-table fixed-header height="265">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Fonte
                                </th>
                                <th class="text-center">
                                    Valor
                                </th>
                                <th class="text-right black--text body-2 font-weight-bold">
                                    Total: {{ somaProventos | dinheiro }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in proventos" :key="i">
                                <td>{{ item.categoria }}</td>
                                <td class="text-center">{{ parseFloat(item.valor) | dinheiro }}</td>
                                <td class="text-right">
                                    <v-btn class="mx-2" icon color="dark" @click="deleteProvento(i)">
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

            <v-col class="mt-2">
                <v-card-actions>
                    <v-row>
                        <v-col cols="6" class="d-flex justify-start pt-0 mt-0">
                            <v-btn text color="primary" @click="alternar(1)">
                                Voltar
                            </v-btn>
                        </v-col>
                        <v-col cols="6" class="d-flex justify-end pt-0 mt-0">
                            <v-btn :disabled="proventos.length <= 0" text color="primary" @click="alternar(3)">
                                Avançar
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-col>

        </v-row>
    </v-card>
</template>

<script>
import AdicionarProventoVue from '@/views/Dialogs/PrimeiroAcesso/AdicionarProvento.vue'
export default {
    components: {
        AdicionarProventoVue
    },
    props: {
        alternar: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            dialog: false,
        }
    },
    computed: {
        proventos() {
            return this.$store.getters.proventos
        },
        somaProventos() {
            return this.$store.getters.somaProventos
        },
    },
    methods: {
        changeDialog(value) {
            this.dialog = value
        },
        deleteProvento(i) {
            this.$store.commit('deleteProvento', i)
        }
    }
}
</script>

<style>

</style>