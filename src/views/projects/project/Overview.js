import React from 'react'
import Cookies from "universal-cookie";
import {
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CCardTitle,
    CRow,
    CButton,
    CCollapse,
    CSidebarClose,
    CButtonClose,
    CProgress,
    CInput,
    CLabel,
    CLink,
    CTextarea,
    CBadge,
    CSelect
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";

import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Moment from 'moment';
import ModalImage from "react-modal-image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import configData from "../../../config.json";
import _nav from '../../../containers/_nav'
import EpisodeCard from './EpisodeCard'
import CreateProjectLink from 'src/views/projects/project/CreateProjectLink'
import UpdateProjectLink from 'src/views/projects/project/UpdateProjectLink'
import UpdateThumbnail from 'src/views/projects/project/UpdateThumbnail'

const Overview = () => {

    const dispatch = useDispatch()
    dispatch({ type: 'set', currentSidebar: _nav.Project })
    dispatch({ type: 'set', currentModule: 'Projects' });

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

    const prevPage = useSelector(state => state.prevPage)
    const project = cookies.get('project');
    var project_id;
    if (project === undefined) {
        history.push(prevPage)
    } else {
        project_id = project["project_id"]
    }

    // Create Project Link Modal
    const [createLinkModal, setCreateLinkModal] = useState(false);

    // Udpate Project Link Modal
    const [updateLinkModal, setUpdateLinkModal] = useState(false);
    const [linkData, setLinkData] = useState([])

    const projectData = useSelector(state => state.projectData)
    const episodes = useSelector(state => state.episodes)
    const projectLinks = useSelector(state => state.projectLinks)

    const [toggleEditableFields, setToggleEditableFields] = useState("")
    const [penIcon, setPenIcon] = useState(0);

    const [project_name, setProjectName] = useState("");
    const [client, setClient] = useState("");
    const [start_date, setStartDate] = useState("");
    const [end_date, setEndDate] = useState("");
    const [status, setStatus] = useState("");
    const [description, setDescription] = useState("");
    const [picture, setPicture] = useState("");

    const [updateImgModal, setUpdateImgModal] = useState(false);

    const [selectedepisodedata, setSelectedEpisodeData] = useState([]);
    const [selectedepisodeindex, setSelectedEpisodeIndex] = useState([]);
    const [episodemodal, setEpisodeModal] = useState(false);

    useEffect(() => {
        getProject();
        getEpisodes();
        getProjectLinks();
    }, [])

    const getProject = () => {
        fetch(configData.API_URL + "/project/" + project_id, {
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
            if (body.project_type === 0) dispatch({ type: 'set', currentProject: 0 })
            else dispatch({ type: 'set', currentProject: 1 });

            dispatch({ type: 'set', projectData: body })
            setProjectName(body.project_name)
            setClient(body.client)
            setStartDate(body.start_date)
            setEndDate(body.end_date)
            setStatus(body.status)
            setDescription(body.description)
            setPicture(body.picture_thumbnail)
        }).catch(error => {
            console.log(error);
        })
    }

    // GET all episodes of series project
    const getEpisodes = () => {
        fetch(configData.API_URL + "/project_episodes/" + project_id, {
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
            dispatch({ type: 'set', episodes: body })
        }).catch(error => {
            console.log(error);
        })
    }

    // GET all links of the project
    const getProjectLinks = () => {
        fetch(configData.API_URL + "/project_links/" + project_id, {
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
            dispatch({ type: 'set', projectLinks: body })
        }).catch(error => {
            console.log(error);
        })
    }

    // GET project link by id for update project link
    const getProjectLink = (id) => {
        fetch(configData.API_URL + "/project_link/" + id, {
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
            setLinkData(body)
        }).catch(error => {
            console.log(error);
        })
    }

    const onUpdateProject = () => {
        const data = {
            "project_name": project_name,
            "client": client,
            "description": description,
            "start_date": Moment(start_date).format("DD-MMM-YYYY"),
            "end_date": Moment(end_date).format("DD-MMM-YYYY"),
            "status": status,
            "picture_thumbnail": picture
        }
        fetch(configData.API_URL + "/project/" + project_id, {
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
            } else if (body.result !== "Success") {
                history.push("/dashboard");
                history.goBack();
            } else {
                setUpdateImgModal(false)
                cookies.set("project", { project_id: projectData.project_id, project_name: project_name }, { path: "/" });
            }
        }).catch(error => {
            console.log(error);
        })
    }

    function validateDate(start_date, end_date) {
        // start date must be earlier than end date
        if (start_date < end_date) return true
        else return false
    }

    function closeEditableField() {
        setToggleEditableFields("");
        setPenIcon(0);
    }

    // // Function to add our give data into cache
    // const addDataIntoCache = (cacheName, url, response) => {
    //     // Coverting our respons into Actual Response form
    //     const data = new Response(JSON.stringify(response));

    //     if ('caches' in window) {
    //         // Opening given cache and putting our data into it
    //         caches.open(cacheName).then((cache) => {
    //             cache.put(url, data);
    //             alert('Data Added into cache!')
    //         });
    //     }
    // };

    // const getDataIntoCache = (cacheName, url, response) => {
    //     // Coverting our respons into Actual Response form
    //     const data = new Response(JSON.stringify(response));

    //     if ('caches' in window) {
    //         // Opening given cache and putting our data into it
    //         caches.open(cacheName).then((cache) => {
    //             cache.get()
    //             console.log(cache.get());
    //             alert('Get!')
    //         });
    //     }
    // };

    // // Our state to store fetched cache data
    // const [cacheData, setCacheData] = React.useState();

    // // Function to get single cache data
    // const getSingleCacheData = async (cacheName, url) => {
    //     if (typeof caches === 'undefined') return false;

    //     const cacheStorage = await caches.open(cacheName);
    //     const cachedResponse = await cacheStorage.match(url);

    //     // If no cache exists
    //     if (!cachedResponse || !cachedResponse.ok) {
    //         setCacheData('Fetched failed!')
    //     }

    //     return cachedResponse.json().then((item) => {
    //         setCacheData(item)
    //         console.log(item);
    //     });
    // };

    // // Cache Object 
    // const cacheToFetch = { cacheName: 'CacheOne', url: 'https://localhost:300' }

    return (
        <>
            <CCard>
                <CCardBody>
                    {/* <button onClick={() => addDataIntoCache('MyCache',
                        'https://localhost:300', 'SampleData')} >
                        Add Data Into Cache</button>
                    <button onClick={() => getSingleCacheData('MyCache',
                        'https://localhost:300')} >
                        Get Single Cache Data</button> */}
                    <CRow>
                        <CCol className="col-12 col-md-4 my-auto">
                            {system_user_role === 0 || system_user_role === 1 ?
                                (<div onMouseEnter={() => { setPenIcon("img") }}
                                    onMouseLeave={() => { setPenIcon(0) }}>
                                    {(penIcon === "img") &&
                                        <CButton className="p-0 px-1 bg-light"
                                            style={{ position: 'absolute', right: '15px' }}
                                            onClick={() => { setUpdateImgModal(!updateImgModal) }}>
                                            <CIcon content={freeSet.cilPencil} size="lg" alt="Edit" />
                                        </CButton>}
                                    <ModalImage
                                        className="rounded"
                                        alt={project_name}
                                        small={projectData.project_type === "Standalone" ? "/avatars/11.png" : "/avatars/66.jpg"}
                                        medium={projectData.project_type === "Standalone" ? "/avatars/11.png" : "/avatars/22.jpg"}
                                        large={configData.File_URL + picture} />
                                </div>)
                                :
                                (<ModalImage
                                    className="rounded"
                                    alt={project_name}
                                    small={projectData.project_type === "Standalone" ? "/avatars/11.png" : "/avatars/66.jpg"}
                                    medium={projectData.project_type === "Standalone" ? "/avatars/11.png" : "/avatars/22.jpg"}
                                    large={configData.File_URL + picture} />)}
                        </CCol>
                        <CCol className="col-12 col-md-8 mt-3 mt-md-0">
                            <CRow>
                                <CCol>
                                    {toggleEditableFields === "name" ? (
                                        <div className="d-flex">
                                            <CInput
                                                className="bg-dark text-white w-25"
                                                size="sm"
                                                value={project_name}
                                                autoFocus
                                                onChange={(e) => (setProjectName(e.target.value))}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        onUpdateProject()
                                                        closeEditableField()
                                                    }
                                                }}
                                                onBlur={() => {
                                                    onUpdateProject()
                                                    closeEditableField()
                                                }} />
                                            <span>
                                                <CCardTitle>({projectData.project_key})</CCardTitle>
                                            </span>
                                        </div>
                                    ) : (
                                        <CCardTitle>
                                            {system_user_role === 0 || system_user_role === 1 ?
                                                (<span onClick={() => { setToggleEditableFields("name") }}
                                                    onMouseEnter={() => { setPenIcon("name") }}
                                                    onMouseLeave={() => { setPenIcon(0) }}>
                                                    {project_name} ({projectData.project_key})
                                                </span>)
                                                :
                                                (<span>{project_name} ({projectData.project_key})</span>)}
                                            {(penIcon === "name") &&
                                                <CIcon name='cilPencil' size="lg" className="pl-1 mt-n2 mb-n1" />}
                                            {system_user_role === 0 &&
                                                (<CButton className="p-0 float-right">
                                                    <CIcon content={freeSet.cilTrash} size="lg" alt="Delete" />
                                                </CButton>)}
                                        </CCardTitle>
                                    )}
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol className="col-sm-4">
                                    <div>Type:</div>
                                    <div className="h6 mb-3">
                                        {projectData.project_type === 0 && 'Standalone'}
                                        {projectData.project_type === 1 && 'Series'}
                                    </div>
                                    <div>Pipeline:</div>
                                    <div className="h6 mb-3">
                                        {projectData.pipeline_type === 0 && 'CG Animation'}
                                        {projectData.pipeline_type === 1 && 'Visual Effects'}
                                        {projectData.pipeline_type === 2 && 'Mixed Media'}
                                    </div>
                                    <div>Client:</div>
                                    {toggleEditableFields === "client" ? (
                                        <CInput
                                            className="mb-1 bg-dark text-white"
                                            size="sm"
                                            value={client}
                                            autoFocus
                                            onChange={(e) => (setClient(e.target.value))}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    onUpdateProject()
                                                    closeEditableField()
                                                }
                                            }}
                                            onBlur={() => {
                                                onUpdateProject()
                                                closeEditableField()
                                            }} />
                                    ) : (
                                        <div className="h6 mb-3">
                                            {system_user_role === 0 || system_user_role === 1 ?
                                                (<span onClick={() => { setToggleEditableFields("client") }}
                                                    onMouseEnter={() => { setPenIcon("client") }}
                                                    onMouseLeave={() => { setPenIcon(0) }}>
                                                    {client}
                                                </span>)
                                                :
                                                (<span>{client}</span>)}
                                            {(penIcon === "client") &&
                                                <CIcon name='cilPencil' className="pl-1 mt-n2 mb-n1" />}
                                        </div>
                                    )}
                                    <div>Producer:</div>
                                    <div className="h6 mb-3">-</div>
                                </CCol>
                                <CCol className="col-sm-8">
                                    <div>Period:</div>
                                    {toggleEditableFields === "start_date" ? (
                                        <div className="h6 mb-3 d-flex">
                                            <DatePicker className="bg-dark pl-2 py-0 mr-n4 border-0 rounded w-75"
                                                autoFocus
                                                selected={new Date(start_date)}
                                                dateFormat="dd-MMM-yyyy"
                                                onChange={(date) => {
                                                    validateDate(date, new Date(end_date)) &&
                                                        setStartDate(date)
                                                }}
                                                onCalendarClose={() => {
                                                    onUpdateProject()
                                                    closeEditableField()
                                                }} />
                                            <span className="ml-n4">
                                                to
                                            </span>
                                            <span className="ml-1" onClick={() => {
                                                setToggleEditableFields("end_date")
                                            }}>{Moment(end_date).format("DD-MMM-YYYY")}</span>
                                        </div>
                                    ) : toggleEditableFields === "end_date" ? (
                                        <div className="h6 mb-3 d-flex">
                                            <span className="mr-1" onClick={() => {
                                                setToggleEditableFields("start_date")
                                            }}>{Moment(start_date).format("DD-MMM-YYYY")}</span>
                                            to
                                            <DatePicker className="bg-dark pl-2 py-0 ml-1 mr-n4 border-0 rounded w-75"
                                                autoFocus
                                                selected={new Date(end_date)}
                                                dateFormat="dd-MMM-yyyy"
                                                onChange={(date) => {
                                                    validateDate(new Date(start_date), date) &&
                                                        setEndDate(date)
                                                }}
                                                onCalendarClose={() => {
                                                    onUpdateProject()
                                                    closeEditableField()
                                                }} />
                                        </div>
                                    ) : (
                                        <div className="h6 mb-3">
                                            {system_user_role === 0 || system_user_role === 1 ?
                                                (<span>
                                                    <span onClick={() => { setToggleEditableFields("start_date") }}
                                                        onMouseEnter={() => { setPenIcon("date") }}
                                                        onMouseLeave={() => { setPenIcon(0) }}>{Moment(start_date).format("DD-MMM-YYYY")} </span>
                                                    to
                                                    <span onClick={() => { setToggleEditableFields("end_date") }}
                                                        onMouseEnter={() => { setPenIcon("date") }}
                                                        onMouseLeave={() => { setPenIcon(0) }}> {Moment(end_date).format("DD-MMM-YYYY")}</span>
                                                </span>)
                                                :
                                                (<span>{Moment(start_date).format("DD-MMM-YYYY")} to {Moment(end_date).format("DD-MMM-YYYY")}</span>)}
                                            {(penIcon === "date") &&
                                                <CIcon name='cilPencil' className="pl-1 mt-n2 mb-n1" />}
                                        </div>
                                    )}
                                    <div>Status:</div>
                                    {toggleEditableFields === "status" ? (
                                        <CSelect custom name="select" id="select"
                                            autoFocus
                                            className="mb-2 bg-dark text-white w-25"
                                            size="sm"
                                            value={status}
                                            onChange={(e) => { setStatus(parseInt(e.target.value)) }}
                                            onBlur={() => {
                                                onUpdateProject()
                                                closeEditableField()
                                            }}>
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </CSelect>
                                    ) : (
                                        <div className="mb-3">
                                            {system_user_role === 0 || system_user_role === 1 ?
                                                (<CBadge color={status === 1 ? "success" : "danger"} className="px-2"
                                                    onClick={() => { setToggleEditableFields("status") }}
                                                    onMouseEnter={() => { setPenIcon("status") }}
                                                    onMouseLeave={() => { setPenIcon(0) }}>
                                                    {status === 0 && 'Inactive'}
                                                    {status === 1 && 'Active'}
                                                </CBadge>)
                                                :
                                                (<CBadge color={status === 1 ? "success" : "danger"} className="px-2">
                                                    {status === 0 && 'Inactive'}
                                                    {status === 1 && 'Active'}
                                                </CBadge>)}
                                            {(penIcon === "status") &&
                                                <CIcon name='cilPencil' className="pl-1 mt-n2 mb-n1" />}
                                        </div>
                                    )}
                                    <div>Description:</div>
                                    {toggleEditableFields === "desc" ? (
                                        <CTextarea
                                            className="bg-dark text-white"
                                            size="sm"
                                            rows="3"
                                            value={description}
                                            autoFocus
                                            onChange={(e) => (setDescription(e.target.value))}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    onUpdateProject()
                                                    closeEditableField()
                                                }
                                            }}
                                            onBlur={() => {
                                                onUpdateProject()
                                                closeEditableField()
                                            }} />
                                    ) : (
                                        <div className="h6 mb-3">
                                            {system_user_role === 0 || system_user_role === 1 ?
                                                (<span onClick={() => { setToggleEditableFields("desc") }}
                                                    onMouseEnter={() => { setPenIcon("desc") }}
                                                    onMouseLeave={() => { setPenIcon(0) }}>
                                                    {description}
                                                </span>)
                                                :
                                                (<span>{description}</span>)}
                                            {(penIcon === "desc") &&
                                                <CIcon name='cilPencil' className="pl-1 mt-n2 mb-n1" />}
                                        </div>
                                    )}
                                </CCol>
                            </CRow>
                        </CCol>
                    </CRow>
                    <CRow className="mt-2 mt-md-3">
                        <div className="col-sm col-xl-3 mr-sm-3">
                            <CCardTitle>Assets (1220)</CCardTitle>
                            <CRow>
                                <div className="col-4 text-nowrap">
                                    <span>Not Started</span>
                                </div>
                                <div className="col-8 mt-2">
                                    <CProgress className="progress-xs" color="dark" value="20" />
                                </div>
                            </CRow>
                            <CRow>
                                <div className="col-4 text-nowrap">
                                    <span>In Progress</span>
                                </div>
                                <div className="col-8 mt-2">
                                    <CProgress className="progress-xs" color="warning" value="50" />
                                </div>
                            </CRow>
                            <CRow>
                                <div className="col-4 text-nowrap">
                                    <span>Completed</span>
                                </div>
                                <div className="col-8 mt-2">
                                    <CProgress className="progress-xs" color="info" value="70" />
                                </div>
                            </CRow>
                            <CRow>
                                <div className="col-4 text-nowrap">
                                    <span>Approved</span>
                                </div>
                                <div className="col-8 mt-2">
                                    <CProgress className="progress-xs" color="success" value="50" />
                                </div>
                            </CRow>
                            <CRow>
                                <div className="col-4 text-nowrap">
                                    <span>Canceled</span>
                                </div>
                                <div className="col-8 mt-2">
                                    <CProgress className="progress-xs" color="secondary" value="20" />
                                </div>
                            </CRow>
                        </div>
                        <div className="col-sm col-xl-3 mr-sm-3 mt-4 mt-sm-0">
                            <CCardTitle>Episodes (60)</CCardTitle>
                            <CRow>
                                <div className="col-4 text-nowrap">
                                    <span>Not Started</span>
                                </div>
                                <div className="col-8 mt-2">
                                    <CProgress className="progress-xs" color="dark" value="20" />
                                </div>
                            </CRow>
                            <CRow>
                                <div className="col-4 text-nowrap">
                                    <span>In Progress</span>
                                </div>
                                <div className="col-8 mt-2">
                                    <CProgress className="progress-xs" color="warning" value="50" />
                                </div>
                            </CRow>
                            <CRow>
                                <div className="col-4 text-nowrap">
                                    <span>Completed</span>
                                </div>
                                <div className="col-8 mt-2">
                                    <CProgress className="progress-xs" color="info" value="70" />
                                </div>
                            </CRow>
                            <CRow>
                                <div className="col-4 text-nowrap">
                                    <span>Approved</span>
                                </div>
                                <div className="col-8 mt-2">
                                    <CProgress className="progress-xs" color="success" value="50" />
                                </div>
                            </CRow>
                            <CRow>
                                <div className="col-4 text-nowrap">
                                    <span>Canceled</span>
                                </div>
                                <div className="col-8 mt-2">
                                    <CProgress className="progress-xs" color="secondary" value="20" />
                                </div>
                            </CRow>
                        </div>
                        <div className="col-xl-5 mt-4 mt-xl-0">
                            <CCardTitle>Project Links</CCardTitle>
                            {projectLinks.map(link => (
                                <CRow>
                                    <div className="col-1">
                                        <CIcon content={freeSet.cilLink} className="text-primary pr-1" />
                                    </div>
                                    <div className="col-4 col-xl-5 ml-n3 ml-sm-n4 ml-xl-n2">
                                        {system_user_role === 0 || system_user_role === 1 ?
                                            (<CLink onClick={() => {
                                                getProjectLink(link.project_link_id);
                                                setUpdateLinkModal(!updateLinkModal);
                                            }}
                                                onMouseEnter={() => { setPenIcon(link.project_link_id) }}
                                                onMouseLeave={() => { setPenIcon(0) }}>
                                                {link.link_name}
                                            </CLink>)
                                            :
                                            (<span>{link.link_name}</span>)}
                                        {(penIcon === link.project_link_id) &&
                                            <CIcon name='cilPencil' className="text-primary pl-1" />}
                                    </div>
                                    <div className="col-7 col-xl-6">
                                        :
                                        {(link.link_url.length > 30) ?
                                            (<CLink className="text-nowrap" href={link.link_url} target="_blank">
                                                {link.link_url.substring(0, 30) + " ..."}
                                            </CLink>)
                                            :
                                            (<CLink className="text-nowrap">
                                                {link.link_url}
                                            </CLink>)
                                        }
                                    </div>
                                </CRow>
                            ))}
                            {(system_user_role === 0 || system_user_role === 1) &&
                                <CButton onClick={() => setCreateLinkModal(!createLinkModal)} color="info m-1 mt-2 py-0">Add Link</CButton>}
                        </div>
                    </CRow>
                    <CRow className="mt-4">
                        {episodes.map(ep => (
                            <CCol md="6" lg="4" xl="3">
                                <EpisodeCard episodeData={ep}></EpisodeCard>
                            </CCol>
                        ))}
                    </CRow>
                </CCardBody>
            </CCard>

            {/* Create Project Link Popup Box for Add Link button */}
            <CreateProjectLink
                showModal={createLinkModal}
                onShow={() => setCreateLinkModal(!createLinkModal)}
                token={token}
                user={user}
                projectData={projectData} />

            {/* Update Thumbnail Pop Up Form */}
            <UpdateThumbnail
                showModal={updateImgModal}
                onShow={() => setUpdateImgModal(!updateImgModal)}
                token={token}
                user={user}
                data={data}
                setPictureState={(e) => setPicture(e)}
                onUpdateProject={() => onUpdateProject()}
                linkData={linkData}
                projectData={projectData} />

            {/* Update Project Link Pop Up Form */}
            <UpdateProjectLink
                showModal={updateLinkModal}
                onShow={() => setUpdateLinkModal(!updateLinkModal)}
                token={token}
                user={user}
                data={data}
                linkData={linkData}
                projectData={projectData} />
        </>
    )
}

export default Overview
