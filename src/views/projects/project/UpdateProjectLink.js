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
    CAlert
} from '@coreui/react'
import { useHistory } from "react-router-dom";
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "universal-cookie";
import configData from "../../../config.json";

const UpdateProjectLink = ({ showModal, onShow, token, user, data, linkData, projectData }) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const cookies = new Cookies();
    const projectLinks = useSelector(state => state.projectLinks)

    const [isVisible, setVisibility] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoaderVisible, setLoaderVisibility] = useState("d-none");

    const [project_link_id, setProjectLinkId] = useState(linkData.project_link_id);
    const [link_name, setLinkName] = useState(linkData.link_name);
    const [link_url, setLinkURL] = useState(linkData.link_url);

    if (data === undefined) {
        history.push("/login")
    }

    useEffect(() => {
        setProjectLinkId(linkData.project_link_id)
        setLinkName(linkData.link_name)
        setLinkURL(linkData.link_url)
    }, [linkData])

    const onUpdate = (e) => {
        e.preventDefault();
        setVisibility(false);

        if (!link_name || !link_url) {
            setErrorMsg("Please fill in mandatory fields.");
            setVisibility(true);
        } else {
            const data = { link_name, link_url, "project_id": projectData.project_id, project_link_id, }
            setLoaderVisibility("");
            fetch(configData.API_URL + "/project_link/" + project_link_id, {
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
                    history.push("/login");
                } else if (body.result !== "Success") {
                    setErrorMsg(body.result);
                    setVisibility(true);
                } else {
                    dispatch({
                        type: 'set', projectLinks: (
                            projectLinks.map((link) => {
                                if (link.project_link_id === project_link_id) {
                                    return {
                                        ...link,
                                        link_name: data.link_name,
                                        link_url: data.link_url,
                                    }
                                } else {
                                    return link
                                }
                            })
                        )
                    })
                    onShow();
                }
            }).catch(error => {
                setLoaderVisibility("d-none");
                console.log(error);
            })
        }
    }

    const onDelete = (e) => {
        e.preventDefault();
        setVisibility(false);
        setLoaderVisibility("");

        fetch(configData.API_URL + "/project_link/" + project_link_id, {
            method: "DELETE",
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
                history.push("/login");
            } else if (body.result === "Success") {
                projectLinks.map((link, index) => {
                    if (link.project_link_id === project_link_id) {
                        projectLinks.splice(index, 1)
                    }
                })
                dispatch({
                    type: 'set', projectLinks: projectLinks.map((link) => {
                        return link // dont know why isit needed but MUST HAVE!!!
                    })
                })
                onShow();
            }
        }).catch(error => {
            setLoaderVisibility("d-none");
            console.log(error);
        })
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
                <CModalTitle>Update Project Link</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal" className="container">
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Project Name</CLabel>
                        <CLabel className="col-md-8 mt-2">{projectData.project_name}</CLabel>
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Link Name *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={link_name}
                            onChange={(e) => setLinkName(e.target.value)} />
                    </CFormGroup>
                    <CFormGroup className="row mt-n2">
                        <CLabel className="col-md-4 mt-2">Link URL *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            value={link_url}
                            onChange={(e) => setLinkURL(e.target.value)} />
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
                        <CButton color="danger" className="mr-2" onClick={onDelete}>Delete Project Link</CButton>
                        <CButton color="info" onClick={onUpdate}>Update Project Link</CButton>
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

export default UpdateProjectLink