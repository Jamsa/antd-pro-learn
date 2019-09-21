import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button } from 'antd';

@connect(({user,helloWorld}) => {
  return {
    currentUser:user.currentUser,
    counting:helloWorld.counting
  }
})
export default class HelloWorld extends Component{

  handleAdd = () => {
    this.props.dispatch({
      type: 'helloWorld/addBtnClick',
    });
  }

  handleSub = () => {
    this.props.dispatch({
      type: 'helloWorld/subBtnClick',
    });
  }

  render() {
    return (<PageHeaderWrapper>
      <p style={{ textAlign: 'center' }}>
        这是个新加的页面<span>{this.props.currentUser.name},</span> 
        <span>计数器示例：{this.props.counting}</span>
        <Button onClick={this.handleAdd}>add</Button>
        <Button onClick={this.handleSub}>sub</Button>
      </p>
    </PageHeaderWrapper>)
  }
}
