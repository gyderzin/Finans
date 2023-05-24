<template>
    <div>
        <template v-if="info == 'proventos'">
            <v-simple-table fixed-header>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">
                                Fonte
                            </th>
                            <th class="text-center">
                                Valor
                            </th>
                            <th class="text-right white--text body-2 font-weight-bold">
                                Total: {{ parseFloat(somaProventos) | dinheiro }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in proventos" :key="i">
                            <td>{{ item.categoria }}</td>
                            <td class="text-center">{{ parseFloat(item.valor) | dinheiro }}</td>
                            <td class="text-right">

                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </template>

        <template v-if="info == 'categorias'">
            <v-simple-table fixed-header>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-center"> Categorias </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in categorias" :key="i">
                            <td class="body-2">
                                <v-row>
                                    <v-col cols="12" class="d-flex justify-center pa-0 ma-0">
                                        <v-chip class="pa-4" small :color="categoriaProps(item.categoria, 'color')"
                                            text-color="white">
                                            <v-icon left>
                                                {{ categoriaProps(item.categoria, 'icon') }}
                                            </v-icon>
                                            {{ item.categoria }}
                                        </v-chip>
                                    </v-col>
                                </v-row>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </template>

        <template v-if="info == 'despesas'">
            <v-simple-table fixed-header>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">
                                Categoria
                            </th>
                            <th class="text-center">
                                Valor
                            </th>
                            <th class="text-right white--text body-2 font-weight-bold">
                                Total: {{ parseFloat(somaDespesasFixas) | dinheiro }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(despesa, i) in despesasFixas" :key="i">
                            <td>
                                <v-row>
                                    <v-col cols="12" class="d-flex justify-center pa-0 ma-0">
                                        <v-chip class="pa-4" small :color="categoriaProps(despesa.categoria, 'color')"
                                            text-color="white">
                                            <v-icon left>
                                                {{ categoriaProps(despesa.categoria, 'icon') }}
                                            </v-icon>
                                            {{ despesa.categoria }}
                                        </v-chip>
                                    </v-col>
                                </v-row>
                            </td>
                            <td class="text-center"> {{ parseFloat(despesa.valor) | dinheiro }} </td>
                            <td class="text-right">

                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </template>

        <template v-if="info == 'perfil'">
            <template v-if="perfilRevisão == true">
                <v-navigation-drawer permanent width="100%">
                    <v-list>
                        <v-list-item>
                            <v-row class="ma-0 pa-0" justify="center">
                                <v-list-item-avatar size="80">
                                    <v-img :src="perfilUsuario" aspect-ratio="1">
                                        <template v-slot:placeholder>
                                            <v-row class="fill-height ma-0" align="center" justify="center">
                                                <v-progress-circular indeterminate
                                                    color="grey lighten-5"></v-progress-circular>
                                            </v-row>
                                        </template>
                                    </v-img>
                                </v-list-item-avatar>
                            </v-row>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="text-h6">
                                    {{ usuario.nome }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ usuario.email }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-navigation-drawer>

            </template>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        info: {
            required: true,
            type: String
        },
        perfilRevisão: {
            required: true,
            type: Boolean,
        }
    },
    computed: {
        proventos() {
            return this.$store.getters.proventos
        },
        somaProventos() {
            return this.$store.getters.somaProventos
        },
        despesasFixas() {
            return this.$store.getters.despesasFixas
        },
        somaDespesasFixas() {
            return this.$store.getters.somaDespesasFixas
        },
        perfilUsuario() {
            return this.$store.getters.perfilUsuario
        },

    }
}
</script>

<style></style>