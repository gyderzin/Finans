import Vue from 'vue'
import VueRouter from 'vue-router'
import ModeloLogin from '@/components/ModeloLogin.vue'
import Login from '@/components/Login.vue'
import PrimeiroAcesso from '@/components/PrimeiroAcesso.vue'
import Inscreverse from '@/components/Login/FormInscreverse.vue'
import Home from '@/components/Home.vue'
import Geral from '@/components/App/Paineis/Geral.vue'
import DespesaConexão from '@/components/App/Paineis/Despesas/DespesaConexão.vue'
import DespesasAvulsas from '@/components/App/Paineis/Despesas/Avulsas.vue'
import DespesasFixas from '@/components/App/Paineis/Despesas/Fixas.vue'
import Proventos from '@/components/App/Paineis/Proventos.vue'
import Categorias from '@/components/App/Paineis/Categorias.vue'
import Cartões from '@/components/App/Paineis/Cartões.vue'
import Perfil from '@/components/App/Paineis/Perfil.vue'
import store from '@/store/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', 
    component: ModeloLogin,
    children: [
      {path: '', component: Login},
      {path:'/inscreverse', component: Inscreverse}
    ]
  },
  {
    path: '/primeiroAcesso', component: PrimeiroAcesso
  },
  {
    path: '/home', component: Home,
    children: [
      { path: '', component: Geral },
      { path: '/home/despesas/', component: DespesaConexão , children: [        
        { path: '', component: DespesasAvulsas },
        { path: 'fixas', component: DespesasFixas },
      ]},     
      { path: '/home/proventos', component: Proventos },     
      { path: '/home/cartões', component: Cartões },     
      { path: '/home/categorias', component: Categorias },     
      { path: '/home/perfil', component: Perfil },     
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (store.getters.storageValidate == false) {
    store.dispatch("getStorageUser")
  }
  let autenticado = store.getters.usuario.usuarioAutenticado 
  if(to.path == '/primeiroAcesso'){     
    let primeiroAcesso = store.getters.usuario.primeiroAcesso
    if(autenticado == true) {
      if(primeiroAcesso == 'true') {
        next()
      } else if(primeiroAcesso == 'false') {        
        next('/home')
      }
    } else {
      store.commit('changeAlert', {
        state: true,
        type: 'error',
        message: 'Faça login para acessar o sistema'
      })
      next("/")
    }
  }
  if (
    to.path == "/home" || to.path == '/home/' || to.path == '/home/cartões' ||
    to.path == '/home/despesas/' || to.path == '/home/despesas/fixas' || to.path == '/home/categorias' || to.path == '/home/proventos' || to.path == '/home/perfil'
  ) {
    if (autenticado == true) {
      let primeiroAcesso = store.getters.usuario.primeiroAcesso
      if(primeiroAcesso == 'true') {          
          next("/primeiroAcesso")
      }
      else {              
        next()
      }
    } else {
      store.commit('changeAlert', {
        state: true,
        type: 'error',
        message: 'Faça login para acessar o sistema'
      })
      next("/")
    }
  } else if (to.path == "/" || to.path == '/inscreverse') {
    if (autenticado == true) {
      store.commit('changeTentativa', true)
      store.commit('changeAlert', {
        state: true,
        type: 'error',
        message: 'Encerre a sessão atual para fazer login novamente!'
      })
      next("/home");
    } else {
      next();
    }
  }   
})

export default router
