import Vue from 'vue'
import Vuex from 'vuex'
import Login from '@/store/modules/Login/Login'
import Inscreverse from '@/store/modules/Login/Inscreverse'
import Proventos from './modules/App/Proventos'
import Categorias from './modules/App/Categorias'
import Despesas from './modules/App/Despesas'
import Perfil from './modules/App/Perfil'
import Alert from '@/store/modules/Alerts/Alert.js'
import img from '@/assets/finance.png'
Vue.use(Vuex)

export default new Vuex.Store({
  mutations: {
    deleteAllInfo(state) {
      state.Despesas.despesasFixas = []
      state.Despesas.despesasPagas = []
      state.Despesas.despesas = []
      state.Despesas.despesaEdited = undefined
      state.Despesas.mesAvulso = undefined
      state.Despesas.mesFixo = undefined      
      state.Categorias.categorias = []
      state.Perfil.perfilUsuario = undefined
      state.Proventos.proventos = []
      state.Inscreverse.step = 1,
      state.Inscreverse.nome = ''
      state.Inscreverse.email = ''
      state.Inscreverse.senha = ''
      state.Inscreverse.typerAlert = ''
      state.Inscreverse.loadingInscreverse = false
      state.Login.usuario = {
        id: '',
        nome: '',
        email: '',
        senha: '',
        usuarioAutenticado: false,
        primeiroAcesso: false,
      },
      state.Login.logoNSG = img,
      state.Login.storageValidate = false,
      state.Login.tentativaLogin = false
    }
  },
  actions: {
    uploadAllInfo(state) {
      return new Promise((resolve) => {
        state.dispatch('uploadProventos').then(() => {
          state.dispatch('uploadCategorias').then(() => {
            state.dispatch('uploadDespesasFixas').then(() => {
              resolve()
            })
          })
        })
      })
    },
    getAllInfo(state) {
      let data = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
      data = data.split('-')
      let dataDespesas = data[0]+'-'+data[1]+'-01'
      let dataDespesasFixas = data[0]+'-'+data[1]+'-'+data[2]
      state.dispatch('getCategorias')
      state.dispatch('getDespesasFixasPendentes', {
        data: dataDespesasFixas,
      })
      state.dispatch('getDespesasFixasPagas', {
        data: dataDespesasFixas,
      })            
      state.dispatch('getDespesas', {
        data: dataDespesas,
        tipo: 'get'
      })
      state.dispatch('getProventosAReceber', {
        data: dataDespesasFixas,
      })
      state.dispatch('getProventosRecebidos', {
        data: dataDespesasFixas,
      })      
    }
  },

  modules: {
    Login,
    Inscreverse,
    Proventos,
    Categorias,
    Despesas,
    Perfil,
    Alert
  },

})

