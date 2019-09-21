import {Badge, Button, Card, Col, DatePicker, Divider, Dropdown, Form, Icon, Input, InputNumber, Menu, Row, Select, message,} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
// import CreateForm from './components/CreateForm';
import CreateForm from '../../list/table-list/components/CreateForm';
import StandardTable, { StandardTableColumnProps } from '../components/StandardTable';
// import UpdateForm, { FormValsType } from './components/UpdateForm';
import UpdateForm, { FormValsType } from './UpdateForm';

//import { TableListItem, TableListPagination, TableListParams } from '../components/StandardTable/data.d';
import { WorkOrderDto } from './data.d';
import { PageQueryParams } from "@/pages/ex/components/StandardTable/data.d";


import styles from './style.less';
import { PaginationConfig } from 'antd/lib/pagination';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

type IStatusMapType = 'QXGD' | 'YFXWHGD' | 'XMGD' | 'RCWHGD';
const statusMap = ['QXGD', 'YFXWHGD', 'XMGD', 'RCWHGD'];
const status = ['缺陷工单', '预防性维护工单', '项目工单', '日常维护工单'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  workorder: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: WorkOrderDto[];
  //formValues: { [key: string]: string };
  stepFormValues: Partial<WorkOrderDto>;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    workorder,
    loading,
  }: {
    workorder: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    workorder,
    loading: loading.models.workorder,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    //formValues: {},
    stepFormValues: {},
  };

  columns: StandardTableColumnProps<WorkOrderDto>[] = [
    {
      title: '工单编号',
      dataIndex: 'workOrderCode',
    },
    {
      title: '设备编号',
      dataIndex: 'instanceNumber',
    },
    {
      title: '工单内容',
      dataIndex: 'workOrderContent',
    },
    /*{
      title: '服务调用次数',
      dataIndex: 'callNo',
      sorter: true,
      align: 'right',
      render: (val: string) => `${val} 万`,
      // mark to display a total number
      needTotal: true,
    },*/
    {
      title: '工单类型',
      dataIndex: 'dictWorkOrderType',
      filters: [
        {
          text: status[0],
          value: 'QXGD',
        },
        {
          text: status[1],
          value: 'YFXWHGD',
        },
        {
          text: status[2],
          value: 'XMGD',
        },
        {
          text: status[3],
          value: 'RCWHGD',
        },
      ],
      render(val: IStatusMapType) {
        return <span>{val?status[statusMap.indexOf(val)]:''}</span>;
      },
    },
    {
      title: '最后修改时间',
      dataIndex: 'modifyDate',
      sorter: true,
      render: (val: string) => <span>{val?moment(val).format('YYYY-MM-DD HH:mm:ss'):''}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          {/* 
          <Divider type="vertical" />
          
          <a href="">订阅警报</a>
          */}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'workorder/fetch',
      payload: {page:1,pageSize:10,formValues:{}},
    });
  }

  handleStandardTableChange = (
    pagination: Partial<PaginationConfig>,
    filtersArg: Record<keyof WorkOrderDto, string[]>,
    sorter: SorterResult<WorkOrderDto>,
  ) => {
    const { dispatch } = this.props;
    //const { formValues } = this.state;
    

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<PageQueryParams> = {
      page: pagination.current || 0,
      pageSize: pagination.pageSize,
      //...formValues,
      ...filters,
    };
    if (sorter.field) {
      //params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'workorder/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    /*this.setState({
      formValues: {},
    });*/
    dispatch({
      type: 'workorder/fetch',
      payload: {formValues:{}},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = (e: { key: string }) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'workerorder/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows: WorkOrderDto[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form, workorder } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      //debugger;
      /*const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });*/
      dispatch({
        type: 'workorder/fetch',
        payload: {
          formValues:fieldsValue,
          page:workorder.data.pagination.current,
          pageSize:workorder.data.pagination.pageSize,
        },//values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: FormValsType) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = (fields: { desc: any }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workorder/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = (fields: FormValsType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workorder/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const { form,workorder:{data:{formValues}} } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="工单编号">
              {getFieldDecorator('workOrderCode',{initialValue: formValues.workOrderCode,})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="工单类型">
              {getFieldDecorator('dictWorkOrderType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="QXGD">缺陷工单</Option>
                  <Option value="YFXWXGD">预防性维护工单</Option>
                  <Option value="XMGD">项目工单</Option>
                  <Option value="RCWHGD">日常维护工单</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="工单编号">
              {getFieldDecorator('workOrderCode')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="工单类型">
              {getFieldDecorator('dictWorkOrderType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="QXGD">缺陷工单</Option>
                  <Option value="YFXWXGD">预防性维护工单</Option>
                  <Option value="XMGD">项目工单</Option>
                  <Option value="RCWHGD">日常维护工单</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="工作内容">
              {getFieldDecorator('workOrderContent')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      workorder: { data },
      loading,
    } = this.props;

    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
