import axios from 'axios'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
  }),
  actions: {
    async login(user) {
      this.userInfo = user
      localStorage.setItem('userInfo', JSON.stringify(user))
    },
    logout() {
      this.userInfo = null
      localStorage.removeItem('userInfo')
    },
    loadFromStorage() {
      const user = localStorage.getItem('userInfo')
      if (user) this.userInfo = JSON.parse(user)
    },
    async updateUser(newData) {
      if (!this.userInfo) return

      try {
        const userId = this.userInfo.id

        // 如果 newData 里有 username，需要先校验
        if (newData.username && newData.username !== this.userInfo.username) {
          // 查询是否存在同名且id不同的用户
          const res = await axios.get(`http://localhost:3000/users`, {
            params: { username: newData.username }
          })
          const users = res.data
          const conflictUser = users.find(u => u.id !== userId)
          if (conflictUser) {
            throw new Error('用户名已被占用，请更换其他用户名')
          }
        }

        // 更新用户信息
        const response = await axios.patch(`http://localhost:3000/users/${userId}`, newData)

        // 更新本地状态和存储
        this.userInfo = response.data
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      } catch (error) {
        console.error('更新用户信息失败', error)
        throw error // 抛出错误让调用方处理（比如前端显示提示）
      }
    }
  }
})
