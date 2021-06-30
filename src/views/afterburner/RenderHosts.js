import React from 'react'
import Cookies from "universal-cookie";
import {
    CSpinner,
    CCardBody,
    CInput,
    CInputGroup,
    CInputGroupAppend,
    CInputGroupText,
    CBadge,
    CSelect
} from '@coreui/react'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";

import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Table from 'react-bootstrap/Table';
import { useTable, useSortBy, useGlobalFilter, useRowSelect } from 'react-table'

import configData from "../../config.json";
import _nav from '../../containers/_nav'

const RenderHosts = () => {

    const dispatch = useDispatch();
    dispatch({ type: 'set', currentSidebar: _nav.Afterburner });
    dispatch({ type: 'set', currentModule: 'Afterburner' });

    const [isLoaderVisible, setLoaderVisibility] = useState("d-none");
    const [editableRowIndex, setEditableRowIndex] = useState(-1);
    const [isHoverRow, setHoverRow] = useState(-1);

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

    const renderHosts = useSelector(state => state.renderHosts)
    const MINUTE_MS = 60000;

    useEffect(() => {
        getRenderHosts();
    }, [])

    // GET all Render Hosts
    const getRenderHosts = () => {
        setLoaderVisibility("");
        fetch(configData.API_URL + "/hosts", {
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
                    element.status = "Offline"
                    break;
                case 1:
                    element.status = "Online"
                    break;
                case 2:
                    element.status = "Unknown"
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
            switch (element.license_redshift) {
                case 0:
                    element.license_redshift = "SG"
                    break;
                case 1:
                    element.license_redshift = "KL"
                    break;
                case 2:
                    element.license_redshift = "SG*"
                    break;
                case 3:
                    element.license_redshift = "KL*"
                    break;
            }
            var render = "";
            if (element.render_arnold) render += "AR ";
            if (element.render_blender) render += "BL ";
            if (element.render_redshift) render += "RS ";
            element.renderer = render;
        }
        dispatch({ type: 'set', renderHosts: data })
    }

    const onUpdateHost = (hostID, hostGroup) => {
        const data = {
            "host_id": hostID,
            "host_tags": hostGroup
        }
        fetch(configData.API_URL + "/host_group", {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "accept": "application/json",
                "Authorization": "Basic " + btoa(user + ":" + token)
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.json()
        }).then(body => {
            console.log(body);
            if (body.detail === "Forbidden") {
                cookies.remove("data");
                history.push("/login");
            } else if (body.result === "Success") {
                dispatch({ type: 'setMultipleRenderHosts', action: 'updateHost', payload: data });
            }
        }).catch(error => {
            console.log(error);
        })
    }

    const updateHostLicense = (hostID, licenseRedshift) => {
        var licenseRedshiftIndex;
        switch (licenseRedshift) {
            case "SG":
                licenseRedshiftIndex = 0
                break;
            case "KL":
                licenseRedshiftIndex = 1
                break;
        }
        const data = {
            "host_id": hostID,
            "redshift_license": licenseRedshiftIndex
        }
        fetch(configData.API_URL + "/host_license", {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "accept": "application/json",
                "Authorization": "Basic " + btoa(user + ":" + token)
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.json()
        }).then(body => {
            console.log(body);
            if (body.detail === "Forbidden") {
                cookies.remove("data");
                history.push("/login");
            } else if (body.result === "Success") {
                dispatch({ type: 'setMultipleRenderHosts', action: 'updateRedshift', payload: { host_id: hostID, license_redshift: licenseRedshift } });
            }
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
        renderHosts.map((row) => {
            getHostProgress(row.host_id);
        })
    }

    const getHostProgress = (host_id) => {
        fetch(configData.API_URL + "/host/" + host_id, {
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
                        data.status = "Offline"
                        break;
                    case 1:
                        data.status = "Online"
                        break;
                    case 2:
                        data.status = "Unknown"
                        break;
                }
                switch (data.license_redshift) {
                    case 0:
                        data.license_redshift = "SG"
                        break;
                    case 1:
                        data.license_redshift = "KL"
                        break;
                    case 2:
                        data.license_redshift = "SG*"
                        break;
                    case 3:
                        data.license_redshift = "KL*"
                        break;
                }
                dispatch({ type: 'setMultipleRenderHosts', action: 'updateProgress', payload: data });
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
        var x = selectedFlatRows.map(d => d.original.host_id)
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
                Header: 'Host / User',
                accessor: 'host_name',
                Cell: ({ row }) => (
                    <div>{row.original.host_name} / {row.original.username}</div>
                ),
            },
            {
                Header: 'User',
                accessor: 'username',
            },
            {
                Header: 'Host Group',
                accessor: 'host_tags',
                Cell: ({ row }) => {
                    const [toggle, setToggle] = useState(true)
                    const [hostGroup, setHostGroup] = useState(row.original.host_tags)
                    const [style, setStyle] = useState("d-none");
                    return (
                        toggle ? (
                            <div className="d-flex text-primary"
                                onMouseEnter={() => { setStyle("d-block") }}
                                onMouseLeave={() => { setStyle("d-none") }}>
                                <CIcon content={freeSet.cilTag} className="pr-1 pt-1" />
                                <div className="text-nowrap d-flex align-items-center"
                                    onClick={() => {
                                        setToggle(false)
                                        setEditableRowIndex(row.index)
                                    }}>
                                    {row.original.host_tags}
                                    {(style === "d-none") ?
                                        <div className="d-block text-white px-2">.</div>
                                        : <CIcon name='cilPencil' className={style + " pl-1"} />
                                    }
                                </div>
                            </div>
                        ) : (
                            <div className="mt-n1 mb-n1">
                                <CInput
                                    className="bg-dark text-white border-top-0 border-left-0 border-right-0"
                                    size="sm"
                                    value={hostGroup}
                                    autoFocus
                                    onChange={(e) => (setHostGroup(e.target.value))}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            onUpdateHost(row.original.host_id, hostGroup)
                                            setToggle(true)
                                            setEditableRowIndex(-1)
                                            setStyle("d-none")
                                        }
                                    }}
                                    onBlur={() => {
                                        onUpdateHost(row.original.host_id, hostGroup)
                                        setToggle(true)
                                        setEditableRowIndex(-1)
                                        setStyle("d-none")
                                    }} />
                            </div>
                        )
                    )
                }
            },
            {
                Header: 'Status',
                accessor: 'status',
                id: 'status',
                Cell: ({ row }) => {
                    switch (row.original.status) {
                        case "Offline":
                            return <div>
                                <CBadge color="danger" size="sm">Offline</CBadge>
                            </div>
                        case "Online":
                            return <div>
                                <CBadge color="success" size="sm">Online</CBadge>
                            </div>
                        case "Unknown":
                            return <div>
                                <CBadge color="dark" size="sm">Unknown</CBadge>
                            </div>
                    }
                }
            },
            {
                Header: 'RDR',
                accessor: 'render_job',
                Cell: ({ row }) => {
                    if (row.original.render_job === null) {
                        return <div>-</div>
                    }
                    return <div>{row.original.render_job}</div>
                }
            },
            {
                Header: 'RDR Time',
                accessor: 'render_job_time',
                Cell: ({ row }) => {
                    if (row.original.render_job_time === null) {
                        return <div>-</div>
                    }
                    return <div>{row.original.render_job_time}</div>
                }
            },
            {
                Header: 'Redshift',
                accessor: 'license_redshift',
                Cell: ({ row }) => {
                    const [toggle, setToggle] = useState(true)
                    const [style, setStyle] = useState("d-none");
                    if (row.original.render_redshift === true) {
                        if (row.original.license_redshift === "SG" || row.original.license_redshift === "KL") {
                            return (
                                toggle ? (
                                    <div className="d-flex text-primary"
                                        onMouseEnter={() => { setStyle("d-block"); }}
                                        onMouseLeave={() => { setStyle("d-none") }}>
                                        <div className="text-nowrap d-flex align-items-center"
                                            onClick={() => {
                                                setToggle(false)
                                                setEditableRowIndex(row.index)
                                            }}>
                                            {row.original.license_redshift}
                                            <CIcon name='cilPencil' className={style + " pl-1"} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-n1 mb-n1">
                                        <CSelect custom name="select" id="select"
                                            autoFocus
                                            className="bg-dark text-white border-top-0 border-left-0 border-right-0"
                                            size="sm"
                                            value={row.original.license_redshift}
                                            onChange={(e) => {
                                                updateHostLicense(row.original.host_id, e.target.value)
                                                setToggle(true)
                                                setEditableRowIndex(-1)
                                                setStyle("d-none")
                                            }}
                                            onBlur={() => {
                                                setToggle(true)
                                                setEditableRowIndex(-1)
                                                setStyle("d-none")
                                            }}>
                                            <option value="SG">SG</option>
                                            <option value="KL">KL</option>
                                        </CSelect>
                                    </div>
                                )
                            )
                        } else {
                            return <div>{row.original.license_redshift}</div>
                        }
                    } else {
                        return <div>-</div>
                    }
                }
            },
            {
                Header: 'Loc',
                accessor: 'location',
            },
            {
                Header: 'CPU',
                accessor: 'cpu',
            },
            {
                Header: 'RAM',
                accessor: 'ram',
                Cell: ({ row }) => {
                    return <div>{row.original.ram}GB</div>
                }
            },
            {
                Header: 'GPU',
                accessor: 'gpu',
            },
            {
                Header: 'Maya',
                accessor: 'maya_version',
            },
            {
                Header: 'Renderers',
                accessor: 'renderer',
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
        columns, data: renderHosts,
        initialState: { globalFilter: globalfilterInput, hiddenColumns: "username" }
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
                                    className={(row.index === isHoverRow || row.index === editableRowIndex) && "bg-secondary text-dark"}
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
        </>
    )
}

export default RenderHosts