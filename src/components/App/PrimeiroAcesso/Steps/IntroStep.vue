<template>
    <v-card height="382px">
        <v-row>
            <v-col cols="12" class="d-flex justify-center pb-0">
                <v-card-title class="text-center">
                    <h2 class="h2', 'Heading 3', '3rem', '400', 'normal', 1">Bem vindo ao Finans!
                    </h2>
                </v-card-title>
            </v-col>
            <v-col cols="12">
                <v-card-text>
                    <p>Olá, <b>{{ usuario.nome }}</b>. Finans é o seu app de controle de finanças pessoais. Nele
                        você
                        encontra e personaliza todos os recursos para que você possa ter uma saúde financeira de
                        qualidade.
                    </p>
                    <p>
                        Para começar a utilizar o finans, precisamos conhecer você um pouco mais para criarmos o
                        seu
                        perfil. Clique no botão avançar para começar o questionário.
                    </p>
                    <p class="pb-0 mb-0">
                        E não se preocupe, todas as informações inseridas neste questionário poderão ser
                        atualizadas na aplicação a hora que você quiser.
                    </p>
                </v-card-text>
            </v-col>
            <v-col cols="12" class="d-flex justify-end mt-8">
                <v-card-actions>
                    <v-btn text color="primary" @click="alternar(2)">
                        Avançar
                    </v-btn>
                </v-card-actions>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
export default {
    props: {
        alternar: {
            type: Function,
            required: true
        }
    }
}
</script>

<style>

</style>