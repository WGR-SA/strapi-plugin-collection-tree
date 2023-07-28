import axiosInstance from '../utils/axiosInstance';

const TreeRequests = {
  getEntries: async (model: string) => {
    const data = await axiosInstance.get(`/strapi-plugin-collection-tree/entries?model=${model}`);    
    return data;
  },
  saveEntries: async (data: { key: string, entries: unknown[] }) => {
    return await axiosInstance.post(`/strapi-plugin-collection-tree/entries`, {
      data,
    });
  }
}

export default TreeRequests;