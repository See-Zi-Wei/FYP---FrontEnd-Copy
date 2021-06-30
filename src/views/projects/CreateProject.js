import React, { useState } from 'react'
import {
    CButton,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CForm,
    CFormGroup,
    CTextarea,
    CInput,
    CLabel,
    CSelect,
    CSwitch,
    CAlert,
    CSpinner,
    CInputRadio
} from '@coreui/react'
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import configData from "../../config.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Moment from 'moment';

const CreateProject = ({ showModal, onShow, token, user }) => {

    const history = useHistory();
    const cookies = new Cookies();

    const [isVisible, setVisibility] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoaderVisible, setLoaderVisibility] = useState("d-none");

    const [project_name, setProjectName] = useState("");
    const [project_type, setProjectType] = useState(0);
    const [pipeline_type, setPinelineType] = useState(0);
    const [project_key, setProjectKey] = useState("");
    const [client, setClient] = useState("");
    const [start_date, setStartDate] = useState(new Date());
    const [end_date, setEndDate] = useState(new Date());
    const [status, setStatus] = useState(1);
    const [description, setDescription] = useState("");

    const onCreate = (e) => {
        e.preventDefault();
        setVisibility(false);

        if (!project_name || !project_key || !start_date || !end_date || !description) {
            setErrorMsg("Please fill in mandatory fields.");
            setVisibility(true);
        } else {
            const data = {
                project_name, project_type, pipeline_type, project_key, client, description, status,
                "start_date": Moment(start_date).format("DD-MMM-YYYY"),
                "end_date": Moment(end_date).format("DD-MMM-YYYY")
            }
            setLoaderVisibility("");
            fetch(configData.API_URL + "/project", {
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

    function validateDate(start_date, end_date) {
        if (start_date < end_date) { // start date must be earlier than end date
            setVisibility(false);
            return true
        } else {
            setErrorMsg("Please choose valid date.");
            setVisibility(true);
            return false
        }
    }

    function resetData() {
        setProjectName("");
        setProjectType(0);
        setPinelineType(0);
        setProjectKey("");
        setClient("");
        setStartDate(new Date());
        setEndDate(new Date());
        setStatus(1);
        setDescription("");
        setVisibility(false);
    }

    return (
        <CModal
            show={showModal}
            className="text-dark"
            onClose={() => {
                onShow()
                setVisibility(false);
                setLoaderVisibility("d-none");
            }}>
            <CModalHeader closeButton>
                <CModalTitle>Create New Project</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm action="" method="post" encType="multipart/form-data"
                    className="form-horizontal" className="container">
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Project Name *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={project_name}
                            onChange={(e) => setProjectName(e.target.value)} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Project Type</CLabel>
                        <div className="col-md-7 mt-2 ml-4">
                            <CInputRadio className="form-check-input" id="radio1" name="radios" value={0} defaultChecked
                                onChange={(e) => setProjectType(e.target.value)} />
                            <CLabel variant="checkbox" className="mr-5">Standalone</CLabel>
                            <CInputRadio className="form-check-input" id="radio1" name="radios" value={1}
                                onChange={(e) => setProjectType(e.target.value)} />
                            <CLabel variant="checkbox">Series</CLabel>
                        </div>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Pipeline</CLabel>
                        <CSelect custom name="select" id="select"
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={pipeline_type}
                            onChange={(e) => setPinelineType(parseInt(e.target.value))}>
                            <option value="0">CG Animation</option>
                            <option value="1">Visual Effects</option>
                            <option value="2">Mixed Media</option>
                        </CSelect>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Project Key *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            placeholder="Upper case max 5 chars e.g. CWP, LWR, etc"
                            value={project_key}
                            onChange={(e) => setProjectKey(e.target.value)} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Client</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={client}
                            onChange={(e) => setClient(e.target.value)} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Start Date *</CLabel>
                        <DatePicker className="border-bottom border-top-0 border-left-0 border-right-0 py-2 text-dark pl-3" selected={start_date}
                            onChange={(date) => { validateDate(date, end_date) && setStartDate(date) }}
                            dateFormat="dd-MMM-yyyy" />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">End Date *</CLabel>
                        <DatePicker className="border-bottom border-top-0 border-left-0 border-right-0 py-2 text-dark pl-3" selected={end_date}
                            onChange={(date) => { validateDate(start_date, date) && setEndDate(date) }}
                            dateFormat="dd-MMM-yyyy" />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Status</CLabel>
                        <div className="col-md-8 mt-1">
                            <CSwitch shape={'pill'} color={'info'} labelOn={'\u2713'} labelOff={'\u2715'}
                                checked={status}
                                onChange={(e) => { if (e.currentTarget.checked) setStatus(1); else setStatus(0) }} />
                        </div>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Description *</CLabel>
                        <CTextarea
                            name="textarea-input"
                            placeholder="Say something about the project"
                            id="textarea-input"
                            rows="3"
                            className="col-md-8 "
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
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
                        <CButton color="info" onClick={onCreate}>Create Project</CButton>
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

export default CreateProject