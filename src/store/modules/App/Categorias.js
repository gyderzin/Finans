import axios from 'axios'
axios.defaults.baseURL = 'http://localhost/Back-End/public/api/'
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
            payload.forEach((element) => {
                state.categorias.push({
                    categoria: element.categoria,
                    icon: element.icon,
                    color: element.color,
                })
            })            
        },
        deleteCategoria(state, payload) {
            state.categorias.splice(payload, 1)
        },
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
        getCategorias(state) {
            let id = state.getters.usuario.id
            axios.get('/recuperar/categorias/' + id).then(res => {                
                res.data.backEnd = true
                state.commit('adicionarCategoria', res.data)
            })
        }
    }
}