export default function user () {
  return {
    avatar: this.$persist(''),
    isNamePublic: false,
    isLoading: false,
    isSuccess: false,
    isDirty: false,
    init () {
      this.fetchUser()
    },
    async fetchUser () {
      const res = await fetch(`${Alpine.store('env').backend}/api/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Alpine.store('auth').jwt}`
        }
      })
      const json = await res.json()
      this.id = json.id
      this.username = json.username
      this.isNamePublic = json.isNamePublic || false
    },
    async updateIsNamePublic () {
      this.isLoading = true

      const res = await fetch(`${Alpine.store('env').backend}/api/profile/${Alpine.store('auth').userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Alpine.store('auth').jwt}`
        },
        body: JSON.stringify({
          isNamePublic: this.isNamePublic
        })
      })
      this.isLoading = false
      this.isDirty = true
      if (!res.ok) {
        this.isSuccess = false
      } else {
        this.isSuccess = true
      }
    }
  }
}
