import request from '@/utils/request';
import {PageQueryParams } from "@/pages/ex/components/StandardTable/data.d";

export async function query(params: PageQueryParams) {
  return request('/server/api/iip-em/web/emWorkOrder/query.form', {
    method: 'POST',
    data: params,
  });
}

export async function getById(id: string) {
  return request('/server/api/iip-em/web/emWorkOrder/get.form', {
    method: 'POST',
    body: `id=${id}`
  });
}

export async function remove(id: string) {
  return request('/server/api/iip-em/web/emWorkOrder/delete.form', {
    method: 'POST',
    body: `id=${id}`
  });
}

export async function saveBatch(params: PageQueryParams) {
  return request('/server/api/iip-em/web/emWorkOrder/query.form', {
    method: 'POST',
    data: {
      params,
    }
  });
}
/*
export async function addRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}*/
