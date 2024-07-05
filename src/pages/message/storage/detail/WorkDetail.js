import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { callRevDetailAPI, callDelMsgAPI, callGetAttachListAPI, callMoveToRevAPI, callMoveToImpAPI } from "../../../../apis/MessageAPICalls";

function WorkDetail() {

    const { msgCode } = useParams();    // URL에서 msgCode 추출
    const dispatch = useDispatch();     // commit
    const msgDetail = useSelector(state => state.messageReducer.messageDetail);
    const navigate = useNavigate();
    const attachmentList = useSelector(state => state.messageReducer.attachments);

    useEffect(() => {
        
        const sendMsgDetail = async () => {
            try {
                console.log("API 시작");
                await dispatch(callRevDetailAPI(msgCode));
                console.log("msgCode : ", msgCode);
            } catch (error) {
                console.log("error : ", error);
            }
        };
        
        const attachList = async () => {
            try {
                console.log("API 시작");
                await dispatch(callGetAttachListAPI(msgCode));
                console.log("msgCode attach : ", msgCode);
            } catch (error) {
                console.log("attach error : ", error);
            }
        };

        sendMsgDetail();
        attachList();

    }, [dispatch, msgCode]);

    if (!msgDetail) {
        console.log("msgDetail : ", msgDetail);
        return <div>로딩중..</div>;
    }

    /* 날짜 포맷 함수 */
    const formatDateTime = (datetimeString) => {
        const date = new Date(datetimeString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
    };

    /* 답장 핸들러 */
    const replyHandler = () => {
        navigate('/message/storage/deliver', {
            state: {
                empRev: msgDetail.messageDetail.revName,
                msgTitle: `RE: ${msgDetail.messageDetail.msgTitle}`
            }
        });
    };
    
    /* 전달 핸들러 */
    const transHandler = () => {
        navigate('/message/storage/deliver', {
            state: {
                msgTitle: `FW: ${msgDetail.messageDetail.msgTitle}`,
                msgCon: `${msgDetail.messageDetail.msgCon}`
            }
        })
    }

    /* 삭제 핸들러 */
    const deleteHandler = async () => {

        try {
            console.log(msgCode);
            await dispatch(callDelMsgAPI(msgCode));
            alert("쪽지를 삭제했습니다.");
            navigate("/message/storage/send");
        } catch (error) {
            console.log("삭제 중 오류 : ", error);
            alert("쪽지 삭제에 실패했습니다.");
        }
    };   
    
    // 파일 다운로드
    const downloadAttach = async (attachOriginal, attachSave) => {
        
        try {
            const url = `http://localhost:8080/emp/message/download?attachOriginal=${encodeURIComponent(attachOriginal)}&attachSave=${encodeURIComponent(attachSave)}`;

            const response = await fetch(url);

            if(!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const blob = await response.blob();

            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;

            link.setAttribute('download', attachOriginal);
            document.body.appendChild(link);
            link.click();

            window.URL.revokeObjectURL(blobUrl);
        } catch(error) {
            console.log("파일 다운로드 error : ", error);
        }
    }

    // 보관함 이동 핸들러
    const moveMsgHandler = (e) => {
        const selectOption = e.target.value;
        
        if (selectOption === "받은 쪽지") {
            moveMsgToRevHandler();

        } else if (selectOption === "중요 보관함") {
            moveMsgToImpHandler();
        }
    };

    // 받은 쪽지 이동 핸들러
    const moveMsgToRevHandler = async () => {
        try {
            await dispatch(callMoveToRevAPI(msgCode));
            alert("받은 쪽지로 이동 되었습니다.");
            navigate('/message/storage/receive');

        } catch (error) {
            console.log("받은 쪽지 이동 중 오류 : ", error);
            window.location.reload();
        }
    }

    // 중요 보관함 이동 핸들러
    const moveMsgToImpHandler = async () => {
        try {
            await dispatch(callMoveToImpAPI(msgCode));
            alert("중요 보관함으로 이동 되었습니다.");
            navigate('/message/storage/important');

        } catch (error) {
            console.log("중요 보관함 이동 중 오류 : ", error);
            window.location.reload();
        }
        
    }

    return (
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">업무 보관함</h4>
            <section className="bl_sect hp_padding15">
                <table className="bl_tb3">
                    <colgroup>
                        <col style={{width: "120px"}} />
                        <col style={{width:"*"}} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="col">보낸사람</th>
                            <td className="hp_alignL">{msgDetail.messageDetail && msgDetail.messageDetail.sendName} {msgDetail.messageDetail && msgDetail.messageDetail.sendPosition}</td>
                        </tr>
                        <tr>
                            <th scope="col">수신일</th>
                            <td className="hp_alignL">{msgDetail.messageDetail && formatDateTime(msgDetail.messageDetail.sendDate)}</td>
                        </tr>
                        <tr>
                            <th scope="col">첨부파일</th>
                            <td className="hp_alignL">
                                {attachmentList.msgCode && attachmentList.msgCode.length > 0 ? (
                                    <ul>
                                        {attachmentList.msgCode.map(attach => (
                                            <li key={attach.attachSave} onClick={() => downloadAttach(attach.attachOriginal, attach.attachSave)}>{attach.attachOriginal}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div>첨부된 파일 없음</div>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="hp_alignL">{msgDetail.messageDetail && msgDetail.messageDetail.msgTitle}</td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="hp_alignL">{msgDetail.messageDetail && msgDetail.messageDetail.msgCon}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="ly_spaceBetween hp_mt10">
                    <div></div>
                    <div className="ly_spaceBetween">
                        <button type="button" className="el_btnS el_btn8Back hp_mr5" onClick={deleteHandler}>삭제</button>
                        <select className="el_btnS el_btn8Bord" onChange={moveMsgHandler}>
                            <option>이동</option>
                            <option>받은 쪽지</option>
                            <option>중요 보관함</option>
                        </select>
                        <button type="button" className="el_btnS el_btnblueBord hp_ml5" onClick={transHandler}>전달</button>
                        <button type="button" className="el_btnS el_btnblueBack hp_ml5" onClick={replyHandler}>답장</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default WorkDetail;