import img from '@/assets/finance.png'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost/Back-End/public/api/'

export default {
  state: {
    usuario: {
      id: '',
      nome: '',
      email: '',
      senha: '',
      usuarioAutenticado: false,
      primeiroAcesso: false,
    },
    logoNSG: img,
    storageValidate: false,
    tentativaLogin: false
  },
  getters: {
    usuario(state) {
      return state.usuario
    },
    logoNSG(state) {
      return state.logoNSG
    },
    storageValidate(state) {
      return state.storageValidate
    },
    tentativaLogin(state) {
      return state.tentativaLogin
    }
  },
  mutations: {
    validarUsuario(state, payload) {
      state.usuario.id = payload[0].id
      state.usuario.nome = payload[0].nome
      state.usuario.email = payload[0].email
      state.usuario.senha = payload[0].senha      
      state.usuario.primeiroAcesso = payload[0].primeiro_acesso
      state.usuario.usuarioAutenticado = true
      state.storageValidate = true
    },
    usuarioNegado(state) {
      state.usuario.usuarioAutenticado = 'negado'
    },
    usuarioAutenticado(state) {
      state.usuario.usuarioAutenticado = true
    },
    validateStorage(state) {
      state.storageValidate = true
    },
    logout(state) {
      state.usuario.usuarioAutenticado = false
    },
    changeTentativa(state, payload) {
      state.tentativaLogin = payload
    },
    changePrimeiroAcesso(state) {
      state.usuario.primeiroAcesso = 'false'
    }
  },
  actions: {
    changePrimeiroAcesso({commit}, idUser) {
      return new Promise ((resolve) => {
        axios.put('/changePrimeiroAcesso/'+idUser, {
          valor: 'false'
        }).then(() => {
          let local = localStorage.getItem('primeiroAcesso')
          let session = sessionStorage.getItem('primeiroAcesso')        
          if(local && local == 'true') {
            localStorage.setItem('primeiroAcesso', 'false')
          } 
          else if(session && session == 'true') {
            sessionStorage.setItem('primeiroAcesso', 'false')
          }
          commit('changePrimeiroAcesso')
          resolve()
        })
      })
    },
    validarUsuario({ commit }, usuario) {
      return new Promise((resolve) => {        
        axios.post('/autenticarUsuario', {
          email: usuario.email,
          senha: usuario.senha
        })
        .then(res => {
          if (res.data.length == 1) {            
            commit('validarUsuario', res.data)            
            resolve()
          }
          else if (res.data == 0) {
            commit('usuarioNegado')
            resolve()
          }
        }
        )
        .catch((erro) => {          
          if(erro.message == 'Network Error')
            commit('changeAlert', {
              state: true,
              type: 'error',
              message: 'Servidor inativo!'
            })
        })
      })
    },
    salvarUsuario({commit}, payload) {
      if (payload == true) {
        localStorage.setItem('usuarioAutenticado', 'autenticado')
        localStorage.setItem('primeiroAcesso', this.getters.usuario.primeiroAcesso)
        localStorage.setItem('idUser', this.getters.usuario.id)
        localStorage.setItem('nomeUser', this.getters.usuario.nome)
        localStorage.setItem('emailUser', this.getters.usuario.email)
      }
      else if (payload == false) {
        sessionStorage.setItem('usuarioAutenticado', 'autenticado')
        sessionStorage.setItem('primeiroAcesso', this.getters.usuario.primeiroAcesso)
        sessionStorage.setItem('idUser', this.getters.usuario.id)
        sessionStorage.setItem('nomeUser', this.getters.usuario.nome)
        sessionStorage.setItem('emailUser', this.getters.usuario.email)
      }
      commit('validateStorage')
    },
    getStorageUser({ commit }) {
      let local = localStorage.getItem('usuarioAutenticado')
      let session = sessionStorage.getItem('usuarioAutenticado')
      if (local && local == 'autenticado') {
        const usuario = [
          {
            id: localStorage.getItem('idUser'),
            nome: localStorage.getItem('nomeUser'),
            email: localStorage.getItem('emailUser'),
            primeiro_acesso: localStorage.getItem('primeiroAcesso')
          }
        ]
        commit('validarUsuario', usuario)
      }
      else if (session && session == 'autenticado') {
        const usuario = [
          {
            id: sessionStorage.getItem('idUser'),
            nome: sessionStorage.getItem('nomeUser'),
            email: sessionStorage.getItem('emailUser'),
            primeiro_acesso: sessionStorage.getItem('primeiroAcesso')
          }
        ]
        commit('validarUsuario', usuario)
      }
    },
    logout({commit}) {
      localStorage.clear()
      sessionStorage.clear()
      commit('logout')
    }
  },
}