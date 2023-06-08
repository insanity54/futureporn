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
    isLoading: false,
    isDirty: false,
    context: '',
    timestamps: [],
    vodId: null,
    get playheadTimestamp() {
      return Alpine.store('player').formatTime(Alpine.store('player').seconds)
    },
    get displayedTimestamps() {
      return (!!this.selectedTag) ? this.timestamps.filter(ts => ts.tag === this.selectedTag.name) : this.timestamps
    },
    getTagVodRelations() {
      this.isLoading = true;
      fetch(`${window.backend}/api/tag-vod-relations?populate=*&filters[vod][id][$eq]=${this.vodId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then((res) => res.json())
      .then((data) => {
        this.isLoading = false;
        this.tagVodRelations = data.data.map((tvr) => this.formatTagVodRelation(tvr))
      })
      .catch((e) => this.errors.push('Unable to download tag list. Please try again later.'))
    },
    formatTagVodRelation(tvr) {
      return {
        id: tvr.id,
        name: tvr.attributes.tag.data.attributes.name,
        vodId: tvr.attributes.vod.data.id,
        tagId: tvr.attributes.tag.data.id,
        votes: tvr.attributes.votes,
        isCreator: tvr.attributes.isCreator,
        dup: false
      }
    },
    init () {
      this.vodId = parseInt(this.$refs.vodId.innerHTML)
      this.getTagVodRelations();
      // let element = this.$refs.tagsInput
      // new BulmaTagsInput(element, {
      //   allowDuplicates: false,
      //   caseSensitive: false,
      //   clearSelectionOnTyping: false,
      //   closeDropdownOnItemSelect: true,
      //   delimiter: ',',
      //   freeInput: true,
      //   highlightDuplicate: true,
      //   highlightMatchesString: true,
      //   itemValue: undefined,
      //   itemText: undefined,
      //   maxTags: undefined,
      //   maxChars: undefined,
      //   minChars: 3,
      //   noResultsLabel: 'No results found',
      //   placeholder: '',
      //   removable: true,
      //   searchMinChars: 1000000,
      //   searchOn: 'text',
      //   selectable: true,
      //   source: undefined,
      //   tagClass: 'is-rounded',
      //   trim: true
      // });

      // this.bti = element.BulmaTagsInput()
      // this.bti.on('before.add', (item) => {
      //   return slugify(item);
      // });
      // // this.bti.on('after.add', (data) => {
      // //   this.createTag(data.item)
      // // });

      // this.bti.on('after.select', (data) => {
      //   this.selectedTag = data.item
      // });

      // this.bti.on('after.unselect', (data) => {
      //   this.selectedTag = ''
      // })
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
    addTimestamp () {
      const ts = {
        time: Alpine.store('player').seconds,
        tag: this.selectedTag,
        vod: this.vodId,
      }
      fetch(`${window.backend}/api/timestamps`, {
        method: 'POST',
        body: JSON.stringify({ data: ts }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Alpine.store('auth').jwt}`
        },
      })
      .then(res => res.json())
      .then(ts => {
        this.timestamps.push(ts)
      })
      .catch((e) => {
        this.errors.push(e)
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
    onSuggestedTagClick (tag) {
      this.tagsInput = ''
      // this.$refs.tagsInput.focus()
      let isDuplicate = false
      for (const tvr of this.tagVodRelations) {
        if (tvr.name === tag.name) {
          tvr.dup = true;
          setTimeout(() => {
            tvr.dup = false;
          }, 1250);
          isDuplicate = true
          break;
        }
      }
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
    onTagSubmit() {
      this.isLoading = true;
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
  }
}
