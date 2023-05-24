<template>
    <v-card>
        <v-row justify="center" class="pa-0 ma-0">
            <v-card-title>
                Adicionar Despesa
            </v-card-title>
        </v-row>
        <v-divider></v-divider>
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="pa-0 ma-0">
                <v-col cols="5" class="pa-0 mx-2 my-2">
                    <v-select v-model="categoriaSelected" :items="categoriasSelects" label="Categoria da despesa"
                        prepend-icon="mdi-shape-outline" required   
                        :rules="[v => !!v || 'Selecione uma categoria']">
                    </v-select>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="5" class="pa-0 mx-3 my-2">
                    <v-select v-model="cartãoSelected" :items="cartões" label="Cartão gasto"
                        prepend-icon="mdi-credit-card-multiple-outline" required
                        :rules="[v => !!v || 'Selecione um cartão']">
                        >
                    </v-select>
                </v-col>
                <v-col cols="5" class="pa-0 mx-2 my-2">
                    <date :alterarData="alterarData" :tipo="'add'"></date>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="5" class="pa-0 mx-3 my-2">
                    <v-text-field id="realDespesa" label="" v-model="valor" prefix="R$" type="text"
                        @keyup="filtrarMoney('realDespesa')" @blur="filtrarMoney('realDespesa')" @focusin="filtrarMoney('realDespesa')"
                        prepend-icon="mdi-cash" required
                        :rules="[v => !!v || 'Informe o valor da despesa']"
                        >
                    </v-text-field>
                </v-col>
                <v-row justify="center" class="pa-0 ma-0">
                    <v-col cols="10" class="pa-0 mx-0 my-2">
                        <v-textarea outlined v-model="descrição" label="Descrição da despesa" auto-grow rows="4" required
                        :rules="[v => !!v || 'Dê uma descrição para a despesa']"
                        >
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
        }
    },
    data() {
        return {
            valid: true,
            categoriaSelected: '',
            cartãoSelected: '',
            cartões: ['Inter', 'Nubank'],
            valor: undefined,
            descrição: '',
            data: undefined,
            loading: false
        }
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
                this.filtrarMoney('realDespesa')
                if(this.valid == true) {
                    this.loading = true
                    let valor = this.filtrarMoney('', this.valor)
                    valor = valor.replace('.', '').replace(',', '.')      
                    let data = this.data.split('/')
                    data = data[2]+'-'+data[1]+'-'+data[0]
                    this.$store.dispatch('uploadDespesas', {
                        categoria: this.categoriaSelected,
                        valor: valor,
                        descrição: this.descrição,
                        cartão: this.cartãoSelected,
                        data: data,
                        fixo: 'false'
                    }).then(() => {
                        this.loading = false
                        this.cancelar()
                        this.$store.commit('changeAlert', {
                            state: true,
                            type: 'success',
                            message: 'Despesa inserida com sucesso!'
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

<style>

</style>