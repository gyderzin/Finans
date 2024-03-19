<template>
    <v-card>
        <v-row justify="center" class="pa-0 ma-0">
            <v-card-title class="pa-2 ma-0 ">
                Configurações de despesas fixas
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
                                        Começou a pagar em
                                    </th>
                                    <th>
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(despesa, i) in despesasFixas" :key="i">
                                    <td>
                                        <v-chip class="pa-4" small :color="categoriaProps(despesa.categoria, 'color')"
                                            text-color="white">
                                            <v-icon left>
                                                {{ categoriaProps(despesa.categoria, 'icon') }}
                                            </v-icon>
                                            {{ despesa.categoria }}
                                        </v-chip>
                                    </td>
                                    <td>
                                        {{ parseFloat(despesa.valor) | dinheiro }}
                                    </td>
                                    <td>
                                        {{ despesa.dtcriação | mes }}
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
                                Editar despesas fixas
                            </v-card-title>
                        </v-row>
                        <v-divider></v-divider>
                        <v-row class="pa-0 ma-0">
                            <v-col cols="12" class="mt-1 pa-0">
                                <v-row class="pa-0 ma-0">
                                    <v-col cols="6">
                                        <v-select v-model="despesaEdit.categoria" :items="categoriasSelects"
                                            label="Categoria da despesa" prepend-icon="mdi-shape-outline" required
                                            :rules="[v => !!v || 'Selecione uma categoria']">
                                        </v-select>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field :id="'realEditarDespesa'" label="" v-model="despesaEdit.valor"
                                            prefix="R$" type="text" @keyup="filtrarMoney('realEditarDespesa')"
                                            @blur="filtrarMoney('realEditarDespesa')"
                                            @focusin="filtrarMoney('realEditarDespesa')" prepend-icon="mdi-cash" required
                                            :rules="[v => !!v || 'Informe o valor da despesa']">
                                        </v-text-field>
                                    </v-col>
                                </v-row>

                                <v-row class="pa-0 ma-0" justify="center">
                                    <v-col cols="8" class="mt-1 pa-0">
                                        <MonthVue :changeMes="alterarData" :tipoDespesa="'editDespesaFixa'"
                                            :editDespesaFixa="{
                                                data: despesaEdit.dtcriação,
                                                indice: indiceDespesaEdit
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
                                                <v-btn color="success" text :loading="loading" @click="atualizarDespesa()">
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
                                                        :color="categoriaProps(despesaDelete.categoria, 'color')"
                                                        text-color="white">
                                                        <v-icon left>
                                                            {{ categoriaProps(despesaDelete.categoria, 'icon') }}
                                                        </v-icon>
                                                        {{ despesaDelete.categoria }}
                                                    </v-chip>
                                                </td>
                                                <td>
                                                    {{ parseFloat(despesaDelete.valor) | dinheiro }}
                                                </td>
                                                <td>
                                                    {{ despesaDelete.dtcriação | mes }}
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
                                            <v-btn color="success" text :loading="loadingDelete" @click="deletarDespesa()">
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
        this.getDespesasFixas()
    },
    data() {
        return {
            valid: true,
            loading: false,
            despesasFixas: undefined,
            dialogEditDespesaFixa: false,
            categoriaSelected: undefined,
            indiceDespesaEdit: 0,
            despesaEdit: {
                id: undefined,
                categoria: undefined,
                valor: undefined,
                dtcriação: undefined,
            },
            dialogDeleteDespesaFixa: false,
            indiceDespesaDelete: 0,
            despesaDelete: {
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
            this.indiceDespesaEdit = i
            this.despesaEdit.id = this.despesasFixas[this.indiceDespesaEdit].id
            this.despesaEdit.categoria = this.despesasFixas[this.indiceDespesaEdit].categoria
            this.despesaEdit.valor = this.despesasFixas[this.indiceDespesaEdit].valor
            this.despesaEdit.dtcriação = this.despesasFixas[this.indiceDespesaEdit].dtcriação
            this.dialogEditDespesaFixa = true
        },
        ativarDialogExcluir(i) {
            this.indiceDespesaDelete = i
            this.despesaDelete.id = this.despesasFixas[this.indiceDespesaDelete].id
            this.despesaDelete.categoria = this.despesasFixas[this.indiceDespesaDelete].categoria
            this.despesaDelete.valor = this.despesasFixas[this.indiceDespesaDelete].valor
            this.despesaDelete.dtcriação = this.despesasFixas[this.indiceDespesaDelete].dtcriação
            this.dialogDeleteDespesaFixa = true
        },
        alterarData(value) {
            this.despesaEdit.dtcriação = value
        },
        atualizarDespesa() {
            let valor = this.filtrarMoney('', this.despesaEdit.valor)
            valor = valor.replace('.', '').replace(',', '.')
            this.despesaEdit.valor = valor
            this.loading = true
            this.$store.dispatch('updateDespesaFixa', this.despesaEdit).then(() => {
                this.loading = false
                this.dialogEditDespesaFixa = false
                this.despesasFixas[this.indiceDespesaEdit].categoria = this.despesaEdit.categoria
                this.despesasFixas[this.indiceDespesaEdit].valor = this.despesaEdit.valor
                this.despesasFixas[this.indiceDespesaEdit].dtcriação = this.despesaEdit.dtcriação
                this.$store.commit('changeAlert', {
                    state: true,
                    type: 'success',
                    message: 'Despesa fixa atualizada com sucesso!'
                })
            })
        },
        deletarDespesa() {
            let valor = this.filtrarMoney('', this.despesaDelete.valor)
            valor = valor.replace('.', '').replace(',', '.')
            this.despesaDelete.valor = valor
            this.loadingDelete = true
            this.$store.dispatch('deleteDespesaFixa', this.despesaDelete.id).then(() => {
                this.loadingDelete = false
                this.dialogDeleteDespesaFixa = false
                this.despesasFixas.splice(this.indiceDespesaDelete, 1)
                this.$store.commit('changeAlert', {
                    state: true,
                    type: 'success',
                    message: 'Despesa fixa finalizada com sucesso!'
                })
            })
        },
        getDespesasFixas() {
            this.$store.dispatch("getDespesasFixas").then((res) => {
                this.despesasFixas = res
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