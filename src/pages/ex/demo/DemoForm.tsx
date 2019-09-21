import createForm, { StandardFormContainer, StandardFormInjectedProps } from '../components/StandardForm';
import React from 'react';
import { Input, Button } from 'antd';
import FormItem from 'antd/lib/form/FormItem';

interface DemoFormProps extends StandardFormInjectedProps<any>{
    visible:boolean;
}

const DemoForm = (props:DemoFormProps)=>{
  const {form,handleUpdate,handleClose,fieldsValue,visible } = props;
  const buttonBar = (<Button key="submit" type="primary" onClick={() => handleUpdate()}>完成</Button>);
  return (<StandardFormContainer onCancel={()=>handleClose()} destroyOnClose={true} visible={visible} buttonBar={buttonBar}>
    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
    {form.getFieldDecorator('desc', {
      rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
      initialValue: fieldsValue.desc,
    })(<Input placeholder="请输入" />)}
    </FormItem>
    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
    {form.getFieldDecorator('username', {
      rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
      initialValue: fieldsValue.username,
    })(<Input placeholder="请输入" />)}
    </FormItem>
    </StandardFormContainer>);
}

//export default connect(({workorder,loading}:any)=>({workorder,loading,fieldsValue:{desc:'aaaaaaaa'}}),)(createForm({moduleCode:'workorder',keyName:'workOrderId'})(DemoForm));
export default createForm<any,DemoFormProps>({moduleCode:'workorder',keyName:'workOrderId'})(DemoForm);