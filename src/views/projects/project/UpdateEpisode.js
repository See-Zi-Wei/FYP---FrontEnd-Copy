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
    CSpinner,
    CAlert,
    CTextarea,
    CSelect
} from '@coreui/react'
import { useHistory } from "react-router-dom";
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Moment from 'moment';

import Cookies from "universal-cookie";
import configData from "../../../config.json";

const UpdateEpisode = ({ showModal, onShow, token, user, data, linkData, episodeData }) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const cookies = new Cookies();
    const projectLinks = useSelector(state => state.projectLinks)

    const [isVisible, setVisibility] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoaderVisible, setLoaderVisibility] = useState("d-none");

    const [episode_name, setEpisodeName] = useState(episodeData.project_name);
    const [start_date, setStartDate] = useState(episodeData.start_date);
    const [end_date, setEndDate] = useState(episodeData.end_date);
    const [status, setStatus] = useState(episodeData.status);
    const [description, setDescription] = useState(episodeData.description);
    const [picture, setPicture] = useState(episodeData.picture_thumbnail);
    const [client, setClient] = useState(episodeData.client)

    if (data === undefined) {
        history.push("/login")
    }

    useEffect(() => {
        setEpisodeName(episodeData.project_name)
        setStartDate(episodeData.start_date)
        setEndDate(episodeData.end_date)
        setStatus(episodeData.status)
        setDescription(episodeData.description)
        setPicture(episodeData.picture_thumbnail)
        setClient(episodeData.client)
    }, [episodeData])

    const onUpdate = (e) => {
        // e.preventDefault();
        // setVisibility(false);

        // if (!link_name || !link_url) {
        //     setErrorMsg("Please fill in mandatory fields.");
        //     setVisibility(true);
        // } else {
        //     const data = { link_name, link_url, "project_id": projectData.project_id, project_link_id, }
        //     setLoaderVisibility("");
        //     fetch(configData.API_URL + "/project_link/" + project_link_id, {
        //         method: "PUT",
        //         headers: {
        //             "Content-type": "application/json",
        //             "accept": "application/json",
        //             "Authorization": "Basic " + btoa(user + ":" + token)
        //         },
        //         body: JSON.stringify(data)
        //     }).then(response => {
        //         return response.json()
        //     }).then(body => {
        //         console.log(body);
        //         setLoaderVisibility("d-none");
        //         if (body.detail === "Forbidden") {
        //             cookies.remove("data");
        //             history.push("/login");
        //         } else if (body.result === "Success") {
        //             dispatch({
        //                 type: 'set', projectLinks: (
        //                     projectLinks.map((link) => {
        //                         if (link.project_link_id === project_link_id) {
        //                             return {
        //                                 ...link,
        //                                 link_name: data.link_name,
        //                                 link_url: data.link_url,
        //                             }
        //                         } else {
        //                             return link
        //                         }
        //                     })
        //                 )
        //             })
        //             onShow();
        //         }
        //     }).catch(error => {
        //         setLoaderVisibility("d-none");
        //         console.log(error);
        //     })
        // }
    }

    const onDelete = (e) => {
        // e.preventDefault();
        // setVisibility(false);
        // setLoaderVisibility("");

        // fetch(configData.API_URL + "/project_link/" + project_link_id, {
        //     method: "DELETE",
        //     headers: {
        //         "Content-type": "application/json",
        //         "accept": "application/json",
        //         "Authorization": "Basic " + btoa(user + ":" + token)
        //     },
        // }).then(response => {
        //     return response.json()
        // }).then(body => {
        //     console.log(body);
        //     setLoaderVisibility("d-none");
        //     if (body.detail === "Forbidden") {
        //         cookies.remove("data");
        //         history.push("/login");
        //     } else if (body.result === "Success") {
        //         projectLinks.map((link, index) => {
        //             if (link.project_link_id === project_link_id) {
        //                 projectLinks.splice(index, 1)
        //             }
        //         })
        //         dispatch({
        //             type: 'set', projectLinks: projectLinks.map((link) => {
        //                 return link // dont know why isit needed but MUST HAVE!!!
        //             })
        //         })
        //         onShow();
        //     }
        // }).catch(error => {
        //     setLoaderVisibility("d-none");
        //     console.log(error);
        // })
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

    return (
        <CModal
            show={showModal}
            onClose={() => {
                onShow()
                setVisibility(false);
                setLoaderVisibility("d-none");
            }} >
            <CModalHeader closeButton>
                <CModalTitle>Update Episode</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal" className="container">
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Episode Name *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={episode_name}
                            onChange={(e) => setEpisodeName(e.target.value)} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Episode Key *</CLabel>
                        <CLabel className="col-md-8 mt-2">123</CLabel>
                    </CFormGroup>
                    <CFormGroup className="row mt-1">
                        <CLabel className="col-md-4 mt-2">Start Date *</CLabel>
                        {/* <DatePicker className="border-bottom border-top-0 border-left-0 border-right-0 py-2 text-dark pl-3"
                            selected={new Date(start_date)}
                            dateFormat="dd-MMM-yyyy"
                            onChange={(date) => {
                                validateDate(date, new Date(end_date)) &&
                                    setStartDate(Moment(date)
                                        .format("DD-MMM-YYYY"))
                            }} /> */}
                    </CFormGroup>
                    <CFormGroup className="row mt-1">
                        <CLabel className="col-md-4 mt-2">End Date *</CLabel>
                        {/* <DatePicker className="border-bottom border-top-0 border-left-0 border-right-0 py-2 text-dark pl-3 rounded-0"
                            selected={new Date(end_date)}
                            onChange={(date) => {
                                validateDate(new Date(start_date), date) &&
                                    setEndDate(Moment(date)
                                        .format("DD-MMM-YYYY"))
                            }}
                            id="date"
                            dateFormat="dd-MMM-yyyy" /> */}
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
                        <CLabel className="col-md-4 mt-2">Description *</CLabel>
                        <CTextarea
                            name="textarea-input"
                            placeholder="Say something about the episode"
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
                        <CButton color="danger" className="mr-2" onClick={onDelete}>Delete Episode</CButton>
                        <CButton color="info" onClick={onUpdate}>Update Episode</CButton>
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

export default UpdateEpisode