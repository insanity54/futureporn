
export default function tagger () {
  return {
    errors: [],
    tagSuggestions: [],
    input: '',
    isLoading: false,
    context: '',
    init () {
      console.log('Hello tagger!');
      
    },
    async search () {
      if (this.input === '') return;
      console.log(`searching using input:${this.input}`)
      this.isLoading = true;
      const res = await fetch(`${window.backend}/api/fuzzy-search/search?query=${this.input}`, {
        headers: {
          'Authorization': `Bearer ${Alpine.store('auth').jwt}`
        }
      })
      const json = await res.json()
      console.log(json)
      this.isLoading = false
      if (!res.ok) {
        errors.push(text)
      } else {
        this.tagSuggestions = json.tags
      }
    },
  }
}
