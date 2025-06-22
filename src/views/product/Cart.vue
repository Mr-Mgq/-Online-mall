<template>
    <div>
        <HeaderNav />

        <el-card v-if="!loading" class="cart-page" shadow="hover">
            <div class="cart-header" style="display: flex; align-items: center; margin-bottom: 24px;">
                <el-button type="text" icon="el-icon-arrow-left" @click="$router.back()">返回上一页</el-button>
                <h2 style="flex: 1; text-align: center; margin: 0;">购物车</h2>
                <el-button type="text" icon="el-icon-refresh" @click="refreshCart">刷新购物车</el-button>
            </div>

            <el-table v-if="cartItems.length" :data="cartItems" style="width: 100%"
                @selection-change="handleSelectionChange" :row-key="row => row.productId" ref="cartTable"
                :highlight-current-row="false">
                <el-table-column type="selection" width="55" />

                <el-table-column label="商品" width="300">
                    <template #default="{ row }">
                        <el-image style="width: 80px; height: 60px; border-radius: 6px" :src="row.product.image"
                            fit="cover" alt="商品图片" />
                        <span style="margin-left: 12px">{{ row.product.title }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="价格" width="300">
                    <template #default="{ row }">￥{{ row.product.price.toFixed(2) }}</template>
                </el-table-column>

                <el-table-column label="数量" width="200">
                    <template #default="{ row }">
                        <el-input-number v-model="row.quantity" :min="1"
                            @change="val => changeQuantity(row.productId, val)" size="small" />
                    </template>
                </el-table-column>

                <el-table-column label="小计" width="200">
                    <template #default="{ row }">￥{{ (row.product.price * row.quantity).toFixed(2) }}</template>
                </el-table-column>

                <el-table-column label="操作" width="180">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="handleSinglePay(row)">支付</el-button>
                        <el-button type="danger" size="small" @click="removeItem(row.productId)">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div v-else class="empty-cart" style="text-align: center; margin-top: 50px;">
                <el-empty description="购物车空空如也，快去挑选心仪的商品吧！" />
            </div>

            <div v-if="cartItems.length" class="cart-footer"
                style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    已选商品 <strong>{{ selectedTotalQuantity }}</strong> 件&nbsp;&nbsp;合计（不含运费）：
                    <strong>￥{{ selectedTotalPrice.toFixed(2) }}</strong>
                </div>
                <el-button type="success" @click="handlePay">结算</el-button>
            </div>
        </el-card>

        <div v-else class="loading" style="text-align: center; margin-top: 100px;">
            <el-loading text="加载中..." />
        </div>
    </div>
</template>

<script setup>
import HeaderNav from '@/components/HeaderNav.vue'
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const API_URL = 'http://localhost:3000/carts'
const ORDER_URL = 'http://localhost:3000/orders'

const cartStore = useCartStore()
const userStore = useUserStore()
const loading = ref(true)
const router = useRouter()

const cartItems = ref([])

// 这里初始化为空数组，不默认选中任何商品
const selectedIds = ref([])
const selectedRows = ref([])

onMounted(async () => {
    await loadCart()
    loading.value = false
})

async function loadCart() {
    try {
        if (!userStore.userInfo) {
            cartItems.value = []
            selectedIds.value = []
            selectedRows.value = []
            return
        }
        await cartStore.loadCart()
        cartItems.value = cartStore.items

        // 不自动选中，保持selectedIds和selectedRows为空
        selectedIds.value = []
        selectedRows.value = []
    } catch (error) {
        console.error('加载购物车失败', error)
    }
}

function handleSelectionChange(val) {
    selectedRows.value = val
    selectedIds.value = val.map((item) => item.productId)
}

const selectedItems = computed(() =>
    cartItems.value.filter((item) => selectedIds.value.includes(item.productId))
)
const selectedTotalQuantity = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + item.quantity, 0)
)
const selectedTotalPrice = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
)

async function changeQuantity(productId, newQuantity) {
    const item = cartItems.value.find((i) => i.productId === productId)
    if (!item || newQuantity < 1) return

    try {
        await axios.patch(`${API_URL}/${item.id}`, { quantity: newQuantity })
        await loadCart()
    } catch (error) {
        ElMessage.error('更新数量失败，请稍后重试')
        console.error(error)
    }
}

async function removeItem(productId) {
    try {
        const item = cartItems.value.find((i) => i.productId === productId)
        if (!item) return

        await axios.delete(`${API_URL}/${item.id}`)
        selectedIds.value = selectedIds.value.filter((id) => id !== productId)
        await loadCart()
    } catch (error) {
        ElMessage.error('移除失败，请稍后重试')
        console.error(error)
    }
}

function handleSinglePay(item) {
    ElMessage.info(
        `单独支付商品: ${item.product.title}，需支付：￥${(item.product.price * item.quantity).toFixed(2)}`
    )
}

async function handlePay() {
    if (!userStore.userInfo || selectedIds.value.length === 0) {
        ElMessage.warning('请选择要结算的商品')
        return
    }

    const selectedProducts = selectedItems.value.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
    }))

    const newOrder = {
        userId: userStore.userInfo.id,
        products: selectedProducts,
        createdAt: new Date().toISOString(),
        status: 'pending',
    }

    try {
        await axios.post(ORDER_URL, newOrder)

        await Promise.all(selectedItems.value.map((item) => axios.delete(`${API_URL}/${item.id}`)))

        selectedIds.value = []
        selectedRows.value = []
        await loadCart()
        router.push('/orders')
    } catch (error) {
        console.error('结算失败：', error)
        ElMessage.error('结算失败，请稍后重试')
    }
}

async function refreshCart() {
    try {
        loading.value = true
        await loadCart()
    } catch (e) {
        console.error('刷新失败', e)
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.cart-page {
    max-width: 1400px;
    margin: 0 auto;
    padding: 16px 40px 90px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: #f5f5f5;
    color: #333;
    min-height: 100vh;
    box-sizing: border-box;
}

.cart-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
}

.empty-cart {
    text-align: center;
    margin-top: 50px;
    font-size: 18px;
    color: #999;
}

.cart-footer {
    font-size: 16px;
    color: #333;
    font-weight: 600;
}
</style>