import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';

interface StateType {
    counting:number;
  }
  
type Effect = (
    action: AnyAction,
    effects: EffectsCommandMap & { select: <T>(func: (state: {helloWorld:StateType}) => T) => T },
) => void;

interface ModelType {
    namespace: string;
    state: StateType;
    effects: {
        addBtnClick: Effect;
        subBtnClick: Effect;
    };
    reducers: {
        modify: Reducer<StateType>;
    };
}

const Model:ModelType = {
    namespace: 'helloWorld',
    state:{
        counting:0,
    },
    effects:{
        *addBtnClick(act, {put, select}){
            const count = yield select(({helloWorld}) => {
                return helloWorld.counting
            });

            yield put({
                type:'modify',
                payload:{
                    counting: count + 1
                }
            });
        },
        *subBtnClick(_, {put, select}){
            const count = yield select (stat => stat.helloWorld.counting)
            yield put({
                type:'modify',
                payload:{
                    counting: count - 1
                }
            })
        }
    },

    reducers:{
        modify(state, {payload}){
            return {
                ...state,
                ...payload
            };
        }
    }
}

export default Model;