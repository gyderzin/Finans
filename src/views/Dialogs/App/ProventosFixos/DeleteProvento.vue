<template>
    <v-card>
        <v-row justify="center" class="pa-0 ma-0 warning">
            <v-card-title class="pa-2 ma-0 white--text">
                Deseja retornar o pagamento?
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
                                    <v-chip class="pa-4" small text-color="white" color="primary">
                                        <v-icon left>
                                            mdi-cash-multiple
                                        </v-icon>
                                        {{ proventoFixo.categoria }}
                                    </v-chip>
                                </td>
                                <td>{{ parseFloat(proventoFixo.valor) | dinheiro }}</td>
                                
                                <td> {{ proventoFixo.data | data }} </td>
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
                            <v-btn color="success" text @click="removerProventoFixo(idProvento)">
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
        idProvento: {
            required: true
        },
        removerProventoFixo: {
            type: Function,
            required: true
        }
    },   
    computed: {
        proventoFixo() {
            let proventos = this.$store.getters.proventosRecebidos
            let proventoAtual = undefined
            proventos.forEach(element => {
                if (element.id == this.idProvento) {
                    proventoAtual = element
                }
            })
            return proventoAtual
        },
    },
}
</script>
<style></style>