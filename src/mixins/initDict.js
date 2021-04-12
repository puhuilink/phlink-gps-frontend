import { queryDictItemByDictCode } from '@/api/dict'

export default {
  data() {
    return {
      dicts: []
    }
  },
  methods: {
    async getDict(dictName) {
      return new Promise((resolve, reject) => {
        queryDictItemByDictCode(dictName).then(res => {
          this.dicts = res.data.data
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
