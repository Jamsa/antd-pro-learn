import request from '@/utils/request';
import { FormDataType } from './index';
import {setMaxDigits,encryptedString,RSAKeyPair} from './rsa';
import qs from 'qs';

export async function fakeAccountLogin(params: FormDataType) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}


function getKey4RSA(){
  setMaxDigits(130);
  return new RSAKeyPair("10001","","8156f866b892b91d22b95a09ec27f8739336a2aa5d111da811354584230876be0c811537ce301944d3cdaaf01936c61dfe0842c4f26a903ef661c9e10ea2bf6999743ab86a0e1055279086aa70bccbc53cb2482918753e16671f0049f091b282abc185f3a39d66cf6704aeea350d2ec5bda02e4afe1ce5251caf3125bfef5bb1");     
}

const key = getKey4RSA();

function wrapperData(serStr: string){
  serStr =  encodeURIComponent(serStr);
  var result = encryptedString(key,serStr ); //非测试环境
  //测试环境下 ，
  //result = serStr;
  return result ;
}

interface LoginData {
  loginName: string;
  password: string;
  forceLogin: string;
  emailCode?: string;
  verificationCode?: string;
}

interface SerialLoginData {
  result: string;
  redirect_uri: string|null;
  aj: string|null;
}

function serialData(obj: LoginData): SerialLoginData{
  var serStr = "loginName="+encodeURIComponent(obj.loginName)+"&password="+encodeURIComponent(obj.password)+"&forceLogin="+obj.forceLogin+"&emailCode="+obj.emailCode+"&verificationCode="+obj.verificationCode;
  var result = wrapperData(serStr);
  var redirect_uri = null;  //单点登录时，原地址信息记录
  var aj = null;  //是否ajax 操作超出会话
  return {"result":result,"redirect_uri":redirect_uri,"aj":aj};
}

/**
 * 登录JReap 4A
 * @param params 界面表单数据
 */
export async function accountLogin(params: FormDataType) {
  let serData = serialData({loginName:params.userName,password:params.password,forceLogin:"unsso",emailCode:undefined,verificationCode:undefined});
  /*let formData = new FormData();
  formData.append("result",serData.result);
  formData.append("redirect_uri",serData.redirect_uri);
  formData.append("aj",serData.aj);*/
  
  return request('/server/api/jreap/web/right/auth/login.form', {
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    body: qs.stringify(serData)
  });
}

/**
 *  选择系统
 * @param params 界面表单数据
 */
export async function selectSystem() {
  return request('/server/api/jreap/web/right/auth/selectSystem.form?id=B2', {
    method: 'POST'
  });
}

/**
 *  注销系统
  */
export async function accountLogout() {
  return request('/server/api/jreap/web/right/auth/logout.form', {
    method: 'POST'
  });
}