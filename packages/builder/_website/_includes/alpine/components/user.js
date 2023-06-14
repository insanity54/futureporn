export default function user () {
  return {
    avatar: this.$persist(''),
    vanityLink: '',
    patreonBenefits: [],
    isNamePublic: false,
    isLinkPublic: false,
    isLoading: false,
    isSuccess: false,
    isDirty: false,
    hasUrlBenefit: false,
    isPatron () {
      return (Alpine.store('user').role === 'patron' ? true : false)
    },
    init () {
      this.fetchUser()
    },
    get hasUrlBenefit () {
      return this.patreonBenefits.includes('10663202') // "Your URL displayed on Futureporn.net"
    },
    async fetchUser () {
      const res = await fetch(`${Alpine.store('env').backend}/api/profile/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Alpine.store('auth').jwt}`
        }
      })
      const json = await res.json()
      console.log('here is the user json')
      console.log(json)
      Alpine.store('user').id = (!!json?.id) ? json.id : 0
      Alpine.store('user').role = (!!json?.role?.type) ? json.role.type : 'public'
      this.username = json.username
      this.isNamePublic = json.isNamePublic || false
      this.isPatron = (json?.role?.type === 'patron') ? true : false
      this.patreonBenefits = (json?.patreonBenefits) ? json.patreonBenefits.split(',') : []
    },
    async updateUserProfile () {
      this.isLoading = true
      const res = await fetch(`${Alpine.store('env').backend}/api/profile/${Alpine.store('user').id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Alpine.store('auth').jwt}`
        },
        body: JSON.stringify({
          isNamePublic: this.isNamePublic,
          isLinkPublic: this.isLinkPublic,
          vanityLink: this.vanityLink
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
