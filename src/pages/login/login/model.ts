import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import { fakeAccountLogin, getFakeCaptcha, accountLogin, accountLogout, selectSystem } from './service';
import { getPageQuery, setAuthority } from './utils/utils';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    logout: Effect;
    login: Effect;
    getCaptcha: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'loginLogin',

  state: {
    status: undefined,
  },

  effects: {
    *logout(action, { call, put }) {
      yield call(accountLogout);
    },
    *login({ payload }, { call, put }) {
      //const response = yield call(fakeAccountLogin, payload);
      try{
      const response = yield call(accountLogin, payload);
      
      if(response && response.status===200 && response.flag==='success'){
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'ok',
            type: 'account',
            currentAuthority: 'admin',
          },
        });

        yield call(selectSystem); //选择系统
        yield put(routerRedux.replace('/'));
      }else{
        yield put({
          status: 'error',
          type: 'account',
          currentAuthority: 'guest',
        })
      }
    }catch(e){
      debugger;
      console.log(e);
    }
      return;
      
      
      // Login successfully
      if (response.status === 'ok') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
