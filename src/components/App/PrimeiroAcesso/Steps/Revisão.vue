<template>
    <v-card height="370px" class="overflow-auto">
        <v-timeline align-top :dense="$vuetify.breakpoint.smAndDown" class="pb-0 mb-0">
            <v-timeline-item v-for="(item, i) in items" :key="i" :color="color" :icon="item.icon" fill-dot small>
                <v-card :color="color" dark class="mx-1" elevation="5">
                    <v-row class="pa-0 ma-0">
                        <v-col cols="12" class="d-flex justify-center pa-0 ma-0">
                            <v-card-title class="pa-2">
                                <h4>{{ item.title }}</h4>
                            </v-card-title>
                        </v-col>
                    </v-row>
                    <v-card-text class="white text--primary">
                        <v-row>
                            <v-col cols="12" class="pa-0 ma-0 mt-1">
                                <RevisãoInfoVue :info="item.info" :perfilRevisão="perfilRevisão" />
                            </v-col>
                            <v-col cols="12" class="pa-1 mt-3 d-flex justify-end">
                                <v-btn @click="atualizar(item.info)" fab dark small :color="color">
                                    <v-icon dark>
                                        mdi-pencil
                                    </v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-timeline-item>

            <v-timeline-item fill-dot large class="mt-10 mb-0 pb-0">
                <template v-slot:icon>
                    <v-tooltip right color="black">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn class="mx-2" color="indigo" fab dark large v-bind="attrs" v-on="on"
                                @click="uploadInfo">
                                <v-icon dark large>
                                    mdi-cloud-upload
                                </v-icon>
                            </v-btn>
                        </template>
                        <span> Finalizar </span>
                    </v-tooltip>

                </template>
            </v-timeline-item>
        </v-timeline>
        <v-overlay :value="overlay">
            <transition name="custom-classes" enter-active-class="animate__animated animate__bounceIn"
                leave-active-class="animate__animated animate__bounceOut" mode="out-in">
                <v-progress-circular v-if="process" indeterminate :size="70" :width="4" color="orange darken-2">
                </v-progress-circular>                        
                <template v-if="!process">
                    <v-icon size="70" color="orange darken-2">
                        mdi-check
                    </v-icon>
                </template>
            </transition>
        </v-overlay>        
    </v-card>
</template>

<script>
import RevisãoInfoVue from '../RevisãoInfo.vue';
export default {
    components: {
        RevisãoInfoVue
    },
    props: {
        alternar: {
            type: Function,
            required: true
        },
        perfilRevisão: {
            required: true,
            type: Boolean,
        }
    },
    data: () => ({
        overlay: false,
        process: false,
        color: 'indigo',
        items: [
            {
                title: 'Proventos',
                info: 'proventos',
                icon: '',
            },
            {
                title: 'Categorias',
                info: 'categorias',
                icon: '',
            },
            {
                title: 'Despesas Fixas',
                info: 'despesas',
                icon: '',
            },
            {
                title: 'Perfil',
                info: 'perfil',
                icon: '',
            },
        ],
    }),
    methods: {
        atualizar(info) {
            switch (info) {
                case 'proventos':
                    this.alternar(2)
                    break;
                case 'categorias':
                    this.alternar(3)
                    break;
                case 'despesas':
                    this.alternar(4)
                    break;
                case 'perfil':
                    this.alternar(5)
                    break;
            }
        },
        uploadInfo() {
            this.overlay = true
            this.process = true
            this.$store.dispatch('uploadAllInfo').then(() => {
                setTimeout(() => {
                    this.process = false
                    setTimeout(() => {
                        this.$store.dispatch('changePrimeiroAcesso', this.usuario.id).then(() => {
                            this.$router.push('/home')
                        })                        
                    }, 3000)
                }, 3000)
            })
        }
    },
}
</script>

<style>

</style>