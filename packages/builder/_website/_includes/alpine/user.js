export default function () {
  return {
    id: null,
    username: '',
    avatar: this.$persist(''),
    isNamePublic: false,
    isLoading: false,
    isSuccess: false,
    isDirty: false,
    init () {
      this.fetchUser()
    },
    async fetchUser () {

      const res = await fetch(`${Alpine.store('env').backendUrl}/api/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Alpine.store('env').jwt}`
        }
      })

      console.log(res)


      const json = await res.json()

      console.log(json)

      this.id = json.id
      this.username = json.username
      this.isNamePublic = json.isNamePublic || false

    },
    async updateIsNamePublic () {
      this.isLoading = true

      const res = await fetch(`${Alpine.store('env').backendUrl}/api/profile/${this.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Alpine.store('env').jwt}`
        },
        body: JSON.stringify({
          isNamePublic: this.isNamePublic
        })
      })
      console.log(res)
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


// <script>
//     window.cookieStorage = {
//         getItem(key) {
//             let cookies = document.cookie.split(";");
//             for (let i = 0; i < cookies.length; i++) {
//                 let cookie = cookies[i].split("=");
//                 if (key == cookie[0].trim()) {
//                     return decodeURIComponent(cookie[1]);
//                 }
//             }
//             return null;
//         },
//         setItem(key, value) {
//             document.cookie = key+' = '+encodeURIComponent(value)
//         }
//     }
// </script>
 
// <div x-data="{ count: $persist(0).using(cookieStorage) }">
//     <button x-on:click="count++">Increment</button>
 
//     <span x-text="count"></span>
// </div>