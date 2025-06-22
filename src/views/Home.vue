<template>
    <div class="page-container">
        <HeaderNav />

        <section class="banner">
            <div class="banner-overlay"></div>
            <div class="banner-content">
                <h1>
                    欢迎来到 <span>NovaMart（新星商城）</span>
                </h1>
                <p>探索高品质商品，享受极致购物体验</p>
            </div>
        </section>

        <section class="products-section">
            <div class="products-header">
                <h2>🛍️ 商品列表</h2>
                <el-input v-model="searchKeyword" placeholder="搜索商品名称" clearable prefix-icon="el-icon-search"
                    class="search-input" @clear="onSearchClear" />
            </div>

            <el-space wrap class="categories" size="medium">
                <el-button v-for="cat in categories" :key="cat" :type="cat === selectedCategory ? 'primary' : 'default'"
                    @click="onCategorySelect(cat)" plain size="medium">
                    {{ cat }}
                </el-button>
            </el-space>

            <div class="status-wrapper" v-if="loading">
                <el-spinner class="spinner" />
                <p>加载中...</p>
            </div>

            <el-alert v-else-if="error" :title="error" type="error" show-icon center />

            <el-row v-else :gutter="24" justify="start" class="products-grid">
                <el-col v-for="item in paginatedProducts" :key="item.id" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                    <ProductCard :product="item" />
                </el-col>
            </el-row>

            <div class="pagination-wrapper" v-if="filteredProducts.length > pageSize">
                <el-pagination background layout="prev, pager, next" :total="filteredProducts.length"
                    :page-size="pageSize" :current-page="currentPage" @current-change="val => currentPage = val" />
            </div>



            <el-empty v-if="!loading && filteredProducts.length === 0" description="没有找到相关商品" />
        </section>

        <Footer />
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import HeaderNav from '@/components/HeaderNav.vue'
import Footer from '@/components/Footer.vue'
import ProductCard from '@/components/ProductCard.vue'

const allProducts = ref([])
const selectedCategory = ref('全部')
const searchKeyword = ref('')
const loading = ref(true)
const error = ref('')
const currentPage = ref(1)
const pageSize = 12

onMounted(async () => {
    try {
        const res = await axios.get('http://localhost:3000/products')
        allProducts.value = res.data
    } catch (err) {
        console.error('获取商品失败', err)
        error.value = '商品加载失败，请稍后重试'
    } finally {
        loading.value = false
    }
})

const categories = computed(() => {
    const set = new Set(allProducts.value.map(p => p.category))
    return ['全部', ...set]
})

const filteredProducts = computed(() => {
    return allProducts.value.filter(p => {
        const matchCategory = selectedCategory.value === '全部' || p.category === selectedCategory.value
        const matchKeyword = p.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
        return matchCategory && matchKeyword
    })
})

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize
    return filteredProducts.value.slice(start, end)
})

function onCategorySelect(cat) {
    selectedCategory.value = cat
    currentPage.value = 1
}

function onSearchClear() {
    selectedCategory.value = '全部'
    currentPage.value = 1
}

watch(searchKeyword, () => {
    currentPage.value = 1
})
</script>


<style scoped>
.page-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #fafafa;
    color: #34495e;
    max-width: 1600px;
    margin: 0 auto;
    padding-bottom: 48px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Banner */
.banner {
    position: relative;
    height: 380px;
    background: linear-gradient(to bottom,
            rgba(20, 30, 48, 0.75),
            rgba(20, 30, 48, 0.45)),
        url('https://images.pexels.com/photos/5632395/pexels-photo-5632395.jpeg') center/cover no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #f0f3f7;
    border-radius: 20px;
    overflow: hidden;
    margin: 2.5rem 0 3.5rem;
    box-shadow: 0 12px 36px rgba(20, 30, 48, 0.4);
}

.banner-overlay {
    display: none;
    /* 由渐变替代 */
}

.banner-content {
    position: relative;
    z-index: 1;
    max-width: 900px;
    padding: 0 1.25rem;
}

.banner-content h1 {
    font-size: 3.4rem;
    font-weight: 900;
    margin-bottom: 0.6rem;
    letter-spacing: 0.06em;
    text-shadow: 0 3px 12px rgba(20, 30, 48, 0.7);
    user-select: none;
}

.banner-content h1 span {
    color: #ffd600;
    text-shadow: 0 3px 12px rgba(255, 214, 0, 0.95);
}

.banner-content p {
    font-size: 1.5rem;
    font-weight: 400;
    opacity: 0.9;
    text-shadow: 0 2px 8px rgba(20, 30, 48, 0.7);
    user-select: none;
}

/* Products Section */
.products-section {
    padding: 0 1.5rem;
}

.products-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1.2rem;
}

.products-header h2 {
    font-size: 2.1rem;
    font-weight: 800;
    color: #1a2634;
    user-select: none;
    flex-shrink: 0;
    letter-spacing: 0.02em;
}

.search-input {
    max-width: 360px;
    width: 100%;
}

.el-input__inner {
    border-radius: 14px;
    height: 44px;
    font-size: 1rem;
    color: #2c3e50;
    background-color: #fff;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.07);
    transition: box-shadow 0.3s ease;
}

.el-input__inner:hover,
.el-input__inner:focus {
    box-shadow: 0 4px 12px rgba(30, 144, 255, 0.35);
}

/* Categories */
.categories {
    margin-bottom: 2.5rem;
    user-select: none;
}

.el-button {
    border-radius: 24px;
    font-weight: 600;
    padding: 0 18px;
    min-width: 90px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    color: #34495e;
    border: 1.8px solid transparent;
}

.el-button--default:hover {
    background-color: #dbe9ff;
    color: #1e90ff;
    border-color: #1e90ff;
}

.el-button--primary {
    background-color: #1e90ff;
    color: white;
    box-shadow: 0 6px 16px rgba(30, 144, 255, 0.45);
}

.el-button--primary:hover,
.el-button--primary:focus {
    background-color: #007acc;
    box-shadow: 0 8px 22px rgba(0, 122, 204, 0.6);
    outline: none;
}

/* Status */
.status-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #7f8c9a;
    font-size: 1.3rem;
    gap: 1rem;
    margin: 3.5rem 0;
}

.spinner {
    font-size: 3.4rem;
    color: #1e90ff;
    animation: spin 1.4s linear infinite;
}

/* 旋转动画 */
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Products Grid */
.products-grid {
    margin-top: 0;
    user-select: none;
}

/* 响应式 */
@media (max-width: 480px) {
    .products-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .search-input {
        max-width: 100%;
    }
}

.pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 32px;
}

::v-deep(.el-pagination.is-background) {
    --el-color-primary: #1e90ff;
    --el-color-primary-light-9: #f0f8ff;
}

::v-deep(.el-pagination .el-pager li) {
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
}

::v-deep(.el-pagination .el-pager li:hover) {
    background-color: #e6f2ff;
    color: #1e90ff;
}

::v-deep(.el-pagination .el-pager li.is-active) {
    background-color: #1e90ff;
    color: white;
    box-shadow: 0 4px 10px rgba(30, 144, 255, 0.3);
}
</style>