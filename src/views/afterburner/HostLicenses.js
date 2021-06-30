import React from 'react'
import Cookies from "universal-cookie";
import {
    CSpinner,
    CCardBody,
    CInput,
    CInputGroup,
    CInputGroupAppend,
    CInputGroupText,
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";

import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Table from 'react-bootstrap/Table';
import { useTable, useSortBy, useGlobalFilter, useRowSelect } from 'react-table'
import Moment from 'moment';

import configData from "../../config.json";
import _nav from '../../containers/_nav'

const HostLicenses = () => {

    const dispatch = useDispatch();
    dispatch({ type: 'set', currentSidebar: _nav.Afterburner });
    dispatch({ type: 'set', currentModule: 'Afterburner' });

    const [isLoaderVisible, setLoaderVisibility] = useState("d-none");
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

    const [hostLicenses, setHostLicenses] = useState([]);

    useEffect(() => {
        getHostLicenses();
    }, [])

    // GET all Host Licenses
    const getHostLicenses = () => {
        setLoaderVisibility("");
        fetch(configData.API_URL + "/redshift_license_list", {
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
            element.out_time = Moment(element.out_time)
                .format("DD-MMM-YY HH:mm:ss")
            element.updated_time = Moment(element.updated_time)
                .format("DD-MMM-YY HH:mm:ss")
        }
        setHostLicenses(data)
    }

    // Filtering (Search Bar)
    const [globalfilterInput, setGlobalFilterInput] = useState("");

    // Update the state when input changes
    const handleGlobalFilterChange = (e) => {
        const value = e.target.value || undefined;
        setGlobalFilter(value || undefined)
        setGlobalFilterInput(value);
    };

    const columns = React.useMemo(
        () => [
            {
                Header: 'Num.',
                Cell: ({ row }) => {
                    return <div>
                        {row.index + 1}
                    </div>
                }
            },
            {
                Header: 'Product',
                accessor: 'product_name',
            },
            {
                Header: 'Version',
                accessor: 'product_version',
            },
            {
                Header: 'User',
                accessor: 'username',
            },
            {
                Header: 'Host',
                accessor: 'host_name',
            },
            {
                Header: 'Loc',
                accessor: 'location',
            },
            {
                Header: 'License',
                accessor: 'num_license',
            },
            {
                Header: 'Out Time',
                accessor: 'out_time',
            },
            {
                Header: 'Updated Time',
                accessor: 'updated_time',
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
    } = useTable({
        columns, data: hostLicenses,
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
        </>
    )
}

export default HostLicenses