<template>
    <div class="auth-wrapper" role="main" aria-label="用户登录">
        <div class="auth-container">
            <div class="left-side" aria-hidden="true">
                <img src="https://images.pexels.com/photos/5632395/pexels-photo-5632395.jpeg" alt="VueMall Logo"
                    loading="lazy" />
            </div>

            <div class="right-side form-container">
                <h2 class="title">
                    <i class="el-icon-user"></i> 用户登录
                </h2>

                <el-form ref="loginForm" :model="form" :rules="rules" @submit.prevent.native="handleLogin"
                    label-position="top" status-icon aria-describedby="error-msg">
                    <el-form-item prop="username">
                        <el-input v-model="form.username" placeholder="请输入用户名" autocomplete="username" clearable
                            autofocus aria-required="true" aria-label="用户名" />
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input v-model="form.password" type="password" placeholder="请输入密码"
                            autocomplete="current-password" show-password clearable aria-required="true"
                            aria-label="密码" />
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" native-type="submit" aria-label="登录" :loading="loading"
                            style="width: 100%;">
                            登录
                        </el-button>
                    </el-form-item>

                    <p v-if="error" id="error-msg" class="error-msg" role="alert" aria-live="assertive">
                        {{ error }}
                    </p>
                </el-form>

                <p class="tip">
                    还没有账户？
                    <router-link to="/register" class="link">注册</router-link>
                </p>

                <p class="back">
                    <router-link to="/" class="link">← 返回首页</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { login } from "@/api/auth";
import { useUserStore } from "@/stores/user";
import { useCartStore } from "@/stores/cart";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const cartStore = useCartStore();

const form = reactive({
    username: "",
    password: "",
});

const loading = ref(false);
const error = ref("");

const rules = {
    username: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        { min: 3, message: "用户名至少3个字符", trigger: "blur" },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, message: "密码至少6个字符", trigger: "blur" },
    ],
};

async function handleLogin() {
    error.value = "";
    loading.value = true;
    try {
        const users = await login(form.username, form.password);
        if (users.length > 0) {
            userStore.login(users[0]);
            await cartStore.loadCart();
            alert("登录成功！");
            const redirectPath = route.query.redirect || "/";
            router.push(redirectPath);
        } else {
            error.value = "用户名或密码错误";
        }
    } catch (err) {
        error.value = "网络错误，请稍后再试";
        console.error(err);
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.auth-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
    background: #f5f7fa;
    padding: 3rem 1rem;
    user-select: none;
}

.auth-container {
    display: flex;
    width: 1280px;
    max-width: 100%;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 14px 40px rgba(10, 25, 47, 0.15);
    overflow: hidden;
    gap: 0;
}

.left-side {
    flex: 3;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #0a1a2f 0%, #142850 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3rem;
}

.left-side img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0 16px 16px 0;
    box-shadow: 0 8px 24px rgba(10, 25, 47, 0.3);
    transition: transform 0.5s ease, filter 0.5s ease;
    user-select: none;
}

.left-side:hover img,
.left-side:focus-within img {
    transform: scale(1.05);
    filter: brightness(0.75) contrast(1.1);
}

.right-side {
    flex: 2;
    padding: 4rem 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    user-select: text;
}

.title {
    font-size: 2.4rem;
    font-weight: 800;
    color: #e65100;
    margin-bottom: 2.4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    user-select: text;
}

.title i {
    font-size: 2.8rem;
    color: #e65100;
    flex-shrink: 0;
}

.error-msg {
    color: #b00020;
    font-weight: 700;
    font-size: 1.1rem;
    margin-top: 1rem;
    min-height: 1.4rem;
    max-width: 420px;
    margin-left: auto;
    margin-right: auto;
    user-select: text;
}

.tip,
.back {
    font-size: 1rem;
    color: #555b6e;
    margin-top: 2rem;
    user-select: text;
}

.link {
    color: #e65100;
    font-weight: 700;
    text-decoration: none;
    transition: color 0.3s ease;
}

.link:hover,
.link:focus-visible {
    text-decoration: underline;
    outline-offset: 3px;
    outline-color: #e65100;
}

@media (max-width: 960px) {
    .auth-container {
        flex-direction: column;
        width: 100%;
        max-width: 480px;
        border-radius: 16px;
    }

    .left-side,
    .right-side {
        flex: unset;
        width: 100%;
        padding: 2.5rem 2rem;
    }

    .left-side img {
        border-radius: 16px 16px 0 0;
        object-fit: cover;
        height: auto;
        max-height: 300px;
        transition: none;
        filter: none;
        transform: none;
    }

    .title {
        font-size: 1.8rem;
    }

    .title i {
        font-size: 2rem;
    }
}
</style>