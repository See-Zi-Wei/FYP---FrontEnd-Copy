import React from 'react'
import Cookies from "universal-cookie";
import {
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CCardTitle,
    CCardSubtitle,
    CCardText,
    CRow,
    CContainer,
    CCardLink,
    CSidebar,
    CSidebarBrand,
    CSidebarNav,
    CBadge,
    CImg,
    CButton,
    CCollapse,
    CSidebarClose,
    CButtonClose,
    CSelect,
    CCardFooter,
    CLink,
    CForm,
    CFormGroup,
    CTextarea,
    CSpinner,
    CLabel
} from '@coreui/react'
import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";

import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { useTable, useSortBy, useGlobalFilter, useRowSelect } from 'react-table'
import { useDropzone } from 'react-dropzone';
import Table from 'react-bootstrap/Table';
import ModalImage from "react-modal-image";
import ScrollMenu from 'react-horizontal-scrolling-menu';
import Moment from 'moment';

import configData from "../../config.json";
import _nav from '../../containers/_nav'

const AssetLibrary = () => {

    const dispatch = useDispatch()
    dispatch({ type: 'set', currentSidebar: _nav.AssetLibrary })
    dispatch({ type: 'set', currentModule: 'Asset Library' });

    const assets = useSelector(state => state.assetSearch)

    const [assetData, setAssetData] = useState([]);

    const data = assets;
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        for (let j = 0; j < data[i].tasks.length; j++) {
            const element = data[i].tasks[j];
            switch (element.task) {
                case 0:
                    element.task = "ART"
                    break;
                case 1:
                    element.task = "MDL"
                    break;
                case 2:
                    element.task = "RIG"
                    break;
                case 3:
                    element.task = "SUR"
                    break;
                case 4:
                    element.task = "LOK"
                    break;
                case 5:
                    element.task = "RIG"
                    break;
                case 6:
                    element.task = "MMG"
                    break;
                case 7:
                    element.task = "MC"
                    break;
                case 8:
                    element.task = "LY"
                    break;
                case 9:
                    element.task = "AMT"
                    break;
                case 10:
                    element.task = "LT"
                    break;
                case 11:
                    element.task = "FX"
                    break;
                case 12:
                    element.task = "CT"
                    break;
            }
            switch (element.status) {
                case 0:
                    element.status = "dark"
                    break;
                case 1:
                    element.status = "warning"
                    break;
                case 2:
                    element.status = "info"
                    break;
                case 3:
                    element.status = "danger"
                    break;
                case 4:
                    element.status = "success"
                    break;
                case 5:
                    element.status = "secondary"
                    break;
            }
        }
        element.start_date = Moment(element.start_date)
            .utc()
            .format("DD-MMM-YYYY")
        element.end_date = Moment(element.end_date)
            .utc()
            .format("DD-MMM-YYYY")
    }
    dispatch({ type: 'set', assetSearch: data });

    // useEffect(() => {
    //     if (assets != null)
    //         setAssetData(assets)
    // }, [assets])

    // // Change date format
    // for (var i = 0; i < assetData.length; i++) {
    //     var element = (assetData[i])

    // }

    // var tasks;

    // for (var i = 0; i < assetData.length; i++) {
    //     tasks = (assetData[i].tasks)
    // }

    const allNotes = useSelector(state => state.notes)
    const [filteringNotes, setFilteringNotes] = useState(allNotes);
    const [notes, setNotes] = useState("Any");

    useEffect(() => {
        getNotes();
    }, [])

    useEffect(() => {
        setFilteringNotes(allNotes)
    }, [allNotes])

    const onChangeNotes = (value) => {
        if (value === "Any") {
            setFilteringNotes(allNotes);
        } else {
            var arr = [];
            for (let i = 0; i < allNotes.length; i++) {
                const element = allNotes[i];
                if (element.task === value) {
                    arr.push(element)
                }
            }
            setFilteringNotes(arr);
        }
    }

    // GET all notes
    const getNotes = () => {
        setLoaderVisibility("");
        fetch(configData.API_URL + "/notes/30769", {
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

            switch (element.task) {
                case 0:
                    element.task = "Art"
                    break;
                case 1:
                    element.task = "Modeling"
                    break;
                case 2:
                    element.task = "Rigging"
                    break;
                case 3:
                    element.task = "Surfacing"
                    break;
                case 12:
                    element.task = "Look Dev"
                    break;
            }

            element.created_time = Moment(element.created_time)
                .utc()
                .format("DD-MMM-YY hh:mm:ss A")

            fetch(configData.API_URL + "/user/" + element.created_by, {
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
                element.created_by = body.username
                element.avatar = body.picture
            }).catch(error => {
                console.log(error);
            })
        }
        dispatch({ type: 'set', notes: data })
    }

    const [isVisible, setVisibility] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoaderVisible, setLoaderVisibility] = useState("d-none");
    const [rightSidebar, setRightSidebar] = useState(false);
    const [rightSidebar2, setRightSidebar2] = useState(false);
    const [rightSidebar3, setRightSidebar3] = useState(false);

    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState('');

    const history = useHistory();
    const cookies = new Cookies();
    const data1 = cookies.get('data')
    var token, user, system_user_role;
    if (data1 === undefined) {
        history.push("/login")
    } else {
        token = data1["token"]
        user = data1["username"]
        system_user_role = data1["user_role"]
    }

    // Slide Out Pipelines
    const pipelinesArr = [
        { id: 1, status: 'danger', pipeline: 'Art', img: 'person.png', assignee: 'Jenny' },
        { id: 2, status: 'warning', pipeline: 'Modeling', img: 'person.png', assignee: 'Summer' },
        { id: 3, status: 'success', pipeline: 'Rigging', img: 'person.png', assignee: 'Janice' },
        { id: 4, status: 'success', pipeline: 'Surfacing', img: 'person.png', assignee: 'Genevieve' },
        { id: 5, status: 'info', pipeline: 'Look Dev', img: 'person.png', assignee: 'Victor Chang' },
    ];
    const pipelinesArr2 = [
        { id: 1, status: 'danger', pipeline: 'Layout', img: 'person.png', assignee: 'Jenny' },
        { id: 2, status: 'warning', pipeline: 'Animation', img: 'person.png', assignee: 'Summer' },
        { id: 3, status: 'success', pipeline: 'Cache', img: 'person.png', assignee: 'Janice' },
    ];
    const pipelinesArr3 = [
        { id: 1, status: 'danger', pipeline: 'Cache', img: 'person.png', assignee: 'Jenny' },
        { id: 2, status: 'warning', pipeline: 'FX', img: 'person.png', assignee: 'Summer' },
        { id: 3, status: 'success', pipeline: 'MG', img: 'person.png', assignee: 'Janice' },
        { id: 4, status: 'success', pipeline: 'Lighting', img: 'person.png', assignee: 'Genevieve' },
        { id: 5, status: 'info', pipeline: 'Rendering', img: 'person.png', assignee: 'Victor Chang' },
        { id: 6, status: 'success', pipeline: 'Compositing', img: 'person.png', assignee: 'Genevieve' },
    ];
    const ArrowLeft = (<CLink><CIcon content={freeSet.cilCaretLeft} alt="btn-left" /></CLink>)
    const ArrowRight = (<CLink><CIcon content={freeSet.cilCaretRight} alt="btn-right" /></CLink>)

    const [pipelinesData, setPipelinesData] = useState([]);
    const [pipelinesData2, setPipelinesData2] = useState([]);
    const [pipelinesData3, setPipelinesData3] = useState([]);
    const [selectedPipeline, setSelectedPipeline] = useState(-1);
    const [translate, setTranslate] = useState(0);

    useEffect(() => {
        setPipelinesData(Pipeline(pipelinesArr, selectedPipeline))
        setPipelinesData2(Pipeline(pipelinesArr2, selectedPipeline))
        setPipelinesData3(Pipeline(pipelinesArr3, selectedPipeline))
    }, [translate])

    const Pipeline = (pipelinesArr, selectedPipeline) => {
        let arr = []
        pipelinesArr.map(el => {
            arr.push(<PipelineItem
                key={el.id}
                status={el.status}
                pipeline={el.pipeline}
                img={el.img}
                assignee={el.assignee}
                selected={selectedPipeline} />)
        });
        return arr
    }

    const PipelineItem = ({ status, pipeline, img, assignee, selected }) => {
        return <div style={{ minWidth: '100px' }} className={"d-flex flex-column my-auto p-3 rounded "
            + (selected && "bg-secondary")}>
            <CBadge id="5" shape="pill" color={status}>{pipeline}</CBadge>
            <div className="c-avatar mx-auto my-1 mt-2">
                <CImg id="5" src={configData.File_URL + img} alt="pic" shape="rounded-circle" height="36" width="36" />
            </div>
            <div id="5" className="text-center">{assignee}</div>
        </div>
    };

    // For dropzone file upload
    const [placeHolder, setPlaceHolder] = useState(true)
    const [files, setFiles] = useState([]);
    const [fileMessage, setFileMessage] = useState(false);

    const baseStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3px',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#3399ff',
        borderStyle: 'dashed',
        color: '#3399ff',
        outline: 'none',
        transition: 'border .24s ease-in-out',
        width: '100%'
    };

    const activeStyle = {
        borderColor: '#3399ff',
        borderStyle: 'solid',
    };

    const acceptStyle = {
        borderColor: '#3399ff',
        borderStyle: 'solid',
    };

    const rejectStyle = {
        borderColor: '#e55353'
    };

    const thumbsContainer = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16
    };

    const thumb = {
        display: 'inline-flex',
        borderRadius: 2,
        border: '1px solid #eaeaea',
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: 'border-box'
    };

    const thumbInner = {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
    };

    const img = {
        display: 'block',
        width: 'auto',
        height: '100%'
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        acceptedFiles,
        fileRejections
    } = useDropzone({
        accept: '', multiple: false, maxFiles: 1,
        // onDrop is called when an image is given
        onDrop: acceptedFiles => {
            // Show the image once successfully drop
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
            setFileMessage(true);
        },
        onDropAccepted: acceptedFiles => {
            setPlaceHolder(false)
            var formData = new FormData();
            acceptedFiles.forEach(file => {
                formData.append('f', file);
            })
            fetch(configData.API_URL + "/upload_file", {
                method: "POST",
                headers: {
                    "Authorization": "Basic " + btoa(user + ":" + token)
                },
                body: formData
            }).then(response => {
                return response.json()
            }).then(body => {
                console.log(body);
                if (body.detail === "Forbidden") {
                    cookies.remove("data");
                    history.push("/login");
                } else {
                    setPicture(body.result)
                }
            }).catch(error => {
                console.log(error);
            })
        },
        onDropRejected: () => {
            setPlaceHolder(true)
        },
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    // Image
    const thumbs = files.map(file => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                <img
                    src={file.preview}
                    style={img}
                />
            </div>
        </div>
    ));

    // Accepted File Message
    const fileAcceptedItems = acceptedFiles.map(file => (
        <li key={file.path}>
            Img - {file.size} bytes
        </li>
    ));

    // Rejected File Message (larger than 1mb)
    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
            Img - {file.size} bytes
            <ul>
                {errors.map(e => (
                    <li key={e.code} className="text-danger">{e.message}</li>
                ))}
            </ul>
        </li>
    ));

    function resetForm() {
        setSelectedPipeline(-1)
        setDescription('');
        setPicture('');
        setPlaceHolder(true);
        setFiles([]);
        setFileMessage(false);
        setVisibility(false);
        setLoaderVisibility("d-none");
    }

    return (
        <>
            <CButton color="warning" onClick={() => {
                setRightSidebar(!rightSidebar)
                resetForm()
            }}>Asset</CButton>
            <CButton color="warning" onClick={() => {
                setRightSidebar2(!rightSidebar2)
                resetForm()
            }}>Animation</CButton>
            <CButton color="warning" onClick={() => {
                setRightSidebar3(!rightSidebar3)
                resetForm()
            }}>Light/Comp</CButton>

            <CContainer fluid>
                <CRow>
                    {assets.map(asset => (
                        <CCol md="6" lg="4" xl="3">
                            <CCard>
                                <CCardHeader>
                                    <CCardTitle className="mb-0 h5 text-center">
                                        {asset.project_name} ({asset.project_key})
                                    </CCardTitle>
                                </CCardHeader>
                                <CCardBody>
                                    <div style={{ width: "100%", maxHeight: "113px", overflow: "hidden" }}>
                                        <ModalImage
                                            className="text-dark rounded"
                                            alt={asset.asset_name}
                                            small={asset.start_date === "01-Apr-2021" ? "/avatars/77.png" : "/avatars/44.png"}
                                            medium={asset.picture_thumbnail}
                                            large={asset.picture_thumbnail} />
                                    </div>
                                    <CCardTitle className="mb-4 mt-2 h5 text-center">
                                        <CCardLink className="text-info "
                                            onClick={() => { history.push("/asset") }}>
                                            {asset.asset_name}</CCardLink>
                                    </CCardTitle>
                                    <div className="row">
                                        <div className="col">
                                            <CCardSubtitle>Start Date</CCardSubtitle>
                                            <CCardText>{asset.start_date} </CCardText>
                                        </div>
                                        <div className="col">
                                            <CCardSubtitle>End Date</CCardSubtitle>
                                            <CCardText>{asset.end_date}</CCardText>
                                        </div>
                                    </div>
                                    <div className="row mt-3 justify-content-center">
                                        {asset.tasks.map(x => (
                                            <CBadge shape="pill" color={x.status} className="mr-1">{x.task}</CBadge>
                                        ))}
                                    </div>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    ))}
                </CRow>
            </CContainer>

            <CContainer fluid>
                <CRow>
                    <CCol md="6" lg="4" xl="3">
                        <CCard>
                            <CCardHeader className="p-0">
                                <ModalImage
                                    className="rounded-top"
                                    alt="Project image name"
                                    small="/omens_logo.png"
                                    medium="/omens_logo.png"
                                    large="/omens_logo.png" />
                            </CCardHeader>
                            <CCardBody>
                                <CCardTitle className="mb-4 h5">
                                    <CCardLink className="text-info"
                                        onClick={() => { history.push("/asset") }}>
                                        [LWS2] Leo Season 2</CCardLink>
                                </CCardTitle>
                                <CRow>
                                    <CCol>
                                        <CCardSubtitle>Series</CCardSubtitle>
                                        <CCardText>80</CCardText>
                                        <CCardSubtitle> Start Date</CCardSubtitle>
                                        <CCardText> 10 Dec 2017</CCardText>
                                    </CCol>
                                    <CCol>
                                        <CCardSubtitle>Status</CCardSubtitle>
                                        <CCardText>Active</CCardText>
                                        <CCardSubtitle>End Date</CCardSubtitle>
                                        <CCardText>10 Dec 2017</CCardText>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol md="6" lg="4" xl="3">
                        <CCard>
                            <CCardHeader>
                                <ModalImage
                                    alt="Project image name"
                                    small="/omens_logo.png"
                                    medium="/omens_logo.png"
                                    large="/omens_logo.png" />
                            </CCardHeader>
                            <CCardBody>
                                <CCardTitle className="mb-4">
                                    <CCardLink className="text-info"
                                        onClick={() => { history.push("/asset") }}>
                                        [LWS2] Leo Season 2</CCardLink>
                                </CCardTitle>
                                <CRow>
                                    <CCol>
                                        <CCardSubtitle>Series</CCardSubtitle>
                                        <CCardText>80</CCardText>
                                        <CCardSubtitle> Start Date</CCardSubtitle>
                                        <CCardText> 10 Dec 2017</CCardText>
                                    </CCol>
                                    <CCol>
                                        <CCardSubtitle>Status</CCardSubtitle>
                                        <CCardText>Active</CCardText>
                                        <CCardSubtitle>End Date</CCardSubtitle>
                                        <CCardText>10 Dec 2017</CCardText>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol md="6" lg="4" xl="3">
                        <CCard>
                            <CCardHeader>
                                <ModalImage
                                    alt="Project image name"
                                    small="/omens_logo.png"
                                    medium="/omens_logo.png"
                                    large="/omens_logo.png" />
                            </CCardHeader>
                            <CCardBody>
                                <CCardTitle className="mb-4">
                                    <CCardLink className="text-info"
                                        onClick={() => { history.push("/asset") }}>
                                        [LWS2] Leo Season 2</CCardLink>
                                </CCardTitle>
                                <CRow>
                                    <CCol>
                                        <CCardSubtitle>Series</CCardSubtitle>
                                        <CCardText>80</CCardText>
                                        <CCardSubtitle> Start Date</CCardSubtitle>
                                        <CCardText> 10 Dec 2017</CCardText>
                                    </CCol>
                                    <CCol>
                                        <CCardSubtitle>Status</CCardSubtitle>
                                        <CCardText>Active</CCardText>
                                        <CCardSubtitle>End Date</CCardSubtitle>
                                        <CCardText>10 Dec 2017</CCardText>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol md="6" lg="4" xl="3">
                        <CCard>
                            <CCardHeader>
                                <ModalImage
                                    alt="Project image name"
                                    small="/omens_logo.png"
                                    medium="/omens_logo.png"
                                    large="/omens_logo.png" />
                            </CCardHeader>
                            <CCardBody>
                                <CCardTitle className="mb-4">
                                    <CCardLink className="text-info"
                                        onClick={() => { history.push("/asset") }}>
                                        [LWS2] Leo Season 2</CCardLink>
                                </CCardTitle>
                                <CRow>
                                    <CCol>
                                        <CCardSubtitle>Series</CCardSubtitle>
                                        <CCardText>80</CCardText>
                                        <CCardSubtitle> Start Date</CCardSubtitle>
                                        <CCardText> 10 Dec 2017</CCardText>
                                    </CCol>
                                    <CCol>
                                        <CCardSubtitle>Status</CCardSubtitle>
                                        <CCardText>Active</CCardText>
                                        <CCardSubtitle>End Date</CCardSubtitle>
                                        <CCardText>10 Dec 2017</CCardText>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol md="6" lg="4" xl="3">
                        <CCard>
                            <CCardHeader>
                                <ModalImage
                                    alt="Project image name"
                                    small="/omens_logo.png"
                                    medium="/omens_logo.png"
                                    large="/omens_logo.png" />
                            </CCardHeader>
                            <CCardBody>
                                <CCardTitle className="mb-4">
                                    <CCardLink className="text-info"
                                        onClick={() => { history.push("/asset") }}>
                                        [LWS2] Leo Season 2</CCardLink>
                                </CCardTitle>
                                <CRow>
                                    <CCol>
                                        <CCardSubtitle>Series</CCardSubtitle>
                                        <CCardText>80</CCardText>
                                        <CCardSubtitle> Start Date</CCardSubtitle>
                                        <CCardText> 10 Dec 2017</CCardText>
                                    </CCol>
                                    <CCol>
                                        <CCardSubtitle>Status</CCardSubtitle>
                                        <CCardText>Active</CCardText>
                                        <CCardSubtitle>End Date</CCardSubtitle>
                                        <CCardText>10 Dec 2017</CCardText>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>

            {/* Slide out right side Asset*/}
            <CSidebar style={{ width: rightSidebar ? "40%" : "0%" }}
                show={rightSidebar} breakpoint="sm"
                aside colorScheme="light">
                <CSidebarNav>
                    <CContainer fluid>
                        {/* Information */}
                        <CRow>
                            <CCol xs="6" xl="4" className="my-auto">
                                <ModalImage
                                    alt="CHAR_AnimExample"
                                    small="/avatars/44.png"
                                    medium="/avatars/44.png"
                                    large="/avatars/44.png" />
                            </CCol>
                            <CCol xs="6" className="pr-4 d-block d-md-none" >
                                <CButtonClose size="lg"
                                    onClick={() => {
                                        setRightSidebar(!rightSidebar)
                                        resetForm()
                                    }}
                                    buttonClass="close">
                                </CButtonClose>
                            </CCol>
                            <CCol xl="8" className="pt-3">
                                <CRow>
                                    <CCol md="6">
                                        <div>Asset:</div>
                                        <div className="h6">CHAR_AnimExample
                                            {/* <CIcon name='cilPencil' className={"d-none" + " pl-1 pb-1"} /> */}
                                        </div>
                                        <div>Asset Type:</div>
                                        <div className="h6">Asset</div>
                                    </CCol>
                                    <CCol sm="6" md="4">
                                        <div>Asset Class:</div>
                                        <div className="h6">Character</div>
                                        <div>Priority:</div>
                                        <CBadge shape="pill" color="success" className="mb-2 mb-md-0">Normal</CBadge>
                                    </CCol>
                                    <CCol md="2" className="pr-4 d-none d-md-block" >
                                        <CButtonClose size="lg"
                                            onClick={() => {
                                                setRightSidebar(!rightSidebar)
                                                resetForm()
                                            }}
                                            buttonClass="close">
                                        </CButtonClose>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol>
                                        <div>Schedule:</div>
                                        <div className="h6">10 Dec 2017 - 31 May 2018</div>
                                        <div>Description:</div>
                                        <div className="h6">There is a fox jump over a river! #dog #river #fox</div>
                                    </CCol>
                                </CRow>
                            </CCol>
                        </CRow>

                        {/* Pipelines status */}
                        <CRow className="my-2">
                            {/* Screen Size BIG */}
                            {pipelinesArr.map(p => (
                                <CCol id={p.id} className={"d-none flex-column my-auto py-3 rounded d-lg-flex " + (selectedPipeline == p.id && "bg-secondary")}
                                    onClick={(e) => { selectedPipeline === e.target.id ? setSelectedPipeline(-1) : setSelectedPipeline(e.target.id) }}>
                                    <CBadge id={p.id} shape="pill" color={p.status} className="px-0">{p.pipeline}</CBadge>
                                    <div className="c-avatar mx-auto my-1 mt-2" >
                                        <CImg id={p.id} src={configData.File_URL + p.img} alt="pic" shape="rounded-circle" height="36" width="36" />
                                    </div>
                                    <div id={p.id} className="text-center">{p.assignee}</div>
                                </CCol>
                            ))}
                            {/* Screen Size SMALL with arrow button and dragging */}
                            <CCol className="d-block d-lg-none">
                                <ScrollMenu
                                    wheel={false}
                                    arrowDisabledClass="d-none" // Hidden the arrow
                                    data={pipelinesData}
                                    arrowLeft={ArrowLeft}
                                    arrowRight={ArrowRight}
                                    hideArrows={true}
                                    hideSingleArrow={true}
                                    selected={selectedPipeline}
                                    onSelect={(e) => {
                                        if (e !== selectedPipeline) setSelectedPipeline(e)
                                        else setSelectedPipeline(-1)
                                    }}
                                    onUpdate={(e) => { setTranslate(e) }} // Initial the data
                                />
                            </CCol>
                        </CRow>

                        <CCollapse show={selectedPipeline !== -1 ? true : false}>
                            <CForm action="" method="put" encType="multipart/form-data" className="form-horizontal" className="container">
                                <CFormGroup className="row">
                                    <CLabel htmlFor="textarea-input" className="col-md-4 col-lg-3 mt-1 text-md-right">Notes:</CLabel>
                                    <CTextarea
                                        name="textarea-input"
                                        id="textarea-input"
                                        rows="2"
                                        value={description}
                                        className="col-md-7 col-lg-8 mb-2"
                                        onChange={(e) => (setDescription(e.target.value))} />
                                </CFormGroup>
                                <CFormGroup className="row mt-n2">
                                    <CLabel htmlFor="company" className="col-md-4 col-lg-3 mt-1 text-md-right">Attachment:</CLabel>
                                    {/* DropZone */}
                                    <div className="col-md-7 col-lg-8 p-0">
                                        <div {...getRootProps({ style })}>
                                            <input {...getInputProps()} />
                                            {placeHolder && <CIcon className="mt-3" content={freeSet.cilCloudUpload} size={'2xl'} />}
                                            {placeHolder && <p show={placeHolder.toString()}>Drop files here to upload</p>}
                                            {/* Image */}
                                            {thumbs}
                                        </div>
                                        {fileMessage &&
                                            <aside style={thumbsContainer}>
                                                {/* Messages */}
                                                <ul>{fileAcceptedItems}</ul>
                                                <ul>{fileRejectionItems}</ul>
                                            </aside>
                                        }
                                    </div>
                                </CFormGroup>
                                <CFormGroup className="d-flex justify-content-center mt-3">
                                    <CButton
                                        color="secondary"
                                        className="mr-2"
                                        onClick={() => {
                                            resetForm()
                                        }}>Cancel</CButton>
                                    <CButton color="info" >Post Note</CButton>
                                    <div className={isLoaderVisible + " mt-1 ml-2"}>
                                        <CSpinner color="info" size="sm" grow />
                                    </div>
                                </CFormGroup>
                            </CForm>
                        </CCollapse>

                        {/* Notes for Task dropdown filter*/}
                        <CRow className="mb-4">
                            <CCol md="4" xl="3" className="mt-1 pr-0">
                                Notes for Task:
                            </CCol>
                            <CCol xs="7" sm="8" md="4" className="mt-1 mt-md-0">
                                <CSelect custom name="select" id="select"
                                    className="border-top-0 border-left-0 border-right-0"
                                    size="sm"
                                    value={notes}
                                    onChange={(e) => {
                                        setNotes(e.target.value)
                                        onChangeNotes(e.target.value)
                                    }}>
                                    <option value="Any">Any</option>
                                    <option value="Art">Art</option>
                                    <option value="Modeling">Modelling</option>
                                    <option value="Rigging">Rigging</option>
                                    <option value="Surfacing">Surfacing</option>
                                    <option value="Look Dev">Look Dev</option>
                                </CSelect>
                            </CCol>
                            <CCol xs="1" md="2" xl="3"></CCol>
                            <CCol xs="2" md="1" className="mt-n1">
                                <CButton>
                                    <CIcon content={freeSet.cilReload} alt="Reload" />
                                </CButton>
                            </CCol>
                            <CCol xs="1"></CCol>
                        </CRow>

                        {/* Notes */}
                        {filteringNotes.map((note) => (
                            <CRow className="mt-n2">
                                <CCol xs="2" lg="1">
                                    <div className="c-avatar mt-1">
                                        <CImg src={configData.File_URL + note.avatar} alt="pic" shape="rounded-circle" height="36" width="36" />
                                    </div>
                                </CCol>
                                <CCol>
                                    <CCard>
                                        <CCardBody>
                                            <CCardText className="mt-n2 text-muted">{note.created_by}
                                                <small className="d-block float-lg-right">{note.created_time}</small>
                                            </CCardText>
                                            <CCardSubtitle>{note.task}</CCardSubtitle>
                                            <div className="pt-3" dangerouslySetInnerHTML={{ __html: note.description }}></div>
                                        </CCardBody>
                                        <CCardFooter className="p-1">
                                            <CButton className="p-0 float-right">
                                                <CIcon content={freeSet.cilTrash} alt="Delete" />
                                            </CButton>
                                        </CCardFooter>
                                    </CCard>
                                </CCol>
                            </CRow>
                        ))}
                    </CContainer>
                </CSidebarNav>
            </CSidebar>

            {/* Slide out right side Animation*/}
            <CSidebar style={{ width: rightSidebar2 ? "40%" : "0%" }}
                show={rightSidebar2} breakpoint="sm"
                aside colorScheme="light">
                <CSidebarNav>
                    <CContainer fluid>
                        {/* Information */}
                        <CRow>
                            <CCol xs="6" xl="4" className="my-auto">
                                <ModalImage
                                    alt="CHAR_AnimExample"
                                    small="/avatars/44.png"
                                    medium="/avatars/44.png"
                                    large="/avatars/44.png" />
                            </CCol>
                            <CCol xs="6" className="pr-4 d-block d-md-none" >
                                <CButtonClose size="lg"
                                    onClick={() => {
                                        setRightSidebar2(!rightSidebar2)
                                        resetForm()
                                    }}
                                    buttonClass="close">
                                </CButtonClose>
                            </CCol>
                            <CCol xl="8" className="pt-3">
                                <CRow>
                                    <CCol md="6">
                                        <div>Asset:</div>
                                        <div className="h6">CHAR_AnimExample
                                            {/* <CIcon name='cilPencil' className={"d-none" + " pl-1 pb-1"} /> */}
                                        </div>
                                        <div>Asset Type:</div>
                                        <div className="h6">Shot</div>
                                        <div>Frames:</div>
                                        <div className="h6">120</div>
                                    </CCol>
                                    <CCol sm="6" md="4">
                                        <div>Set:</div>
                                        <div className="h6">Garden</div>
                                        <div>Priority:</div>
                                        <CBadge shape="pill" color="success" className="mb-2 mb-md-0">Normal</CBadge>
                                    </CCol>
                                    <CCol md="2" className="pr-4 d-none d-md-block" >
                                        <CButtonClose size="lg"
                                            onClick={() => {
                                                setRightSidebar2(!rightSidebar2)
                                                resetForm()
                                            }}
                                            buttonClass="close">
                                        </CButtonClose>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol>
                                        <div>Schedule:</div>
                                        <div className="h6">10 Dec 2017 - 31 May 2018</div>
                                        <div>Description:</div>
                                        <div className="h6">There is a fox jump over a river! #dog #river #fox</div>
                                    </CCol>
                                </CRow>
                            </CCol>
                        </CRow>

                        {/* Pipelines status */}
                        <CRow className="my-2">
                            {/* Screen Size BIG */}
                            {pipelinesArr2.map(p => (
                                <CCol id={p.id} className={"d-none flex-column my-auto py-3 rounded d-sm-flex " + (selectedPipeline == p.id && "bg-secondary")}
                                    onClick={(e) => { selectedPipeline === e.target.id ? setSelectedPipeline(-1) : setSelectedPipeline(e.target.id) }}>
                                    <CBadge id={p.id} shape="pill" color={p.status} className="px-0">{p.pipeline}</CBadge>
                                    <div className="c-avatar mx-auto my-1 mt-2" >
                                        <CImg id={p.id} src={configData.File_URL + p.img} alt="pic" shape="rounded-circle" height="36" width="36" />
                                    </div>
                                    <div id={p.id} className="text-center">{p.assignee}</div>
                                </CCol>
                            ))}
                            {/* Screen Size SMALL with arrow button and dragging */}
                            <CCol className="d-block d-sm-none">
                                <ScrollMenu
                                    wheel={false}
                                    arrowDisabledClass="d-none" // Hidden the arrow
                                    data={pipelinesData2}
                                    arrowLeft={ArrowLeft}
                                    arrowRight={ArrowRight}
                                    hideArrows={true}
                                    hideSingleArrow={true}
                                    selected={selectedPipeline}
                                    onSelect={(e) => {
                                        if (e !== selectedPipeline) setSelectedPipeline(e)
                                        else setSelectedPipeline(-1)
                                    }}
                                    onUpdate={(e) => { setTranslate(e) }} // Initial the data
                                />
                            </CCol>
                        </CRow>

                        <CCollapse show={selectedPipeline !== -1 ? true : false}>
                            <CForm action="" method="put" encType="multipart/form-data" className="form-horizontal" className="container">
                                <CFormGroup className="row">
                                    <CLabel htmlFor="textarea-input" className="col-md-4 col-lg-3 mt-1 text-md-right">Notes:</CLabel>
                                    <CTextarea
                                        name="textarea-input"
                                        id="textarea-input"
                                        rows="2"
                                        value={description}
                                        className="col-md-7 col-lg-8 mb-2"
                                        onChange={(e) => (setDescription(e.target.value))} />
                                </CFormGroup>
                                <CFormGroup className="row mt-n2">
                                    <CLabel htmlFor="company" className="col-md-4 col-lg-3 mt-1 text-md-right">Attachment:</CLabel>
                                    {/* DropZone */}
                                    <div className="col-md-7 col-lg-8 p-0">
                                        <div {...getRootProps({ style })}>
                                            <input {...getInputProps()} />
                                            {placeHolder && <CIcon className="mt-3" content={freeSet.cilCloudUpload} size={'2xl'} />}
                                            {placeHolder && <p show={placeHolder.toString()}>Drop files here to upload</p>}
                                            {/* Image */}
                                            {thumbs}
                                        </div>
                                        {fileMessage &&
                                            <aside style={thumbsContainer}>
                                                {/* Messages */}
                                                <ul>{fileAcceptedItems}</ul>
                                                <ul>{fileRejectionItems}</ul>
                                            </aside>
                                        }
                                    </div>
                                </CFormGroup>
                                <CFormGroup className="d-flex justify-content-center mt-3">
                                    <CButton
                                        color="secondary"
                                        className="mr-2"
                                        onClick={() => {
                                            resetForm()
                                        }}>Cancel</CButton>
                                    <CButton color="info" >Post Note</CButton>
                                    <div className={isLoaderVisible + " mt-1 ml-2"}>
                                        <CSpinner color="info" size="sm" grow />
                                    </div>
                                </CFormGroup>
                            </CForm>
                        </CCollapse>

                        {/* Notes for Task dropdown filter*/}
                        <CRow className="mb-4">
                            <CCol md="4" xl="3" className="mt-1 pr-0">
                                Notes for Task:
                            </CCol>
                            <CCol xs="7" sm="8" md="4" className="mt-1 mt-md-0">
                                <CSelect custom name="select" id="select"
                                    className="border-top-0 border-left-0 border-right-0"
                                    size="sm"
                                    value={notes}
                                    onChange={(e) => (setNotes(e.target.value))}>
                                    <option value="Any">Any</option>
                                    <option value="Art">Art</option>
                                    <option value="Modelling">Modelling</option>
                                    <option value="Rigging">Rigging</option>
                                    <option value="Surfacing">Surfacing</option>
                                    <option value="Look Dev">Look Dev</option>
                                </CSelect>
                            </CCol>
                            <CCol xs="1" md="2" xl="3"></CCol>
                            <CCol xs="2" md="1" className="mt-n1">
                                <CButton>
                                    <CIcon content={freeSet.cilReload} alt="Reload" />
                                </CButton>
                            </CCol>
                            <CCol xs="1"></CCol>
                        </CRow>

                        {/* Notes */}
                        <CRow className="mt-n2">
                            <CCol xs="2" lg="1">
                                <div className="c-avatar mt-1">
                                    <CImg src={configData.File_URL + "person.png"} alt="pic" shape="rounded-circle" height="36" width="36" />
                                </div>
                            </CCol>
                            <CCol>
                                <CCard>
                                    <CCardBody>
                                        <CCardText className="mt-n2 text-muted">Summer Teo
                                            <span className="d-block float-lg-right">11-Dec-2017 07:45:11 PM</span>
                                        </CCardText>
                                        <CCardSubtitle>
                                            Assignment
                                        </CCardSubtitle>
                                        <CCardText className="pt-3">
                                            Modelling task assigned to Clarissa due by 31-Dec-2017</CCardText>
                                    </CCardBody>
                                    <CCardFooter className="p-1">
                                        <CButton className="p-0 float-right">
                                            <CIcon content={freeSet.cilTrash} alt="Delete" />
                                        </CButton>
                                    </CCardFooter>
                                </CCard>
                            </CCol>
                        </CRow>
                        <CRow className="mt-n2">
                            <CCol xs="2" lg="1">
                                <div className="c-avatar mt-1">
                                    <CImg src={configData.File_URL + "person.png"} alt="pic" shape="rounded-circle" height="36" width="36" />
                                </div>
                            </CCol>
                            <CCol>
                                <CCard>
                                    <CCardBody>
                                        <CCardText className="mt-n2 text-muted">Summer Teo
                                            <span className="d-block float-lg-right">11-Dec-2017 07:45:11 PM</span>
                                        </CCardText>
                                        <CCardSubtitle>
                                            Assignment
                                        </CCardSubtitle>
                                        <CCardText className="pt-3">
                                            Modelling task assigned to Clarissa due by 31-Dec-2017</CCardText>
                                    </CCardBody>
                                    <CCardFooter className="p-1">
                                        <CButton className="p-0 float-right">
                                            <CIcon content={freeSet.cilTrash} alt="Delete" />
                                        </CButton>
                                    </CCardFooter>
                                </CCard>
                            </CCol>
                        </CRow>
                        <CRow className="mt-n2">
                            <CCol xs="2" lg="1">
                                <div className="c-avatar mt-1">
                                    <CImg src={configData.File_URL + "person.png"} alt="pic" shape="rounded-circle" height="36" width="36" />
                                </div>
                            </CCol>
                            <CCol>
                                <CCard>
                                    <CCardBody>
                                        <CCardText className="mt-n2 text-muted">Summer Teo
                                            <span className="d-block float-lg-right">11-Dec-2017 07:45:11 PM</span>
                                        </CCardText>
                                        <CCardSubtitle>
                                            Assignment
                                        </CCardSubtitle>
                                        <CCardText className="pt-3">
                                            Modelling task assigned to Clarissa due by 31-Dec-2017</CCardText>
                                    </CCardBody>
                                    <CCardFooter className="p-1">
                                        <CButton className="p-0 float-right">
                                            <CIcon content={freeSet.cilTrash} alt="Delete" />
                                        </CButton>
                                    </CCardFooter>
                                </CCard>
                            </CCol>
                        </CRow>
                    </CContainer>
                </CSidebarNav>
            </CSidebar>

            {/* Slide out right side Light/Comp*/}
            <CSidebar style={{ width: rightSidebar3 ? "40%" : "0%" }}
                show={rightSidebar3} breakpoint="sm"
                aside colorScheme="light">
                <CSidebarNav>
                    <CContainer fluid>
                        {/* Information */}
                        <CRow>
                            <CCol xs="6" xl="4" className="my-auto">
                                <ModalImage
                                    alt="CHAR_AnimExample"
                                    small="/avatars/44.png"
                                    medium="/avatars/44.png"
                                    large="/avatars/44.png" />
                            </CCol>
                            <CCol xs="6" className="pr-4 d-block d-md-none" >
                                <CButtonClose size="lg"
                                    onClick={() => {
                                        setRightSidebar3(!rightSidebar3)
                                        resetForm()
                                    }}
                                    buttonClass="close">
                                </CButtonClose>
                            </CCol>
                            <CCol xl="8" className="pt-3">
                                <CRow>
                                    <CCol md="6">
                                        <div>Asset:</div>
                                        <div className="h6">CHAR_AnimExample
                                            {/* <CIcon name='cilPencil' className={"d-none" + " pl-1 pb-1"} /> */}
                                        </div>
                                        <div>Asset Type:</div>
                                        <div className="h6">Shot</div>
                                        <div>Frames:</div>
                                        <div className="h6">120</div>
                                    </CCol>
                                    <CCol sm="6" md="4">
                                        <div>Set:</div>
                                        <div className="h6">Garden</div>
                                        <div>Priority:</div>
                                        <CBadge shape="pill" color="success" className="mb-2 mb-md-0">Normal</CBadge>
                                    </CCol>
                                    <CCol md="2" className="pr-4 d-none d-md-block" >
                                        <CButtonClose size="lg"
                                            onClick={() => {
                                                setRightSidebar3(!rightSidebar3)
                                                resetForm()
                                            }}
                                            buttonClass="close">
                                        </CButtonClose>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol>
                                        <div>Schedule:</div>
                                        <div className="h6">10 Dec 2017 - 31 May 2018</div>
                                        <div>Description:</div>
                                        <div className="h6">There is a fox jump over a river! #dog #river #fox</div>
                                    </CCol>
                                </CRow>
                            </CCol>
                        </CRow>

                        {/* Pipelines status */}
                        <CRow className="my-2">
                            {/* Screen Size BIG */}
                            {pipelinesArr3.map(p => (
                                <CCol id={p.id} className={"d-none flex-column my-auto py-3 rounded d-xxl-flex " + (selectedPipeline == p.id && "bg-secondary")}
                                    onClick={(e) => { selectedPipeline === e.target.id ? setSelectedPipeline(-1) : setSelectedPipeline(e.target.id) }}>
                                    <CBadge id={p.id} shape="pill" color={p.status} className="px-0">{p.pipeline}</CBadge>
                                    <div className="c-avatar mx-auto my-1 mt-2" >
                                        <CImg id={p.id} src={configData.File_URL + p.img} alt="pic" shape="rounded-circle" height="36" width="36" />
                                    </div>
                                    <div id={p.id} className="text-center">{p.assignee}</div>
                                </CCol>
                            ))}
                            {/* Screen Size SMALL with arrow button and dragging */}
                            <CCol className="d-block d-xxl-none">
                                <ScrollMenu
                                    wheel={false}
                                    arrowDisabledClass="d-none" // Hidden the arrow
                                    data={pipelinesData3}
                                    arrowLeft={ArrowLeft}
                                    arrowRight={ArrowRight}
                                    hideArrows={true}
                                    hideSingleArrow={true}
                                    selected={selectedPipeline}
                                    onSelect={(e) => {
                                        if (e !== selectedPipeline) setSelectedPipeline(e)
                                        else setSelectedPipeline(-1)
                                    }}
                                    onUpdate={(e) => { setTranslate(e) }} // Initial the data
                                />
                            </CCol>
                        </CRow>

                        <CCollapse show={selectedPipeline !== -1 ? true : false}>
                            <CForm action="" method="put" encType="multipart/form-data" className="form-horizontal" className="container">
                                <CFormGroup className="row">
                                    <CLabel htmlFor="textarea-input" className="col-md-4 col-lg-3 mt-1 text-md-right">Notes:</CLabel>
                                    <CTextarea
                                        name="textarea-input"
                                        id="textarea-input"
                                        rows="2"
                                        value={description}
                                        className="col-md-7 col-lg-8 mb-2"
                                        onChange={(e) => (setDescription(e.target.value))} />
                                </CFormGroup>
                                <CFormGroup className="row mt-n2">
                                    <CLabel htmlFor="company" className="col-md-4 col-lg-3 mt-1 text-md-right">Attachment:</CLabel>
                                    {/* DropZone */}
                                    <div className="col-md-7 col-lg-8 p-0">
                                        <div {...getRootProps({ style })}>
                                            <input {...getInputProps()} />
                                            {placeHolder && <CIcon className="mt-3" content={freeSet.cilCloudUpload} size={'2xl'} />}
                                            {placeHolder && <p show={placeHolder.toString()}>Drop files here to upload</p>}
                                            {/* Image */}
                                            {thumbs}
                                        </div>
                                        {fileMessage &&
                                            <aside style={thumbsContainer}>
                                                {/* Messages */}
                                                <ul>{fileAcceptedItems}</ul>
                                                <ul>{fileRejectionItems}</ul>
                                            </aside>
                                        }
                                    </div>
                                </CFormGroup>
                                <CFormGroup className="d-flex justify-content-center mt-3">
                                    <CButton
                                        color="secondary"
                                        className="mr-2"
                                        onClick={() => {
                                            resetForm()
                                        }}>Cancel</CButton>
                                    <CButton color="info" >Post Note</CButton>
                                    <div className={isLoaderVisible + " mt-1 ml-2"}>
                                        <CSpinner color="info" size="sm" grow />
                                    </div>
                                </CFormGroup>
                            </CForm>
                        </CCollapse>

                        {/* Notes for Task dropdown filter*/}
                        <CRow className="mb-4">
                            <CCol md="4" xl="3" className="mt-1 pr-0">
                                Notes for Task:
                            </CCol>
                            <CCol xs="7" sm="8" md="4" className="mt-1 mt-md-0">
                                <CSelect custom name="select" id="select"
                                    className="border-top-0 border-left-0 border-right-0"
                                    size="sm"
                                    value={notes}
                                    onChange={(e) => (setNotes(e.target.value))}>
                                    <option value="Any">Any</option>
                                    <option value="Art">Art</option>
                                    <option value="Modelling">Modelling</option>
                                    <option value="Rigging">Rigging</option>
                                    <option value="Surfacing">Surfacing</option>
                                    <option value="Look Dev">Look Dev</option>
                                </CSelect>
                            </CCol>
                            <CCol xs="1" md="2" xl="3"></CCol>
                            <CCol xs="2" md="1" className="mt-n1">
                                <CButton>
                                    <CIcon content={freeSet.cilReload} alt="Reload" />
                                </CButton>
                            </CCol>
                            <CCol xs="1"></CCol>
                        </CRow>

                        {/* Notes */}
                        <CRow className="mt-n2">
                            <CCol xs="2" lg="1">
                                <div className="c-avatar mt-1">
                                    <CImg src={configData.File_URL + "person.png"} alt="pic" shape="rounded-circle" height="36" width="36" />
                                </div>
                            </CCol>
                            <CCol>
                                <CCard>
                                    <CCardBody>
                                        <CCardText className="mt-n2 text-muted">Summer Teo
                                            <span className="d-block float-lg-right">11-Dec-2017 07:45:11 PM</span>
                                        </CCardText>
                                        <CCardSubtitle>
                                            Assignment
                                        </CCardSubtitle>
                                        <CCardText className="pt-3">
                                            Modelling task assigned to Clarissa due by 31-Dec-2017</CCardText>
                                    </CCardBody>
                                    <CCardFooter className="p-1">
                                        <CButton className="p-0 float-right">
                                            <CIcon content={freeSet.cilTrash} alt="Delete" />
                                        </CButton>
                                    </CCardFooter>
                                </CCard>
                            </CCol>
                        </CRow>
                        <CRow className="mt-n2">
                            <CCol xs="2" lg="1">
                                <div className="c-avatar mt-1">
                                    <CImg src={configData.File_URL + "person.png"} alt="pic" shape="rounded-circle" height="36" width="36" />
                                </div>
                            </CCol>
                            <CCol>
                                <CCard>
                                    <CCardBody>
                                        <CCardText className="mt-n2 text-muted">Summer Teo
                                            <span className="d-block float-lg-right">11-Dec-2017 07:45:11 PM</span>
                                        </CCardText>
                                        <CCardSubtitle>
                                            Assignment
                                        </CCardSubtitle>
                                        <CCardText className="pt-3">
                                            Modelling task assigned to Clarissa due by 31-Dec-2017</CCardText>
                                    </CCardBody>
                                    <CCardFooter className="p-1">
                                        <CButton className="p-0 float-right">
                                            <CIcon content={freeSet.cilTrash} alt="Delete" />
                                        </CButton>
                                    </CCardFooter>
                                </CCard>
                            </CCol>
                        </CRow>
                        <CRow className="mt-n2">
                            <CCol xs="2" lg="1">
                                <div className="c-avatar mt-1">
                                    <CImg src={configData.File_URL + "person.png"} alt="pic" shape="rounded-circle" height="36" width="36" />
                                </div>
                            </CCol>
                            <CCol>
                                <CCard>
                                    <CCardBody>
                                        <CCardText className="mt-n2 text-muted">Summer Teo
                                            <span className="d-block float-lg-right">11-Dec-2017 07:45:11 PM</span>
                                        </CCardText>
                                        <CCardSubtitle>
                                            Assignment
                                        </CCardSubtitle>
                                        <CCardText className="pt-3">
                                            Modelling task assigned to Clarissa due by 31-Dec-2017</CCardText>
                                    </CCardBody>
                                    <CCardFooter className="p-1">
                                        <CButton className="p-0 float-right">
                                            <CIcon content={freeSet.cilTrash} alt="Delete" />
                                        </CButton>
                                    </CCardFooter>
                                </CCard>
                            </CCol>
                        </CRow>
                    </CContainer>
                </CSidebarNav>
            </CSidebar>
        </>
    )
}


export default AssetLibrary
