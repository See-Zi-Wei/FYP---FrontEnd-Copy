import React from 'react'
import Cookies from "universal-cookie";
import {
    CCard,
    CCardHeader,
    CCardBody,
    CCardTitle,
    CCardText,
    CCardLink,
} from '@coreui/react'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from "react-router-dom";
import Moment from 'moment';

import ModalImage from "react-modal-image";
import configData from "../../config.json";

const ProjectCard = ({ projectData }) => {

    const location = useLocation();
    const dispatch = useDispatch()
    const history = useHistory();
    const cookies = new Cookies();
    // small={configData.File_URL + projectData.picture_thumbnail}
    // medium={configData.File_URL + projectData.picture_thumbnail}
    // large={configData.File_URL + projectData.picture_thumbnail} 
    return (
        <CCard>
            <CCardHeader className="p-0">
                <div style={{ width: "100%", maxHeight: "113px", overflow: "hidden" }}>
                    <ModalImage
                        className="rounded-top"
                        alt={projectData.project_name}
                        small={projectData.project_type === 0 ? "/avatars/11.png" : "/avatars/66.jpg"}
                        medium={projectData.project_type === 0 ? "/avatars/11.png" : "/avatars/66.jpg"}
                        large={configData.File_URL + projectData.picture_thumbnail} />
                </div>
            </CCardHeader>
            <CCardBody>
                <CCardTitle className="mb-3 h5">
                    <CCardLink className="text-info"
                        onClick={() => {
                            cookies.set("project", { project_id: projectData.project_id, project_name: projectData.project_name }, { path: "/" });
                            history.push("/projectOverview")
                            dispatch({ type: 'set', prevPage: location.pathname });
                        }}>
                        {projectData.project_name} ({projectData.project_key})</CCardLink>
                </CCardTitle>
                <CCardText className="m-0">
                    {projectData.project_type === 0 && 'Standalone'}
                    {projectData.project_type === 1 && 'Series'}
                    {projectData.num_episodes !== 0 && " (" + projectData.num_episodes + ")"}</CCardText>
                <CCardText className="m-0">
                    {projectData.pipeline_type === 0 && 'CG Animation'}
                    {projectData.pipeline_type === 1 && 'Visual Effects'}
                    {projectData.pipeline_type === 2 && 'Mixed Media'}
                </CCardText>
                <CCardText className="m-0">Start Date: {Moment(projectData.start_date).format("DD-MMM-YYYY")}</CCardText>
                <CCardText className="m-0">End Date: {Moment(projectData.end_date).format("DD-MMM-YYYY")}</CCardText>
            </CCardBody>
        </CCard>
    )
}

export default ProjectCard