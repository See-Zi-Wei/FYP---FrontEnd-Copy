import React, { useState } from 'react'
import {
    CButton,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CForm,
    CFormGroup,
    CInput,
    CLabel,
    CSelect,
    CSwitch,
    CSpinner,
    CInputCheckbox,
    CAlert
} from '@coreui/react'
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import configData from "../../config.json";

const CreateRenderJob = ({ showModal, onShow, token, user }) => {

    const history = useHistory();
    const cookies = new Cookies();

    const [isVisible, setVisibility] = useState(false);
    const [isLoaderVisible, setLoaderVisibility] = useState("d-none");
    const [errorMsg, setErrorMsg] = useState("");

    const [job_name, setJobName] = useState("");
    const [scene_path, setScenePath] = useState("");
    const [output_path, setOutputPath] = useState("");
    const [log_path, setLogPath] = useState("");
    const [maya_version, setMayaVersion] = useState("2018");
    const [renderer, setRenderer] = useState(0);
    const [host_tags, setHostTag] = useState("");
    const [max_hosts, setMaxHost] = useState(99);
    const [frames, setFrames] = useState("1-10");
    const [batch_frames, setBatchFrames] = useState(1);
    const [max_time, setMaxTime] = useState(360);
    const [location, setLocation] = useState(0);
    const [min_frame_time, setMinTime] = useState(10);
    const [priority, setPriority] = useState(999);
    const [additional_params, setAdditionalParams] = useState("");
    const [split_job, setSplitJob] = useState(false);
    const [gpu, setGPU] = useState(false);

    const onCreate = (e) => {
        e.preventDefault();
        setVisibility(false);
        var re = /^(?=[^A-Za-z]+$).*[0-9]+[\-]{1}[0-9]+.*$/g;
        if (!job_name || !scene_path || !output_path || !host_tags || !max_hosts
            || !frames || !batch_frames || !max_time || !min_frame_time || !priority) {
            setErrorMsg("Please fill in mandatory fields.");
            setVisibility(true);
        } else if (frames.match(re) === null) {
            setErrorMsg("Please fill in valid frames pattern.");
            setVisibility(true);
        } else if (max_hosts < 1 || max_hosts > 99 || batch_frames < 1 || max_time < 1 || min_frame_time < 1 || priority < 1) {
            setErrorMsg("Please enter valid values for Max Hosts, Batch Frames, Time or Priority.");
            setVisibility(true);
        } else {
            const data = {
                job_name, scene_path, output_path, log_path, maya_version,
                renderer, host_tags, max_hosts, frames, batch_frames, max_time,
                min_frame_time, priority, additional_params, split_job, gpu, location
            }
            setLoaderVisibility("");
            fetch(configData.API_URL + "/render_job", {
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
                } else if (body.result !== "Success") {
                    setErrorMsg(body.result);
                    setVisibility(true);
                } else {
                    onShow();
                    resetData();
                    history.push("/dashboard")
                    history.goBack()
                }
            }).catch(error => {
                setLoaderVisibility("d-none");
                console.log(error);
            })
        }
    }

    function resetData() {
        setJobName('');
        setScenePath('');
        setOutputPath('');
        setLogPath("");
        setMayaVersion("");
        setRenderer(0);
        setHostTag("");
        setMaxHost(99);
        setFrames("1-10");
        setBatchFrames(1);
        setMaxTime(360);
        setLocation(0);
        setMinTime(10);
        setPriority(999);
        setAdditionalParams("");
        setSplitJob(false);
        setGPU(false);
        setVisibility(false);
    }

    return (
        <CModal
            show={showModal}
            onClose={() => {
                onShow()
                setVisibility(false)
                setLoaderVisibility("d-none");
            }}
            className="text-dark">
            <CModalHeader closeButton>
                <CModalTitle>New Render Job</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal" className="container">
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2"> Job Name *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            placeholder="e.g. MWS401_Sc01"
                            value={job_name}
                            onChange={(e) => setJobName(e.target.value)} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Scene Path *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            placeholder="e.g. Q:\Projects\MWS4\MWS401_Sc01.mb"
                            value={scene_path}
                            onChange={(e) => setScenePath(e.target.value)} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Output Folder *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            placeholder="e.g. \\houston\renders\MWS401"
                            value={output_path}
                            onChange={(e) => setOutputPath(e.target.value)} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Log Folder </CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            placeholder="e.g. \\houston\renders\MWS401\logs"
                            value={log_path}
                            onChange={(e) => setLogPath(e.target.value)} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Maya Version *</CLabel>
                        <CSelect custom name="select" id="select"
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={maya_version}
                            onChange={(e) => setMayaVersion(e.target.value)}>
                            <option value="2018">2018</option>
                            <option value="2016">2016</option>
                        </CSelect>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Renderer </CLabel>
                        <CSelect custom name="select" id="select"
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={renderer}
                            onChange={(e) => setRenderer(parseInt(e.target.value))}>
                            <option value="0">Arnold</option>
                            <option value="1">Redshift</option>
                            <option value="2">Blender</option>
                        </CSelect>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-1">GPU Only</CLabel>
                        <div className="col-md-8">
                            <CSwitch shape={'pill'} color={'info'} labelOn={'\u2713'} labelOff={'\u2715'}
                                checked={gpu}
                                value={gpu}
                                onChange={(e) => { if (e.currentTarget.checked) setGPU(1); else setGPU(0) }} />
                        </div>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Hosts Location </CLabel>
                        <CSelect custom name="select" id="select"
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={location}
                            onChange={(e) => setLocation(parseInt(e.target.value))}>
                            <option value="0">Singapore</option>
                            <option value="1">Kuala Lumpur</option>
                            <option value="2">Bangalore</option>
                        </CSelect>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Host Group * </CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={host_tags}
                            onChange={(e) => setHostTag(e.target.value)} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Max Hosts * </CLabel>
                        <CInput
                            type="number" min={1} max={99}
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={max_hosts}
                            onChange={(e) => setMaxHost(e.target.value)} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Render Frames * </CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={frames}
                            onChange={(e) => setFrames(e.target.value)} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Batch Frames * </CLabel>
                        <CInput
                            type="number" min={1}
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={batch_frames}
                            onChange={(e) => setBatchFrames(e.target.value)} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Max Batch Time *</CLabel>
                        <CInput
                            type="number" min={1}
                            className="col-sm-10 col-md-6 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={max_time}
                            onChange={(e) => setMaxTime(e.target.value)} />
                        <span className="col-2 mt-2">Mins</span>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Min Frame Time *</CLabel>
                        <CInput
                            type="number" min={1}
                            className="col-sm-10 col-md-6 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={min_frame_time}
                            onChange={(e) => setMinTime(e.target.value)} />
                        <span className="col-2 mt-2">Secs</span>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Priority *</CLabel>
                        <CInput
                            type="number" min={1}
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={priority}
                            onChange={(e) => { setPriority(e.target.value) }} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Additional Params</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={additional_params}
                            onChange={(e) => setAdditionalParams(e.target.value)} />
                    </CFormGroup>
                    <div className="float-right mt-n1">
                        <CInputCheckbox
                            checked={split_job}
                            value={split_job}
                            onChange={(e) => { if (e.currentTarget.checked) setSplitJob(1); else setSplitJob(0) }} />
                        <CLabel>Create Multiple Jobs by Commas in Params</CLabel>
                    </div>
                    <CFormGroup className="d-flex justify-content-center mt-5">
                        <CButton
                            color="secondary"
                            className="mr-2"
                            onClick={() => {
                                onShow()
                                setVisibility(false);
                                setLoaderVisibility("d-none");
                            }}
                        >Cancel</CButton>
                        <CButton color="info" onClick={onCreate}>Create Job</CButton>
                        <div className={isLoaderVisible + " mt-1 ml-2"}>
                            <CSpinner color="info" size="sm" grow />
                        </div>
                    </CFormGroup>
                    <CAlert show={isVisible} color="danger">{errorMsg}</CAlert>
                </CForm>
            </CModalBody>
        </CModal >
    )
}

export default CreateRenderJob