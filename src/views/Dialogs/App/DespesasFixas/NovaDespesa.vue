<template>
    <v-card>
        <v-row justify="center" class="pa-0 ma-0">
            <v-card-title class="pa-2 ma-0 ">
                Cadastrar nova despesa fixa
            </v-card-title>
        </v-row>
        <v-divider></v-divider>
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="pa-0 ma-0">
                <v-col cols="12" class="mt-1 pa-0">
                    <v-row class="pa-0 ma-0">
                        <v-col cols="6">
                            <v-select v-model="categoriaSelected" :items="categoriasSelects" label="Categoria da despesa"
                                prepend-icon="mdi-shape-outline" required :rules="[v => !!v || 'Selecione uma categoria']">
                            </v-select>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field id="realDespesaFixa" label="" v-model="valor" prefix="R$" type="text"
                                @keyup="filtrarMoney('realDespesaFixa')" @blur="filtrarMoney('realDespesaFixa')"
                                @focusin="filtrarMoney('realDespesaFixa')" prepend-icon="mdi-cash" required
                                :rules="[v => !!v || 'Informe o valor da despesa']">
                            </v-text-field>
                        </v-col>
                    </v-row>

                    <v-row class="pa-0 ma-0" justify="center">
                        <v-col cols="8" class="mt-1 pa-0">
                            <MouthPicker :changeMes="changeMes" :tipoDespesa="'novaDespesaFixa'"></MouthPicker>
                        </v-col>
                    </v-row>
                </v-col>
                
                <v-col cols="12" class="ma-0 pa-0 mt-2">
                    <v-card-actions>
                        <v-row class="pa-0 ma-0">
                            <v-col cols="6" class="pa-0 ma-0">
                                <v-btn color="error" text @click="cancelar">
                                    Cancelar
                                </v-btn>
                            </v-col>

                            <v-col cols="6" class="d-flex justify-end pa-0 ma-0">
                                <v-btn color="primary" text @click="adicionarDespesa" :disabled="!valid" :loading="loading">
                                    Confirmar
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
import MouthPicker from '@/views/Pickers/Month.vue'
export default {
    components: { MouthPicker },
    props: {
        closeDialog: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            valid: true,
            categoriaSelected: undefined,
            valor: undefined,
            mes: undefined,
            loading: false
        }
    },
    methods: {
        cancelar() {
            this.valor = undefined
            this.categoriaSelected = undefined
            this.$refs.form.resetValidation()
            this.closeDialog()
        },
        validar() {
            return new Promise((resolve) => {
                this.$refs.form.validate()
                resolve()
            })
        },
        adicionarDespesa() {
            this.validar().then(() => {
                this.filtrarMoney('realDespesaFixa')
                if (this.valid == true) {
                    this.loading = true
                    let valor = this.filtrarMoney('', this.valor)
                    valor = valor.replace('.', '').replace(',', '.')
                    this.$store.dispatch('uploadNovaDespesaFixa', {
                        id_usuario: this.usuario.id,
                        categoria: this.categoriaSelected,
                        valor: valor,
                        data: this.mes + '-01'
                    }).then(() => {
                        this.loading = false
                        this.valor = undefined
                        this.categoriaSelected = undefined
                        this.mes = this.$store.getters.mesAvulso
                        this.$refs.form.resetValidation()
                        this.closeDialog()
                    })
                }
            })
        },
        changeMes(val) {
            this.mes = val
        },
    },  
}
</script>
<style></style>