import axios from 'axios'
axios.defaults.baseURL = 'https://apithundermonkey.com.br/api/finans/'
export default {
    state: {
        despesasFixas: [],
        despesasPagas: [],
        despesas: [],
        despesaEdited: undefined,
        mesAvulso: undefined,
        mesFixo: undefined,
    },
    getters: {
        mesAvulso(state) {
            return state.mesAvulso
        },
        mesFixo(state) {
            return state.mesFixo
        },
        despesasFixas(state) {
            return state.despesasFixas
        },
        despesasPagas(state) {
            return state.despesasPagas
        },
        somaDespesasFixas(state) {
            var soma = 0
            state.despesasFixas.forEach(element => {
                let n1 = parseFloat(element.valor)
                soma = n1 + soma
            });
            return soma
        },
        somaDespesas(state) {
            var somaDespesas = 0
            state.despesas.forEach(element => {
                let n1 = element.valor
                somaDespesas = parseFloat(n1) + parseFloat(somaDespesas)
            });
            return somaDespesas
        },
        despesas(state) {
            return state.despesas
        },
        despesaEdited(state) {
            return state.despesaEdited
        },
    },
    mutations: {
        addDespesasPagas(state, payload) {
            state.despesasPagas.push(payload)
        },
        removeDespesaPagas(state, payload) {
            state.despesasPagas.splice(payload, 1)
        },
        changeMesAvulso(state, payload) {
            state.mesAvulso = payload
        },
        changeMesFixo(state, payload) {
            state.mesFixo = payload
        },
        adicionarDespesaFixa(state, payload) {
            if (payload.type == 'update') {
                state.despesasFixas = []
            }
            if (Array.isArray(payload) == true) {
                payload.forEach(element => {
                    state.despesasFixas.push({
                        id: element.id,
                        categoria: element.categoria,
                        valor: element.valor,
                        action: false,
                    })
                })
            } else {
                state.despesasFixas.push({
                    id: payload.id,
                    categoria: payload.categoria,
                    valor: payload.valor,
                    action: false,
                })                
            }
        },
        adicionarDespesaFixaPaga(state, payload) {
            if (payload.type == 'update') {
                state.despesasPagas = []
            }
            payload.forEach(element => {              
                state.despesasPagas.push({
                    id: element.id,
                    categoria: element.categoria,
                    valor: element.valor,
                    cartão: element.cartão,
                    data: element.data,
                    action: false,
                })
            })
        },
        deleteDespesaFixa(state, payload) {            
            state.despesasFixas.forEach((element, i) => {                                
                if(element.id == payload) {
                    state.despesasFixas.splice(i, 1)
                }
            })            
        },
        updadeDespesaFixa(state, payload) {            
            state.despesasFixas.forEach(element => {
                if (element.id == payload.id) {
                    element.categoria = payload.categoria
                    element.valor = payload.valor
                    element.data = payload.dtcriação
                }
            })
        },
        adicionarDespesa(state, payload) {
            if (payload.type == 'update') {
                state.despesas = []
            }
            if (Array.isArray(payload) == true) {
                payload.forEach(element => {
                    let data = element.data.split('-')
                    data = data[2] + '/' + data[1] + '/' + data[0]
                    state.despesas.push({
                        id: element.id,
                        categoria: element.categoria,
                        valor: element.valor,
                        data: data,
                        cartão: element.cartão,
                        descrição: element.descrição,
                        fixo: element.fixo,
                        actions: false
                    })
                })
            } else {                
                let data = payload.data.split('-')
                data = data[2] + '/' + data[1] + '/' + data[0]
                state.despesas.push({
                    id: payload.id,
                    categoria: payload.categoria,
                    valor: payload.valor,
                    data: data,
                    cartão: payload.cartão,
                    descrição: payload.descrição,
                    fixo: payload.fixo,
                    actions: false
                })
            }

        },
        changeDespesaEdited(state, payload) {
            let despesa = { ...payload }
            state.despesaEdited = despesa
        },
        uploadDespesa(state, payload) {
            state.despesas.forEach((element, i) => {
                if (element.id == payload.id) {
                    if (payload.deletar == true) {
                        state.despesas.splice(i, 1)
                    }
                    else {
                        let despesa = state.despesas[i]
                        despesa.categoria = payload.categoria
                        despesa.cartão = payload.cartão
                        despesa.descrição = payload.descrição
                        despesa.data = payload.data
                        despesa.valor = payload.valor
                    }
                }
            })

        },
        setDateEdit(state, payload) {
            state.despesaEdited.data = payload
        },
        deletarDespesa(state, payload) {
            state.despesas.forEach((element, i) => {
                if (element.id == payload.id) {
                    state.despesas.splice(i, 1)
                }
            })
        }
    },
    actions: {
        changeDespesaEdited({ commit }, payload) {
            return new Promise((resolve) => {
                commit('changeDespesaEdited', payload)
                resolve()
            })
        },
        uploadDespesasFixas(state) {
            return new Promise((resolve) => {
                const despesas = state.getters.despesasFixas
                despesas.forEach(element => {
                    var id = state.getters.usuario.id
                    axios.post('/inserir/despesasFixas', {
                        id_usuario: id,
                        categoria: element.categoria,
                        valor: element.valor
                    })
                })
                resolve()
            })
        },
        uploadNovaDespesaFixa(state, payload) {
            return new Promise((resolve) => {
                var id = state.getters.usuario.id
                axios.post('/inserir/novaDespesaFixa', payload).then(() => {
                    axios.get('/recuperar/ultimaDespesaFixa/' + id).then(res => {
                        let id = res.data.id
                        let mesFixo = state.getters.mesFixo.split('-')
                        let mesDespesa = payload.data.split('-')
                        payload.id = id
                        if (mesFixo[1] == mesDespesa[1]) {
                            state.commit('adicionarDespesaFixa', payload)
                        }
                    }).then(() => {
                        resolve()
                    })
                })
            })
        },
        uploadDespesas(state, payload) {
            return new Promise((resolve) => {
                var id = state.getters.usuario.id
                let despesa = {
                    id: null,
                    id_usuario: id,
                    categoria: payload.categoria,
                    valor: payload.valor,
                    descrição: payload.descrição,
                    cartão: payload.cartão,
                    data: payload.data,
                    fixo: payload.fixo
                }
                axios.post('/inserir/despesas', despesa).then(() => {
                    axios.get('/recuperar/ultimaDespesa/' + id).then(res => {
                        let id = res.data.id
                        despesa.id = id
                        if (payload.fixo == 'false') {
                            let mesFilter = state.getters.mesAvulso.split('-')
                            let mesDespesa = payload.data.split('-')
                            if (mesFilter[1] == mesDespesa[1]) {
                                state.commit('adicionarDespesa', despesa)
                            }
                        }
                        else if (payload.fixo == 'true') {
                            let mesAtual = new Date().toISOString().substr(0, 7)
                            mesAtual = mesAtual.split('-')
                            let mesDespesa = payload.data.split('-')
                            if (mesAtual[1] == mesDespesa[1]) {
                                state.commit('adicionarDespesa', despesa)
                            }
                        }
                    }).then(() => {
                        resolve()
                    })
                })
            })
        },
        getDespesasFixas(state) {
            return new Promise((resolve) => {
                let id = state.getters.usuario.id
                axios.get('/recuperar/despesasFixas/' + id).then((res) => {                    
                    resolve(res.data)
                })
            })
        },
        getDespesasFixasPendentes(state, payload) {
            let id = state.getters.usuario.id
            axios.get('/recuperar/despesasFixasPendentes/' + id + '/' + payload.data).then((res) => {

                if (payload.tipo == 'update') {
                    res.data.type = 'update'
                }
                state.commit('adicionarDespesaFixa', res.data)
            })
        },
        getDespesasFixasPagas(state, payload) {
            let id = state.getters.usuario.id
            axios.get('/recuperar/despesasFixasPagas/' + id + '/' + payload.data).then((res) => {
                if (payload.tipo == 'update') {
                    res.data.type = 'update'
                }                
                state.commit('adicionarDespesaFixaPaga', res.data)
            })
        },
        updateDespesaFixa(state, payload) {
            return new Promise((resolve) => [
                axios.put('/atualizar/despesaFixa', {
                    id: payload.id,
                    categoria: payload.categoria,
                    valor: payload.valor,
                    data: payload.dtcriação
                }).then(() => {
                    state.getters.despesasFixas.forEach(element => {
                        if (element.id == payload.id) {
                            state.commit('updadeDespesaFixa', payload)
                        }
                    })
                    resolve()
                })
            ])

        },
        deleteDespesaFixa(state, payload) {
            return new Promise((resolve) => {
                axios.delete('/deletar/despesaFixa/' + payload).then(() => {
                    state.getters.despesasFixas.forEach(element => {
                        if (element.id == payload) {
                            state.commit('deleteDespesaFixa', payload)
                        }
                    })
                    resolve()
                })
            })
        },
        getDespesas(state, payload) {
            let id = state.getters.usuario.id
            axios.get('/recuperar/despesas/' + id + '/' + payload.data).then((res) => {
                if (payload.tipo == 'update') {
                    res.data.type = 'update'
                }
                state.commit('adicionarDespesa', res.data)
            })

        },
        updateDespesa(state, payload) {
            return new Promise((resolve) => {
                axios.put('/atualizar/despesa', {
                    id: payload.id,
                    categoria: payload.categoria,
                    cartão: payload.cartão,
                    descrição: payload.descrição,
                    valor: payload.valor,
                    data: payload.data
                }).then(() => {
                    let mesFilter = state.getters.mesAvulso.split('-')
                    let mesDespesa = payload.data.split('/')
                    if (mesFilter[1] != mesDespesa[1]) {
                        payload.deletar = true
                    }
                    state.commit('uploadDespesa', payload)
                    resolve()
                })
            })
        },
        deletDespesa(state, payload) {
            if (payload.tipo == 'despesaEdit') {
                return new Promise((resolve) => {
                    let despesa = state.getters.despesaEdited
                    axios.delete('/deletar/despesa/' + despesa.id).then(() => {
                        state.commit('deletarDespesa', despesa)
                        resolve()
                    })
                })
            }
            else if (payload.tipo == 'despesaFixa') {
                return new Promise((resolve) => {
                    axios.delete('/deletar/despesa/' + payload.id).then(() => {
                        state.commit('deletarDespesa', payload)
                        resolve()
                    })
                })
            }
        }
    }
}