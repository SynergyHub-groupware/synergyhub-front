// import '../../css/personal.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callRegistAppAPI } from '../../apis/EmployeeAPICalls';

function AppointRegist(){

    const dispatch = useDispatch();

    const registAppoints = useSelector(state => state.employeeReducer.registAppoints);

    const [appRegistData, setAppRegistData] = useState({

        aappDate: '',
        empName: '',
        adetType: '',
        adetBefore: '',
        adetAfter: ''

    });

    const [appFormData, setAppFormData] = useState({

        aappNo: generateAppointNumber(),
        aappTitle: ''

    });

    useEffect(() => {
        dispatch(callRegistAppAPI());
    }, [dispatch]);

    const [appRegists, setAppRegists] = useState([]);

    // 발령 번호 생성
    function generateAppointNumber() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');

        const currentAappNos = registAppoints
            .map(app => app.aappNo)
            .filter(no => no.startsWith(`APP-${year}-${month}`))
            .sort();

        let newAappNo = 1;

        if (currentAappNos.length > 0) {
            const lastAappNo = currentAappNos[currentAappNos.length - 1];
            const lastAappNumber = parseInt(lastAappNo.split('-')[3], 10);
            newAappNo = lastAappNumber + 1;
        }

        const formattedAappNo = String(newAappNo).padStart(3, '0');

        return `APP-${year}-${month}-${formattedAappNo}`;
    }


    const handleAddApp = () => {
        const newApp = { ...appRegistData };
        setAppRegists([ ...appRegists, newApp ]);
        setAppRegistData({

            aappDate: '',
            empName: '',
            adetType: '',
            adetBefore: '',
            adetAfter: ''

        });
    };

    const handleChange = (e) => {

        const { name, value } = e.target;
        setAppRegistData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFormChange = (e) => {

        const { name, value } = e.target;

        setAppFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    return(        
        <div className="ly_cont">
            <div className="ly_spaceBetween ly_fitemEnd hp_mb30">
                <h4 className="el_lv1Head">발령등록</h4>
                <button type="button" className="el_btnS el_btnblueBack">일괄등록 & 파일업로드</button>
            </div>
            <section className="bl_sect hp_padding15">
                <table className="bl_tb3">
                    <colgroup>
                        <col style={{width: "120px"}} />
                        <col style={{width: "*"}} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">발령번호</th>
                            <td><input type="text" className="hp_w100" name="aappNO" value={appFormData.aappNo} onChange={handleFormChange} /></td>
                        </tr>
                        <tr>
                            <th scope="row">제목</th>
                            <td><input type="text" className="hp_w100" name="aappTitle" value={appFormData.aappTitle} onChange={handleFormChange} /></td>
                        </tr>
                    </tbody>
                </table>
                <div className="ly_spaceBetween hp_mt20">
                    <h5 className="hp_fw700 hp_fs18">개별등록</h5>
                    <div>
                        <button type="button" className="el_btnS el_btn8Back" onClick={() => 
                            setAppRegistData({
                                aappDate: '',
                                empCode: '',
                                adetType: '',
                                adetBefore: '',
                                adetAfter: ''
                            })
                        }>비우기</button>
                        <button type="button" className="el_btnS el_btn0Back" onClick={handleAddApp}>추가</button>
                    </div>
                </div>
                <table className="bl_tb3 hp_mt10">
                    <colgroup>
                        <col style={{width: "120px"}} />
                        <col style={{width: "*"}} />
                        <col style={{width: "120px"}} />
                        <col style={{width: "*"}} />
                        <col style={{width: "120px"}} />
                        <col style={{width: "*"}} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">발령일</th>
                            <td><input type="date" className="hp_w100" name="aappDate" value={appRegistData.aappDate} onChange={handleChange} /></td>
                            <th scope="row">이름</th>
                            <td><input type="text" className="hp_w100" name="empName" value={appRegistData.empName} onChange={handleChange} /></td>
                            <th scope="row">발령종류</th>
                            <td>
                                <select type="text" className="hp_w100" name="adetType" value={appRegistData.adetType} onChange={handleChange} >
                                    <option>선택</option>
                                    <option>승진</option>
                                    <option>이동</option>
                                    <option>휴직</option>
                                    <option>복직</option>
                                    <option>정직</option>
                                    <option>해고</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">부서</th>
                            <td><input type="text" className="hp_w100" name="dept_title" onChange={handleChange} /></td>
                            <th scope="row">직책</th>
                            <td><input type="text" className="hp_w100" name="title_name" onChange={handleChange} /></td>
                            <th scope="row">직급</th>
                            <td><input type="text" className="hp_w100" name="position_name" onChange={handleChange} /></td>
                        </tr>
                        <tr>
                            <th scope="row">발령 전</th>
                            <td><input type="text" className="hp_w100" name="adetBefore" value={appRegistData.adetBefore} onChange={handleChange} /></td>
                            <th scope="row">발령 후</th>
                            <td><input type="text" className="hp_w100" name="adetAfter" value={appRegistData.adetAfter} onChange={handleChange} /></td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <div className="ly_spaceBetween hp_mt70">
                <button type="button" className="el_btnS el_btn8Back">삭제</button>
                <form action="" method="">
                    <input type="text" className="" id="" name="" value="" placeholder="검색어를 입력해주세요" />
                    <input type="submit" className="el_btnS el_btnblueBord hp_ml5" id="" name="" value="검색" />
                </form>
            </div>
            <section className="bl_sect hp_mt10">
                <table className="bl_tb1">
                    <colgroup>
                        <col style={{width: "50px"}} />
                        <col style={{width: "120px"}} />
                        <col style={{width: "120px"}} />
                        <col style={{width: "120px"}} />
                        <col style={{width: "120px"}} />
                        <col style={{width: "120px"}} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col"><input type="checkbox" className="" id="" name="" value="checkAll" /></th>
                            <th scope="col">발령일</th>
                            <th scope="col">이름</th>
                            <th scope="col">발령종류</th>
                            <th scope="col">발령 전</th>
                            <th scope="col">발령 후</th>
                        </tr>
                    </thead>
                    {/* <!-- 5개씩 나열 --> */}
                    <tbody>
                        <tr>
                            <th scope="row"><input type="checkbox" className="" id="" name="" value="checkOne" /></th>
                            <td></td>
                            <td className="" style={{ textAlign: 'center' }}></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <div className="ly_spaceBetween ly_fitemC hp_mt10">
                <div className="hp_ml10 hp_7Color">총 1 / <b className="hp_0Color hp_fw700">1</b> 페이지</div>
                <select className="">
                    <option value="">정렬방식</option>
                </select>
            </div>
            <section className="bl_sect hp_mt10 hp_padding5" style={{ textAlign: 'center' }}>
                <div className="bl_paging">
                    <a className="bl_paging__btn bl_paging__first" href="" title="첫 페이지로 이동"></a>
                    <a className="bl_paging__btn bl_paging__prev" href="" title="이전 페이지로 이동"></a>
                    <a className="bl_paging__btn bl_paging__num" href="">1</a>
                    <a className="bl_paging__btn bl_paging__next" href="" title="다음 페이지로 이동"></a>
                    <a className="bl_paging__btn bl_paging__last" href="" title="마지막 페이지로 이동"></a>
                </div>
            </section>
        </div>
    )
}
export default AppointRegist;