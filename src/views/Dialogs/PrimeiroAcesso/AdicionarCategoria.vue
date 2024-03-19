<template>
    <v-card>
        <v-card-title class="d-flex justify-center black--title pt-4">
            Adicione ou crie categorias
        </v-card-title>
        <v-container fluid>

            <v-form ref="form" v-model="valid" lazy-validation>

                <v-combobox v-model="model" :items="itemsCategoria" :search-input.sync="search" hide-selected
                    hint="Crie suas próprias categorias digitando e pressionando a tecla enter." label="Adicione categorias"
                    multiple persistent-hint small-chips :rules="itemsRules">

                    <template v-slot:item="{ item }">
                        <v-chip class="pa-4" small :color="propsItems(item, 'color')" text-color="white">
                            <v-icon left>
                                {{ propsItems(item, 'icon') }}
                            </v-icon>
                            {{ item }}
                        </v-chip>
                    </template>

                    <template v-slot:selection="{ attrs, item, parent, selected }">
                        <v-chip class="pa-4" small v-bind="attrs" :input-value="selected" label
                            :color="propsItems(item, 'color')">
                            <v-icon left>
                                {{ propsItems(item, 'icon') }}
                            </v-icon>
                            <span class="pr-2">
                                {{ item }}
                            </span>
                            <v-icon small @click="parent.selectItem(item)">
                                $delete
                            </v-icon>
                        </v-chip>
                    </template>

                    <template v-slot:no-data>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                    Pressione <kbd>enter</kbd> para adicionar "<strong>{{ search }}</strong>" como
                                    categoria.
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>

                </v-combobox>

            </v-form>
        </v-container>

        <v-card-actions>
            <v-row dense>
                <v-col class="d-flex justify start">
                    <v-btn color="blue darken-1" text @click="fechar">
                        Voltar
                    </v-btn>
                </v-col>

                <v-spacer></v-spacer>

                <v-col class="d-flex justify-end">
                    <v-btn color="blue darken-1" text @click="salvar()" :disabled="!valid">
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
        changeDialog: {
            required: true,
            type: Function
        }
    },
    data: () => ({
        itemsRules: [
            valor => {
                if (valor.length <= 0) {
                    return 'Adicione algumas categorias para avançar!'
                } else {
                    return true
                }
            }
        ],
        model: [],
        valid: true,
        search: null,
    }),
    computed: {
        itemsCategoria() {
            return this.$store.getters.itemsCategoria
        },
        items() {
            return this.$store.getters.items
        }
    },
    methods: {
        propsItems(categoria, props) {
            let retorno = undefined
            this.items.forEach(element => { 
                if (element.categoria == categoria) {
                    if (props == 'icon') {
                        retorno = element.icon
                    }
                    else if (props == 'color') {
                        retorno = element.color
                    }
                } else {
                    let teste = this.itemsCategoria.find(element => element == categoria)
                    if (teste == undefined) {
                        if (props == 'color') {
                            retorno = 'primary'
                        } else if (props == 'icon') {
                            retorno = 'mdi-shape-outline'
                        }
                    }
                }
            })
            return retorno
        },
        salvar() {
            this.$refs.form.validate()
            if (this.model.length > 0) {
                this.changeDialog(false)
                let categorias = []
                this.model.forEach(element => {
                    categorias.push({
                        categoria: element,
                        icon: this.propsItems(element, 'icon'),
                        color: this.propsItems(element, 'color')
                    })
                })                
                this.$store.commit('adicionarCategoria', categorias)
                this.model = []
                this.$refs.form.reset()
            }
        },
        fechar() {
            this.model = []
            this.$refs.form.reset()
            this.changeDialog(false)
        }
    },   
}
</script>

<style></style>