import React from 'react'
import Cookies from "universal-cookie";
import {
    CCard,
    CCardHeader,
    CCardBody,
    CCardTitle,
    CCardText,
    CCardLink,
    CBadge
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from "react-router-dom";

import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Moment from 'moment';

import ModalImage from "react-modal-image";
import configData from "../../../config.json";
import UpdateEpisode from './UpdateEpisode';

const EpisodeCard = ({ episodeData }) => {

    const location = useLocation();
    const dispatch = useDispatch()
    const history = useHistory();
    const cookies = new Cookies();
    const data = cookies.get('data')
    var token, user, system_user_role;
    if (data === undefined) {
        history.push("/login")
    } else {
        token = data["token"]
        user = data["username"]
        system_user_role = data["user_role"]
    }
    // small={configData.File_URL + episodeData.picture_thumbnail}
    // medium={configData.File_URL + episodeData.picture_thumbnail}
    // large={configData.File_URL + episodeData.picture_thumbnail} 

    const [penIcon, setPenIcon] = useState(0);

    // Update User Modal
    const [modal, setModal] = useState(false)
    const [fullEpisodeData, setFullEpisodeData] = useState([])

    // GET full episode data for update episode
    const getEpisode = (id) => {
        fetch(configData.API_URL + "/project_episode/" + id, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "accept": "application/json",
                "Authorization": "Basic " + btoa(user + ":" + token)
            },
        }).then(response => {
            return response.json()
        }).then(body => {
            console.log(body);
            if (body.detail === "Forbidden") {
                cookies.remove("data");
                history.push("/login")
            }
            setFullEpisodeData(body);
        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <>
            <CCard onMouseEnter={() => { (system_user_role === 0 || system_user_role === 1) && setPenIcon(episodeData.project_id) }}
                onMouseLeave={() => { setPenIcon(0) }}>
                <CCardHeader className="p-0">
                    <div style={{ width: "100%", maxHeight: "113px", overflow: "hidden" }}>
                        <ModalImage
                            className="rounded-top"
                            alt={episodeData.project_name}
                            small={episodeData.status === 1 ? "/avatars/11.png" : "/avatars/55.jpg"}
                            medium={episodeData.project_type === "Standalone" ? "/avatars/11.png" : "/avatars/66.jpg"}
                            large={configData.File_URL + episodeData.picture_thumbnail} />
                    </div>
                </CCardHeader>
                <CCardBody>
                    <CCardTitle className="mb-3 h5">
                        <CCardLink className="text-info"
                            onClick={() => {
                                history.push("/shots")
                            }}>
                            {episodeData.project_name} ({episodeData.project_key})</CCardLink>
                    </CCardTitle>
                    <CCardText className="my-2 mt-n1">
                        {episodeData.status === 0 && <CBadge color="dark">Not Started</CBadge>}
                        {episodeData.status === 1 && <CBadge color="warning">In Progress</CBadge>}
                        {episodeData.status === 2 && <CBadge color="info">Completed</CBadge>}
                        {episodeData.status === 3 && <CBadge color="danger">Fix Required</CBadge>}
                        {episodeData.status === 4 && <CBadge color="success">Approved</CBadge>}
                        {episodeData.status === 5 && <CBadge color="secondary">Cancelled</CBadge>}
                        {(penIcon === episodeData.project_id) &&
                            <CIcon name='cilPencil' size="lg" className="float-right"
                                onClick={() => {
                                    getEpisode(episodeData.project_id)
                                    setModal(!modal);
                                }} />}
                    </CCardText>
                    <CCardText className="m-0">Start Date: {Moment(episodeData.start_date).format("DD-MMM-YYYY")}</CCardText>
                    <CCardText className="m-0">End Date: {Moment(episodeData.end_date).format("DD-MMM-YYYY")}</CCardText>
                </CCardBody>
            </CCard>

            {/* Update Episode Pop Up Form */}
            <UpdateEpisode
                showModal={modal}
                onShow={() => setModal(!modal)}
                token={token}
                user={user}
                data={data}
                episodeData={fullEpisodeData} />
        </>
    )
}

export default EpisodeCard