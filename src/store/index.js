import { createStore } from 'vuex'
import state from './state.js'
import actions from './actions'
import mutations from './mutations'
export default createStore({
    state,
    mutations,
    actions,
    modules: {}
})