import React from 'react'
import Cookies from "universal-cookie";
import {
  CCardBody,
  CInput,
  CLink,
  CInputGroup,
  CInputGroupAppend,
  CInputGroupText,
  CImg,
  CTooltip
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Table from 'react-bootstrap/Table';

import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import { useState } from 'react'
import { useHistory } from "react-router-dom";

import configData from "../../config.json";
import UpdateUser from './UpdateUser'
import _nav from '../../containers/_nav'

const UserList = ({ usersData }) => {

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

  // Update User Modal
  const [modal, setModal] = useState(false)
  const [userData, setUserData] = useState([])

  // GET user by id for update user
  const getUser = (id) => {
    fetch(configData.API_URL + "/user/" + id, {
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
      setUserData(body);
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

  const columns = React.useMemo(
    () => [
      {
        Header: 'Username',
        accessor: 'username',
        Cell: ({ row }) => {
          return <div className="d-flex">
            <div className="c-avatar">
              <CImg src={configData.File_URL + row.original.picture} alt="pic" shape="rounded-circle" height="36" width="36" />
            </div>
            {system_user_role === 0 || system_user_role === 1 ?
              (<CLink className="pl-2 pt-2 text-nowrap"
                onClick={() => {
                  setModal(!modal);
                  getUser(row.original.user_id);
                }}>
                {row.original.username}</CLink>)
              :
              (<span className="pl-2 pt-2 text-nowrap">
                {row.original.username}</span>)
            }
          </div>
        }
      },
      {
        Header: 'Full Name',
        accessor: 'full_name',
        Cell: ({ row }) => {
          return <div>
            <span>{row.original.full_name}</span>
            <CTooltip content={row.original.email} placement="right-end">
              <CLink href={"mailto:" + row.original.email}>
                <CIcon content={freeSet.cilEnvelopeClosed} className="ml-1 mb-1" />
              </CLink>
            </CTooltip>
          </div>
        }
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'User Role',
        accessor: 'user_role',
      },
      {
        Header: 'Job Title',
        accessor: 'job_title',
      },

      {
        Header: 'Department',
        accessor: 'department',
      },
      {
        Header: 'Loc',
        accessor: 'location',
      },
      {
        Header: 'Last Login Time / IP',
        accessor: 'last_login_time',
        Cell: ({ row }) => {
          return <div>
            {row.original.last_login_time === "-" && row.original.last_login_ip === "-" ?
              <span>-</span> :
              <span>
                {row.original.last_login_time} / {row.original.last_login_ip}
              </span>
            }
          </div>
        }
      },
      {
        Header: 'Last Login IP',
        accessor: 'last_login_ip',
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
    columns, data: usersData,
    initialState: { globalFilter: globalfilterInput, hiddenColumns: ["last_login_ip", "email"] } // Set this for row sizes and default global filter
  }, useGlobalFilter, useSortBy)

  return (
    <>
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

      {/* Update User Pop Up Form */}
      <UpdateUser
        showModal={modal}
        onShow={() => setModal(!modal)}
        token={token}
        user={user}
        data={data}
        userData={userData} />
    </>
  )
}

export default UserList