<template>
    <div class="profile-wrapper">
        <el-card class="form-card" shadow="always">
            <h2 class="form-title">用户信息</h2>
            <el-form :model="form" :rules="rules" ref="formRef" label-position="top" size="large">
                <div class="avatar-section">
                    <el-upload class="avatar-uploader" action="#" :show-file-list="false" :auto-upload="false"
                        :before-upload="handleAvatarUpload">
                        <el-avatar :size="120" :src="form.avatar || defaultAvatar" class="avatar-img" />
                        <div class="upload-overlay">点击更换头像</div>
                    </el-upload>
                </div>

                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名" @blur="validateUsernameUnique" />
                    <p v-if="usernameError" class="el-form-item__error">{{ usernameError }}</p>
                </el-form-item>

                <el-form-item label="邮箱">
                    <el-input v-model="form.email" placeholder="example@example.com" />
                </el-form-item>

                <el-form-item label="电话">
                    <el-input v-model="form.phone" placeholder="例如 13800000000" />
                </el-form-item>

                <el-form-item label="地址">
                    <el-input v-model="form.address" placeholder="请输入地址" />
                </el-form-item>

                <el-form-item label="个人简介">
                    <el-input v-model="form.bio" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }"
                        placeholder="个人简介" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" :loading="isSaving" :disabled="hasValidationErrors" @click="save" round
                        size="large">
                        {{ isSaving ? '保存中...' : '保存' }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const formRef = ref()

const defaultAvatar = 'https://i.pravatar.cc/150?u=default'
const form = reactive({
    id: '',
    username: '',
    avatar: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
})

const usernameError = ref('')
const isSaving = ref(false)

watch(
    () => userStore.userInfo,
    (newUser) => {
        if (newUser) {
            Object.assign(form, newUser)
        }
    },
    { immediate: true }
)

const rules = {
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { min: 2, max: 20, message: '长度为2-20个字符', trigger: 'blur' },
    ],
}

function handleAvatarUpload(file) {
    const reader = new FileReader()
    reader.onload = (e) => {
        form.avatar = e.target.result
    }
    reader.readAsDataURL(file)
    return false
}

async function validateUsernameUnique() {
    if (!form.username.trim()) {
        usernameError.value = '用户名不能为空'
        return false
    }
    if (form.username === userStore.userInfo?.username) {
        usernameError.value = ''
        return true
    }
    try {
        const res = await axios.get('http://localhost:3000/users', {
            params: { username: form.username },
        })
        const exists = res.data.find((u) => u.id !== form.id)
        if (exists) {
            usernameError.value = '用户名已存在'
            return false
        } else {
            usernameError.value = ''
            return true
        }
    } catch (err) {
        console.error(err)
        usernameError.value = ''
        return true
    }
}

const hasValidationErrors = computed(() => !!usernameError.value)

async function save() {
    const valid = await formRef.value.validate()
    if (!valid || usernameError.value) {
        ElMessage.warning(usernameError.value || '请检查表单')
        return
    }

    isSaving.value = true
    try {
        const ok = await validateUsernameUnique()
        if (!ok) {
            ElMessage.warning(usernameError.value)
            isSaving.value = false
            return
        }

        await userStore.updateUser({
            ...form,
            avatar: form.avatar || defaultAvatar,
        })

        ElMessage.success('保存成功')
        router.push('/')
    } catch (err) {
        console.error(err)
        ElMessage.error('保存失败，请稍后重试')
    } finally {
        isSaving.value = false
    }
}
</script>

<style scoped>
.profile-wrapper {
    max-width: 720px;
    margin: 3rem auto;
    padding: 0 1.5rem;
}

.form-card {
    padding: 2rem 2.5rem;
    border-radius: 16px;
}

.form-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 2rem;
    text-align: center;
    color: #2c3e50;
}

.avatar-section {
    display: flex;
    justify-content: center;
    margin-bottom: 1.8rem;
    position: relative;
}

.avatar-uploader {
    position: relative;
    display: inline-block;
    cursor: pointer;
}

.avatar-img {
    transition: 0.3s;
    border: 4px solid #f2f2f2;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.upload-overlay {
    position: absolute;
    bottom: -2.2rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.85rem;
    color: #888;
    width: 82px;
}
</style>