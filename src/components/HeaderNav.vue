<template>
    <header class="header" :class="{ shrink: isScrolled }" role="banner" aria-label="网站主导航">
        <div class="container">
            <!-- 左侧LOGO + 主导航 -->
            <div class="header-left">
                <img src="/logo.png" alt="VueMall Logo" class="header-logo" />
                <RouterLink to="/" class="logo" aria-label="返回首页">NovaMart</RouterLink>
                <nav class="main-nav" aria-label="主导航菜单">
                    <RouterLink to="/" class="nav-item" exact>首页</RouterLink>
                    <!-- <RouterLink to="/categories" class="nav-item">全部分类</RouterLink>
                    <RouterLink to="/promotions" class="nav-item">促销</RouterLink>
                    <RouterLink to="/new" class="nav-item">新品</RouterLink>
                    <RouterLink to="/productBrands" class="nav-item">品牌</RouterLink> -->
                </nav>
            </div>

            <!-- 中间搜索 -->
            <div class="header-center">
                <div class="search-bar" role="search">
                    <input type="search" v-model="searchQuery" placeholder="搜索商品、品牌、类目" aria-label="搜索商品"
                        @keyup.enter="search" />
                    <button class="search-btn" @click="search" aria-label="搜索按钮">
                        <i class="fa fa-search"></i>
                    </button>
                </div>
            </div>

            <!-- 右侧菜单 -->
            <nav class="header-right" aria-label="用户操作菜单">
                <RouterLink to="/cart" class="nav-icon cart-link" :aria-label="`购物车，共 ${cartCount} 件商品`" tabindex="0">
                    <i class="fa fa-shopping-cart"></i>
                    <span class="label">购物车</span>
                    <span v-if="cartCount > 0" class="cart-count" aria-live="polite">{{ cartCount }}</span>
                </RouterLink>

                <RouterLink v-if="user" to="/orders" class="nav-icon" aria-label="我的订单" tabindex="0">
                    <i class="fa fa-list-alt"></i>
                    <span class="label">我的订单</span>
                </RouterLink>


                <template v-if="user">
                    <div class="user-info" tabindex="0" aria-label="用户信息" @click="goToProfile" style="cursor:pointer;">
                        <img :src="user.avatar" alt="用户头像" class="user-avatar" />
                        <span class="username">你好，{{ user.username }}</span>
                    </div>
                    <button @click="logout" class="logout-btn" aria-label="退出登录">退出</button>
                </template>


                <template v-else>
                    <RouterLink to="/login" class="nav-link" tabindex="0">登录</RouterLink>
                    <RouterLink to="/register" class="nav-link" tabindex="0">注册</RouterLink>
                </template>
            </nav>
        </div>
    </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()

const user = computed(() => userStore.userInfo)
const cartCount = computed(() => cartStore.totalQuantity)

const logout = () => {
    userStore.logout()
    router.push('/')
}

const searchQuery = ref('')
const search = () => {
    if (searchQuery.value.trim()) {
        router.push({ path: '/search', query: { q: searchQuery.value.trim() } })
    }
}

const isScrolled = ref(false)
const onScroll = () => {
    isScrolled.value = window.scrollY > 20
}

onMounted(() => {
    window.addEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
})

const goToProfile = () => {
    router.push('/profile')
}
</script>

<style scoped>
/* 整体头部 */
.header {
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 10000;
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
    transition: padding 0.3s ease, box-shadow 0.3s ease;
    padding: 1.25rem 0;
    border-bottom: 1px solid #ddd;
}

.header.shrink {
    padding: 0.75rem 0;
    box-shadow: 0 1px 6px rgb(0 0 0 / 0.12);
}

/* 容器布局 */
.container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    user-select: none;
}

