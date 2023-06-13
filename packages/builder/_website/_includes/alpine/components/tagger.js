import slugify from 'slugify';
import { toRaw } from '@vue/reactivity'

export default function tagger () {
  return {
    bti: null,
    tagVodRelations: [],
    tagSuggestions: [],
    tagsInput: '',
    errors: [],
    selectedTag: {},
    isTsLoading: false,
    isLoading: false,
    isDirty: false,
    context: '',
    timestamps: [],
    vodId: null,
    get playheadTimestamp() {
      return Alpine.store('player').formatTime(Alpine.store('player').seconds)
    },
    get displayedTimestamps() {
      return (!!this.selectedTag.id) ? this.timestamps.filter(ts => ts.tagName === this.selectedTag.name) : this.timestamps
    },
    truncateString(str, maxLength) {
      if (str.length <= maxLength) {
        return str;
      }
      return str.substring(0, maxLength - 1) + '…';
    },
    getTagVodRelations(page = 1) {
      this.isLoading = true;
      return fetch(`${window.backend}/api/tag-vod-relations?populate=*&filters[vod][id][$eq]=${this.vodId}&pagination[page]=${page}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
      })
      .then((res) => res.json())
      .then((json) => {
        const tvrs = json.data.map((tvr) => this.formatTagVodRelation(tvr));
        this.tagVodRelations = this.tagVodRelations.concat(tvrs)

        const totalPages = json.meta.pagination.pageCount;
        const nextPage = page + 1;

        if (nextPage <= totalPages) {
          window.setTimeout(() => { this.getTagVodRelations(nextPage); }, 500)
        } else {
          this.isLoading = false;
        }
      })
      .catch((e) => {
        console.error(e)
        this.errors.push('Unable to download tag list.')
      })
      .finally(() => {
        this.isLoading = false;
      })
    },
    formatTagVodRelation(tvr) {
      if (!tvr?.attributes?.tag?.data) throw new Error(`cannot format tvr id ${tvr.id} because tvr.attributes.tag.data is undefined`)
      const id        = tvr.id
      const name      = tvr.attributes.tag.data.attributes.name
      const tagId     = tvr.attributes.tag.data.id
      const vodId     = tvr.attributes.vod.data.id
      const votes     = tvr.attributes.votes
      const creatorId = tvr.attributes.creatorId
      const createdAt = tvr.attributes.createdAt
      const dup       = false
      return { id, name, vodId, tagId, votes, creatorId, createdAt, dup }
    },
    init () {
      this.vodId = parseInt(this.$refs.vodId.innerHTML)
      this.getTimestamps()
        .then(() => {
          return this.getTagVodRelations()
        })
    },
    createTag (name) {
      const data = {
        name: name
      }
      this.isLoading = true;
      fetch(`${window.backend}/api/tags`, {
        method: 'POST',
        body: JSON.stringify({ data }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Alpine.store('auth').jwt}`
        },
      }).then((res) => {
        this.isLoading = false
      })

    },


    //
    // TIMESTAMPS SECTION
    //
    onTimestampNameClick (ts) {
      // const tvr = tagVodRelations.find((tvr) => (tvr.name === ts.tagName))
    },
    async createTimestamp() {
      const ts = {
        time: parseInt(Alpine.store('player').seconds),
        tag: this.selectedTag.tagId,
        vod: this.vodId
      }
      return fetch(`${window.backend}/api/timestamps?populate=*`, {
        method: 'POST',
        body: JSON.stringify({ 
          data: ts
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Alpine.store('auth').jwt}`
        },
      })
      .then(res => res.json())
      .then(data => {
        console.log('here is data')
        console.log(data)
        if (data?.error) {
          throw new Error(data.error.message || 'Problem while creating timestamp. Please try again later')
        }
        else return data.data
      })
    },
    formatTimestamp(ts) {
      if (!ts?.attributes?.tag?.data) throw new Error(`cannot format ts id ${ts.id} because ts.attributes.tag.data is undefined`)
      const id        = ts.id
      const time      = ts.attributes.time
      const tagName   = ts.attributes.tag.data.attributes.name
      const tnShort   = this.truncateString(tagName, 14)
      const tagId     = ts.attributes.tag.data.id
      const vodId     = ts.attributes.vod.data.id
      const votes     = ts.attributes.votes
      const createdAt = ts.attributes.createdAt
      const creatorId = ts.attributes.creatorId
      return { id, time, vodId, tagName, tagId, createdAt, creatorId, tnShort, votes }
    },
    async deleteTimestamp (id) {
      console.log(`deleting timestamp id ${id}`)
      return fetch(`${window.backend}/api/timestamps/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${Alpine.store('auth').jwt}`
        }
      })
    },
    async onClickDeleteTimestamp (id) {
      this.isTsLoading = true
      return this.deleteTimestamp(id)
        .then((ts) => {
          // @todo remove ts that was deleted
          this.timestamps = this.timestamps.filter((ts) => ts.id !== id)
        })
        .catch((e) => {
          this.errors.push(e)
        })
        .finally(() => {
          this.isTsLoading = false
        })
    },
    async onClickAddTimestamp () {
      this.isTsLoading = true
      return this.createTimestamp()
        .then((ts) => {
          console.log('add ts to list')
          console.log(this.formatTimestamp(ts))
          this.timestamps.push(this.formatTimestamp(ts))
        })
        .catch((e) => {
          this.errors.push(e)
        })
        .finally(() => {
          this.isTsLoading = false
        })
    },
    async getTimestamps(page = 1) {
      this.isTsLoading = true;
      return fetch(`${window.backend}/api/timestamps?populate=*&filters[vod][id][$eq]=${this.vodId}&sort=time%3Aasc&pagination[page]=${page}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
      })
      .then((res) => res.json())
      .then((json) => {
        this.timestamps = this.timestamps.concat(json.data.map((ts) => this.formatTimestamp(ts)))
        const totalPages = json.meta.pagination.pageCount;
        const nextPage = page + 1;
        if (nextPage <= totalPages) {
          window.setTimeout(() => { this.getTimestamps(nextPage); }, 500)
        } else {
          this.isLoading = false;
        }
      })
      .catch((e) => {
        console.error(e)
        this.errors.push('Unable to download timestamps. Please try again later.')
      })
      .finally(() => {
        this.isTsLoading = false;
      })
    },


    //
    // TAG VOD RELATIONS SECTION
    //

    async deleteTagVodRelation (id) {
      return fetch(`${window.backend}/api/tag-vod-relations/deleteMine/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${Alpine.store('auth').jwt}`,
          'Accept': 'application/json'
        }
      })
    },
    async createTagVodRelationAndTag (tagName, vodId) {
      console.log(`tagName:${tagName} slugified becomes ${slugify(tagName)}`)
      return fetch(`${window.backend}/api/tag-vod-relations/tag`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Alpine.store('auth').jwt}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            tagName: slugify(this.tagsInput.split(',').at(0)),
            vodId: this.vodId
          }
        })
      })
    },
    async createTagVodRelation (tagId) {
      this.isLoading = true;
      return fetch(`${window.backend}/api/tag-vod-relations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Alpine.store('auth').jwt}`
        },
        body: JSON.stringify({ 
          data: {
            vod: this.vodId,
            tag: tagId
          }
        })
      })
      .then((res) => res.json())
      .then((json) => {
        this.isLoading = false;
        if (json?.error) throw new Error(json?.error?.message);
        return this.formatTagVodRelation(json.data)
      })
    },
    
    getTagVodRelations(page = 1) {
      this.isLoading = true;
      return fetch(`${window.backend}/api/tag-vod-relations?populate=*&filters[vod][id][$eq]=${this.vodId}&pagination[page]=${page}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
      })
      .then((res) => res.json())
      .then((json) => {
        const tvrs = json.data.map((tvr) => this.formatTagVodRelation(tvr));
        this.tagVodRelations = this.tagVodRelations.concat(tvrs)

        const totalPages = json.meta.pagination.pageCount;
        const nextPage = page + 1;

        if (nextPage <= totalPages) {
          window.setTimeout(() => { this.getTagVodRelations(nextPage); }, 500)
        } else {
          this.isLoading = false;
        }
      })
      .catch((e) => {
        console.error(e)
        this.errors.push('Unable to download tag list. Please try again later.')
      })
      .finally(() => {
        this.isLoading = false;
      })
    },

    //
    // TAGS SECTION
    // 
    async search () {
      this.isDirty = true;
      const ti = this.tagsInput
      if (!ti) return;
      this.isLoading = true;
      const res = await fetch(`${window.backend}/api/fuzzy-search/search?query=${ti.split(',').at(0)}`, {
        headers: {
          'Authorization': `Bearer ${Alpine.store('auth').jwt}`
        }
      })
      const json = await res.json()
      this.isLoading = false;
      if (!res.ok) {
        this.errors.push(JSON.stringify(json))
      } else {
        this.tagSuggestions = json.tags
      }
    },
    async onTagSubmit() {
      let tagName = this.tagsInput.split(',').at(0)
      let vodId = this.vodId
      let { isDuplicate } = this.indicateDuplicates(tagName)
      if (isDuplicate) return;
      this.isLoading = true;
      return this.createTagVodRelationAndTag(tagName, vodId)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Unable to create tag. Please try again later.')
          }
          return res.json()
        })
        .then((json) => {
          const tvr = this.formatTagVodRelation(json.data)
          this.tagVodRelations.push(tvr)
          this.tagsInput = ''
          this.selectedTag = tvr
        })
        .catch((e) => {
          this.errors.push(e)
        })
        .finally(() => {
          this.isLoading = false;
        })
    },
    async onTagDelete(id) {
      console.log(`del ${id}`)
      this.isLoading = true;
      return this.deleteTagVodRelation(id)
        .then(() => {
          this.tagVodRelations = this.tagVodRelations.filter((tvr) => tvr.id !== id)
        })
        .catch((e) => {
          this.errors.push(e)
        })
        .finally(() => {
          this.isLoading = false;
        })
    },
    getTagObject(tagName) {
      return toRaw(this.tagSuggestions).find((t) => (t.name === tagName))
    },
    onTagClick (tvr) {
      if (this.selectedTag && this.selectedTag.name === tvr.name) {
        this.selectedTag = {};
      } else {
        this.selectedTag = tvr;
      }
      // this.$refs.tagsInput.focus()
    },
    indicateDuplicates (tagName) {
      let isDuplicate = false
      for (const tvr of this.tagVodRelations) {
        if (tvr.name === tagName) {
          tvr.dup = true;
          setTimeout(() => {
            tvr.dup = false;
          }, 1250);
          isDuplicate = true
          break;
        }
      }
      return { isDuplicate }
    },
    onSuggestedTagClick (tag) {
      this.tagsInput = ''
      const { isDuplicate } = this.indicateDuplicates(tag.name)
      if (!isDuplicate) {
        this.createTagVodRelation(tag.id)
          .then((tvr) => {
            this.tagVodRelations.push(tvr)
          })
          .catch((e) => {
            this.errors.push(e)
          })
      }
    },


  }
}
