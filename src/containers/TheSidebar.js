import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavTitle,
  CSidebarNavItem,
  CImg,
  CButton,
  CRow,
  CSpinner,
  CDataTable,
  CProgress,
  CBadge,
  CForm,
  CFormGroup,
  CLabel,
  CInput,
} from '@coreui/react'

import CreateUser from 'src/views/users/CreateUser'
import CreateRenderJob from 'src/views/afterburner/CreateRenderJob'
import CreateCompJob from 'src/views/afterburner/CreateCompJob'
import UpdatePriority from 'src/views/afterburner/UpdatePriority'
import CreateProject from 'src/views/projects/CreateProject'
import CreateEpisode from 'src/views/projects/project/CreateEpisode'

import Cookies from "universal-cookie";
import configData from "../config.json";
import { useHistory, useLocation } from 'react-router-dom';

const TheSidebar = () => {

  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)

  const location = useLocation();
  const history = useHistory();
  const cookies = new Cookies();
  const data = cookies.get('data')
  var token, user, system_user_role;
  if (data === undefined) {
    history.push("/login")
  } else {
    token = data["token"];
    user = data["username"];
    system_user_role = data["user_role"];
  }

  // To show the correct sidebar in page
  const sidebarPage = useSelector(state => state.currentSidebar)

  // To display the custom sidebar item for different module
  const currentModule = useSelector(state => state.currentModule)

  // To display the custom sidebar item for different project type (Standalone & Series)
  const currentProject = useSelector(state => state.currentProject)


  // Create User Modal
  const [modal, setModal] = useState(false);

  // Create Render Job Modal
  const [renderJobModal, setRenderJobModal] = useState(false);

  // Update Priority Modal
  const [priorityModal, setPriorityModal] = useState(false);

  // Create Comp Job Modal
  const [compJobModal, setCompJobModal] = useState(false);

  // Create New Project Modal
  const [projectModal, setProjectModal] = useState(false);

  // Create New Episode Modal
  const [episodeModal, setEpisodeModal] = useState(false);

  var selectedrows = cookies.get('selectedrows');
  var selection = !!selectedrows ? selectedrows : [];

  const [isLoaderVisible, setLoaderVisibility] = useState("d-none");

  const onUpdateStatus = (statusIndex, updateStatusPath) => (e) => {
    e.preventDefault();

    selectedrows = cookies.get('selectedrows');
    selection = !!selectedrows ? selectedrows : [];
    if (selection.length === 0) {
      alert("Please select at least 1 job.")
      return
    };

    const data = {
      "ids": selection
    }

    setLoaderVisibility("");
    fetch(configData.API_URL + updateStatusPath + statusIndex, {
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
      setLoaderVisibility("d-none");
      if (body.detail === "Forbidden") {
        cookies.remove("data");
        history.push("/login");
      } else if (body.result === "Success") {
        switch (statusIndex) {
          case 0:
            statusIndex = "Fail"
            break;
          case 1:
            statusIndex = "Done"
            break;
          case 2:
            statusIndex = "Queue"
            break;
          case 3:
            statusIndex = "Run"
            break;
          case 4:
            statusIndex = "Paused"
            break;
        }
        if (location.pathname === '/renderJobs') {
          selection.map((id) => {
            dispatch({ type: 'setMultipleRenderJobs', action: 'update', payload: { id: id, statusIndex: statusIndex } });
          })
        } else if (location.pathname === '/renderJobs/renderFrames') {
          selection.map((id) => {
            dispatch({ type: 'setMultipleRenderFrames', payload: { id: id, statusIndex: statusIndex } });
          })
        } else if (location.pathname === '/compJobs') {
          selection.map((id) => {
            dispatch({ type: 'setMultipleCompJobs', action: 'update', payload: { id: id, statusIndex: statusIndex } });
          })
        } else if (location.pathname === '/renderHosts') {
          switch (statusIndex) {
            case "Fail": // Since above statusIndex had been changed
              statusIndex = "Offline" // case 0 will be "Fail"
              break;
            case "Done":
              statusIndex = "Online" // case 1 will be "Done"
              break;
          }
          selection.map((id) => {
            dispatch({ type: 'setMultipleRenderHosts', action: 'update', payload: { id: id, statusIndex: statusIndex } });
          })
        }
      }
    }).catch(error => {
      setLoaderVisibility("d-none");
      console.log(error);
    })
  }

  const onDelete = jobPath => (e) => {
    e.preventDefault();

    selectedrows = cookies.get('selectedrows');
    selection = !!selectedrows ? selectedrows : [];
    if (selection.length === 0) {
      alert("Please select at least 1 job.")
      return
    };

    const data = {
      "ids": selection
    }

    if (location.pathname === '/renderHosts') {
      alert("Selected hosts will be removed. This only applies to hosts with Unknown status.")
    }

    setLoaderVisibility("");
    fetch(configData.API_URL + jobPath, {
      method: "DELETE",
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
      setLoaderVisibility("d-none");
      if (body.detail === "Forbidden") {
        cookies.remove("data");
        history.push("/login");
      } else if (body.result === "Success") {
        if (location.pathname === '/renderJobs') {
          selection.map((id) => {
            dispatch({ type: 'setMultipleRenderJobs', action: 'delete', payload: { id: id } });
          })
        } else if (location.pathname === '/compJobs') {
          selection.map((id) => {
            dispatch({ type: 'setMultipleCompJobs', action: 'delete', payload: { id: id } });
          })
        } else if (location.pathname === '/renderHosts') {
          selection.map((id) => {
            dispatch({ type: 'setMultipleRenderHosts', action: 'delete', payload: { id: id } });
          })
        }
      }
    }).catch(error => {
      setLoaderVisibility("d-none");
      console.log(error);
    })
  }

  const onUpdateQueueFailed = (e) => {
    e.preventDefault();

    selectedrows = cookies.get('selectedrows');
    selection = !!selectedrows ? selectedrows : [];
    if (selection.length === 0) {
      alert("Please select at least 1 job.")
      return
    };

    const data = {
      "ids": selection
    }

    setLoaderVisibility("");
    fetch(configData.API_URL + "/render_job_queue_failed", {
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
      setLoaderVisibility("d-none");
      if (body.detail === "Forbidden") {
        cookies.remove("data");
        history.push("/login");
      } else if (body.result === "Success") {
        selection.map((id) => {
          dispatch({ type: 'setMultipleRenderJobs', action: 'updateQueueFailed', payload: { id: id } });
        })
      }
    }).catch(error => {
      setLoaderVisibility("d-none");
      console.log(error);
    })
  }

  // Render Hosts Redshift and Storage Info Table
  const [redshiftData, setRedshiftData] = useState([]);
  const [storageData, setStorageData] = useState([]);
  const customFontSize = {
    fontSize: "11px"
  };
  const fields = [
    { key: 'REDSHIFT', _classes: 'text-light', _style: customFontSize },
    { key: 'AVAIL', _classes: 'text-light', _style: customFontSize },
    { key: 'ONLINE', _classes: 'text-light', _style: customFontSize },
  ]

  useEffect(() => {
    fetch(configData.API_URL + "/redshift_license_usage", {
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
      const newData = [
        { REDSHIFT: "SG* Lock", AVAIL: body.avail_locked_sg, ONLINE: body.used_locked_sg },
        { REDSHIFT: "SG Float", AVAIL: body.avail_float_sg, ONLINE: body.used_float_sg },
        { REDSHIFT: "KL* Lock", AVAIL: body.avail_locked_kl, ONLINE: body.used_locked_kl },
        { REDSHIFT: "KL Float", AVAIL: body.avail_float_kl, ONLINE: body.used_float_kl },
        {
          REDSHIFT: "TOTAL", AVAIL: body.avail_locked_sg + body.avail_locked_kl + body.avail_float_sg + body.avail_float_kl,
          ONLINE: body.used_locked_sg + body.used_locked_kl + body.used_float_sg + body.used_float_kl,
        }
      ]
      setRedshiftData(newData)
    }).catch(error => {
      console.log(error);
    })

    fetch(configData.API_URL + "/storage_info", {
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
      for (let i = 0; i < body.length; i++) {
        const element = body[i];
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
      }
      setStorageData(body);
    }).catch(error => {
      console.log(error);
    })
  }, [])

  // Asset Search
  const [project, setProject] = useState(cookies.get('s_project') || "");
  const [asset_text, setAssetText] = useState(cookies.get('s_asset_text') || "");
  const [assetClassSelection, setAssetClassSelection] = useState(cookies.get('s_assetClassSelection') || []);
  const [check0, setCheck0] = useState(false);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);

  const assets = useSelector(state => state.assetSearch)

  useEffect(() => {
    if (assets.length === 0) {
      resetState();
    }
    initialCheckbox();
  }, [])

  const resetState = () => {
    cookies.remove('s_project');
    cookies.remove('s_asset_text');
    cookies.remove('s_assetClassSelection');
    setProject("");
    setAssetText("");
    setAssetClassSelection([]);
    setCheck0(false);
    setCheck1(false);
    setCheck2(false);
    setCheck3(false);
  }

  const initialCheckbox = () => {
    for (let i = 0; i < assetClassSelection.length; i++) {
      const element = assetClassSelection[i];
      switch (element) {
        case "0": setCheck0(true)
          break;
        case "1": setCheck1(true)
          break;
        case "2": setCheck2(true)
          break;
        case "3": setCheck3(true)
          break;
      }
    }
  }

  // Handle onchange of the asset type checboxes
  const onChangeHandler = (e) => {
    if (e.target.checked) {
      assetClassSelection.push(e.target.value)
    } else {
      var index = assetClassSelection.indexOf(e.target.value)
      assetClassSelection.splice(index, 1)
    }
    setAssetClassSelection(assetClassSelection)
    switch (e.target.value) {
      case "0": setCheck0(!check0)
        break;
      case "1": setCheck1(!check1)
        break;
      case "2": setCheck2(!check2)
        break;
      case "3": setCheck3(!check3)
        break;
    }
  }

  const onSearchAsset = (e) => {
    e.preventDefault();

    if ((!project && !asset_text) || (assetClassSelection.length === 0)) {
      return false
    } else {
      console.log("onSearchAsset")
      const data = { project, asset_text, asset_class: assetClassSelection }
      setLoaderVisibility("");
      fetch(configData.API_URL + "/asset_search", {
        method: "POST",
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
        setLoaderVisibility("d-none");
        if (body.detail === "Forbidden") {
          cookies.remove("data");
          history.push("/login");
        }
        dispatch({ type: 'set', assetSearch: body });
        cookies.set("s_project", project, { path: "/" });
        cookies.set("s_asset_text", asset_text, { path: "/" });
        cookies.set("s_assetClassSelection", assetClassSelection, { path: "/" });
      }).catch(error => {
        setLoaderVisibility("d-none");
        console.log(error);
      })
    }
  }

  const resetSearchAsset = (e) => {
    e.preventDefault();
    dispatch({ type: 'set', assetSearch: [] });
    resetState();
  }

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: 'set', sidebarShow: val })}>
      <CSidebarBrand className="d-md-down-none bg-white" to="/">
        <CImg
          src="/omens_logo.png"
          fluid
          width='130'
        />
      </CSidebarBrand>

      <CSidebarNav>
        <CCreateElement
          items={sidebarPage}
          components={{
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />

        {/* Users - side bar */}
        {(currentModule === 'Users' && (system_user_role === 0 || system_user_role === 1)) &&
          <CSidebarNavItem>
            <CButton onClick={() => setModal(!modal)} color="info m-3">Create New User</CButton>
          </CSidebarNavItem>}

        {/* Afterburner - Render Jobs side bar */}
        {(currentModule === 'Afterburner' && location.pathname === '/renderJobs') &&
          <CSidebarNavItem className="mb-4">
            <CSidebarNavTitle>Job Controls</CSidebarNavTitle>
            <CButton onClick={() => setRenderJobModal(!renderJobModal)} color="info ml-4 mt-2 w-50">Create New Job</CButton>
            <CButton onClick={onUpdateStatus(1, "/render_job_status/")} color="info ml-4 mt-2 w-50">Done</CButton>
            <CButton onClick={onUpdateStatus(4, "/render_job_status/")} color="info ml-4 mt-2 w-50">Pause</CButton>
            <CRow className="ml-0 w-100">
              <CButton onClick={onUpdateStatus(2, "/render_job_status/")} color="info ml-4 mt-2 w-50">Queue</CButton>
              <div className={isLoaderVisible + " mt-3 ml-4 mb-n2"}>
                <CSpinner color="info" grow />
              </div>
            </CRow>
            <CButton onClick={onUpdateQueueFailed} color="info ml-4 mt-2 w-50">Queue Failed</CButton>
            <CButton onClick={onUpdateStatus(0, "/render_job_status/")} color="info ml-4 mt-2 w-50">Fail</CButton>
            <CButton onClick={onDelete("/render_job")} color="info ml-4 mt-2 w-50">Dump</CButton>
            <CButton onClick={() => {
              selectedrows = cookies.get('selectedrows');
              selection = !!selectedrows ? selectedrows : [];
              if (selection.length === 0) {
                alert("Please select at least 1 job.");
              } else {
                setPriorityModal(!priorityModal);
              }
            }} color="info ml-4 mt-2 w-50">+/- Priority</CButton>
          </CSidebarNavItem>}

        {/* Afterburner - Render Frames side bar */}
        {(currentModule === 'Afterburner' && location.pathname === '/renderJobs/renderFrames') &&
          <CSidebarNavItem className="mb-4">
            <CSidebarNavTitle>Frame Controls</CSidebarNavTitle>
            <CButton onClick={onUpdateStatus(2, "/render_frame_status/")} color="info ml-4 mt-2 w-50">Queue</CButton>
            <CRow className="ml-0 w-100">
              <CButton onClick={onUpdateStatus(1, "/render_frame_status/")} color="info ml-4 mt-2 w-50">Done</CButton>
              <div className={isLoaderVisible + " mt-3 ml-4 mb-n2"}>
                <CSpinner color="info" grow />
              </div>
            </CRow>
            <CButton onClick={onUpdateStatus(0, "/render_frame_status/")} color="info ml-4 mt-2 w-50">Fail</CButton>
            <CButton onClick={onUpdateStatus(4, "/render_frame_status/")} color="info ml-4 mt-2 w-50">Pause</CButton>
          </CSidebarNavItem>}

        {/* Afterburner - Comp Jobs side bar */}
        {(currentModule === 'Afterburner' && location.pathname === '/compJobs') &&
          <CSidebarNavItem className="mb-4">
            <CSidebarNavTitle>Job Controls</CSidebarNavTitle>
            <CButton onClick={() => setCompJobModal(!compJobModal)} color="info ml-4 mt-2 w-50">Create New Job</CButton>
            <CButton onClick={onUpdateStatus(1, "/comp_job_status/")} color="info ml-4 mt-2 w-50">Done</CButton>
            <CRow className="ml-0 w-100">
              <CButton onClick={onUpdateStatus(4, "/comp_job_status/")} color="info ml-4 mt-2 w-50">Pause</CButton>
              <div className={isLoaderVisible + " mt-3 ml-4 mb-n2"}>
                <CSpinner color="info" grow />
              </div>
            </CRow>
            <CButton onClick={onUpdateStatus(2, "/comp_job_status/")} color="info ml-4 mt-2 w-50">Queue</CButton>
            <CButton onClick={onUpdateStatus(0, "/comp_job_status/")} color="info ml-4 mt-2 w-50">Fail</CButton>
            <CButton onClick={onDelete("/comp_job")} color="info ml-4 mt-2 w-50">Dump</CButton>
          </CSidebarNavItem>}

        {/* Afterburner - Render Hosts side bar */}
        {(currentModule === 'Afterburner' && location.pathname === '/renderHosts') &&
          <CSidebarNavItem className="mb-4">
            <CSidebarNavTitle>Host Controls</CSidebarNavTitle>
            <CButton onClick={onUpdateStatus(1, "/host_status/")} color="info ml-4 mt-2 w-50">Online</CButton>
            <CRow className="ml-0 w-100">
              <CButton onClick={onUpdateStatus(0, "/host_status/")} color="info ml-4 mt-2 w-50">Offline</CButton>
              <div className={isLoaderVisible + " mt-3 ml-4 mb-n2"}>
                <CSpinner color="info" grow />
              </div>
            </CRow>
            <CButton onClick={onDelete("/host")} color="info ml-4 mt-2 w-50">Remove</CButton>
            {/* Redshift Lisence Usage Table */}
            <CSidebarNavItem>
              <div className="p-4 pr-5 pt-5">
                <CDataTable
                  size="sm"
                  items={redshiftData}
                  fields={fields}
                  scopedSlots={{
                    'REDSHIFT':
                      (item) => (
                        <td className="text-white" style={customFontSize}>{item.REDSHIFT}</td>
                      ),
                    'AVAIL':
                      (item) => (
                        <td className="text-white" style={customFontSize}>{item.AVAIL}</td>
                      ),
                    'ONLINE':
                      (item) => (
                        item.ONLINE > item.AVAIL ? <td className="p-0">
                          <CBadge color="danger" size="sm">{item.ONLINE}</CBadge>
                        </td> :
                          <td className="text-white" style={customFontSize}>{item.ONLINE}</td>
                      ),
                  }}
                />
              </div>
            </CSidebarNavItem>
            {/* Storage Info Table */}
            <CSidebarNavItem>
              <div className="p-2 pr-4 mt-n4">
                {storageData.map(storage => (
                  <div className="progress-group mb-2 mx-3" style={{ fontSize: "11px" }}>
                    <div className="progress-group-header">
                      <span className="font-weight-bold">{storage.server_name.toUpperCase()} ({storage.location})</span>
                    </div>
                    <div className="progress-group-bars">
                      <CProgress className="progress-xs" color="danger" value={(storage.total_used / storage.total_capacity * 100).toFixed(1)} />
                      <span className="ml-auto text-muted">
                        {storage.total_used}/ {storage.total_capacity} GB {(storage.total_used / storage.total_capacity * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CSidebarNavItem>
          </CSidebarNavItem>}

        {/* Asset - Search Asset side bar */}
        {(currentModule === 'Asset Library') &&
          <CSidebarNavItem className="mb-4">
            <CForm action="" method="post" className="ml-3 mt-3">
              <CFormGroup className="row pr-5">
                <CLabel className="col-4 mt-2">Project: </CLabel>
                <CInput
                  placeholder="e.g. MWS6"
                  className="col-8 h-75"
                  value={project}
                  onChange={(e) => setProject(e.target.value)} />
              </CFormGroup>
              <CFormGroup className="row pr-5">
                <CLabel className="col-4 mt-2 float-md-right">Text: </CLabel>
                <CInput
                  placeholder="e.g. Table"
                  className="col-8 h-75"
                  value={asset_text}
                  onChange={(e) => setAssetText(e.target.value)} />
              </CFormGroup>
              <CFormGroup>
                <CRow className="row pr-5 mt-2">
                  <CLabel className="col-4">Type: </CLabel>
                  <input className="mt-1" type="checkbox" aria-label="None"
                    value={0} onChange={onChangeHandler} checked={check0} />
                  <CLabel className="ml-2">None</CLabel>
                </CRow>
                <CRow className="row pr-5">
                  <CLabel className="col-4"></CLabel>
                  <input className="mt-1" type="checkbox" aria-label="Character"
                    value={1} onChange={onChangeHandler} checked={check1} />
                  <CLabel className="ml-2">Character</CLabel>
                </CRow>
                <CRow className="row pr-5">
                  <CLabel className="col-4"></CLabel>
                  <input className="mt-1" type="checkbox" aria-label="Prop"
                    value={2} onChange={onChangeHandler} checked={check2} />
                  <CLabel className="ml-2">Prop</CLabel>
                </CRow>
                <CRow className="row pr-5">
                  <CLabel className="col-4"></CLabel>
                  <input className="mt-1" type="checkbox" aria-label="Environment"
                    value={3} onChange={onChangeHandler} checked={check3} />
                  <CLabel className="ml-2">Environment</CLabel>
                </CRow>
                <CRow className="row pr-5">
                  <dix className="col d-flex justify-content-end">
                    <div className={isLoaderVisible + " mt-3"}>
                      <CSpinner color="info" size="sm" grow />
                    </div>
                  </dix>
                  <CButton color="danger mt-2 mr-2"
                    onClick={resetSearchAsset}>Reset</CButton>
                  <CButton color="info mt-2 w-50"
                    onClick={onSearchAsset}>Search</CButton>
                </CRow>
              </CFormGroup>
            </CForm>
            <CSidebarNavTitle>STATUS LEGEND</CSidebarNavTitle>
            <CFormGroup className="ml-5">
              <CRow className="align-items-center">
                <div className="bg-transparent border border-secondary theme-color rounded p-2"></div>
                <CLabel className="m-0 p-2">Not Started</CLabel>
              </CRow>
              <CRow className="align-items-center">
                <div className="bg-warning theme-color rounded p-2"></div>
                <CLabel className="m-0 p-2">In Progress</CLabel>
              </CRow>
              <CRow className="align-items-center">
                <div className="bg-info theme-color rounded p-2"></div>
                <CLabel className="m-0 p-2">Completed</CLabel>
              </CRow>
              <CRow className="align-items-center">
                <div className="bg-danger theme-color rounded p-2"></div>
                <CLabel className="m-0 p-2">Fix Required</CLabel>
              </CRow>
              <CRow className="align-items-center">
                <div className="bg-success theme-color rounded p-2"></div>
                <CLabel className="m-0 p-2">Approved</CLabel>
              </CRow>
              <CRow className="align-items-center">
                <div className="bg-secondary theme-color rounded p-2"></div>
                <CLabel className="m-0 p-2">Cancelled</CLabel>
              </CRow>
            </CFormGroup>
          </CSidebarNavItem>}

        {/* Projects - side bar */}
        {(currentModule === 'Projects' && (location.pathname === '/activeProjects' || location.pathname === '/archivedProjects')
          && (system_user_role === 0 || system_user_role === 1)) &&
          <CSidebarNavItem>
            <CButton onClick={() => setProjectModal(!projectModal)} color="info m-3">Create New Project</CButton>
          </CSidebarNavItem>}

        {/* Projects - Overview side bar */}
        {(currentModule === "Projects" && currentProject === 1 && location.pathname === '/projectOverview'
          && (system_user_role === 0 || system_user_role === 1)) &&
          <CSidebarNavItem>
            <CButton onClick={() => setEpisodeModal(!episodeModal)} color="info m-3">Create New Episode</CButton>
          </CSidebarNavItem>
        }
      </CSidebarNav>

      {/* Create User Popup Box for Users Module */}
      <CreateUser
        showModal={modal}
        onShow={() => setModal(!modal)}
        token={token}
        user={user} />
      {/* Create Render Job Popup Box for Afterburner Module */}
      <CreateRenderJob
        showModal={renderJobModal}
        onShow={() => setRenderJobModal(!renderJobModal)}
        token={token}
        user={user} />
      {/* Update Priority Popup Box for Afterburner Module */}
      <UpdatePriority
        showModal={priorityModal}
        onShow={() => setPriorityModal(!priorityModal)}
        token={token}
        user={user}
        selectedrows={selection} />
      {/* Create Comp Job Popup Box for Afterburner Module */}
      <CreateCompJob
        showModal={compJobModal}
        onShow={() => setCompJobModal(!compJobModal)}
        token={token}
        user={user} />
      {/* Create New Project Popup Box for Project Module */}
      <CreateProject
        showModal={projectModal}
        onShow={() => setProjectModal(!projectModal)}
        token={token}
        user={user} />
      {/* Create New Episode Popup Box for Project Module */}
      <CreateEpisode
        showModal={episodeModal}
        onShow={() => setEpisodeModal(!episodeModal)}
        token={token}
        user={user} />
    </CSidebar >
  )
}

export default React.memo(TheSidebar)