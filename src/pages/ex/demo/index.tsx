import React from 'react';

import { connect } from 'dva';
import DemoForm from './DemoForm';
import { Button } from 'antd';

@connect(({workorder,loading}:any)=>({
  workorder,loading
}),
)
class DemoIndex extends React.Component<{},{visible:boolean,values:{}}>{
  
  constructor(props:any){
    super(props)
    this.state={
      visible:false,
      values:{desc:'init value'}
    }
  }
  closeForm(){
    this.setState({
      visible:false,
      values:{desc:'close value'}
    })
  }
  openForm(){
    this.setState({
      visible:true,
      values:{desc:'open value',username:'aaa'}
    })
  }
  render(){
    return (<div>
      <DemoForm visible={this.state.visible} onClose={()=>this.closeForm()} fieldsValue={this.state.values}/>
      <Button key="submit" type="primary" onClick={() => this.openForm()}>显示</Button>
      </div>);
  }
}

//export default connect(({workorder,loading}:any)=>({workorder,loading,fieldsValue:{desc:'aaaaaaaa'}}),)(createForm({moduleCode:'workorder',keyName:'workOrderId'})(DemoForm));
export default DemoIndex;