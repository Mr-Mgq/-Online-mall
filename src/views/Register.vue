<template>
  <div class="auth-wrapper" role="main" aria-label="注册账户">
    <div class="auth-container">
      <div class="left-side" aria-hidden="true">
        <img src="https://images.pexels.com/photos/5632395/pexels-photo-5632395.jpeg" alt="" loading="lazy" />
      </div>

      <div class="right-side form-container">
        <h2 class="title">
          <i class="fa fa-user-plus" aria-hidden="true"></i> 注册账户
        </h2>

        <el-form :model="form" :rules="rules" ref="registerForm" label-position="top"
          @submit.prevent.native="handleRegister" autocomplete="off" aria-describedby="error-msg">
          <p v-if="error" id="error-msg" class="error-msg" role="alert" aria-live="assertive">{{ error }}</p>

          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="用户名" autocomplete="username" autofocus aria-label="用户名"
              clearable />
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="form.password" placeholder="密码" autocomplete="new-password" show-password type="password"
              aria-label="密码" clearable />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" native-type="submit" class="btn-primary" aria-label="注册" :loading="loading"
              style="width: 100%; max-width: 420px; margin: 0 auto;">
              注册
            </el-button>
          </el-form-item>
        </el-form>

        <p class="tip">
          已有账户？
          <router-link to="/login" class="link">登录</router-link>
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
import { useRouter } from "vue-router";
import { register } from "@/api/auth";

const router = useRouter();
const registerForm = ref(null);
const loading = ref(false);
const error = ref("");

const form = reactive({
  username: "",
  password: "",
});

const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "用户名长度在3到20个字符之间", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度至少6个字符", trigger: "blur" },
  ],
};

async function handleRegister() {
  error.value = "";
  loading.value = true;

  registerForm.value.validate(async (valid) => {
    if (valid) {
      try {
        await register({
          username: form.username.trim(),
          password: form.password.trim(),
        });
        alert("注册成功！请登录");
        router.push("/login");
      } catch (err) {
        error.value = "注册失败，请稍后再试";
        console.error(err);
      }
    }
    loading.value = false;
  });
}
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  background: #e8f6f3;
  padding: 3rem 1rem;
  user-select: none;
}

.auth-container {
  display: flex;
  width: 1280px;
  max-width: 100%;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(34, 139, 146, 0.15);
  overflow: hidden;
  gap: 0;
}

.left-side {
  flex: 3;
  position: relative;
  overflow: hidden;
  background: #d4f1f0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  border-right: 3px solid #3cbec9;
  border-radius: 16px 0 0 16px;
}

.left-side img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0 16px 16px 0;
  filter: brightness(1) saturate(1);
  box-shadow: 0 8px 24px rgba(60, 190, 201, 0.3);
  transition: transform 0.5s ease, filter 0.5s ease;
  user-select: none;
}

.left-side:hover img,
.left-side:focus-within img {
  transform: scale(1.04);
  filter: brightness(1.1) saturate(1.1);
}

.right-side {
  flex: 2;
  padding: 4rem 5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  color: #047481;
  user-select: text;
}

.title {
  font-size: 2.4rem;
  font-weight: 800;
  color: #039aa9;
  margin-bottom: 2.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  user-select: text;
}

.title i {
  font-size: 2.8rem;
  color: #039aa9;
  flex-shrink: 0;
}

.error-msg {
  color: #e63946;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 1.6rem;
  min-height: 1.4rem;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
  user-select: text;
}

.tip,
.back {
  font-size: 1rem;
  color: #047481;
  margin-top: 2rem;
  user-select: text;
}

.link {
  color: #03a9f4;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link:hover,
.link:focus-visible {
  text-decoration: underline;
  outline-offset: 3px;
  outline-color: #03a9f4;
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
    box-shadow: none;
  }

  .title {
    font-size: 1.9rem;
  }

  .title i {
    font-size: 2.4rem;
  }
}
</style>
