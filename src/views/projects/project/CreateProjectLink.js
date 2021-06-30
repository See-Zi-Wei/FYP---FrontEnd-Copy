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
    CAlert,
    CSpinner,
} from '@coreui/react'
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import configData from "../../../config.json";

const CreateProjectLink = ({ showModal, onShow, token, user, projectData }) => {

    const history = useHistory();
    const cookies = new Cookies();

    const [isVisible, setVisibility] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoaderVisible, setLoaderVisibility] = useState("d-none");

    const [link_name, setLinkName] = useState("");
    const [link_url, setLinkUrl] = useState("");

    const onCreate = (e) => {
        e.preventDefault();
        setVisibility(false);

        if (!link_name || !link_url) {
            setErrorMsg("Please fill in mandatory fields.");
            setVisibility(true);
        } else {
            const data = { link_name, link_url, "project_id": projectData.project_id }
            setLoaderVisibility("");
            fetch(configData.API_URL + "/project_link", {
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
        setLinkName("");
        setLinkUrl("");
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
                <CModalTitle>Create Project Link</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm action="" method="post" encType="multipart/form-data"
                    className="form-horizontal" className="container">
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Project Name</CLabel>
                        <CLabel className="col-md-8 mt-2">{projectData.project_name}</CLabel>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Link Name *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            placeholder="e.g. Project Schedule"
                            value={link_name}
                            onChange={(e) => setLinkName(e.target.value)} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Link URL *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            placeholder="e.g. https://docs.google.com/document/123"
                            value={link_url}
                            onChange={(e) => setLinkUrl(e.target.value)} />
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

export default CreateProjectLink