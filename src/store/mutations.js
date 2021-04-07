export default {
    addCart(state, payload) {
        console.log('payload.count:', payload)
        state.cartCount = payload.count
    }
}