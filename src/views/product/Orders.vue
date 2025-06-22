<template>
    <HeaderNav />
    <div class="orders-page">
        <div class="header">
            <el-button type="text" icon="el-icon-arrow-left" @click="goBack">返回</el-button>
            <h2>我的订单</h2>
        </div>

        <div v-if="orders.length > 0" class="order-list">
            <el-card v-for="order in orders" :key="order.id" class="order-card" shadow="hover"
                @click="goToOrderDetail(order.id)" style="cursor: pointer">
                <div class="order-info">
                    <div>订单编号：<strong>#{{ order.id }}</strong></div>
                    <div>下单时间：{{ formatDate(order.createdAt) }}</div>
                    <el-tag :type="statusType(order.status)">{{ order.status }}</el-tag>
                </div>

                <div class="product-items">
                    <div v-for="item in order.products" :key="item.productId" class="product-item">
                        <img :src="productMap.get(item.productId)?.image || placeholder"
                            :alt="productMap.get(item.productId)?.title || '商品已下架'" class="product-img" />
                        <div class="product-info">
                            <div class="title">{{ productMap.get(item.productId)?.title || '商品已下架' }}</div>
                            <div class="meta">
                                <span class="price">¥{{ (productMap.get(item.productId)?.price || 0).toFixed(2)
                                    }}</span>
                                <span class="quantity">×{{ item.quantity }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="order-total">
                    合计：
                    ¥{{
                        order.products
                            .reduce((sum, item) => {
                                const p = productMap.get(item.productId)
                                return sum + (p?.price || 0) * item.quantity
                            }, 0)
                            .toFixed(2)
                    }}
                </div>

                <div class="order-actions">
                    <el-button v-if="order.status === '已取消' || order.status === '已完成'" type="danger"
                        @click.stop="deleteOrder(order.id)">
                        删除订单
                    </el-button>

                    <el-button v-if="order.status === 'pending'" @click.stop="cancelOrder(order.id)">
                        取消订单
                    </el-button>
                    <el-button v-if="order.status === 'pending'" type="primary" @click.stop="payOrder(order.id)">
                        去支付
                    </el-button>
                </div>
            </el-card>
        </div>

        <div v-else class="empty">
            <img src="https://img.alicdn.com/imgextra/i1/O1CN01JcgDC31R5xFwF4nvL_!!6000000002112-2-tps-360-360.png"
                alt="暂无订单" />
            <p>暂无订单</p>
        </div>
    </div>
</template>

<script setup>
import HeaderNav from '@/components/HeaderNav.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()
const orders = ref([])
const productMap = ref(new Map())
const placeholder = 'https://via.placeholder.com/60x60?text=N/A'

async function fetchOrders() {
    const userId = userStore.userInfo?.id
    if (!userId) return

    try {
        const [orderRes, productRes] = await Promise.all([
            axios.get(`http://localhost:3000/orders?userId=${userId}`),
            axios.get('http://localhost:3000/products'),
        ])
        orders.value = orderRes.data
        productMap.value = new Map(productRes.data.map((p) => [p.id, p]))
    } catch (error) {
        ElMessage.error('加载订单失败，请稍后重试')
    }
}

onMounted(() => {
    fetchOrders()
})

function formatDate(iso) {
    const d = new Date(iso)
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}

function goBack() {
    router.back()
}

function statusType(status) {
    switch (status) {
        case '已完成':
            return 'success'
        case 'pending':
            return 'warning'
        case '已取消':
            return 'danger'
        default:
            return ''
    }
}

async function deleteOrder(orderId) {
    try {
        await ElMessageBox.confirm('确认删除该订单？此操作不可恢复', '删除订单', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
        await axios.delete(`http://localhost:3000/orders/${orderId}`)
        await fetchOrders()
        ElMessage.success('订单删除成功')
    } catch {
        ElMessage.info('已取消操作或删除失败')
    }
}

async function cancelOrder(orderId) {
    try {
        await ElMessageBox.confirm('确认取消该订单？', '取消订单', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
        await axios.patch(`http://localhost:3000/orders/${orderId}`, { status: '已取消' })
        await fetchOrders()
        ElMessage.success('订单已取消')
    } catch {
        ElMessage.info('已取消操作或失败')
    }
}

async function payOrder(orderId) {
    try {
        await ElMessageBox.confirm('确认支付该订单？', '支付订单', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info',
        })

        // 先调用接口修改订单状态
        await axios.patch(`http://localhost:3000/orders/${orderId}`, { status: '已完成' })

        // 本地立即更新状态，页面马上显示已完成
        const order = orders.value.find(o => o.id === orderId)
        if (order) {
            order.status = '已完成'
        }

        // 获取当前订单中的商品id列表
        const productIds = order.products.map(p => p.productId)

        // 获取当前用户购物车所有商品
        const cartRes = await axios.get(`http://localhost:3000/cart?userId=${userStore.userInfo.id}`)
        const cartItems = cartRes.data

        // 清理购物车里与订单商品id匹配的商品
        for (const item of cartItems) {
            if (productIds.includes(item.productId)) {
                await axios.delete(`http://localhost:3000/carts/${item.id}`)
            }
        }

        // 你也可以选择重新拉一次订单数据，保证数据完全同步（可选）
        await fetchOrders()

        ElMessage.success('支付成功，订单已完成，购物车已清理')
    } catch {
        ElMessage.info('已取消支付或支付失败')
    }
}



function goToOrderDetail(orderId) {
    router.push(`/orders/${orderId}`)
}
</script>

<style scoped>
.orders-page {
    max-width: 960px;
    margin: 40px auto;
    padding: 32px 24px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    font-family: "Helvetica Neue", Arial, sans-serif;
    color: #333;
}

.header {
    display: flex;
    align-items: center;
    margin-bottom: 32px;
}

h2 {
    font-weight: 700;
    font-size: 28px;
    color: #222;
    margin-left: 12px;
}

.order-list {
    display: flex;
    flex-direction: column;
    gap: 28px;
}

.order-card {
    padding: 20px 24px 28px;
    background: #fafafa;
    border-radius: 14px;
    box-shadow: none;
}

.order-info {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    font-size: 14px;
    color: #666;
    margin-bottom: 18px;
    align-items: center;
    gap: 12px;
}

.product-items {
    border-top: 1px solid #ddd;
    padding-top: 16px;
    margin-bottom: 20px;
}

.product-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #ddd;
}

.product-item:last-child {
    border-bottom: none;
}

.product-img {
    width: 72px;
    height: 72px;
    border-radius: 8px;
    object-fit: cover;
    margin-right: 16px;
    background: #f5f5f5;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.title {
    font-size: 16px;
    font-weight: 600;
    color: #222;
    margin-bottom: 6px;
}

.meta {
    font-size: 14px;
    color: #999;
    display: flex;
    gap: 18px;
}

.price {
    color: #e60023;
    font-weight: 700;
    font-size: 15px;
}

.order-total {
    text-align: right;
    font-weight: 700;
    font-size: 18px;
    color: #222;
    margin-bottom: 18px;
}

.order-actions {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
}

.empty {
    text-align: center;
    margin-top: 120px;
    color: #aaa;
    font-size: 16px;
}

.empty img {
    width: 140px;
    margin-bottom: 18px;
}

/* 响应式 */
@media (max-width: 768px) {
    .orders-page {
        padding: 20px 16px;
    }

    .order-info {
        flex-direction: column;
        gap: 6px;
    }

    .order-actions {
        justify-content: center;
        flex-wrap: wrap;
        gap: 12px;
    }

    .product-img {
        width: 60px;
        height: 60px;
        margin-right: 12px;
    }

    .title {
        font-size: 14px;
    }
}
</style>