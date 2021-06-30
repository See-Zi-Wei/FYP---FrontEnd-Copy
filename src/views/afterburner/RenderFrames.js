import React from 'react'
import Cookies from "universal-cookie";
import {
  CCardBody,
  CInput,
  CInputGroup,
  CInputGroupAppend,
  CInputGroupText,
  CBadge,
  CSpinner
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";

import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Table from 'react-bootstrap/Table';
import { useTable, useSortBy, useGlobalFilter, useRowSelect } from 'react-table'
import Moment from 'moment';

import configData from "../../config.json";
import _nav from '../../containers/_nav'

const RenderFrames = () => {

  const dispatch = useDispatch();
  dispatch({ type: 'set', currentSidebar: _nav.Afterburner });
  dispatch({ type: 'set', currentModule: 'Afterburner' });

  const [isLoaderVisible, setLoaderVisibility] = useState("d-none");
  const [isHoverRow, setHoverRow] = useState(-1);

  const history = useHistory();
  const cookies = new Cookies();
  const data = cookies.get('data');
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

  const jobFramesData = useSelector(state => state.renderFrames);
  const frame = cookies.get('frame');
  var job_id;
  if (frame === undefined) {
    history.push("/renderJobs")
  } else {
    job_id = frame["job_id"]
  }

  useEffect(() => {
    getRenderFrames()
  }, [])

  // GET all Render Frames
  const getRenderFrames = () => {
    setLoaderVisibility("");
    fetch(configData.API_URL + '/render_frames/' + job_id, {
      method: "GET",
      headers: {
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
      handleIndexValues(body)
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
      if (element.start_time === null) {
        element.start_time = "-"
      } else {
        element.start_time = Moment(element.start_time)
          .utc()
          .format("DD-MMM-YY HH:mm:ss")
      }
      if (element.end_time === null) {
        element.end_time = "-"
      } else {
        element.end_time = Moment(element.end_time)
          .utc()
          .format("DD-MMM-YY HH:mm:ss")
      }
    }
    dispatch({ type: 'set', renderFrames: data })
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
    var x = selectedFlatRows.map(d => d.original.frame_id)
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
        Header: 'Frame',
        accessor: 'frame_num',
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
        Header: 'Try',
        accessor: 'tries',
      },
      {
        Header: 'Host',
        accessor: 'host_name',
        Cell: ({ row }) => {
          return <div>
            {row.original.host_name === null ?
              "-" :
              <span>{row.original.host_name}</span>
            }
          </div>
        }
      },
      {
        Header: 'Start Time',
        accessor: 'start_time',
      },
      {
        Header: 'End Time',
        accessor: 'end_time',
      },
      {
        Header: 'Elapsed Time',
        accessor: 'elapsed_time',
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
    columns, data: jobFramesData,
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
              className=""
              placeholder="Search"
            />
            <CInputGroupAppend>
              <CInputGroupText >
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
                    className="pl-4 font-weight-normal py-3" >
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
export default RenderFrames;