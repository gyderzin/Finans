<template>
    <v-card>
        <v-row justify="center" class="pa-0 ma-0 error">
            <v-card-title class="pa-2 ma-0 ">
                Deseja excluir esse provento?
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
                                    Data
                                </th>
                                <th class="text-left">
                                    Valor
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
                                                {{ proventoDelet.categoria }}
                                            </v-chip>
                                        </v-col>
                                    </v-row>
                                </td>
                                <td>{{ proventoDelet.data }}</td>                                
                                <td>{{ parseFloat(proventoDelet.valor) | dinheiro }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
            <v-col cols="12" class="ma-0 pa-0 mt-2">
                <v-card-actions>
                    <v-row class="pa-0 ma-0">
                        <v-col cols="6" class="pa-0 ma-0">
                            <v-btn color="primary" text @click="closeDialog()">
                                Cancelar
                            </v-btn>
                        </v-col>

                        <v-col cols="6" class="d-flex justify-end pa-0 ma-0">
                            <v-btn color="error" text @click="excluir()" :loading="loading">
                                Excluir
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
        dialog: {
            required: true,
            type: Boolean
        }
    },
    data() {
        return {
            loading: false
        }
    },
    computed: {
        proventoDelet() {
            return this.$store.getters.proventoEdit
        }
    },
    methods: {
        excluir() {
            this.loading = true
            this.$store.dispatch('deletProvento', { tipo: 'proventoEdit' }).then(() => {
                this.loading = false
                this.closeDialog()
                this.$store.commit('changeAlert', {
                    state: true,
                    type: 'success',
                    message: 'Provento excluído com sucesso!'
                })
            })
        }
    }
}
</script>

<style></style>