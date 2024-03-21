import axios from 'axios'
axios.defaults.baseURL = 'https://apithundermonkey.com.br/api/finans/'
export default {
    state: {
        proventos: [],
        proventosRecebidos: [],
        proventosAReceber: [],
        proventosFixos: [],
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
            if (Array.isArray(payload) == true) {
                payload.forEach(element => {
                    state.proventos.push({
                        categoria: element.categoria,
                        valor: element.valor
                    })
                })
            } else {
                state.proventos.push({
                    categoria: payload.categoria,
                    valor: payload.valor
                })
            }
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
        updadeProventoFixo(state, payload) {            
            state.proventosAReceber.forEach(element => {            
                if (element.id == payload.id) {
                    element.categoria = payload.categoria
                    element.valor = payload.valor
                    element.data = payload.dtcriação                    
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
                        let mesDespesa = payload.data.split('-')
                        payload.id = id
                        if (mesFixo[1] == mesDespesa[1]) {
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
        getProventos(state) {
            let id = state.getters.usuario.id
            axios.get('/recuperar/proventos/' + id).then((res) => {
                state.commit('adicionarProvento', res.data)
            })
        }
    }
}