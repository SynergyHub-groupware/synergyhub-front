import { useDispatch, useSelector } from "react-redux";
import PagingBar from "../../../components/commons/PagingBar";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Waiting from "./Waiting";
import Complete from "./Complete";
import Return from "./Return";
import Reference from './Reference';
import {callMyInfoAPI} from "../../../apis/EmployeeAPICalls";
import { callreceiveDocListAPI } from "../../../apis/ApprovalAPICalls";

function ReceiveMain(){
    const {status} = useParams();
    const [title, setTitle] = useState();
    const dispatch = useDispatch();

    const { employee, documents } = useSelector(state => ({
        employee: state.employeeReducer.employee,
        documents: state.approvalReducer.documents
    }));
    useEffect(() => {
        dispatch(callMyInfoAPI());
    }, [dispatch]);

    console.log("status", status);
    console.log("employee", employee);

    // 접근 url에 따라 렌더링 변경
    useEffect(() => {
        switch (status) {
            case 'waiting': setTitle('대기'); break;
            case 'complete': setTitle('완료'); break;
            case 'return': setTitle('반려'); break;
            case 'reference': setTitle('참조/열람'); break;
            default: setTitle('');
        }
        setCurrentPage(1);
    }, [status]);
    
    const renderDocList = () => {
        switch(status){
            case 'waiting': return <Waiting data={currentResults} />; break;
            case 'complete': return <Complete data={currentResults} />; break;
            case 'return': return <Return data={currentResults} />; break;
            case 'reference': return <Reference data={currentResults} />; break;
        }
    }

    // 정보 받아오기
    useEffect(() => {
        employee.emp_code && dispatch(callreceiveDocListAPI({empCode: employee.emp_code, status}));
    }, [employee.emp_code, status]);

    console.log("documents", documents);

    // 검색
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {   // searchResults 초기값 설정
        setSearchResults(documents);
    }, [documents]);
  
    const handleSearch = (event) => {
        event.preventDefault();
    
        if (!searchTerm.trim()) {       // 검색어가 없는 경우, 모든 문서를 그대로 출력
            setSearchResults(documents);
        } else {                        // 검색어가 있는 경우, 검색어를 포함한 문서만 필터링하여 출력
            const filteredDocuments = documents.filter(doc => {
                return Object.values(doc).some(value =>
                    typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
            setSearchResults(filteredDocuments);
        }
        setCurrentPage(1);
    };

    console.log("searchResults", searchResults);

    // 정렬방식 추가
    const [sortOption, setSortOption] = useState('');

    const sortDocuments = (results, option) => {
        switch (option) {
            case '상신일':
                return results.slice().sort((a, b) => new Date(a.adReportDate) - new Date(b.adReportDate));
            case '결재양식':
                return results.slice().sort((a, b) => a.afName.localeCompare(b.afName));
            case '제목':
                return results.slice().sort((a, b) => a.adTitle.localeCompare(b.adTitle));
            case '완료일':
                return results.slice().sort((a, b) => a.talDate.localeCompare(b.talDate));
            case '반려일':
                return results.slice().sort((a, b) => a.talDate.localeCompare(b.talDate));
            default:
                return results;
        }
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
        setCurrentPage(1); // 정렬 방식 변경 시 첫 페이지로 초기화
    };

    console.log("sortOption", sortOption);
    
    // 페이징
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;

    // 현재 페이지의 결과 계산
    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;

    // 검색 결과에 정렬 적용
    const sortedSearchResults = sortDocuments(searchResults, sortOption);
    const currentResults = sortedSearchResults.slice(indexOfFirstResult, indexOfLastResult);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(searchResults.length / resultsPerPage);

    // 페이지 변경 함수
    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    return(        
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">받은결재함 [{title}]</h4>
            {document.talReason &&
                <section className="bl_sect hp_padding15 hp_mb30">
                    <table className="bl_tb3">
                        <colgroup>
                            <col style={{width:'200px'}}/>
                            <col style={{width:'*'}}/>
                        </colgroup>
                        <tbody>
                        <tr>
                            <th scope="col" className="hp_dBack">반려사유</th>
                            <td>{document.talReason}</td>
                        </tr>
                        </tbody>
                    </table>
                </section>}
            <div className="ly_spaceBetween">
                {status == "share" ? (
                    <button type="button" className="el_btnS el_btn8Back">삭제</button>
                ) : (<div></div>)}
                <form onSubmit={handleSearch}>
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="검색어를 입력해주세요"/>
                    <input type="submit" className="el_btnS el_btnblueBord hp_ml5" value="검색"/>
                </form>
            </div>
            {renderDocList()}
            <div className="ly_spaceBetween ly_fitemC hp_mt10">
                <div className="hp_ml10 hp_7Color">총 <b className="hp_0Color hp_fw700">{currentPage}</b> / {totalPages} 페이지</div>
                <select className="" onChange={handleSortChange} value={sortOption}>
                    <option value="">정렬방식</option>
                    {status == "waiting" ? (
                        <option value="상신일">상신일</option>
                    ):""}
                    <option value="결재양식">결재양식</option>
                    <option value="제목">제목</option>
                    {status == "complete" ? (
                        <option value="완료일">완료일</option>
                    ):""}
                    {status == "return" ? (
                        <option value="반려일">반려일</option>
                    ):""}
                </select>
            </div>
            <PagingBar pageInfo={{currentPage, maxPage: totalPages}} setCurrentPage={handlePageChange} />
        </div>
    )
}
export default ReceiveMain;