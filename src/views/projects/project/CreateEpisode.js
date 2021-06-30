import React, { useState, useEffect } from 'react'
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
    CAlert,
    CSpinner,
    CTextarea,
    CSelect
} from '@coreui/react'
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Moment from 'moment';

import Cookies from "universal-cookie";
import configData from "../../../config.json";

const CreateEpisode = ({ showModal, onShow, token, user }) => {

    const history = useHistory();
    const cookies = new Cookies();

    const [isVisible, setVisibility] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoaderVisible, setLoaderVisibility] = useState("d-none");

    const projectData = useSelector(state => state.projectData)

    const [episode_name, setEpisodeName] = useState("");
    const [episode_key, setEpisodeKey] = useState(projectData.project_key);
    const [start_date, setStartDate] = useState(new Date());
    const [end_date, setEndDate] = useState(new Date());
    const [status, setStatus] = useState(0);
    const [description, setDescription] = useState("");

    useEffect(() => {
        setEpisodeKey(projectData.project_key)
    }, [projectData])

    const onCreate = (e) => {
        e.preventDefault();
        setVisibility(false);

        if (!episode_name || !episode_key || !description || !start_date || !end_date) {
            setErrorMsg("Please fill in mandatory fields.");
            setVisibility(true);
        } else {
            const data = {
                "parent_id": projectData.project_id,
                "project_type": 2,
                "pipeline_type": projectData.pipeline_type,
                "project_name": episode_name,
                "project_key": episode_key,
                "description": description,
                "start_date": Moment(start_date).format("DD-MMM-YYYY"),
                "end_date": Moment(end_date).format("DD-MMM-YYYY"),
                "status": status
            }
            setLoaderVisibility("");
            fetch(configData.API_URL + "/project_episode", {
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
                    history.push("/dashboard");
                    history.goBack();
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
        setEpisodeName("");
        setEpisodeKey("");
        setStartDate(new Date());
        setEndDate(new Date());
        setStatus(0);
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
                <CModalTitle>Create New Episode</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm action="" method="post" encType="multipart/form-data"
                    className="form-horizontal" className="container">
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Series</CLabel>
                        <CLabel className="col-md-8 mt-2">{projectData.project_name}</CLabel>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Episode Name * </CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={episode_name}
                            onChange={(e) => setEpisodeName(e.target.value)} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Episode Key *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={episode_key}
                            onChange={(e) => (setEpisodeKey(e.target.value))} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Start Date *</CLabel>
                        <DatePicker className="border-bottom border-top-0 border-left-0 border-right-0 py-2 text-dark pl-3" selected={start_date}
                            onChange={(date) => { validateDate(date, end_date) && setStartDate(date) }}
                            dateFormat="dd-MMM-yyyy" />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">End Date *</CLabel>
                        <DatePicker className="border-bottom border-top-0 border-left-0 border-right-0 py-2 text-dark pl-3 rounded-0" selected={end_date}
                            onChange={(date) => { validateDate(start_date, date) && setEndDate(date) }}
                            dateFormat="dd-MMM-yyyy" />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Status </CLabel>
                        <CSelect custom name="select" id="select"
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={status}
                            onChange={(e) => setStatus(parseInt(e.target.value))}>
                            <option value="0">Not Started</option>
                            <option value="1">In Progress</option>
                            <option value="2">Completed</option>
                            <option value="3">Fix Required</option>
                            <option value="4">Approved</option>
                            <option value="5">Cancelled</option>
                        </CSelect>
                    </CFormGroup>
                    <CFormGroup className="row">
                        <CLabel className="col-md-4">Description *</CLabel>
                        <CTextarea
                            name="textarea-input"
                            placeholder="Say something about the episode"
                            id="textarea-input"
                            rows="3"
                            className="col-md-8 "
                            value={description}
                            onChange={(e) => setDescription(e.target.value)} />
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
                        <CButton color="info" onClick={onCreate}>Create Project Link</CButton>
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

export default CreateEpisode