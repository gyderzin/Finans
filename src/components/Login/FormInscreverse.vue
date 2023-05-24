<template>
  <v-card class="white" width="80%" height="100%">
    <v-col cols="12 pb-0" class="d-flex justify-center" v-if="step !== 5">
      <v-card-title>
        <h2>Cadastrar-se</h2>
      </v-card-title>
    </v-col>
    <v-divider> </v-divider>
    <div class="ml-5 mt-2" v-if="step !== 5">
      <h3> {{ currentTitle }}</h3>
    </div>
    <v-window v-model="step">
      <v-window-item :value="1">
        <v-card-text>
          <v-text-field label="Nome" required v-model="nome" :rules="nameRules" :append-icon="iconName"
            :success="nameState == 'success'" :error="nameState == 'error'"></v-text-field>
          <span class="text-caption grey--text text--darken-1">
            Este será o seu nome de usuário.
          </span>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="2">
        <v-card-text>

          <v-text-field label="Email" required v-model="email" :rules="emailRules" :append-icon="iconEmail"
            :success="emailState == 'success'" :error="emailState == 'error'"></v-text-field>

          <span class="text-caption grey--text text--darken-1">
            Este email será para você fazer login no Finans.
          </span>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="3">
        <v-card-text>
          <v-text-field label="Senha" type="password" v-model="senha" :rules="senhaRules" required
            @blur="validarSenha('1')" :append-icon="icoSenha" :success="stateSenha == 'success'"
            :error="stateSenha == 'error'"></v-text-field>
          <v-text-field label="Confirme sua senha " type="password" v-model="confirmSenha" :rules="confirmSenhaRules"
            required @blur="validarSenha('2')" :append-icon="icoConfirmSenha" :success="stateConfirmSenha == 'success'"
            :error="stateConfirmSenha == 'error'">
          </v-text-field>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="4">
        <v-card-text>
          <p class="pt-0 mt-0">Enviamos um código de confirmação de email no endereço <b>{{ email }}</b>. Digite no campo
            abaixo o código.
          </p>
          <div class="d-flex justify center">
            <v-otp-input length="4" v-model="codigoUser" plain type="number" :success="stateCodigo == 'success'"
              :error="stateCodigo == 'error'" :rules="rulesCodigo"></v-otp-input>
          </div>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="5">
        <div class="pa-4 text-center">
          <v-img class="mb-4" contain height="150" src="@/assets/finance2.png"></v-img>
          <h3 class="text-h6 font-weight-light mb-2">
            Bem vindo ao MyFinans!
          </h3>
          <span class="text-caption grey--text">
            Fodase.
          </span>
          <br>
          <v-btn depressed @click="redirect()">
            Fazer Login
          </v-btn>
        </div>
      </v-window-item>
    </v-window>

    <v-divider></v-divider>

    <v-card-actions v-if="step != 5">
      <v-btn :disabled="step === 1" text @click="voltar()">
        <v-icon dark left>
          mdi-arrow-left
        </v-icon>
        Voltar
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn :disabled="step === 5 || valid == false" :loading="loading" color="primary" depressed @click="avançar()">
        Avançar

        <v-icon dark right>
          mdi-arrow-right
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  created() {
    this.$store.commit('restartStep')
  },
  data: () => ({
    nome: '',
    nameRules: [name => {
      if (name == '') {
        return 'Digite seu nome para avançar!'
      } else { return true }
    }],
    nameState: '',
    iconName: '',
    email: '',
    emailRules: [email => {
      if (email == '') {
        return 'Digite seu email para avançar!'
      } else { return true }
    },
    email => /.+@.+\..+/.test(email) || 'O email precisa ser valido!',
    ],
    emailState: '',
    iconEmail: '',
    senha: '',
    icoSenha: '',
    stateSenha: '',
    senhaRules: [senha => {
      if (senha == '') { return 'Crie uma senha para avançar!' } else { return true }
    }],
    icoConfirmSenha: '',
    stateConfirmSenha: '',
    confirmSenha: '',
    confirmSenhaRules: [confirmSenha => {
      if (confirmSenha == '') { return 'Confirme sua senha para avançar!' } else { return true }
    }],
    codigoEmail: '#',
    codigoUser: '',
    stateCodigo: '',
    rulesCodigo: [
      s => {
        if (s.length < 4 || s == '') {
          return 'Preencha o campo para validar!'
        } else { return true }
      }
    ],
    valid: true,
  }),
  methods: {
    changeLoading(value) {
      this.$store.commit('changeLoadingInscreverse', value)
    },
    avançar() {
      this.changeLoading(true)
      if (this.step == 1) {
        if (this.nome == '') {
          this.valid = false
        }
        this.$store.dispatch('validarNome', this.nome)
          .then(res => {
            if (res) {
              this.iconName = 'mdi-check'
              this.nameState = 'success'
            } else {
              this.iconName = 'mdi-close'
              this.nameState = 'error'
            }
          })
      }
      else if (this.step == 2) {
        if (this.email == '') {
          this.valid = false
          this.changeLoading(false)
        }
        this.$store.dispatch('validarEmail', this.email)
          .then(res => {
            if (res) {
              this.iconEmail = 'mdi-check'
              this.emailState = 'success'
            } else {
              this.iconEmail = 'mdi-close'
              this.emailState = 'error'
            }
          })
      }
      else if (this.step == 3) {
        if (this.senha == '' || this.confirmSenha == '') {
          this.valid = false
          this.changeLoading(false)
        }
        let senhas = {
          senha: this.senha,
          confirmSenha: this.confirmSenha
        }
        this.$store.dispatch('validarSenha', senhas).then(res => {
          if (res == 'erro1') {
            if (this.senha == '') {
              this.icoSenha = 'mdi-close'
              this.stateSenha = 'error'
            }
            if (this.confirmSenha == '') {
              this.icoConfirmSenha = 'mdi-close'
              this.stateConfirmSenha = 'error'
            }
          }
        })
      }
      else if (this.step == 4) {                
        if (this.codigoEmail == this.codigoUser) {       
          this.stateCodigo = 'success'
          this.$store.commit('changeLoadingInscreverse', false)
          this.$store.commit('nextStep')
        } else {
          this.stateCodigo = 'error'
          let alert = {
            state: true,
            type: 'error',
            message: 'Código incorreto!'
          }
          this.$store.commit('changeAlert', alert)
          this.$store.commit('changeLoadingInscreverse', false)
        }
      }
    },
    validarSenha(p) {
      if (p == '1') {
        if (this.senha !== '') {
          this.icoSenha = 'mdi-check'
          this.stateSenha = 'success'
        }
      }
      else if (p == '2') {
        if (this.confirmSenha !== '' && this.confirmSenha == this.senha) {
          this.icoConfirmSenha = 'mdi-check'
          this.stateConfirmSenha = 'success'
        }
        else {
          this.icoConfirmSenha = 'mdi-close'
          this.stateConfirmSenha = 'error'
        }
      }
    },
    voltar() {
      this.$store.commit('backStep')
    },
    redirect() {
      this.$router.push('/')
    }
  },
  computed: {
    step() {
      return this.$store.getters.getStep
    },
    loading() {
      return this.$store.getters.getLoadingInscreverse
    },
    typeAlert() {
      return this.$store.getters.getTypeAlert
    },
    currentTitle() {
      switch (this.step) {
        case 1: return 'Qual é seu nome?'
        case 2: return 'Informe seu email'
        case 3: return 'Crie uma senha'
        case 4: return 'Confirme seu email'
        default: return 'Conta criada'
      }
    },
  },
  watch: {
    nome(newVal) {
      if (newVal == '') {
        this.iconName = 'mdi-close'
        this.nameState = ''
      } else {
        this.iconName = ''
        this.valid = true
        this.nameState = ''
      }
    },
    email(newVal) {
      if (newVal == '') {
        this.iconEmail = 'mdi-close'
        this.emailState = ''
      } else {
        this.iconEmail = ''
        this.valid = true
        this.emailState = ''
      }
    },
    senha(newVal) {
      if (newVal == '') {
        this.icoSenha = 'mdi-close'
        this.stateSenha = ''
      } else {
        this.icoSenha = ''
        this.valid = true
        this.stateSenha = ''
      }
    },
    confirmSenha(newVal) {
      if (newVal == '') {
        this.icoConfirmSenha = 'mdi-close'
        this.stateConfirmSenha = ''
      } else {
        this.icoConfirmSenha = ''
        this.valid = true
        this.stateConfirmSenha = ''
      }
    },
    step(newVal, oldVal) {
      this.valid = true
      if (newVal == 4 && oldVal == 3) {
        this.$store.dispatch('confirmaçãoEmail').then(res => {          
          this.codigoEmail = res
        })
      }
      else if (newVal == 5 && oldVal == 4) {
        this.$store.dispatch('autenticarUsuario')
      }
    }
  }
}
</script>

<style>

</style>