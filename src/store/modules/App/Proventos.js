import axios from 'axios'
axios.defaults.baseURL = 'https://apithundermonkey.com.br/api/finans/'
export default {
    state: {        
        proventos: []
    },
    getters: {
        proventos(state) {
            return state.proventos
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
        adicionarProvento(state, payload) {            
            if(Array.isArray(payload) == true) {
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
                    axios.post('/inserir/proventos', {
                        id_usuario: id,
                        categoria: element.categoria,
                        valor: element.valor
                    })
                })
                resolve()                
            }) 
        },
        getProventos(state) {
            let id = state.getters.usuario.id
            axios.get('/recuperar/proventos/'+id).then((res) => {                
                state.commit('adicionarProvento', res.data)                
            })
        }
    }
}