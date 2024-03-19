import axios from 'axios'
axios.defaults.baseURL = 'https://apithundermonkey.com.br/api/finans/'
export default {
    state: {
        categorias: [],
        items: [
            { header: 'Pesquise por categorias ou crie uma digitando e pressionando enter.' },
            { categoria: 'Academia', icon: 'mdi-dumbbell', color: 'primary' },
            { categoria: 'Alimentação', icon: 'mdi-food-variant', color: 'primary' },
            { categoria: 'Aluguel', icon: 'mdi-home-city', color: 'primary' },
            { categoria: 'Combustivel', icon: 'mdi-gas-station', color: 'primary' },
            { categoria: 'Conta de Água', icon: 'mdi-water-pump', color: 'primary' },
            { categoria: 'Energia', icon: 'mdi-lightbulb-on', color: 'primary' },
            { categoria: 'Internet', icon: 'mdi-wifi', color: 'primary' },
            { categoria: 'Lanches', icon: 'mdi-food', color: 'primary' },
            { categoria: 'Rolês', icon: 'mdi-party-popper', color: 'primary' },
            { categoria: 'Transporte', icon: 'mdi-bus-stop', color: 'primary' },
            { categoria: 'Uber', icon: 'mdi-taxi', color: 'primary' },
        ],


    },
    getters: {
        categorias(state) {
            return state.categorias
        },
        categoriasSelects(state) {
            let categorias = []
            state.categorias.forEach(element => {
                categorias.push(element.categoria)
            })
            return categorias
        },       
        itemsCategoria(state) {
            let items = []
            state.items.forEach(element => {
                let teste = state.categorias.find(categorias => categorias.categoria == element.categoria)
                if(teste == undefined) {
                    items.push(element.categoria)
                }                
            })
            return items
        },
        items(state) {
            return state.items
        }
    },
    mutations: {
        adicionarCategoria(state, payload) {
            if(payload.backEnd == true) {
                payload.forEach((element) => {
                    state.categorias.push({
                        id: element.id,
                        categoria: element.categoria,
                        icon: element.icon,
                        color: element.color,
                    })
                })  
            }
            else {
                payload.forEach((element) => {
                    state.categorias.push({
                        categoria: element.categoria,
                        icon: element.icon,
                        color: element.color,
                    })
                })            
            }
        },
        newCategoria(state, payload) {
            state.categorias.push(payload)
        },
        updateCategoria(state, payload) {
            state.categorias.forEach(element => {
                if(element.id == payload.id) {
                    element.categoria = payload.categoria
                    element.color = payload.color
                    element.icon = payload.icon
                }
            })
        },        
        deleteCategoria(state, payload) {
            state.categorias.splice(payload, 1)
        },
        excluirCategoria(state, payload) {
            state.categorias.forEach((element, i) => {
                if(element.id == payload) {
                    state.categorias.splice(i, 1)
                }
            })
        }
    },
    actions: {
        uploadCategorias(state) {
            return new Promise((resolve) => {
                const categorias = state.getters.categorias
                categorias.forEach(element => {
                    var id = state.getters.usuario.id
                    axios.post('/inserir/categorias', {
                        id_usuario: id,
                        categoria: element.categoria,
                        icon: element.icon,
                        color: element.color
                    })
                })
                resolve()
            })
        },
        newCategoria({commit}, payload) {
            return new Promise ((resolve) => {                
                axios.post('/inserir/categorias', payload).then(() => {                    
                    commit('newCategoria', payload)
                    resolve()
                })
            })
        },
        deleteCategoria({commit}, payload) {
            axios.delete('/deletar/categoria/'+payload).then(() => {
                commit('excluirCategoria', payload)
            })
        },
        getCategorias(state) {
            let id = state.getters.usuario.id
            axios.get('/recuperar/categorias/' + id).then(res => {                
                res.data.backEnd = true                
                state.commit('adicionarCategoria', res.data)
            })
        },
        updateCategorias({commit},payload) {
            return new Promise ((resolve) => {
                axios.put('/atualizar/categoria', payload).then(() => {
                    commit('updateCategoria', payload)
                    resolve()
                })
            })
         
        }
    }
}