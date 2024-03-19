import axios from 'axios'
axios.defaults.baseURL = 'https://apithundermonkey.com.br/api/finans/'
import julius from '@/assets/perfil/julius.jpg'
import img2 from '@/assets/perfil/img2.jpg'
import img3 from '@/assets/perfil/img3.jpg'
import img4 from '@/assets/perfil/img4.jpg'
import img5 from '@/assets/perfil/img5.jpg'
import img6 from '@/assets/perfil/img6.jpg'
import img7 from '@/assets/perfil/img7.jpg'
import img8 from '@/assets/perfil/img8.jpg'
import img9 from '@/assets/perfil/img9.jpg'
import img10 from '@/assets/perfil/img10.jpg'
import img11 from '@/assets/perfil/img11.jpg'
import img12 from '@/assets/perfil/img12.jpg'
import img13 from '@/assets/perfil/img13.jpg'
import img14 from '@/assets/perfil/img14.jpg'
import img15 from '@/assets/perfil/img15.jpg'
import img16 from '@/assets/perfil/img16.jpg'
import img17 from '@/assets/perfil/img17.jpg'
import img18 from '@/assets/perfil/img18.jpg'
import img19 from '@/assets/perfil/img19.jpg'
import img20 from '@/assets/perfil/img20.jpg'
import img21 from '@/assets/perfil/img21.jpg'
export default {
    state: {
        perfilUsuario: undefined,
        imagensPefil: [
            julius, img2, img3, img4,img5,img6,img7,img8,img9,img10,img11,img12,img13,img14,img15,img16,img17,img18,img19,img20,img21
        ]
    },
    getters: {
        getImagensPefil(state) {
            return state.imagensPefil
        },
        perfilUsuario(state) {            
            return state.perfilUsuario
        }
    },
    mutations: {
        changePerfilUsuario(state, payload) {            
            state.perfilUsuario = payload            
        }
    },
    actions: {
        uploadFotoPerfil(state, payload) {            
            return new Promise(() => {                
                axios({
                    method: "post",
                    url: "/processarFoto",
                    headers: {                      
                      'Content-Type': 'multipart/form-data',
                    },
                    data: {
                      img: payload.foto,
                      id_user: payload.id
                    },
                  })      
            }) 
        },
        recuperarFotoPerfil({commit}, payload) {
            return new Promise ((resolve) => {
                axios({
                    method: "get",
                    url: "/fotoUsuario/"+payload.id+'/'+payload.tipo,
                  }).then(res => {
                    commit('changePerfilUsuario', res.data)
                    resolve(res.data)                         
                  })
            })
        }
    }   
}
