import React from 'react'
import Cookies from "universal-cookie";
import {
    CContainer,
    CRow,
    CCol
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";

import configData from "../../config.json";
import _nav from '../../containers/_nav'
import ProjectCard from './ProjectCard'

const ActiveProjects = () => {

    const dispatch = useDispatch()
    dispatch({ type: 'set', currentSidebar: _nav.Projects })
    dispatch({ type: 'set', currentModule: 'Projects' });

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

    const [activeProjects, setActiveProjects] = useState([]);

    useEffect(() => {
        getProjects();
    }, [])

    // GET all active projects
    const getProjects = () => {
        fetch(configData.API_URL + "/projects/1", {
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
            setActiveProjects(body)
        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <>
            <CContainer fluid>
                <CRow>
                    {activeProjects.map(project => (
                        <CCol md="6" lg="4" xl="3">
                            <ProjectCard projectData={project}></ProjectCard>
                        </CCol>
                    ))}
                </CRow>
            </CContainer>
        </>
    )
}

export default ActiveProjects