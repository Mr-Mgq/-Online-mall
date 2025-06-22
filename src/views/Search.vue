<template>
    <div class="search-page">
        <HeaderNav />

        <section class="search-result" role="region" aria-label="搜索结果">
            <!-- 返回按钮 -->
            <el-button type="text" @click="$router.back()" aria-label="返回上一页" class="back-button">
                <el-icon>
                    <ArrowLeft />
                </el-icon>
                返回上一页
            </el-button>

            <h2 class="title" tabindex="0">
                🔍 搜索结果：
                <span class="keyword">{{ keyword }}</span>
            </h2>

            <div class="status" v-loading="loading" aria-live="polite" aria-busy="true">
                <template v-if="error">
                    <el-alert type="error" :title="error" show-icon :closable="false" />
                </template>

                <template v-else>
                    <el-row :gutter="20" v-if="filteredProducts.length">
                        <el-col v-for="product in filteredProducts" :key="product.id" :xs="24" :sm="12" :md="8" :lg="6">
                            <ProductCard :product="product" />
                        </el-col>
                    </el-row>

                    <el-empty v-else description="没有找到相关商品" />
                </template>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import HeaderNav from '@/components/HeaderNav.vue'
import ProductCard from '@/components/ProductCard.vue'
import { ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const keyword = computed(() => (route.query.q || '').toLowerCase())

const allProducts = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
    try {
        const res = await axios.get('http://localhost:3000/products')
        allProducts.value = res.data
    } catch (e) {
        error.value = '加载失败，请稍后重试'
    } finally {
        loading.value = false
    }
})

const filteredProducts = computed(() =>
    allProducts.value.filter((p) =>
        p.title.toLowerCase().includes(keyword.value)
    )
)
</script>

<style scoped>
.search-page {
    background: #f9f9fb;
    min-height: 100vh;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.search-result {
    max-width: 1280px;
    margin: 0 auto;
    padding: 32px 24px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.back-button {
    font-size: 15px;
    color: #409eff;
    font-weight: 500;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 6px;
    user-select: none;
}

.back-button:hover {
    color: #66b1ff;
    text-decoration: underline;
}

.title {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 28px;
    line-height: 1.4;
    display: flex;
    align-items: center;
    gap: 8px;
}

.keyword {
    color: #409eff;
    font-weight: 700;
    font-size: 22px;
    margin-left: 6px;
    background-color: #ecf5ff;
    padding: 2px 8px;
    border-radius: 6px;
}

.status {
    text-align: center;
    padding: 40px 0;
    font-size: 16px;
    color: #909399;
}

.status.error {
    color: #f56c6c;
}

.el-empty {
    margin-top: 60px;
}

.el-row {
    row-gap: 24px;
}

@media (max-width: 768px) {
    .search-result {
        padding: 24px 16px;
    }

    .title {
        font-size: 20px;
    }

    .keyword {
        font-size: 18px;
    }
}
</style>
