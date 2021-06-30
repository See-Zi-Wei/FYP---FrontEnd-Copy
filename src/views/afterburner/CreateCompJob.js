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
    CAlert,
    CSpinner,
} from '@coreui/react'
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import configData from "../../config.json";

const CreateCompJob = ({ showModal, onShow, token, user }) => {

    const history = useHistory();
    const cookies = new Cookies();

    const [isVisible, setVisibility] = useState(false);
    const [isLoaderVisible, setLoaderVisibility] = useState("d-none");
    const [errorMsg, setErrorMsg] = useState("");

    const [job_name, setJobName] = useState("");
    const [file_path, setFilePath] = useState("");
    const [output_path, setOutputPath] = useState("");
    const [log_path, setLogPath] = useState("");
    const [comp_software, setCompSoftware] = useState(0);
    const [location, setLocation] = useState(0);
    const [host_tags, setHostTag] = useState("");
    const [additional_params, setAdditionalParams] = useState("");
    const [max_job_time, setMaxJobTime] = useState(360);
    const [min_job_time, setMinJobTime] = useState(10);
    const [priority, setPriority] = useState(999);

    const onCreate = (e) => {
        e.preventDefault();
        setVisibility(false);

        if (!job_name || !file_path || !host_tags || !max_job_time || !min_job_time || !priority) {
            setErrorMsg("Please fill in mandatory fields.");
            setVisibility(true);
        } else if (max_job_time < 1 || min_job_time < 1 || priority < 1) {
            setErrorMsg("Please enter valid values for Time or Priority.");
            setVisibility(true);
        } else {
            const data = {
                job_name, file_path, output_path, log_path,
                comp_software, location, host_tags,
                max_job_time, min_job_time, priority, additional_params
            };
            setLoaderVisibility("");
            fetch(configData.API_URL + "/comp_job", {
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
        setJobName("");
        setFilePath("");
        setOutputPath("");
        setLogPath("");
        setCompSoftware(0);
        setLocation(0);
        setHostTag("");
        setAdditionalParams("");
        setMaxJobTime(360);
        setMinJobTime(10);
        setPriority(999);
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
                <CModalTitle>New Comp Job</CModalTitle>
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
                        <CLabel className="col-md-4 mt-2">Comp File Path *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            placeholder="e.g. Q:\Projects\MWS4\MWS401_Sc01.blend"
                            value={file_path}
                            onChange={(e) => setFilePath(e.target.value)} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Output Folder</CLabel>
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
                        <CLabel className="col-md-4 mt-2">Comp Software </CLabel>
                        <CSelect custom name="select" id="select"
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={comp_software}
                            onChange={(e) => setCompSoftware(parseInt(e.target.value))}>
                            <option value="0">Blender</option>
                        </CSelect>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Host Location</CLabel>
                        <CSelect custom name="select" id="select"
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={location}
                            onChange={(e) => setLocation(parseInt(e.target.value))}>
                            <option value="0">Singapore</option>
                            <option value="1">Kuala Lumpur</option>
                        </CSelect>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Host Group *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={host_tags}
                            onChange={(e) => setHostTag(e.target.value)} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Max Job Time *</CLabel>
                        <CInput
                            type="number" min={1}
                            className="col-sm-10 col-md-6 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={max_job_time}
                            onChange={(e) => setMaxJobTime(e.target.value)} />
                        <span className="col-2 mt-2">Mins</span>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Min Job Time *</CLabel>
                        <CInput
                            type="number" min={1}
                            className="col-sm-10 col-md-6 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={min_job_time}
                            onChange={(e) => setMinJobTime(e.target.value)} />
                        <span className="col-2 mt-2">Secs</span>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Priority *</CLabel>
                        <CInput
                            type="number" min={1}
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={priority}
                            onChange={(e) => {
                                setPriority(e.target.value)
                            }}
                        />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Additional Params</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={additional_params}
                            onChange={(e) => setAdditionalParams(e.target.value)} />
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

export default CreateCompJob