/* 左侧部分：LOGO+主导航 */
.header-left {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-shrink: 0;
}
.header-logo{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.logo {
    font-size: 2.6rem;
    font-weight: 900;
    color: #e4393c;
    /* 京东红 */
    text-decoration: none;
    letter-spacing: 2.5px;
    cursor: pointer;
    user-select: none;
    flex-shrink: 0;
}

.main-nav {
    display: flex;
    gap: 1.5rem;
}

.nav-item {
    color: #444;
    font-weight: 600;
    font-size: 1.1rem;
    text-decoration: none;
    padding: 0.5rem 0;
    border-bottom: 3px solid transparent;
    transition: border-color 0.3s ease, color 0.3s ease;
}

.nav-item:hover,
.nav-item.router-link-exact-active {
    color: #e4393c;
    border-color: #e4393c;
}

/* 中间搜索框 */
.header-center {
    flex: 1;
    display: flex;
    justify-content: center;
}

.search-bar {
    width: 100%;
    max-width: 680px;
    display: flex;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 4px 14px rgb(228 228 228);
    border: 1.5px solid #ddd;
    background-color: #fff;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-bar:focus-within {
    border-color: #e4393c;
    box-shadow: 0 6px 20px rgb(228 57 59 / 0.5);
}

.search-bar input {
    flex: 1;
    font-size: 1.2rem;
    border: none;
    outline: none;
    padding: 0.8rem 1.5rem;
    font-weight: 500;
    color: #333;
}

.search-bar input::placeholder {
    color: #bbb;
}

.search-btn {
    background-color: #e4393c;
    border: none;
    padding: 0 1.8rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
}

.search-btn:hover {
    background-color: #b02a2d;
}

.search-btn i {
    color: #fff;
    font-size: 1.4rem;
}

/* 右侧菜单 */
.header-right {
    display: flex;
    align-items: center;
    gap: 1.8rem;
    font-size: 1rem;
    white-space: nowrap;
}

.nav-icon {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: #555;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    padding: 0.3rem 0.5rem;
    border-radius: 6px;
    transition: background-color 0.25s ease, color 0.25s ease;
    user-select: none;
}

.nav-icon i {
    font-size: 1.4rem;
    line-height: 1;
}

.nav-icon:hover {
    color: #e4393c;
    background-color: #fff0f0;
    text-decoration: none;
}

.cart-link {
    position: relative;
    font-weight: 700;
    font-size: 1.15rem;
}

.cart-count {
    position: absolute;
    top: -6px;
    right: -12px;
    background: #e4393c;
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: 50%;
    padding: 3px 7px;
    line-height: 1;
    box-shadow: 0 0 6px rgb(228 57 59 / 0.9);
    user-select: none;
}

.label {
    user-select: none;
}

/* 用户信息区域 */
.user-info {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 700;
    color: #444;
    cursor: default;
}

.user-info i {
    font-size: 1.6rem;
    color: #e4393c;
}

.username {
    user-select: text;
}

/* 头像 */
.user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 0.4rem;
    border: 1.5px solid #e4393c;
}

/* 退出按钮 */
.logout-btn {
    background: transparent;
    border: 1.5px solid #ccc;
    padding: 0.3rem 1rem;
    cursor: pointer;
    border-radius: 6px;
    font-weight: 600;
    color: #555;
    transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}

.logout-btn:hover {
    background-color: #e4393c;
    color: white;
    border-color: #e4393c;
}

/* 响应式调整 */
@media (max-width: 1024px) {
    .container {
        padding: 0 1rem;
    }

    .header-left {
        gap: 1rem;
    }

    .main-nav {
        display: none;
        /* 大屏以下隐藏主导航，改用侧边或汉堡菜单，需额外实现 */
    }

    .header-center {
        max-width: 100%;
    }
}

@media (max-width: 576px) {
    .container {
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    .header-left {
        width: 100%;
        justify-content: center;
    }

    .logo {
        font-size: 2rem;
    }

    .header-center {
        order: 3;
        width: 100%;
    }

    .search-bar {
        max-width: 100%;
        border-radius: 12px;
    }

    .header-right {
        order: 2;
        width: 100%;
        justify-content: center;
        gap: 1rem;
    }
}
</style>