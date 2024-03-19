<template>
    <v-stepper-items >
        <v-stepper-content step="1">
            <IntroStepVue :alternar="alternar" :usuario="usuario"></IntroStepVue>
        </v-stepper-content>

        <v-stepper-content step="2">
            <ProventosStepVue :alternar="alternar"></ProventosStepVue>
        </v-stepper-content>

        <v-stepper-content step="3">
            <CategoriasStepVue :alternar="alternar"></CategoriasStepVue>
        </v-stepper-content>

        <v-stepper-content step="4">
            <DespesasStepVue :alternar="alternar"> </DespesasStepVue>
        </v-stepper-content>

        <v-stepper-content step="5" >
            <PerfilStepVue :alternar="alternar"> </PerfilStepVue>
        </v-stepper-content>
        <v-stepper-content step="6" >
            <RevisãoVue :alternar="alternar" :perfilRevisão="perfilRevisão"> </RevisãoVue>
        </v-stepper-content>
    </v-stepper-items>
</template>

<script>
import IntroStepVue from './Steps/IntroStep.vue'
import ProventosStepVue from './Steps/ProventosStep.vue'
import CategoriasStepVue from './Steps/CategoriasStep.vue'
import DespesasStepVue from './Steps/DespesasStep.vue'
import PerfilStepVue from './Steps/PerfilStep.vue'
import RevisãoVue from './Steps/Revisão.vue'
export default {   
    components: {
        IntroStepVue, ProventosStepVue, CategoriasStepVue, DespesasStepVue, PerfilStepVue, RevisãoVue
    },
    props: {      
        alternar: {
            type: Function,
            required: true
        },
        perfilRevisão: {
            type: Boolean,
            required: true
        }
    }  
}
</script>

<style>

</style>