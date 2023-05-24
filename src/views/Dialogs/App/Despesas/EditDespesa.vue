<template>
    <v-card>
        <v-row justify="center" class="pa-0 ma-0">
            <v-card-title>
                Editar Despesa
            </v-card-title>
        </v-row>
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="pa-0 ma-0">
                <v-col cols="5" class="pa-0 mx-2 my-2">
                    <v-select v-model="despesa.categoria" :items="categoriasSelects" label="Categoria da despesa"
                        prepend-icon="mdi-shape-outline" required :rules="[v => !!v || 'Selecione uma categoria']">
                    </v-select>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="5" class="pa-0 mx-3 my-2">
                    <v-select v-model="despesa.cartão" :items="cartões" label="Cartão gasto"
                        prepend-icon="mdi-credit-card-multiple-outline" required
                        :rules="[v => !!v || 'Selecione um cartão']">
                        >
                    </v-select>
                </v-col>
                <v-col cols="5" class="pa-0 mx-2 my-2">
                    <date :alterarData="alterarData" :tipo="'edit'"></date>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="5" class="pa-0 mx-3 my-2">
                    <v-text-field :id="'realDespesaEdit' + despesa.id" label="" v-model="despesa.valor"
                        prefix="R$" type="text" @keyup="filtrarMoney('realDespesaEdit' + despesa.id)"
                        @blur="filtrarMoney('realDespesaEdit' + despesa.id)"
                        @focusin="filtrarMoney('realDespesaEdit' + despesa.id)" prepend-icon="mdi-cash" required
                        :rules="[v => !!v || 'Informe o valor da despesa']">
                    </v-text-field>
                </v-col>
                <v-row justify="center" class="pa-0 ma-0">
                    <v-col cols="10" class="pa-0 mx-0 my-2">
                        <v-textarea outlined v-model="despesa.descrição" label="Descrição da despesa" auto-grow
                            rows="4" required :rules="[v => !!v || 'Dê uma descrição para a despesa']">
                        </v-textarea>
                    </v-col>
                </v-row>
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
        },
        dialog: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            valid: true,
            categoriaSelected: '',
            cartãoSelected: '',
            cartões: ['Inter', 'Nubank'],
            valor: '',
            descrição: '', 
            data: '',
            loading: false
        }
    },
    computed: {      
        despesa() {
            return this.$store.getters.despesaEdited
        },        
    },
    methods: {
        alterarData(val) {
            this.data = val
        },
        cancelar() {
            this.filtrarMoney('realDespesaEdit' + this.despesa.id)
            this.closeDialog()            
        },
        salvar() {
            this.validar().then(() => {
                this.loading = true
                this.filtrarMoney('realDespesaEdit' + this.despesa.id)
                if (this.valid == true) {
                    let valor = this.filtrarMoney('', this.despesa.valor)
                    valor = valor.replace('.', '').replace(',', '.')
                    this.$store.dispatch('updateDespesa', {
                        id: this.despesa.id,
                        categoria: this.despesa.categoria,
                        cartão: this.despesa.cartão,
                        descrição: this.despesa.descrição,
                        valor: valor,
                        data: this.despesa.data
                    }).then(() => {                        
                        this.loading = false                        
                        this.cancelar()
                        this.$store.commit('changeAlert', {
                            state: true,
                            type: 'success',
                            message: 'Despesa atualizada com sucesso!'
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
    watch: {
        dialog() {
            this.filtrarMoney('realDespesaEdit' + this.despesa.id)
        },
    }
}
</script>

<style>

</style>