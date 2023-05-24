import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router/route.js'
import store from './store/store'
import vuetify from './plugins/vuetify'
import VAnimateCss from 'v-animate-css';


Vue.use(VAnimateCss);

Vue.filter('dinheiro', function (valor) {
  return valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
})
Vue.filter('data', function (valor) {
  let dtcriação = valor.split('-')
  return dtcriação[2] + '/' + dtcriação[1] + '/' + dtcriação[0]
})
Vue.filter('mes', function (valor) {
  var meses = {
    '01': "Janeiro",
    '02': "Fevereiro",
    '03': "Março",
    '04': "Abril",
    '05': "Maio",
    '06': "Junho",
    '07': "Julho",
    '08': "Agosto",
    '09': "Setembro",
    '10': "Outubro",
    '11': "Novembro",
    '12': "Dezembro"
  };
  let data = valor.split('-')
  return meses[data[1]] + ' de ' + data['0']
})

Vue.mixin({
  data() {
    return {
      animateLogoCard: {
        classes: 'fadeInDown',
        delay: 0,
        duration: 1500,
      }
    }
  },
  methods: {
    filtrarMoney(id, num = '') {
      let el = ''
      let v = undefined
      if (id !== '') {
        el = document.getElementById(id)
        v = el.value.replace(/\D/g, '');
        v = (v / 100).toFixed(2) + '';
        v = v.replace(".", ",");
        v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        el.value = v;
      } else {
        el = num
        v = el.replace(/\D/g, '');
        v = (v / 100).toFixed(2) + '';
        v = v.replace(".", ",");
        v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        el = v;
        return el
      }
    },
    categoriaProps(categoria, prop) {
      let retorno = {}
      this.categorias.forEach(element => {
        if (element.categoria == categoria) {
          if(prop == 'icon') {
            retorno = element.icon
          } else if (prop == 'color') {
            retorno = element.color
          }          
        }
      })
      return retorno
    },
  },
  computed: {
    logoNSG() {
      return this.$store.getters.logoNSG
    },
    usuario() {
      return this.$store.getters.usuario
    },
    categorias() {
      return this.$store.getters.categorias
    },
    categoriasSelects() {
      return this.$store.getters.categoriasSelects
    },
    usuarioAutenticado() {
      return this.$store.getters.usuario.usuarioAutenticado;
    },
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,  
  render: h => h(App)
}).$mount('#app')
