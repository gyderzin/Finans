import axios from 'axios'
axios.defaults.baseURL = 'https://apithundermonkey.com.br/api/finans/'
export default {
    state: {
        proventos: [],
        proventosRecebidos: [],
        proventosAReceber: [],
        proventosFixos: [],
        proventoEdit: [],
        mesFixoProventos: undefined,
        mesAvulsoProventos: undefined
    },
    getters: {
        proventos(state) {
            return state.proventos
        },
        proventosFixos(state) {
            return state.proventosFixos
        },
        proventoEdit(state) {
            return state.proventoEdit
        },
        mesFixoProventos(state) {
            return state.mesFixoProventos
        },
        mesAvulsoProventos(state) {
            return state.mesAvulsoProventos
        },
        proventosRecebidos(state) {
            return state.proventosRecebidos
        },
        proventosAReceber(state) {
            return state.proventosAReceber
        },
        somaProventos(state) {
            var soma = 0
            state.proventos.forEach(element => {
                let n1 = parseFloat(element.valor)
                soma = n1 + soma
            });
            return soma
        }
    },
    mutations: {
        changeMesFixoProventos(state, payload) {
            state.mesFixoProventos = payload
        },
        changeMesAvulsoProventos(state, payload) {
            state.mesAvulsoProventos = payload
        },
        adicionarProvento(state, payload) {
            if (payload.type == 'update') {
                state.proventos = []
            }
            if (Array.isArray(payload) == true) {
                payload.forEach(element => {
                    let data = element.data.split('-')
                    data = data[2] + '/' + data[1] + '/' + data[0]
                    state.proventos.push({
                        id: element.id,
                        categoria: element.categoria,
                        valor: element.valor,
                        data: data,
                        descrição: element.descrição,
                        fixo: element.fixo,
                        actions: false
                    })
                })
            } else {
                let data = payload.data.split('-')
                data = data[2] + '/' + data[1] + '/' + data[0]
                state.proventos.push({
                    id: payload.id,
                    categoria: payload.categoria,
                    valor: payload.valor,
                    data: data,
                    descrição: payload.descrição,
                    fixo: payload.fixo,
                    actions: false
                })
            }
        },
        addProventoRecebido(state, payload) {
           state.proventosRecebidos.push(payload)
        },
        adicionarProventoFixo(state, payload) {
            if (Array.isArray(payload) == true) {
                payload.forEach(element => {
                    state.proventosFixos.push({
                        id: element.id,
                        categoria: element.categoria,
                        valor: element.valor,
                        action: false,
                        dtcriaçao: element.dtcriação
                    })
                })
            } else {
                state.proventosFixos.push({
                    id: payload.id,
                    categoria: payload.categoria,
                    valor: payload.valor,
                    action: false,
                    dtcriaçao: payload.dtcriação
                })
            }
        },
        adicionarProventoRecebido(state, payload) {
            if (payload.type == 'update') {
                state.proventosRecebidos = []
            }
            payload.forEach(element => {
                state.proventosRecebidos.push({
                    id: element.id,
                    categoria: element.categoria,
                    valor: element.valor,
                    data: element.data,
                    action: false,
                })
            })
        },
        adicionarProventoAReceber(state, payload) {
            if (payload.type == 'update') {
                state.proventosAReceber = []
            }
            if (Array.isArray(payload) == true) {
                payload.forEach(element => {
                    state.proventosAReceber.push({
                        id: element.id,
                        categoria: element.categoria,
                        valor: element.valor,
                        action: false,
                    })
                })
            } else {
                state.proventosAReceber.push({
                    id: payload.id,
                    categoria: payload.categoria,
                    valor: payload.valor,
                    action: false,
                })
            }
        },
        removerProventoRecebido(state, payload) {
            state.proventosRecebidos.forEach((proventoRecebido, i) => {
                if (proventoRecebido.id == payload) {
                    state.proventosRecebidos.splice(i, 1)             
                    state.proventosAReceber.push({
                        id: proventoRecebido.id,
                        categoria: proventoRecebido.categoria,
                        valor: proventoRecebido.valor,
                        action: false,
                    })       
                }
            })
            state.proventos.forEach((provento, i) => {           
                console.log(provento, payload)     
                if (provento.id == payload) {                    
                    state.proventos.splice(i, 1)                    
                }
            })

        },
        changeProventoEdit(state, payload) {
            let provento = { ...payload }
            state.proventoEdit = provento
        },
        setDateEditProvento(state, payload) {
            state.proventoEdit.data = payload
        },
        uploadProvento(state, payload) {
            state.proventos.forEach((element, i) => {
                if (element.id == payload.id) {
                    if (payload.deletar == true) {
                        state.proventos.splice(i, 1)
                    }
                    else {
                        let provento = state.proventos[i]
                        provento.categoria = payload.categoria
                        provento.cartão = payload.cartão
                        provento.descrição = payload.descrição
                        provento.data = payload.data
                        provento.valor = payload.valor
                    }
                }
            })

        },
        updadeProventoFixo(state, payload) {
            state.proventosAReceber.forEach(element => {
                if (element.id == payload.id) {
                    element.categoria = payload.categoria
                    element.valor = payload.valor
                    element.data = payload.dtcriação
                }
            })
        },
        deletarProventoFixo(state, payload) {
            state.proventosAReceber.forEach((element, i) => {
                if(element.id == payload) {
                    state.proventosAReceber.splice(i, 1)
                }
            })
            
        },
        deletarProvento(state, payload) {
            state.proventos.forEach((element, i) => {
                if (element.id == payload.id) {
                    state.proventos.splice(i, 1)
                }
            })
        },
        deleteProvento(state, payload) {
            state.proventos.splice(payload, 1)
        },
    },
    actions: {
        uploadProventos(state) {
            return new Promise((resolve) => {
                const proventos = state.getters.proventos
                proventos.forEach(element => {
                    var id = state.getters.usuario.id
                    axios.post('/inserir/proventosfixos', {
                        id_usuario: id,
                        categoria: element.categoria,
                        valor: element.valor,
                    })
                })
                resolve()
            })
        },
        uploadNovoProventoFixo(state, payload) {
            return new Promise((resolve) => {
                var id = state.getters.usuario.id
                axios.post('/inserir/novoProventoFixo', payload).then(() => {
                    axios.get('/recuperar/ultimoProventoFixo/' + id).then(res => {
                        let id = res.data.id
                        let mesFixo = state.getters.mesFixoProventos.split('-')
                        let mesprovento = payload.data.split('-')
                        payload.id = id
                        if (mesFixo[1] == mesprovento[1]) {
                            state.commit('adicionarProventoAReceber', payload)
                        }
                    }).then(() => {
                        resolve()
                    })
                })
            })
        },
        updateProventoFixo(state, payload) {
            return new Promise((resolve) => [
                axios.put('/atualizar/proventoFixo', {
                    id: payload.id,
                    categoria: payload.categoria,
                    valor: payload.valor,
                    data: payload.dtcriação
                }).then(() => {
                    state.getters.proventosAReceber.forEach(element => {
                        if (element.id == payload.id) {
                            state.commit('updadeProventoFixo', payload)
                        }
                    })
                    resolve()
                })
            ])

        },  
        removerProventoRecebido(state, payload) {
            return new Promise((resolve) => {                
                axios.delete('/deletar/provento/' + payload).then(() => {
                    state.commit('removerProventoRecebido', payload)
                    resolve()
                })
            })
        },
        receberProvento(state, payload) {
            return new Promise((resolve) => {
                let id_usuario = state.getters.usuario.id
                let provento = {
                    id_usuario: id_usuario,
                    categoria: payload.categoria,
                    valor: payload.valor,
                    descrição: payload.descrição,
                    data: payload.data,
                    fixo: payload.fixo
                }
                axios.post('/inserir/novoProvento', provento).then(() => {
                    axios.get('/recuperar/ultimoProvento/' + id_usuario).then(res => {
                        let id = res.data.id
                        provento.id = id
                        if (payload.fixo == 'false') {                            
                            let mesFilter = state.getters.mesAvulsoProventos.split('-')
                            let mesprovento = payload.data.split('-')
                            if (mesFilter[1] == mesprovento[1]) {
                                state.commit('adicionarProvento', provento)
                            }
                        }
                        else if (payload.fixo == 'true') {
                            let mesAtual = new Date().toISOString().substr(0, 7)
                            mesAtual = mesAtual.split('-')
                            let mesprovento = payload.data.split('-')
                            if (mesAtual[1] == mesprovento[1]) {
                                state.commit('adicionarProvento', provento)
                            }
                        }
                    }).then(() => {     
                        resolve(provento.id)                     
                    })                                 
                })
            })
        },
        updateProvento(state, payload) {
            return new Promise((resolve) => {
                axios.put('/atualizar/provento', {
                    id: payload.id,
                    categoria: payload.categoria,                    
                    descrição: payload.descrição,
                    valor: payload.valor,
                    data: payload.data
                }).then(() => {
                    let mesFilter = state.getters.mesAvulsoProventos.split('-')
                    let mesProvento = payload.data.split('/')
                    if (mesFilter[1] != mesProvento[1]) {
                        payload.deletar = true
                    }
                    state.commit('uploadProvento', payload)
                    resolve()
                })
            })
        },
        deleteProventoFixo(state, payload) {
            return new Promise((resolve) => {
                axios.delete('/deletar/proventoFixo/'+payload).then(() => {
                    state.commit('deletarProventoFixo', payload) 
                    resolve()
                })
            })
        },
        deletProvento(state, payload) {
            if (payload.tipo == 'proventoEdit') {
                return new Promise((resolve) => {
                    let provento = state.getters.proventoEdit
                    axios.delete('/deletar/provento/' + provento.id).then(() => {
                        state.commit('deletarProvento', provento)
                        resolve()
                    })
                })
            }
            else if (payload.tipo == 'proventoFixa') {
                return new Promise((resolve) => {
                    axios.delete('/deletar/provento/' + payload.id).then(() => {
                        state.commit('deletarProvento', payload)
                        resolve()
                    })
                })
            }
        },
        getProventosFixos(state) {
            return new Promise((resolve) => {
                let id = state.getters.usuario.id
                axios.get('/recuperar/proventosfixos/' + id).then((res) => {
                    resolve(res.data)
                })
            })
        },
        getProventosAReceber(state, payload) {
            let id = state.getters.usuario.id
            axios.get('/recuperar/proventosAReceber/' + id + '/' + payload.data).then((res) => {
                if (payload.tipo == 'update') {
                    res.data.type = 'update'
                }
                state.commit('adicionarProventoAReceber', res.data)
            })
        },
        getProventosRecebidos(state, payload) {
            let id = state.getters.usuario.id
            axios.get('/recuperar/proventosRecebidos/' + id + '/' + payload.data).then((res) => {
                if (payload.tipo == 'update') {
                    res.data.type = 'update'
                }
                state.commit('adicionarProventoRecebido', res.data)
            })
        },
        getProventos(state, payload) {
            let id = state.getters.usuario.id
            axios.get('/recuperar/proventos/'+ id +'/'+ payload.data).then((res) => {
                if (payload.tipo == 'update') {
                    res.data.type = 'update'
                }
                state.commit('adicionarProvento', res.data)
            })
        }
    }
}