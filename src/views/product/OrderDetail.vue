<template>
    <div>
        <HeaderNav />

        <el-card v-if="order" class="order-detail-page" shadow="hover">
            <!-- 返回与标题 -->
            <div class="page-header"
                style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
                <el-button type="text" icon="el-icon-arrow-left" @click="router.back()">返回订单列表</el-button>
                <h2 style="margin: 0;">订单详情</h2>
                <div style="width: 100px;"></div> <!-- 占位，保持居中 -->
            </div>

            <!-- 订单基础信息卡片 -->
            <el-card class="base-info" shadow="never" style="margin-bottom: 20px;">
                <el-descriptions column="1" border>
                    <el-descriptions-item label="订单编号">{{ order.id }}</el-descriptions-item>
                    <el-descriptions-item label="下单时间">{{ formatDate(order.createdAt) }}</el-descriptions-item>
                    <el-descriptions-item label="订单状态">
                        <el-tag :type="statusType(order.status)" disable-transitions>{{ order.status }}</el-tag>
                    </el-descriptions-item>
                </el-descriptions>
            </el-card>

            <!-- 商品列表卡片 -->
            <el-card class="product-list" shadow="never" style="margin-bottom: 20px;">
                <h3 style="margin-bottom: 16px;">商品清单</h3>
                <el-table :data="order.products" border style="width: 100%" :row-key="row => row.productId"
                    size="small">
                    <el-table-column label="商品" width="300">
                        <template #default="{ row }">
                            <el-image :src="productMap.get(row.productId)?.image || placeholder" fit="cover"
                                style="width: 80px; height: 80px; border-radius: 6px;" lazy />
                            <span style="margin-left: 12px;">
                                {{ productMap.get(row.productId)?.title || '商品已下架' }}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column label="单价" width="280" align="right">
                        <template #default="{ row }">
                            ¥{{ (productMap.get(row.productId)?.price || 0).toFixed(2) }}
                        </template>
                    </el-table-column>

                    <el-table-column label="数量" width="300" align="center">
                        <template #default="{ row }">
                            {{ row.quantity }}
                        </template>
                    </el-table-column>

                    <el-table-column label="小计" width="240" align="right">
                        <template #default="{ row }">
                            ¥{{ ((productMap.get(row.productId)?.price || 0) * row.quantity).toFixed(2) }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

            <!-- 订单金额卡片 -->
            <el-card class="total-section" shadow="never" style="text-align: right;">
                <div style="margin-bottom: 8px;">
                    <span>商品总价：</span>
                    <strong>¥{{ totalAmount.toFixed(2) }}</strong>
                </div>
                <div style="margin-bottom: 12px;">
                    <span>运费：</span>
                    <strong>¥0.00</strong>
                </div>
                <div style="font-size: 18px; font-weight: bold;">
                    <span>应付总额：</span>
                    <strong>¥{{ totalAmount.toFixed(2) }}</strong>
                </div>
            </el-card>
        </el-card>

        <el-empty v-else description="未找到订单信息" style="margin-top: 60px;" />
    </div>
</template>

<script setup>
import HeaderNav from '@/components/HeaderNav.vue'
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const order = ref(null)
const productMap = ref(new Map())
const placeholder = 'https://via.placeholder.com/80?text=N/A'

function formatDate(iso) {
    const d = new Date(iso)
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}

const totalAmount = computed(() => {
    if (!order.value) return 0
    return order.value.products.reduce((sum, item) => {
        const p = productMap.value.get(item.productId)
        return sum + (p?.price || 0) * item.quantity
    }, 0)
})

function statusType(status) {
    switch (status) {
        case '已完成':
            return 'success'
        case 'pending':
            return 'warning'
        case '已取消':
            return 'danger'
        default:
            return 'info'
    }
}

onMounted(async () => {
    const orderId = route.params.id
    try {
        const [orderRes, productRes] = await Promise.all([
            axios.get(`http://localhost:3000/orders/${orderId}`),
            axios.get(`http://localhost:3000/products`),
        ])
        order.value = orderRes.data
        productMap.value = new Map(productRes.data.map((p) => [p.id, p]))
    } catch (e) {
        // Element Plus 弹框替代 alert
        import('element-plus').then(({ ElMessage }) => {
            ElMessage.error('加载订单详情失败，请稍后重试')
        })
    }
})
</script>

<style scoped>
.order-detail-page {
    max-width: 1200px;
    margin: 40px auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f6f6f6;
}

.page-header h2 {
    color: #303133;
}
</style>
