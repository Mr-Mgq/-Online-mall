<template>
    <router-link :to="`/product/${product.id}`" class="product-card-link" aria-label="查看商品详情">
        <el-card shadow="hover" class="product-card" tabindex="0" role="group">
            <div class="image-wrapper" aria-hidden="true">
                <img :src="product.image" :alt="product.title" />
            </div>

            <div class="content">
                <h3 class="title" :title="product.title">{{ product.title }}</h3>
                <p class="price">￥{{ product.price.toFixed(2) }}</p>
                <p class="type" v-if="product.category" title="商品类别">
                    类型：<span>{{ product.category }}</span>
                </p>
                <p class="desc" v-if="product.description" title="商品描述">{{ product.description }}</p>
            </div>
        </el-card>
    </router-link>
</template>

<script setup>
defineProps({
    product: Object,
})
</script>

<style scoped>
.product-card-link {
    text-decoration: none;
    color: inherit;
    display: block;
}

.product-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    cursor: pointer;
    border-radius: 16px;
    overflow: hidden;
    transition: transform 0.3s ease;
}

.product-card:hover,
.product-card:focus-within {
    transform: translateY(-6px);
    box-shadow: 0 10px 20px rgba(30, 144, 255, 0.25);
}

.image-wrapper {
    width: 100%;
    height: 180px;
    overflow: hidden;
    border-radius: 12px 12px 0 0;
    background-color: #f5f7fa;
}

.image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.product-card:hover .image-wrapper img,
.product-card:focus-within .image-wrapper img {
    transform: scale(1.05);
}

.content {
    padding: 1rem 1.2rem 1.4rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.title {
    font-weight: 700;
    font-size: 1.1rem;
    color: #2c3e50;
    line-height: 1.3;
    overflow-wrap: break-word;
    margin: 0;
    flex-shrink: 0;
}

.price {
    font-weight: 700;
    font-size: 1.25rem;
    color: #e94b3c;
    margin: 0;
    flex-shrink: 0;
}

.type {
    font-size: 0.9rem;
    color: #666666;
    font-weight: 600;
    flex-shrink: 0;
}

.type span {
    font-weight: 400;
    color: #999999;
}

.desc {
    font-size: 0.85rem;
    color: #555555;
    line-height: 1.4;
    margin-top: 0.5rem;
    flex-grow: 1;
    overflow: hidden;
    /* display: -webkit-box;
    -webkit-line-clamp: 3; */
    -webkit-box-orient: vertical;
}
</style>