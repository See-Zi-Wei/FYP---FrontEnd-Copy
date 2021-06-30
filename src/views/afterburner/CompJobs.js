import React from 'react'
import Cookies from "universal-cookie";
import {
    CSpinner,
    CCardBody,
    CInput,
    CLink,
    CInputGroup,
    CInputGroupAppend,
    CInputGroupText,
    CBadge,
} from '@coreui/react'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";

import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Table from 'react-bootstrap/Table';
import { useTable, useSortBy, useGlobalFilter, useRowSelect } from 'react-table'
import Moment from 'moment';

import configData from "../../config.json";
import _nav from '../../containers/_nav'
import UpdateCompJob from './UpdateCompJob'

const CompJobs = () => {

    const dispatch = useDispatch();
    dispatch({ type: 'set', currentSidebar: _nav.Afterburner });
    dispatch({ type: 'set', currentModule: 'Afterburner' });

    const [isLoaderVisible, setLoaderVisibility] = useState("d-none");
    const [isHoverRow, setHoverRow] = useState(-1);

    // Update Comp Job Modal
    const [modal, setModal] = useState(false)
    const [jobData, setJobData] = useState([])

    const history = useHistory();
    const cookies = new Cookies();
    const data = cookies.get('data')
    var token, user, system_user_role;
    if (data === undefined) {
        history.push("/login")
    } else {
        token = data["token"]
        user = data["username"]
        system_user_role = data["user_role"]
    }

    // Check for access right to prevent user by typing the url manually
    if (system_user_role === 3 || system_user_role === 4) history.push("/");

    const compJobs = useSelector(state => state.compJobs)
    const MINUTE_MS = 60000;

    useEffect(() => {
        getCompJobs();
    }, [])

    // GET all Comp Jobs
    const getCompJobs = () => {
        setLoaderVisibility("");
        fetch(configData.API_URL + "/comp_jobs", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "accept": "application/json",
                "Authorization": "Basic " + btoa(user + ":" + token)
            },
        }).then(response => {
            return response.json()
        }).then(body => {
            console.log(body);
            setLoaderVisibility("d-none");
            if (body.detail === "Forbidden") {
                cookies.remove("data");
                history.push("/login")
            }
            handleIndexValues(body);
        }).catch(error => {
            setLoaderVisibility("d-none");
            console.log(error);
        })
    }

    const handleIndexValues = (body) => {
        const data = body;
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            switch (element.status) {
                case 0:
                    element.status = "Fail"
                    break;
                case 1:
                    element.status = "Done"
                    break;
                case 2:
                    element.status = "Queue"
                    break;
                case 3:
                    element.status = "Run"
                    break;
                case 4:
                    element.status = "Paused"
                    break;
            }
            switch (element.location) {
                case 0:
                    element.location = "SG"
                    break;
                case 1:
                    element.location = "KL"
                    break;
                case 2:
                    element.location = "BG"
                    break;
            }
            switch (element.comp_software) {
                case 0:
                    element.comp_software = "Blender"
                    break;
            }
            element.updated_time = Moment(element.updated_time)
                .format("DD-MMM-YY HH:mm")
        }
        dispatch({ type: 'set', compJobs: data })
    }

    // GET individual Comp Job for update
    const getCompJob = (id) => {
        fetch(configData.API_URL + "/comp_job/" + id, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "accept": "application/json",
                "Authorization": "Basic " + btoa(user + ":" + token)
            },
        }).then(response => {
            return response.json()
        }).then(body => {
            console.log(body);
            if (body.detail === "Forbidden") {
                cookies.remove("data");
                history.push("/login")
            }
            const data = body;
            switch (data.host_location) {
                case 0:
                    data.host_locationValue = "Singapore"
                    break;
                case 1:
                    data.host_locationValue = "Kuala Lumpur"
                    break;
            }
            switch (data.comp_software) {
                case 0:
                    data.comp_softwareValue = "Blender"
                    break;
            }

            setJobData(data);
        }).catch(error => {
            console.log(error);
        })
    }

    // Update Progress Bar every 1 minutes
    useInterval(() => {
        intervalProgress();
    }, MINUTE_MS);

    function useInterval(callback, delay) {
        const savedCallback = useRef();

        useEffect(() => {
            savedCallback.current = callback;
        });

        useEffect(() => {
            function tick() {
                savedCallback.current();
            }

            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }, [delay]);
    }

    const intervalProgress = () => {
        compJobs.map((row) => {
            if (row.status === "Queue" || row.status === "Run") {
                getCompProgress(row.job_id);
            }
        })
    }

    const getCompProgress = (job_id) => {
        fetch(configData.API_URL + "/comp_job_progress/" + job_id, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "accept": "application/json",
                "Authorization": "Basic " + btoa(user + ":" + token)
            },
        }).then(response => {
            return response.json()
        }).then(body => {
            console.log(body);
            if (body.detail === "Forbidden") {
                cookies.remove("data");
                history.push("/login")
            } else {
                const data = body;
                switch (data.status) {
                    case 0:
                        data.status = "Fail"
                        break;
                    case 1:
                        data.status = "Done"
                        break;
                    case 2:
                        data.status = "Queue"
                        break;
                    case 3:
                        data.status = "Run"
                        break;
                    case 4:
                        data.status = "Paused"
                        break;
                }
                dispatch({ type: 'setMultipleCompJobs', action: 'updateProgress', payload: data });
            }
        }).catch(error => {
            console.log(error);
        })
    }

    // Filtering (Search Bar)
    const [globalfilterInput, setGlobalFilterInput] = useState("");

    // Update the state when input changes
    const handleGlobalFilterChange = (e) => {
        const value = e.target.value || undefined;
        setGlobalFilter(value || undefined)
        setGlobalFilterInput(value);
    };

    // Checkbox
    const IndeterminateCheckbox = React.forwardRef(
        ({ indeterminate, ...rest }, ref) => {
            const defaultRef = React.useRef()
            const resolvedRef = ref || defaultRef

            React.useEffect(() => {
                resolvedRef.current.indeterminate = indeterminate
            }, [resolvedRef, indeterminate])

            return (
                <>
                    <input type="checkbox" ref={resolvedRef} {...rest} />
                </>
            )
        }
    )

    useEffect(() => {
        var x = selectedFlatRows.map(d => d.original.job_id)
        cookies.set("selectedrows", x, { path: "/" });
    }, [IndeterminateCheckbox])

    const columns = React.useMemo(
        () => [
            {
                Header: ({ getToggleAllRowsSelectedProps }) => (
                    <div>
                        <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                    </div>
                ),
                Cell: ({ row }) => (
                    <div>
                        <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                    </div>
                ),
                accessor: 'check-box',
                disableSortBy: true,
                disableFilters: true,
            },
            {
                Header: 'JobID',
                accessor: 'job_id',
            },
            {
                Header: 'Job Name',
                accessor: 'job_name',
                Cell: ({ row }) => {
                    return <div className="d-flex">
                        <CLink className="pl-2 text-nowrap"
                            onClick={() => {
                                setModal(!modal);
                                getCompJob(row.original.job_id);
                            }}>
                            {row.original.job_name}</CLink>
                    </div>
                }
            },
            {
                Header: 'Modified',
                accessor: 'updated_time',
            },
            {
                Header: 'Owner',
                accessor: 'created_by',
            },
            {
                Header: 'Loc',
                accessor: 'location',
            },
            {
                Header: 'Status',
                accessor: 'status',
                id: 'status',
                Cell: ({ row }) => {
                    switch (row.original.status) {
                        case "Fail":
                            return <div>
                                <CBadge color="danger" size="sm">Fail</CBadge>
                            </div>
                        case "Done":
                            return <div>
                                <CBadge color="success" size="sm">Done</CBadge>
                            </div>
                        case "Queue":
                            return <div>
                                <CBadge color="info" size="sm">Queue</CBadge>
                            </div>
                        case "Run":
                            return <div>
                                <CBadge color="warning" size="sm">Run</CBadge>
                            </div>
                        case "Paused":
                            return <div>
                                <CBadge color="dark" size="sm">Paused</CBadge>
                            </div>
                    }
                }
            },
            {
                Header: 'Software',
                accessor: 'comp_software',
            },
            {
                Header: 'Host',
                accessor: 'host_name',
                Cell: ({ row }) => {
                    return <div>
                        {row.original.host_name === null || row.original.host_name === "" ?
                            <span>-</span> :
                            <span>
                                {row.original.host_name}
                            </span>
                        }
                    </div>
                }
            },
            {
                Header: 'Priority',
                accessor: 'priority',
            },
            {
                Header: 'Comptime',
                accessor: 'elapsed_time',
                Cell: ({ row }) => {
                    if (row.original.elapsed_time === "00:00:00") {
                        return <div>-</div>
                    }
                    return <div>{row.original.elapsed_time}</div>
                }
            },
        ],
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setGlobalFilter,
        selectedFlatRows,
    } = useTable({
        columns, data: compJobs,
        initialState: { globalFilter: globalfilterInput }
    }, useGlobalFilter, useSortBy, useRowSelect)

    return (
        <>
            <div className={isLoaderVisible + " float-left ml-4 mt-3 mb-n1"}>
                <CSpinner color="info" grow />
            </div>
            <CCardBody className="bg-white mt-n4">
                <div className="col-4 ml-auto mr-n2 my-n1">
                    <CInputGroup>
                        <CInput
                            value={globalfilterInput}
                            onChange={handleGlobalFilterChange}
                            placeholder="Search"
                        />
                        <CInputGroupAppend>
                            <CInputGroupText>
                                <CIcon content={freeSet.cilSearch} />
                            </CInputGroupText>
                        </CInputGroupAppend>
                    </CInputGroup>
                </div>

                {/* React-Boostrap Table */}
                <Table {...getTableProps()} striped responsive="sm" className="mt-3">
                    <thead className="bg-dark font-weight-normal">
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className="pl-4 font-weight-normal py-3 text-nowrap" >
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? <CIcon content={freeSet.cilArrowBottom} size={'sm'} />
                                                    : <CIcon name="cil-arrow-top" size={'sm'} />
                                                : ''}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map(row => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()}
                                    className={row.index === isHoverRow && "bg-secondary text-dark"}
                                    onMouseEnter={() => { setHoverRow(row.index) }}
                                    onMouseLeave={() => { setHoverRow(-1) }}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                className="pl-4 align-middle py-2 text-nowrap">
                                                {cell.render('Cell')}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </CCardBody>

            {/* Update Comp Job Pop Up Form */}
            <UpdateCompJob
                showModal={modal}
                onShow={() => setModal(!modal)}
                token={token}
                user={user}
                data={data}
                jobData={jobData} />
        </>
    )
}

export default CompJobs