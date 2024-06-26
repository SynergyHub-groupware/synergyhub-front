import { delMsg, getBinMsg, getImpMsg, getRevMsg, getSendMsg, getWorkMsg } from "../modules/MessageModules";
import { request } from "./api";

export const callRevMsgListAPI = () => {
    
    return async (dispatch, getState) => {

        try {
            const result = await request('GET', '/emp/message/receive', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callAPI result : ', result);

            if (result && result.status === 200) {

                dispatch(getRevMsg(result.data));
            } else {
                console.log('error : ', result);
            }
        } catch (error) {
            console.log("error : ", error);
        }
        
    };
};

export const callSendMsgListAPI = () => {

    return async (dispatch, getState) => {

        try {
            const result = await request('GET', '/emp/message/send', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callAPI result : ' , result);

            if (result && result.status === 200) {
                dispatch(getSendMsg(result.data));
            } else {
                console.log('error : ', result);
            }
        } catch (error) {
            console.log('error : ', error);
        }
    };
};

export const callBinMsgListAPI = () => {

    return async (dispatch, getState) => {

        try {
            const result = await request('GET', '/emp/message/bin', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callAPI result : ', result);

            if (result && result.status === 200) {
                dispatch(getBinMsg(result.data));
            } else {
                console.log("error : ", result);
            } 
        } catch (error) {
            console.log('error : ', error);
        }
    };
};

export const callImpMsgListAPI = () => {

    return async (dispatch, getState) => {

        try {
            const result = await request('GET', '/emp/message/important', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('call API result : ', result);

            if (result && result.status === 200) {
                dispatch(getImpMsg(result.data));
            } else {
                console.log("error : ", result);
            }  
        } catch (error) {
            console.log("error :", error);
        }
    };
};

export const callWorkMsgListAPI = () => {

    return async (dispatch, getState) => {

        try {
            const result = await request('GET', '/emp/message/work', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('call API result : ', result);

            if (result && result.status === 200) {
                dispatch(getWorkMsg(result.data));
            } else {
                console.log("error : " ,result);
            }
        } catch (error) {
            console.log("error : ", error);
        }
    };
};

export const callDelMsgAPI = (msgCode) => {
    
    return async (dispatch, getState) => {

        try {
            const result = await request('PUT', `/emp/message/receive/${msgCode}/bin`, {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            }, {
                storCode: 5
            });

            if (result && result.status === 200) {
                dispatch(delMsg(msgCode));
            } else {
                console.log("error : ", result);
            }
        } catch (error) {
            console.log("del error : ", error);
        }
    };
};