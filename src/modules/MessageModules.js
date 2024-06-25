import { createActions, handleActions } from "redux-actions";

/* 초기값 */
const initialState = {
    messages: []
};

/* 액션 타입 */
const GET_REV_MSG = 'message/GET_REV_MSG';
const GET_SEND_MSG = 'message/GET_SEND_MSG';


/* 액션 함수 */
export const { message : { getRevMsg }, message : { getSendMsg }} = createActions({
    [GET_REV_MSG] : result => {
        console.log('action : ', result);

        return {message: result};
    },

    [GET_SEND_MSG] : result => {
        console.log('action : ', result);

        return {message: result};
    }

}, initialState);


/* 리듀서 */
const messageReducer = handleActions({
    [GET_REV_MSG] : (state, {payload}) => {
        console.log("reducer : ", payload);

        return {
            ...state,
            messages: payload
        };
    },

    [GET_SEND_MSG] : (state, {payload}) => {
        console.log("reducer : ", payload);

        return {
            ...state,
            messages: payload
        };
    }

}, initialState);

export default messageReducer;