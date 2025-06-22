// src/api/auth.js
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'  // 生成唯一ID，需要先安装：npm install uuid

const BASE_URL = 'http://localhost:3000'
// 登录Api
export async function login(username, password) {
  if (!username.trim() || !password.trim()) {
    return []; // 直接返回空数组，避免调用后端
  }
  const res = await axios.get(`${BASE_URL}/users`, {
    params: {
      username,
      password
    }
  })
  return res.data // 返回匹配的用户数组
}
//查询用户名是否已存在
export async function checkUsernameExists(username) {
  const res = await axios.get(`${BASE_URL}/users`, { params: { username } })
  return res.data.length > 0
}

// 注册api
export async function register(userData) {
  // 1. 校验用户名是否存在
  const exists = await checkUsernameExists(userData.username)
  if (exists) {
    throw new Error('用户名已存在')
  }

  // 2. 组装完整用户数据，自动补全缺失字段
  const newUser = {
    id: uuidv4(),
    username: userData.username,
    password: userData.password,
    avatar: userData.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(userData.username)}`,
    email: userData.email || '',
    phone: userData.phone || '',
    address: userData.address || '',
    bio: userData.bio || '',
    createdAt: new Date().toISOString()
  }

  // 3. 发送请求创建新用户
  const res = await axios.post(`${BASE_URL}/users`, newUser)
  return res.data
}
