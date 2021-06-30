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

const UpdateCompJob = ({ showModal, onShow, token, user, data, jobData }) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const cookies = new Cookies();
    const compJobs = useSelector(state => state.compJobs)

    const [isVisible, setVisibility] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoaderVisible, setLoaderVisibility] = useState("d-none");

    const [job_id, setJobId] = useState(jobData.job_id);
    const [job_name, setJobName] = useState(jobData.job_name);
    const file_path = jobData.file_path;
    const output_path = jobData.output_path;
    const log_path = jobData.log_path;
    const comp_software = jobData.comp_software;
    const comp_softwareValue = jobData.comp_softwareValue;
    const host_location = jobData.host_location;
    const host_locationValue = jobData.host_locationValue;
    const [host_tags, setHostTag] = useState(jobData.host_tags);
    const [max_job_time, setMaxJobTime] = useState(jobData.max_job_time);
    const [min_job_time, setMinJobTime] = useState(jobData.min_job_time);
    const [priority, setPriority] = useState(jobData.priority);
    const [additional_params, setAdditionalParams] = useState(jobData.additional_params);

    if (data === undefined) {
        history.push("/login")
    }

    useEffect(() => {
        setJobId(jobData.job_id);
        setJobName(jobData.job_name);
        setHostTag(jobData.host_tags);
        setMaxJobTime(jobData.max_job_time);
        setMinJobTime(jobData.min_job_time);
        setPriority(jobData.priority);
        setAdditionalParams(jobData.additional_params);
    }, [jobData])

    const onUpdateJob = (e) => {
        e.preventDefault();
        setVisibility(false);

        if (!job_name || !host_tags || !max_job_time || !min_job_time || !priority) {
            setErrorMsg("Please fill in mandatory fields.");
            setVisibility(true);
        } else if (max_job_time < 1 || min_job_time < 1 || priority < 1) {
            setErrorMsg("Please enter valid values for Time or Priority.");
            setVisibility(true);
        } else {
            const data = {
                job_id, job_name, file_path, output_path, log_path,
                comp_software, host_location, host_tags,
                max_job_time, min_job_time, priority, additional_params
            };
            setLoaderVisibility("");
            fetch(configData.API_URL + "/comp_job/" + job_id, {
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
                        type: 'set', compJobs: (
                            compJobs.map((comp) => {
                                if (comp.job_id === job_id) {
                                    return {
                                        ...comp,
                                        job_name: data.job_name,
                                        host_tags: data.host_tags,
                                        max_job_time: data.max_job_time,
                                        min_job_time: data.min_job_time,
                                        priority: data.priority,
                                        additional_params: data.additional_params
                                    }
                                } else {
                                    return comp
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
                <CModalTitle>Update Comp Job</CModalTitle>
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
                        <CLabel className="col-md-4 mt-2">Comp File Path</CLabel>
                        <CInput
                            disabled
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-1"
                            value={file_path} />
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
                        <CLabel className="col-md-4 mt-2">Comp Software</CLabel>
                        <CLabel className="col-md-8 mt-2">{comp_softwareValue}</CLabel>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Host Location</CLabel>
                        <CLabel className="col-md-8 mt-2">{host_locationValue}</CLabel>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Host Group *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={host_tags}
                            onChange={(e) => (setHostTag(e.target.value))} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Max Job Time *</CLabel>
                        <CInput
                            type="number" min={1}
                            className="col-sm-10 col-md-6 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={max_job_time}
                            onChange={(e) => (setMaxJobTime(e.target.value))} />
                        <span className="col-2 mt-2">Mins</span>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Min Job Time *</CLabel>
                        <CInput
                            type="number" min={1}
                            className="col-sm-10 col-md-6 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={min_job_time}
                            onChange={(e) => (setMinJobTime(e.target.value))} />
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
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={additional_params}
                            onChange={(e) => (setAdditionalParams(e.target.value))} />
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

export default UpdateCompJob