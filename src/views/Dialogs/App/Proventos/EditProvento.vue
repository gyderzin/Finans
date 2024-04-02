<template>
    <v-card>
        <v-row justify="center" class="pa-0 ma-0">
            <v-card-title>
                Editar Provento
            </v-card-title>
        </v-row>
        <v-divider></v-divider>
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="pa-0 ma-0">
                <v-col cols="5" class="pa-0 mx-2 my-2">
                    <v-select v-model="provento.categoria" :items="categorias" label="Categoria do provento"
                        prepend-icon="mdi-shape-outline" required :rules="[v => !!v || 'Selecione uma categoria']">
                    </v-select>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="5" class="pa-0 mx-2 my-2">
                    <date :alterarData="alterarData" :tipo="'editProvento'"></date>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="5" class="pa-0 mx-3 my-2">
                    <v-text-field :id="'realProventoEdit' + provento.id" label="" v-model="provento.valor"
                        prefix="R$" type="text" @keyup="filtrarMoney('realProventoEdit' + provento.id)"
                        @blur="filtrarMoney('realProventoEdit' + provento.id)"
                        @focusin="filtrarMoney('realProventoEdit' + provento.id)" prepend-icon="mdi-cash" required
                        :rules="[v => !!v || 'Informe o valor do provento']">
                    </v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 mx-0">
                    <v-row justify="center" class="pa-0 ma-0">
                        <v-col cols="10" class="pa-0 mx-0 my-2">
                            <v-textarea outlined v-model="provento.descrição" label="Descrição do provento" auto-grow rows="4"
                                required :rules="[v => !!v || 'Dê uma descrição para o provento']">
                            </v-textarea>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-form>
        <v-card-actions class="py-0 ma-0">
            <v-row class="pa-0 ma-0">
                <v-col cols="6" class="d-flex justify-start pa-0 ma-0 mb-3">
                    <v-btn color="error" text @click="cancelar">
                        Cancelar
                    </v-btn>
                </v-col>
                <v-col cols="6" class="d-flex justify-end pa-0 ma-0 mb-3">
                    <v-btn color="success" text @click="salvar" :disabled="!valid" :loading="loading">
                        Salvar
                    </v-btn>
                </v-col>

            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
import Date from '@/views/Pickers/Date.vue';
export default {
    components: {
        Date
    },
    props: {
        closeDialog: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            valid: true,
            categorias: ['Alugueis', 'Investimentos', 'Pensão', 'Salário', 'Outros'],
            categoriaSelected: '',
            valor: undefined,
            descrição: '',
            data: '',
            loading: false
        }
    },
    computed: {      
        provento() {
            return this.$store.getters.proventoEdit
        },        
    },
    methods: {
        alterarData(val) {
            this.data = val
        },
        cancelar() {
            this.closeDialog()
            this.$refs.form.resetValidation()
            this.categoriaSelected = ''
            this.cartãoSelected = ''
            this.valor = ''
            this.descrição = ''
        },
        salvar() {
            this.validar().then(() => {
                this.loading = true
                this.filtrarMoney('realProventoEdit' + this.provento.id)
                if (this.valid == true) {
                    let valor = this.filtrarMoney('', this.provento.valor)
                    valor = valor.replace('.', '').replace(',', '.')
                    this.$store.dispatch('updateProvento', {
                        id: this.provento.id,
                        categoria: this.provento.categoria,                        
                        descrição: this.provento.descrição,
                        valor: valor,
                        data: this.provento.data
                    }).then(() => {                        
                        this.loading = false                        
                        this.cancelar()
                        this.$store.commit('changeAlert', {
                            state: true,
                            type: 'success',
                            message: 'Provento atualizado com sucesso!'
                        })
                    })                    
                }
            })
        },
        validar() {
            return new Promise((resolve) => {
                this.$refs.form.validate()
                resolve()
            })
        }
    },
}
</script>

<style></style>