import { PageQueryParams, PageQueryResult,ResultPageInfo } from "@/pages/ex/components/StandardTable/data.d";

export interface WorkOrderDto{
    id?: string;
    mainWorkOrderId:string;
    workOrderCode?: string;
    workOrderContent: string;
    workOrderCreateDate: string;
    workOrderCreatorDeptId?: string;
    workOrderCreatorId?: {};
    workOrderDeptId?: string;

    instanceId: string;
    instanceNumber: string;
    dictWorkOrderType: string;
    dictYesNo: string;
    specialityCode?: string;

    responseDeptId?: {};
    responsePersonId?: {};
    operWorkId?: {};
    parentAssignWorkOrderId?: {};
    planEndTime?: string;
    planStartTime?: string;
    planTimeLength?: string;
    prodId?: string;
    proWorkId?: string;
    processStatus?: string;
    pworkId?:{};

    remark?: string;
    itemKey?: string;
    recorder?: string;
    recordDate?: string;
    modifier?: string;
    modifyDate?: string;
    orgId?: string|null;
}

