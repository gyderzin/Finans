export default {
    state: {
        alert: { 
            stateAlert: false,
            typeAlert: '',
            messageAlert: ''
        },               
    },
    getters: {        
      alert(state) {
        return state.alert
      }      
    },
    mutations: {     
      changeAlert(state, payload) {
        state.alert.stateAlert = payload.state
        state.alert.typeAlert = payload.type
        state.alert.messageAlert = payload.message
      },     
      alternarAlert(state, payload) {
        state.alert.stateAlert = payload
      }
    }          
}