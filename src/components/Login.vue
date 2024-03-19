<template>    
     <form-login 
     :usuarioAutenticado="usuarioAutenticado"
     :autenticacaoUsuario="autenticacaoUsuario"> 
     </form-login>                         
</template>

<script>
import FormLogin from '@/components/Login/FormLogin.vue'

export default {
     components: {FormLogin},    
     methods: {
          autenticacaoUsuario(state, salvarUser) {
               let alert = {
                    state: '',
                    type: '',
                    message: '',
               }
               if (state == true) {
                    alert.type = 'success'
                    alert.message = 'Logado com sucesso!'
                    setTimeout(() => {
                         this.$router.push('/home')
                    }, 3000)
                    this.$store.dispatch('salvarUsuario', salvarUser)
               }
               else if (state == 'negado') {
                    alert.type = 'error'
                    alert.message = 'Login invalido'
               }
               alert.state = true
               this.$store.commit('changeAlert', alert)
          }
     },
     computed: {         
          usuarioAutenticado() {
               return this.$store.getters.usuario.usuarioAutenticado;
          },
          nomeUser() {
               return this.$store.getters.usuario.nomeUsuario
          }
     }

}
</script>

<style scoped>
.alertLogin {
       position: relative;
       bottom: 10px;
  }

  .w-100 {
       width: 100%;
  }
</style>