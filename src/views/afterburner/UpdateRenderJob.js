import React from 'react'
import {
    CInput,
    CButton,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CForm,
    CFormGroup,
    CLabel,
    CAlert,
    CSpinner,
} from '@coreui/react'
import { useHistory } from "react-router-dom";
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "universal-cookie";
import configData from "../../config.json";

const UpdateRenderJob = ({ showModal, onShow, token, user, data, jobData }) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const cookies = new Cookies();
    const renderJobs = useSelector(state => state.renderJobs)

    const [isVisible, setVisibility] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoaderVisible, setLoaderVisibility] = useState("d-none");

    const [job_id, setJobId] = useState(jobData.job_id);
    const [job_name, setJobName] = useState(jobData.job_name);
    const scene_path = jobData.scene_path;
    const output_path = jobData.output_path;
    const log_path = jobData.log_path;
    const maya_version = jobData.maya_version;
    const renderer = jobData.renderer;
    const rendererValue = jobData.rendererValue;
    const location = jobData.location;
    const locationValue = jobData.locationValue;
    const [host_tags, setHostTag] = useState(jobData.host_tags);
    const [max_hosts, setMaxHost] = useState(jobData.max_hosts);
    const frames = jobData.frames;
    const [batch_frames, setBatchFrames] = useState(jobData.batch_frames);
    const [max_time, setMaxTime] = useState(jobData.max_time);
    const [min_frame_time, setMinTime] = useState(jobData.min_frame_time);
    const [priority, setPriority] = useState(jobData.priority);
    const additional_params = jobData.additional_params;

    if (data === undefined) {
        history.push("/login")
    }

    useEffect(() => {
        setJobId(jobData.job_id);
        setJobName(jobData.job_name);
        setHostTag(jobData.host_tags);
        setMaxHost(jobData.max_hosts);
        setBatchFrames(jobData.batch_frames);
        setMaxTime(jobData.max_time);
        setMinTime(jobData.min_frame_time);
        setPriority(jobData.priority);
    }, [jobData])

    const onUpdateJob = (e) => {
        e.preventDefault();
        setVisibility(false);

        if (!job_name || !host_tags || !max_hosts || !batch_frames || !max_time || !min_frame_time || !priority) {
            setErrorMsg("Please fill in mandatory fields.");
            setVisibility(true);
        } else if (max_hosts < 1 || max_hosts > 99 || batch_frames < 1 || max_time < 1 || min_frame_time < 1 || priority < 1) {
            setErrorMsg("Please enter valid values for Max Hosts, Batch Frames, Time or Priority.");
            setVisibility(true);
        } else {
            const data = {
                job_id, job_name, scene_path, output_path, log_path,
                maya_version, renderer, location, host_tags, max_hosts, frames,
                batch_frames, max_time, min_frame_time, priority, additional_params
            };
            setLoaderVisibility("");
            fetch(configData.API_URL + "/render_job/" + job_id, {
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
                    history.push("/login")
                } else if (body.result !== "Success") {
                    setErrorMsg(body.result);
                    setVisibility(true);
                } else {
                    dispatch({
                        type: 'set', renderJobs: (
                            renderJobs.map((render) => {
                                if (render.job_id === job_id) {
                                    return {
                                        ...render,
                                        job_name: data.job_name,
                                        host_tags: data.host_tags,
                                        max_hosts: data.max_hosts,
                                        batch_frames: data.batch_frames,
                                        max_time: data.max_time,
                                        min_frame_time: data.min_frame_time,
                                        priority: data.priority,
                                    }
                                } else {
                                    return render
                                }
                            })
                        )
                    })
                    onShow()
                }
            }).catch(error => {
                setLoaderVisibility("d-none");
                console.log(error);
            })
        }
    }

    return (
        <CModal
            show={showModal}
            onClose={() => {
                onShow()
                setVisibility(false);
                setLoaderVisibility("d-none");
            }} >
            <CModalHeader closeButton>
                <CModalTitle>Update Render Job</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal" className="container">
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Job Name *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={job_name}
                            onChange={(e) => (setJobName(e.target.value))} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Scene Path</CLabel>
                        <CInput
                            disabled
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-1"
                            value={scene_path} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Output Folder</CLabel>
                        <CInput
                            disabled
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-1"
                            value={output_path} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Log Folder</CLabel>
                        <CInput
                            disabled
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-1"
                            value={log_path} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Maya Version</CLabel>
                        <CLabel className="col-md-8 mt-2">{maya_version}</CLabel>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Renderer</CLabel>
                        <CLabel className="col-md-8 mt-2">{rendererValue}</CLabel>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Hosts Location</CLabel>
                        <CLabel className="col-md-8 mt-2">{locationValue}</CLabel>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Host Group *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={host_tags}
                            onChange={(e) => (setHostTag(e.target.value))} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Max Hosts *</CLabel>
                        <CInput
                            type="number" min={1} max={99}
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={max_hosts}
                            onChange={(e) => (setMaxHost(e.target.value))} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Render Frames</CLabel>
                        <CLabel className="col-md-8 mt-2">{frames}</CLabel>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Batch Frames *</CLabel>
                        <CInput
                            type="number" min={1}
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={batch_frames}
                            onChange={(e) => (setBatchFrames(e.target.value))} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Max Batch Time *</CLabel>
                        <CInput
                            type="number" min={1}
                            className="col-sm-10 col-md-6 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={max_time}
                            onChange={(e) => (setMaxTime(e.target.value))} />
                        <span className="col-2 mt-2">Mins</span>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Min Frame Time *</CLabel>
                        <CInput
                            type="number" min={1}
                            className="col-sm-10 col-md-6 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={min_frame_time}
                            onChange={(e) => (setMinTime(e.target.value))} />
                        <span className="col-2 mt-2">Secs</span>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Priority *</CLabel>
                        <CInput
                            type="number" min={1}
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={priority}
                            onChange={(e) => (setPriority(e.target.value))} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Additional Params</CLabel>
                        <CInput
                            disabled
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-1"
                            value={additional_params} />
                    </CFormGroup>
                    <CFormGroup className="d-flex justify-content-center mt-4">
                        <CButton
                            color="secondary"
                            className="mr-2"
                            onClick={() => {
                                onShow()
                                setVisibility(false);
                                setLoaderVisibility("d-none");
                            }}
                        >Cancel</CButton>
                        <CButton color="info" onClick={onUpdateJob}>Update Job</CButton>
                        <div className={isLoaderVisible + " mt-1 ml-2"}>
                            <CSpinner color="info" size="sm" grow />
                        </div>
                    </CFormGroup>
                    <CAlert show={isVisible} color="danger">{errorMsg}</CAlert>
                </CForm>
            </CModalBody>
        </CModal>
    )
}

export default UpdateRenderJob