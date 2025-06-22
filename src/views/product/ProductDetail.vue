<template>
    <div>
        <HeaderNav />
    </div>

    <div v-if="product" class="product-detail">
        <el-button type="default" icon="el-icon-arrow-left" @click="goHome" class="back-btn">
            返回首页
        </el-button>

        <el-row class="detail-container" :gutter="24" wrap>
            <!-- 左侧图片区 -->
            <el-col :xs="24" :sm="24" :md="10" class="image-section">
                <el-image :src="selectedImage" fit="contain" class="main-image" lazy
                    preview-src-list="product.images" />
                <div class="thumbnail-list">
                    <el-image v-for="(img, idx) in product.images" :key="idx" :src="img" fit="cover" class="thumbnail"
                        :class="{ active: img === selectedImage }" @click="selectedImage = img" lazy
                        preview-src-list="product.images" />
                </div>
            </el-col>

            <!-- 右侧信息区 -->
            <el-col :xs="24" :sm="24" :md="14" class="info-section">
                <h1 class="title">{{ product.title }}</h1>

                <div class="price-area">
                    <span class="current-price">￥{{ product.price.toFixed(2) }}</span>
                    <span v-if="product.originalPrice && product.originalPrice > product.price" class="original-price">
                        ￥{{ product.originalPrice.toFixed(2) }}
                    </span>
                    <el-tag v-if="product.discount" type="danger" class="discount-tag">
                        {{ product.discount }}折
                    </el-tag>
                </div>

                <div class="rating-area" v-if="product.rating">
                    <el-rate v-model="product.rating" :disabled="true" :allow-half="true" show-score="false" max="5"
                        class="stars" />
                    <span class="rating-count">{{ product.ratingCount }} 评价</span>
                </div>

                <div class="promotion-area" v-if="product.promotion">
                    <el-alert :title="product.promotion" type="warning" show-icon class="promotion-text"
                        :closable="false" />
                </div>

                <!-- 数量选择 -->
                <div class="quantity-selector">
                    <label for="quantity-input">数量：</label>
                    <el-input-number id="quantity-input" v-model="quantity" :min="1" :max="product.stock || 99"
                        size="medium" />
                    <span v-if="product.stock !== undefined" class="stock-info">库存：{{ product.stock }}</span>
                </div>

                <!-- 操作按钮 -->
                <div class="action-buttons">
                    <el-button type="danger" icon="el-icon-shopping-cart-full" :loading="addingToCart"
                        @click="addToCart" :disabled="addingToCart">
                        加入购物车
                    </el-button>
                    <el-button type="warning" @click="goToCart">前往购物车</el-button>
                </div>

                <!-- 服务保障 -->
                <div class="service-guarantee">
                    <p><i class="el-icon-s-check"></i> 正品保障</p>
                    <p><i class="el-icon-truck"></i> 极速配送</p>
                    <p><i class="el-icon-phone-outline"></i> 7天无理由退货</p>
                </div>

                <!-- 商品描述 -->
                <section class="description" v-if="product.description">
                    <h2>商品描述</h2>
                    <p>{{ product.description }}</p>
                </section>
            </el-col>
        </el-row>
    </div>

    <div v-else class="loading">
        <p>加载中...</p>
    </div>
</template>

<script setup>
import HeaderNav from '@/components/HeaderNav.vue'

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'

import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()

const product = ref(null)
const quantity = ref(1)
const selectedImage = ref('')
const addingToCart = ref(false)

onMounted(async () => {
    try {
        const id = route.params.id
        const res = await axios.get(`http://localhost:3000/products/${id}`)
        product.value = res.data
        if (product.value.images && product.value.images.length) {
            selectedImage.value = product.value.images[0]
        } else {
            selectedImage.value = product.value.image || ''
        }
    } catch (error) {
        console.error('请求商品详情失败', error)
    }
})

function increment() {
    if (product.value.stock && quantity.value >= product.value.stock) return
    quantity.value++
}
function decrement() {
    if (quantity.value > 1) quantity.value--
}

async function addToCart() {
    if (!userStore.userInfo) {
        ElMessage.warning('请先登录后再添加购物车')
        router.push('/login')
        return
    }
    addingToCart.value = true
    try {
        await cartStore.addItem({ ...product.value, quantity: quantity.value })
        ElMessage.success(`成功添加 ${product.value.title} × ${quantity.value} 到购物车！`)
    } catch (error) {
        console.error('添加购物车失败', error)
        ElMessage.error('添加购物车失败，请稍后再试')
    } finally {
        addingToCart.value = false
    }
}

//前往购物车
function goToCart() {
    router.push('/cart')
}

function goHome() {
    router.push('/')
}
</script>

<style scoped>
.product-detail {
    max-width: 1200px;
    margin: 3rem auto;
    padding: 0 1rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
        Arial, sans-serif;
    color: #333;
}

.back-btn {
    margin-bottom: 2rem;
}

.detail-container {
    background: white;
    border-radius: 10px;
    padding: 2rem;
    box-shadow: 0 6px 15px rgb(0 0 0 / 0.1);
}

/* 图片区 */
.image-section {
    max-width: 480px;
    margin-bottom: 2rem;
}

.main-image {
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #fafafa;
    border-radius: 12px;
    box-shadow: inset 0 0 10px #eee;
    border: 1px solid #ddd;
    cursor: pointer;
}

.thumbnail-list {
    margin-top: 1rem;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.thumbnail {
    width: 60px;
    height: 60px;
    border-radius: 6px;
    border: 2px solid transparent;
    cursor: pointer;
    transition: border-color 0.3s;
    object-fit: cover;
}

.thumbnail.active,
.thumbnail:hover {
    border-color: #ff4400;
}

/* 右侧信息 */
.info-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.title {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    color: #222;
}

.price-area {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    font-weight: 700;
    font-size: 2rem;
    color: #e60012;
}

.original-price {
    font-size: 1.2rem;
    color: #999;
    text-decoration: line-through;
}

.discount-tag {
    user-select: none;
}

.rating-area {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #ff9900;
}

.stars {
    font-size: 1.1rem;
}

.rating-count {
    font-size: 0.9rem;
    color: #666;
}

.promotion-area {
    font-size: 1rem;
}

.quantity-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
}

.quantity-selector label {
    font-weight: 600;
    width: 60px;
}

.stock-info {
    color: #999;
    font-size: 0.85rem;
    margin-left: 1rem;
    user-select: none;
}

/* 操作按钮 */
.action-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1rem;
}

.service-guarantee {
    margin-top: 1.5rem;
    display: flex;
    gap: 1.5rem;
    color: #666;
    font-size: 0.9rem;
}

.service-guarantee p {
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

.service-guarantee i {
    color: #ff4400;
    font-size: 1.2rem;
}

/* 商品描述 */
.description {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
    color: #444;
    line-height: 1.6;
}

.description h2 {
    font-weight: 700;
    margin-bottom: 0.6rem;
    font-size: 1.3rem;
}

/* 加载状态 */
.loading {
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    color: #999;
}

/* 响应式 */
@media (max-width: 768px) {
    .detail-container {
        flex-direction: column;
    }

    .image-section,
    .info-section {
        max-width: 100%;
        flex: none;
    }

    .title {
        font-size: 1.5rem;
    }

    .price-area {
        font-size: 1.5rem;
    }

    .action-buttons {
        flex-direction: column;
    }
}
</style>