import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './user'

const API_URL = 'http://localhost:3000/carts'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [] // 每个项：{ id, userId, productId, quantity, product }
    }),
    actions: {
        async loadCart() {
            try {
                const userStore = useUserStore()
                if (!userStore.userInfo) {
                    this.items = []
                    return
                }
                const cartRes = await axios.get(`${API_URL}?userId=${userStore.userInfo.id}`)
                const productRes = await axios.get('http://localhost:3000/products')

                const productMap = new Map(productRes.data.map(p => [String(p.id), p]))

                this.items = cartRes.data.map(item => ({
                    ...item,
                    product: productMap.get(String(item.productId)) || {
                        id: '',
                        title: '商品信息不存在',
                        price: 0,
                        image: ''
                    }
                }))
            } catch (error) {
                console.error('加载购物车失败', error)
            }
        },


        async addItem(product) {
            try {
                const userStore = useUserStore()
                if (!userStore.userInfo) return

                const existing = this.items.find(item => item.productId === product.id)
                const addQuantity = product.quantity || 1 // 传入的数量，没有就默认1

                if (existing) {
                    await axios.patch(`${API_URL}/${existing.id}`, {
                        quantity: existing.quantity + addQuantity
                    })
                } else {
                    await axios.post(API_URL, {
                        userId: userStore.userInfo.id,
                        productId: product.id,
                        quantity: addQuantity
                    })
                }
                await this.loadCart()
            } catch (error) {
                console.error('添加购物车失败', error)
            }
        },

        async removeItem(productId) {
            try {
                const userStore = useUserStore()
                if (!userStore.userInfo) return

                const item = this.items.find(i => i.productId === productId)
                if (item) {
                    await axios.delete(`${API_URL}/${item.id}`)
                    await this.loadCart()
                }
            } catch (error) {
                console.error('移除购物车失败', error)
            }
        },

        async clearCart() {
            try {
                const userStore = useUserStore()
                if (!userStore.userInfo) return

                const deletePromises = this.items.map(item => axios.delete(`${API_URL}/${item.id}`))
                await Promise.all(deletePromises)
                await this.loadCart()
            } catch (error) {
                console.error('清空购物车失败', error)
            }
        }
    },
    getters: {
        totalQuantity: (state) =>
            state.items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: (state) =>
            state.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
    }
})
