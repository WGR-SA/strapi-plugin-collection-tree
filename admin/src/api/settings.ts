import axiosInstance from '../utils/axiosInstance';

const SettingsRequests = {
  getModels: async () => {
    const data = await axiosInstance.get(`/strapi-plugin-collection-tree/models`);
    return data;
  },
  getSettings: async () => {
    const data = await axiosInstance.get(`/strapi-plugin-collection-tree/settings`);
    return data;
  },
  setSettings: async (data: { models: string[] }) => {
    return await axiosInstance.post(`/strapi-plugin-collection-tree/settings`, {
      body: data,
    });
  },
}

export default SettingsRequests;