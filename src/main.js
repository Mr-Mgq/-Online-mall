// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 3. 引入并使用 store（提前加载用户信息）
import { useUserStore } from './stores/user.js'
const userStore = useUserStore()
userStore.loadFromStorage()

app.mount('#app')
