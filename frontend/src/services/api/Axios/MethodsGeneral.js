import instance from './baseConfig';

export const get = (url) => instance.get(url);

export const post = (url, data) => instance.post(url, data);

export const put = (url, data) => instance.put(url, data);

export const del = (url) => instance.delete(url);

export const patch = (url, data) => instance.patch(url, data);

export const getID = (url, id) => instance.get(`${url}/${id}`);

export const putID = (url, id, data) => instance.put(`${url}/${id}`, data);

export const deleteID = (url, id) => instance.delete(`${url}/${id}`);

export const postID = (url, id, data) => instance.post(`${url}/${id}`, data);

export default {
  get,
  post,
  put,
  del,
  patch,
  getID,
  putID,
  deleteID,
  postID,
};
