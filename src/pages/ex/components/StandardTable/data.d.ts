/*import { PaginationConfig } from "antd/lib/table";

//数据列表行
export interface TableListItem {
  id?: string;
}

//数据明细行
export interface DetailItem {
  id?: string;
}*/

//服务端响应数据
export interface ResponseObject{
  flag: string;
  success: string;
  msg: string;
  error: string;
  errCode: string|null;
}

//查询结果中的分页信息
export interface ResultPageInfo{
  totalpages: string;
  totalrecords: string;
  currpage: string;
}

//分页查询结果
export interface PageQueryResult<T> extends ResultPageInfo,ResponseObject {
  rows: T[];
  aggregate: {};
}

//根据id获单条记录
export interface SingleQueryResult<T> extends ResponseObject{
  result:T
}

//过滤条件
export interface QueryFilter{
  name: string;
  operator: string;
  value: string;
  valueType: string;
}

//分页查询参数
export interface PageQueryParams {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
  filters: QueryFilter[]
}
