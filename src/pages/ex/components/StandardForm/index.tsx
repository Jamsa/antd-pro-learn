import Form, { FormComponentProps } from "antd/lib/form";
import { Component, Dispatch, ReactNode } from "react";
import React from "react";
import Modal, { ModalProps } from "antd/lib/modal";

/**
 * 创建表单HOC组件的参数
 */
export interface CreateFormOptions {
    moduleCode: string;
    keyName: string;
    modal?: boolean;
    ajaxLoad?:boolean;
}

/**
 * 注入给子被包装组件的属性
 * @template T DTO数据类型
 */
export interface StandardFormInjectedProps<T> extends FormComponentProps<Partial<T>> {
    handleGet: ()=>void;
    handleUpdate: ()=>void;
    handleClose: ()=>void;
    fieldsValue: Partial<T>; //字段值
    
}

/**
 * HOC组件的属性
 */
interface StandardFormProps{
    //visible: boolean; //是否可见
    onClose?: ()=>void;
    onGet?: ()=>void;
    onUpdate?: ()=>void;

    //重叠属性
    form:any;
    fieldsValue: any;
    dispatch: Dispatch<any>;
}

/**
 * HOC组件的状态
 */
export interface StandardFormState<T>{
    //visible: boolean;
    //fieldsValue?: Partial<T>;
}

const createForm = <T,P extends StandardFormInjectedProps<T>/*,S extends StandardFormState<T>*/>(options: CreateFormOptions) => (
    _FormComponent: React.ComponentType<P>
    )=>{
        // TypeScript issues: https://github.com/piotrwitek/react-redux-typescript-guide/issues/111
        const FormComponent = _FormComponent as React.ComponentType<StandardFormInjectedProps<T>>;
        type HOCProps = Omit<P,keyof StandardFormInjectedProps<T>> & StandardFormProps;
        type HOCState = StandardFormState<T>;

        //表单HOC
        class StandardForm extends Component<HOCProps,HOCState> {
            static displayName = `StandardForm(${FormComponent.name})`;

            //类静态变量
            static formOptions:CreateFormOptions = {
                modal:false,
                ajaxLoad:false,
                ...options
            }

            static defaultProps = {
                //visible: false,
                fieldsValue: {},
                
            }

            /*state: Readonly<HOCState> = {
                visible: false,
                //fieldsValue:{},
            }*/

            handleClose = () =>{
                const {onClose} = this.props;
                if(onClose){
                    onClose();
                }
            }

            handleGet = () => {
                console.log('handleGet');
                const {moduleCode,keyName} = StandardForm.formOptions;
                const { dispatch,fieldsValue } = this.props;
                dispatch({
                    type:`${moduleCode}/get`,
                    payload:{id:fieldsValue[keyName]},
                    callback:function(data:Partial<T>){
                        this.setState({fieldsValue:data});
                    }
                })
            }

            handleUpdate = () => {
                const {form,dispatch} = this.props;
                //const {moduleCode,keyName} = StandardForm.formOptions;

                form.validateFields((err, fieldsValue) => {
                    console.log('handleUpdate',fieldsValue);
                    this.handleClose();
                    if (err) return;
                    
                });
            }

            componentDidMount(){
                const {ajaxLoad} = StandardForm.formOptions;
                if(ajaxLoad){
                    this.handleGet()
                }
            }

            constructor(props: HOCProps) {
                super(props);
                //const {modal} = StandardForm.formOptions;
                this.state = {
                    //visible : props.modal?(props.modal.visible?true:false):false,
                    //fieldsValue : props.fieldsValue,
                    //modal: props.modal,
                }
            }

            render() {
                return (<FormComponent {...this.props}
                    handleGet= {this.handleGet}
                    handleUpdate= {this.handleUpdate}
                    handleClose  = {this.handleClose}
                />);
            }
        }

        return Form.create<HOCProps>()(StandardForm as any) as React.ComponentType<Omit<HOCProps,'form'|'dispatch'>>;
        //return compose(Form.create<HOCProps>())(StandardForm);
        //return StandardForm as React.ComponentType<HOCProps>;
    }

    /*const createForm = <T,P extends StandardFormInjectedProps>(opts:CreateFormOptions,form: React.ComponentType<P>)=>{

        return Form.create<Omit<P,keyof StandardFormInjectedProps> & StandardFormProps<T>>()(_createForm<T,P>(opts)(form) as any);
    }

    const createForm1 = <T,P extends FormComponentProps>(opts:CreateFormOptions,form: React.ComponentType<P & StandardFormInjectedProps>)=>{
        return Form.create<P>()(_createForm<T,P & StandardFormInjectedProps>(opts)(form) as any);
    }*/



//export default Form.create<StandardFormProps>()(UpdateForm);
export default createForm;

export interface StandardFormContainerProps extends ModalProps{
    children? : ReactNode;
    buttonBar? : ReactNode;
}
const StandardFormContainer = (props:StandardFormContainerProps)=>{
    const {buttonBar, ...rest} = props;
    //debugger;
    return (<Modal {...rest} footer={buttonBar}>
        {props.children}
    </Modal>);
}

export {StandardFormContainer};