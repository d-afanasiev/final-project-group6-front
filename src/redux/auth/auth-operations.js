import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Notify } from 'notiflix';
import notifyError from '../../helpers/api/notifyError';
import { tokenToAxios } from '../../api/settings';

// axios.defaults.baseURL = 'https://final-project-group6-back.herokuapp.com/';
axios.defaults.baseURL = 'http://localhost:4321/';

const token = {
  set(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  unset() {
    axios.defaults.headers.common.Authorization = '';
  },
};

const register = createAsyncThunk(
  'api/auth/register',
  async (credentials, rejectValue) => {
    try {
      const { data } = await axios.post('api/auth/register', credentials);
      token.set(data.token);
      tokenToAxios.set(data.token);
      Notify.success(
        `Пользователь с email ${data.user.email} успешно зарегистрирован`,
        {
          timeout: 3000,
          clickToClose: true,
          pauseOnHover: true,
        },
      );
      return data;
    } catch (error) {
      notifyError(error);
      return rejectValue(error);
    }
  },
);

const logIn = createAsyncThunk(
  'api/auth/login',
  async (credentials, rejectValue) => {
    try {
      const { data } = await axios.post('api/auth/login', credentials);
      token.set(data.token);
      Notify.success(`Добро пожаловать ${data.user.email}`, {
        timeout: 3000,
        clickToClose: true,
        pauseOnHover: true,
      });
      return data;
    } catch (error) {
      notifyError(error);
      return rejectValue(error);
    }
  },
);

const logOut = createAsyncThunk('api/auth/logout', async (_, rejectValue) => {
  try {
    // console.log('tokenAxios', tokenToAxios);
    await axios.post('api/auth/logout');
    tokenToAxios.unset();
    token.unset();
  } catch (error) {
    notifyError(error);
    return rejectValue(error);
  }
});

const fetchCurrentUser = createAsyncThunk(
  'api/user/current',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;
    if (persistedToken === null) {
      return thunkAPI.rejectWithValue();
    }

    token.set(persistedToken);
    try {
      const { data } = await axios.get('api/user/current');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue();
    }
  },
);

const googleIn = createAsyncThunk(
  'api/auth/googleIn',
  async (token, thunkAPI) => {
    if (token === null) {
      return thunkAPI.rejectWithValue('Token neded');
    }
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    try {
      const { data } = await axios.get('/api/user/current');
      Notify.success(`Добро пожаловать ${data.userName}`, {
        timeout: 3000,
        clickToClose: true,
        pauseOnHover: true,
      });
      return data;
    } catch (error) {
      notifyError(error);
      return thunkAPI.rejectWithValue();
    }
  },
);
const refreshToken = createAsyncThunk(
  'api/user/token/refresh',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const stateToken = state.auth.token;
    if (stateToken === null) {
      return thunkAPI.rejectWithValue();
    }
    const stateRefresh = state.auth.refreshToken;
    token.set(stateRefresh);
    tokenToAxios.set(stateRefresh);
    try {
      return await axios.get('api/user/token/refresh').then(({ data }) => {
        token.set(data.token);
        tokenToAxios.set(data.token);
        return data;
      });
    } catch (error) {
      return thunkAPI.rejectWithValue();
    }
  },
);

const renewToken = createAsyncThunk(
  'api/user/token/refresh',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const stateToken = state.auth.token;
    if (stateToken === null) {
      return thunkAPI.rejectWithValue();
    }
    token.set(stateToken);
    try {
      return await axios.get('api/user/token/refresh').then(({ data }) => {
        token.set(data.token);
        tokenToAxios.set(data.token);
        return data;
      });
    } catch (error) {
      return thunkAPI.rejectWithValue();
    }
  },
);

const operations = {
  register,
  logOut,
  logIn,
  fetchCurrentUser,
  googleIn,
  refreshToken,
  renewToken,
};
export default operations;
