<template>
    <v-card>
        <v-row justify="center" class="pa-0 ma-0">
            <v-card-title>
                Adicionar Provento
            </v-card-title>
        </v-row>
        <v-divider></v-divider>
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="pa-0 ma-0">
                <v-col cols="5" class="pa-0 mx-2 my-2">
                    <v-select v-model="categoriaSelected" :items="categorias" label="Categoria do provento"
                        prepend-icon="mdi-shape-outline" required :rules="[v => !!v || 'Selecione uma categoria']">
                    </v-select>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="5" class="pa-0 mx-2 my-2">
                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                        transition="scale-transition" offset-y min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field  flat
                                prepend-icon="mdi-calendar" v-model="dataBR"
                                label="Data provento" readonly
                                v-bind="attrs" v-on="on"></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="date" @input="menu = false" locale="pt-br"></v-date-picker>                      
                    </v-menu>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="5" class="pa-0 mx-3 my-2">
                    <v-text-field id="realProvento" label="" v-model="valor" prefix="R$" type="text"
                        @keyup="filtrarMoney('realProvento')" @blur="filtrarMoney('realProvento')"
                        @focusin="filtrarMoney('realProvento')" prepend-icon="mdi-cash" required
                        :rules="[v => !!v || 'Informe o valor do provento.']">
                    </v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 mx-0">
                    <v-row justify="center" class="pa-0 ma-0">
                        <v-col cols="10" class="pa-0 mx-0 my-2">
                            <v-textarea outlined v-model="descrição" label="Descrição do provento" auto-grow rows="4"
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
export default {
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
            date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            loading: false
        }
    },
    computed: {
        dataBR() {
            let data = this.date.split('-')
            return data[2] + '/' + data[1] + '/' + data[0]            
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
                this.filtrarMoney('realProvento')
                if (this.valid == true) {
                    this.loading = true
                    let valor = this.filtrarMoney('', this.valor)
                    valor = valor.replace('.', '').replace(',', '.')                
                    this.$store.dispatch('receberProvento', {
                        categoria: this.categoriaSelected,
                        valor: valor,
                        descrição: this.descrição,                        
                        data: this.date,
                        fixo: 'false'
                    }).then(() => {
                        this.loading = false
                        this.cancelar()
                        this.$store.commit('changeAlert', {
                            state: true,
                            type: 'success',
                            message: 'Provento inserido com sucesso!'
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