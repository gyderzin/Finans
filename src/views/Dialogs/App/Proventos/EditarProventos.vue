<template>
    <v-card>
        <v-row justify="center" class="pa-0 ma-0">
            <v-card-title class="pa-2 ma-0 ">
                Configurações de proventos
            </v-card-title>
        </v-row>
        <v-divider></v-divider>
        <v-form ref="form" v-model="valid" lazy-validation>
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
                                        Começou a receber em
                                    </th>
                                    <th>
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(provento, i) in proventosFixos" :key="i">
                                    <td>
                                        <v-chip class="pa-4" small text-color="white" color="primary">
                                            <v-icon left>
                                                mdi-cash-multiple
                                            </v-icon>
                                            {{ provento.categoria }}
                                        </v-chip>
                                    </td>
                                    <td>
                                        {{ parseFloat(provento.valor) | dinheiro }}
                                    </td>
                                    <td>
                                        {{ provento.dtcriação | mes }}
                                    </td>
                                    <td>
                                        <v-tooltip left color="primary">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn icon v-bind="attrs" v-on="on">
                                                    <v-icon small color="primary" @click="ativarDialogEditar(i)">
                                                        mdi-pencil
                                                    </v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Editar</span>
                                        </v-tooltip>

                                        <v-tooltip right color="primary">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn icon v-bind="attrs" v-on="on">
                                                    <v-icon small color="primary" @click="ativarDialogExcluir(i)">
                                                        mdi-delete
                                                    </v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Excluir</span>
                                        </v-tooltip>

                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-col>
                <v-dialog v-model="dialogEditDespesaFixa" width="470">
                    <v-card>
                        <v-row justify="center" class="pa-0 ma-0 info">
                            <v-card-title class="pa-2 ma-0 white--text">
                                Editar provento fixo
                            </v-card-title>
                        </v-row>
                        <v-divider></v-divider>
                        <v-row class="pa-0 ma-0">
                            <v-col cols="12" class="mt-1 pa-0">
                                <v-row class="pa-0 ma-0">
                                    <v-col cols="6">
                                        <v-select v-model="proventoEdit.categoria" :items="categorias"
                                            label="Categoria do provento" prepend-icon="mdi-shape-outline" required
                                            :rules="[v => !!v || 'Selecione uma categoria']">
                                        </v-select>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field :id="'realEditarProventoFixo'" label="" v-model="proventoEdit.valor"
                                            prefix="R$" type="text" @keyup="filtrarMoney('realEditarProventoFixo')"
                                            @blur="filtrarMoney('realEditarProventoFixo')"
                                            @focusin="filtrarMoney('realEditarProventoFixo')" prepend-icon="mdi-cash"
                                            required :rules="[v => !!v || 'Informe o valor da despesa']">
                                        </v-text-field>
                                    </v-col>
                                </v-row>

                                <v-row class="pa-0 ma-0" justify="center">
                                    <v-col cols="8" class="mt-1 pa-0">
                                        <MonthVue :changeMes="alterarData" :tipoDespesa="'editProventoFixo'"
                                            :editProventoFixo="{
                                                    data: proventoEdit.dtcriação,
                                                    indice: indiceProventoEdit
                                            }">
                                        </MonthVue>
                                    </v-col>
                                </v-row>
                                <v-divider></v-divider>
                                <v-col cols="12" class="ma-0 pa-0 mt-2">
                                    <v-card-actions>
                                        <v-row class="pa-0 ma-0">
                                            <v-col cols="6" class="pa-0 ma-0">
                                                <v-btn color="error" text @click="dialogEditDespesaFixa = false">
                                                    Cancelar
                                                </v-btn>
                                            </v-col>

                                            <v-col cols="6" class="d-flex justify-end pa-0 ma-0">
                                                <v-btn color="success" text :loading="loading"
                                                    @click="atualizarDespesa()">
                                                    Confirmar
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card-actions>
                                </v-col>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-dialog>

                <v-dialog v-model="dialogDeleteDespesaFixa" width="370">
                    <v-card>
                        <v-row justify="center" class="pa-0 ma-0 warning">
                            <v-card-title class="white--text pa-2 ma-0">
                                Deseja finalizar essa despesa fixa?
                            </v-card-title>
                        </v-row>
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
                                                    Começou a pagar em
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <v-chip class="pa-4" small
                                                        :color="categoriaProps(proventoDelete.categoria, 'color')"
                                                        text-color="white">
                                                        <v-icon left>
                                                            {{ categoriaProps(proventoDelete.categoria, 'icon') }}
                                                        </v-icon>
                                                        {{ proventoDelete.categoria }}
                                                    </v-chip>
                                                </td>
                                                <td>
                                                    {{ parseFloat(proventoDelete.valor) | dinheiro }}
                                                </td>
                                                <td>
                                                    {{ proventoDelete.dtcriação | mes }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-col>
                            <v-divider></v-divider>
                            <v-col cols="12" class="ma-0 pa-0 mt-2">
                                <v-card-actions>
                                    <v-row class="pa-0 ma-0">
                                        <v-col cols="6" class="pa-0 ma-0">
                                            <v-btn color="error" text @click="dialogDeleteDespesaFixa = false">
                                                Cancelar
                                            </v-btn>
                                        </v-col>

                                        <v-col cols="6" class="d-flex justify-end pa-0 ma-0">
                                            <v-btn color="success" text :loading="loadingDelete"
                                                @click="deletarDespesa()">
                                                Confirmar
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card-actions>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-dialog>

                <v-col cols="12" class="ma-0 pa-0 mt-2">
                    <v-card-actions>
                        <v-row class="pa-0 ma-0">
                            <v-col cols="6" class="pa-0 ma-0">
                                <v-btn color="primary" text @click="cancelar">
                                    Voltar
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-actions>
                </v-col>
            </v-row>
        </v-form>
    </v-card>
</template>
<script>
import MonthVue from '@/views/Pickers/Month.vue'
export default {
    components: {
        MonthVue
    },
    props: {
        closeDialog: {
            type: Function,
            required: true
        }
    },
    created() {
        this.getProventosFixos()
    },
    data() {
        return {
            valid: true,
            loading: false,
            proventosFixos: undefined,
            categorias: ['Alugueis', 'Investimentos', 'Pensão', 'Salário', 'Outros'],
            dialogEditDespesaFixa: false,
            categoriaSelected: undefined,
            indiceProventoEdit: 0,
            proventoEdit: {
                id: undefined,
                categoria: undefined,
                valor: undefined,
                dtcriação: undefined,
            },
            dialogDeleteDespesaFixa: false,
            indiceProventoDelete: 0,
            proventoDelete: {
                id: undefined,
                categoria: undefined,
                valor: undefined,
                dtcriação: undefined,
            },
            loadingDelete: false,
        }
    },
    methods: {
        ativarDialogEditar(i) {
            this.indiceProventoEdit = i
            this.proventoEdit.id = this.proventosFixos[this.indiceProventoEdit].id
            this.proventoEdit.categoria = this.proventosFixos[this.indiceProventoEdit].categoria
            this.proventoEdit.valor = this.proventosFixos[this.indiceProventoEdit].valor
            this.proventoEdit.dtcriação = this.proventosFixos[this.indiceProventoEdit].dtcriação
            this.dialogEditDespesaFixa = true
        },
        ativarDialogExcluir(i) {
            this.indiceProventoDelete = i
            this.proventoDelete.id = this.proventosFixos[this.indiceProventoDelete].id
            this.proventoDelete.categoria = this.proventosFixos[this.indiceProventoDelete].categoria
            this.proventoDelete.valor = this.proventosFixos[this.indiceProventoDelete].valor
            this.proventoDelete.dtcriação = this.proventosFixos[this.indiceProventoDelete].dtcriação
            this.dialogDeleteDespesaFixa = true
        },
        alterarData(value) {
            this.proventoEdit.dtcriação = value
        },
        atualizarDespesa() {
            let valor = this.filtrarMoney('', this.proventoEdit.valor)
            valor = valor.replace('.', '').replace(',', '.')
            this.proventoEdit.valor = valor
            this.loading = true
            this.$store.dispatch('updateProventoFixo', this.proventoEdit).then(() => {
                this.loading = false
                this.dialogEditDespesaFixa = false
                this.proventosFixos[this.indiceProventoEdit].categoria = this.proventoEdit.categoria
                this.proventosFixos[this.indiceProventoEdit].valor = this.proventoEdit.valor
                this.proventosFixos[this.indiceProventoEdit].dtcriação = this.proventoEdit.dtcriação
                this.$store.commit('changeAlert', {
                    state: true,
                    type: 'success',
                    message: 'Provento fixa atualizada com sucesso!'
                })
            })
        },
        deletarDespesa() {
            let valor = this.filtrarMoney('', this.proventoDelete.valor)
            valor = valor.replace('.', '').replace(',', '.')
            this.proventoDelete.valor = valor
            this.loadingDelete = true
            this.$store.dispatch('deleteDespesaFixa', this.proventoDelete.id).then(() => {
                this.loadingDelete = false
                this.dialogDeleteDespesaFixa = false
                this.proventosFixos.splice(this.indiceProventoDelete, 1)
                this.$store.commit('changeAlert', {
                    state: true,
                    type: 'success',
                    message: 'Despesa fixa finalizada com sucesso!'
                })
            })
        },
        getProventosFixos() {
            this.$store.dispatch("getProventosFixos").then((res) => {
                this.proventosFixos = res
            });
        },
        cancelar() {
            this.$refs.form.resetValidation()
            this.closeDialog()
        },
    },
}
</script>
<style scoped></style>