import {
  get,
  del,
  post,
  postID,
  put,
} from '../../../services/api/Axios/MethodsGeneral';

export const login = async (data) => {
  const response = await post('login', data);
  return response;
};

export const validateCode = async (code, id) => {
  const response = await postID(`verification`, id, code);
  return response;
};

export const changePassword = async (data) => {
  const response = await put(`change-password`, data);
  console.log(response);
  return response;
};
export const logOut = async () => {
  const response = await del('logout');
  return response;
};

export const sendVerifyCode = async (id) => {
  const response = await postID('sendVerifyCode', id, { type_email: 0 });
  return response;
};

export const getRole = async () => {
  const response = await get('get-role');
  return response;
};
