import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { saveBatch, query, remove } from './service';

import { WorkOrderDto } from './data.d';
//import {ResultPageInfo,PageQueryParams } from "@/pages/ex/components/StandardTable/data.d";
import { PaginationConfig } from 'antd/lib/pagination';

export interface StateType {
  data: {
    list: WorkOrderDto[];
    pagination: PaginationConfig;
    formValues: {};//查询条件
    /*detail: Partial<WorkOrderDto>;
    isEdit: boolean;
    isLook: boolean;*/
  }
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    save: Effect; 
    remove: Effect;
    update: Effect;
  };
  reducers: {
    saveList: Reducer<StateType, AnyAction>;
    saveDetail: Reducer<StateType, AnyAction>;
  };
}

const Model: ModelType = {
  namespace: 'workorder',

  state: {
    data: {
      list: [],
      pagination: {},
      formValues: {},
      /*detail: {},
      isEdit: false,
      isLook: false,*/
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const formValues = payload.formValues||{};
      const params = {page:payload.page||0,pageSize:payload.pageSize||10,filters:[
        {name:'workOrderCode',operator:'like',value:formValues.workOrderCode?formValues.workOrderCode:''},
        {name:'dictWorkOrderType',operator:'equal',value:formValues.dictWorkOrderType?formValues.dictWorkOrderType:''},
        {name:'workOrderContent',operator:'startwith',value:formValues.workOrderContent?formValues.workOrderContent:''},
      ]};
      
      const response = yield call(query, params);

      yield put({
        type: 'saveList',
        payload: {
          list: response.rows,
          pagination:{
            total: parseInt(response.totalrecords),
            current: parseInt(response.currpage),
            pageSize: parseInt(payload.pageSize),
          },
          formValues: formValues,
        },
      });
    },
    *save({ payload, callback }, { call, put }) {
      const response = yield call(saveBatch, payload);
      yield put({
        type: 'saveDetail',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
      //yield call(query);
      /*yield put({
        type: 'saveDetail',
        payload: response,
      });
      if (callback) callback();*/
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(saveBatch, payload);
      yield put({
        type: 'saveDetail',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        data:{
          list: action.payload.list,
          pagination:action.payload.pagination,
          formValues:action.payload.formValues,
        },
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

export default Model;
