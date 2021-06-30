import React from 'react'
import Cookies from "universal-cookie";
import {
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CCardTitle,
    CCardSubtitle,
    CCardText,
    CRow,
    CContainer,
    CCardLink,
    CBadge,
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";

import ModalImage from "react-modal-image";
import Moment from 'moment';
import configData from "../../config.json";
import _nav from '../../containers/_nav'

const AssetSearch = () => {

    const dispatch = useDispatch()
    dispatch({ type: 'set', currentSidebar: _nav.AssetLibrary })
    dispatch({ type: 'set', currentModule: 'Asset Library' });

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

    // Check for access right to prevent user by typing the url manually
    if (system_user_role === 3 || system_user_role === 4) history.push("/");

    const assets = useSelector(state => state.assetSearch)
    const pipelineTasks = useSelector(state => state.pipelineTasks)

    useEffect(() => {
        getPipelineTasks();
    }, [])

    // GET all pipeline tasks (Initial)
    const getPipelineTasks = () => {
        fetch(configData.API_URL + "/pipeline_tasks", {
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
            dispatch({ type: 'set', pipelineTasks: body })
        }).catch(error => {
            console.log(error);
        })
    }

    //  const data = assets;
    for (let i = 0; i < assets.length; i++) {
        const element = assets[i];
        for (let j = 0; j < assets[i].tasks.length; j++) {
            const element = assets[i].tasks[j];
            for (let k = 0; k < pipelineTasks.length; k++) {
                const pt = pipelineTasks[k];
                if (element.task === pt.task_id) element.task = pt.task_name_short;
            }
            switch (element.status) {
                case 0:
                    element.status = "dark"
                    break;
                case 1:
                    element.status = "warning"
                    break;
                case 2:
                    element.status = "info"
                    break;
                case 3:
                    element.status = "danger"
                    break;
                case 4:
                    element.status = "success"
                    break;
                case 5:
                    element.status = "secondary"
                    break;
            }
        }
        element.start_date = Moment(element.start_date)
            .format("DD-MMM-YYYY")
        element.end_date = Moment(element.end_date)
            .format("DD-MMM-YYYY")
    }
    dispatch({ type: 'set', assetSearch: assets });

    return (
        <>
            <CContainer fluid>
                <CRow>
                    {assets.map(asset => (
                        <CCol md="6" lg="4" xl="3">
                            <CCard>
                                <CCardHeader>
                                    <CCardTitle className="mb-0 h5 text-center">
                                        {asset.project_name} ({asset.project_key})
                                    </CCardTitle>
                                </CCardHeader>
                                <CCardBody>
                                    <div style={{ width: "100%", maxHeight: "113px", overflow: "hidden" }}>
                                        <ModalImage
                                            className="text-dark rounded"
                                            alt={asset.asset_name}
                                            small={asset.start_date === "01-Apr-2021" ? "/avatars/77.png" : "/avatars/44.png"}
                                            medium={asset.picture_thumbnail}
                                            large={asset.picture_thumbnail} />
                                    </div>
                                    <CCardTitle className="mb-4 mt-2 h5 text-center">
                                        <CCardLink className="text-info"
                                            onClick={() => { history.push("/asset") }}>
                                            {asset.asset_name}</CCardLink>
                                    </CCardTitle>
                                    <div className="row">
                                        <div className="col">
                                            <CCardSubtitle>Start Date</CCardSubtitle>
                                            <CCardText>{asset.start_date}</CCardText>
                                        </div>
                                        <div className="col">
                                            <CCardSubtitle>End Date</CCardSubtitle>
                                            <CCardText>{asset.end_date}</CCardText>
                                        </div>
                                    </div>
                                    <div className="row mt-3 justify-content-center">
                                        {asset.tasks.map(x => (
                                            <CBadge shape="pill" color={x.status} className="mr-1">{x.task}</CBadge>
                                        ))}
                                    </div>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    ))}
                </CRow>
            </CContainer>
        </>
    )
}

export default AssetSearch