import axios from 'axios'
axios.defaults.baseURL = 'http://localhost/Back-End/public/api/'

export default {
    state: {
        step: 1,
        nome: '',
        email: '',
        senha: '',
        typerAlert: '',
        loadingInscreverse: false,
    },
    getters: {
        getUser(state) {
            let user = { 
                nome: state.nome,
                email: state.email,
                senha: state.senha
            }
            return user
        },
        getStep(state) {
            return state.step
        },
        getTypeAlert(state) {
            return state.typerAlert
        },
        getLoadingInscreverse(state) {
            return state.loadingInscreverse
        },
    },
    mutations: {
        changeNome(state, value) {
            state.nome = value
        },
        changeEmail(state, value) {
            state.email = value
        },
        changeSenha(state, value) {
            state.senha = value
        },
        nextStep(state) {
            state.step++
        },
        backStep(state) {            
            state.step--            
        },
        restartStep(state) {
            state.step = 1
        },
        changeLoadingInscreverse(state, value) {
            state.loadingInscreverse = value
        }
    },
    actions: {
        validarNome({ commit }, nome) {
            return new Promise((resolve) => {
                if (nome != '') {
                    commit('changeNome', nome)
                    commit('nextStep')
                    resolve(true)
                }
                else {
                    let alert = {
                        state: true,
                        type: 'error',
                        message: 'Preencha o campo para avançar!'
                    }
                    commit('changeAlert', alert)
                    resolve(false)
                }
                commit('changeLoadingInscreverse', false)
            })
        },
        validarEmail({ commit }, email) {
            return new Promise((resolve) => {
                if (email != '' && /.+@.+\..+/.test(email)) {
                    axios.post('/validarEmail', {
                        email: email
                    }).then(res => {
                        if (res.data.length == 0) {
                            commit('nextStep')
                            commit('changeEmail', email)
                            resolve(true)
                        }
                        else if (res.data.length >= 1) {
                            let alert = {
                                state: true,
                                type: 'error',
                                message: 'Este email já está em uso. Faça login ou utilize outro email. '
                            }
                            commit('changeAlert', alert)
                            resolve(false)
                        }
                        commit('changeLoadingInscreverse', false)
                    })
                }
                else {
                    if (email == '') {
                        let alert = {
                            state: true,
                            type: 'error',
                            message: 'Preencha o campo para avançar!'
                        }
                        commit('changeAlert', alert)
                    } else if (!/.+@.+\..+/.test(email)) {
                        let alert = {
                            state: true,
                            type: 'error',
                            message: 'O email precisa ser valido!'
                        }
                        commit('changeAlert', alert)
                    }
                    commit('changeLoadingInscreverse', false)
                    resolve(false)
                }
            }
            )
        },
        validarSenha({ commit }, senhas) {
            return new Promise ((resolve) => {
                if (
                    senhas.senha !== '' &&
                    senhas.confirmSenha !== '' &&
                    senhas.senha == senhas.confirmSenha) {                    
                    commit('changeSenha', senhas.senha)        
                    commit('nextStep')   
                    commit('changeLoadingInscreverse', false)      
                    resolve(true)
                }
                else if (senhas.senha == '' || senhas.confirmSenha == '') {
                    let alert = {
                        state: true,
                        type: 'error',
                        message: 'Preencha os campos para avançar!'
                    }
                    commit('changeAlert', alert)
                    resolve('erro1')
                    commit('changeLoadingInscreverse', false)      
                }
                else if(senhas.senha != senhas.confirmSenha) {
                    let alert = {
                        state: true,
                        type: 'error',
                        message: 'Confirme sua senha corretamente!'
                    }
                    commit('changeAlert', alert)
                    resolve('erro2')
                    commit('changeLoadingInscreverse', false)      
                }                          
            })
        },
        confirmaçãoEmail(state) {            
            return new Promise ((resolve) => {
                axios.post('verificacaoEmail', {
                    emailUser: state.getters.getUser.email
                }).then(res => {
                    resolve(res.data)
                })
            })
        },
        autenticarUsuario (state) {
            let user = state.getters.getUser
            axios.post('/cadastrarUsuario', user)
        }
    }
}