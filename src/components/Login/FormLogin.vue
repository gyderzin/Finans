<template>
  <transition>
    <v-card
      class="white"
      width="70%"
      height="105%"
      v-animate-css="animateCardForm"
    >
      <v-col cols="12" class="d-flex justify-center">
        <v-card-title>
          <h2>Login de Usuário</h2>
        </v-card-title>
      </v-col>
      <v-form v-model="valid" ref="form" lazy-validation>
        <v-col cols="12">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
            filled
            type="email"
          >
            <v-icon slot="append"> mdi-email </v-icon>
          </v-text-field>
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="senha"
            :rules="senhaRules"
            label="Senha"
            required
            :type="tipoInputSenha"
            filled
          >
            <v-icon slot="append" @click="changeIcoPassword">
              {{ icoSenha }}
            </v-icon>
          </v-text-field>
        </v-col>
        <v-col cols="12" id="colCheckbox" class="padding0 d-flex">
          <v-row>
            <v-col cols="6" class="d-flex justify-start">
              <v-checkbox class="padding0" v-model="lembreDeMim" label="Lembre de mim"> </v-checkbox>
            </v-col>
            <v-col cols="6" class="d-flex justify-end">
              <v-btn          
                class="padding0 btn-inscreverse"
                color="primary"
                plain
                to="/inscreverse"
              >
               Criar conta
              </v-btn>
            </v-col>
          </v-row>
        </v-col>

      </v-form>
      <v-card-actions class="padding0" id="cardActions">
        <v-btn
          block
          elevation="2"
          rounded
          color="primary"
          @click="validate"          
          :disabled="!valid"
          :loading="loading"
          class="padding0"
        >
          <v-icon left> mdi-login </v-icon>
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </transition>
</template>

<script>
export default {
  props: {   
    autenticacaoUsuario: {
      type: Function,
    },
  },
  data() {
    return {
      loading: false,
      animateCardForm: {
        classes: "fadeIn",
        delay: 900,
        duration: 1300,
      },
      email: "",
      senha: "",
      emailRules: [(v) => !!v || "Preencha o seu e-mail"],
      senhaRules: [(v) => !!v || "Entre com sua senha"],
      valid: true,
      icoSenha: "mdi-eye",
      tipoInputSenha: "password",
      icoVisible: true,
      lembreDeMim: false,
    };
  },
  methods: {
    validate() {
      this.$refs.form.validate();
      if (this.email !== "" && this.senha !== "") {
        this.loading = true;
        this.$store
          .dispatch("validarUsuario", {
            email: this.email,
            senha: this.senha,
          })
          .then(() => {
            this.autenticacaoUsuario(this.usuarioAutenticado, this.lembreDeMim);
            this.loading = false;
          });
      }
    },
    changeIcoPassword() {
      if (this.icoVisible) {
        (this.icoSenha = "mdi-eye-off"), (this.tipoInputSenha = "text");
      } else {
        this.icoSenha = "mdi-eye";
        this.tipoInputSenha = "password";
      }
      this.icoVisible = !this.icoVisible;
    },
  },
  watch: {
    loading(newVal) {
      if(newVal) {
        setTimeout(() => {
          this.loading = false
        }, 20000)
      }
    }
  }
};
</script>

<style>
.padding0 {
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: 0px;
}
#colCheckbox {
  position: relative;
  bottom: 15px;    
}
#cardActions {
  position: relative;
  bottom: 10px;
}
.btn-inscreverse {
  position: relative;
  bottom: 5px;
}
.col {
  padding-bottom: 10px;
}
</style>