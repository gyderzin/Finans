<template>
    <v-card>
        <v-card-title class="d-flex justify-center">
            Adicionar Despesa Fixa
        </v-card-title>

        <v-form ref="form" v-model="valid" lazy-validation>
            <v-col cols="12" class="d-flex justify-start">
                <v-row>
                    <v-col cols="6">
                        <v-select :items="categoriasSelects" v-model="categoria" dense label="Categoria" :rules="categoriaRules">
                        </v-select>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field id="moneyDespesas" v-model="valorDespesa" prefix="R$" dense type="text" :rules="valorDespesaRules"                             
                            @keyup="filtrarMoney('moneyDespesas')" 
                            @blur="filtrarMoney('moneyDespesas')"
                            @focusin="filtrarMoney('moneyDespesas')">
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-col>
        </v-form>

        <v-card-actions>
            <v-btn color="blue darken-1" text @click="fechar">
                Fechar
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn :disabled="!valid" color="blue darken-1" text @click="salvar">
                Salvar
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    props: {
        changeDialog: {
            required: true,
            type: Function
        }
    },
    data() {
        return {            
            categoria: '',
            categoriaRules: [ valor => !!valor || 'Preencha este campo!'],
            valorDespesa: 0,
            valorDespesaRules: [ valor =>{ 
                if (valor == '0,0' || valor == 0) { return 'Preencha este campo!'} else{return true}
            }] ,
            valid: true
        }
    },
    methods: {
        salvar() {
            this.$refs.form.validate()
            if(this.categoria !== '' && this.categoria !== null && this.valorDespesa !== '' && this.valorDespesa !== null) {
                let valor = this.filtrarMoney('', this.valorDespesa)
                valor = valor.replace('.', '').replace(',', '.')                
                this.$store.commit('adicionarDespesaFixa', {
                    categoria: this.categoria,
                    valor: valor
                })
                this.changeDialog(false)
                this.$refs.form.reset()
            }
        },
        fechar() {
            this.changeDialog(false)
            this.categoria = ''
            this.valorReal = ''
            this.$refs.form.reset()
        }
    },    
}
</script>

<style>

</style>