import axiosInstance from '../utils/axiosInstance'

const TreeRequests = {
  getEntries: async (model: string, locale?: string | null) => {
    const lang = locale ? `&locale=${locale}` : ''
    const data = await axiosInstance.get(`/strapi-plugin-collection-tree/entries?model=${model}${lang}`)    
    return data
  },
  saveEntries: async (data: { key: string, entries: unknown[], locale?: string | null }) => {
    return await axiosInstance.post(`/strapi-plugin-collection-tree/entries`, {
      data,
    })
  }
}

export default TreeRequests