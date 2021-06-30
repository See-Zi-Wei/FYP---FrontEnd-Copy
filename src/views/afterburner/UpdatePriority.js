import React, { useState } from 'react'
import {
  CInput,
  CButton,
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormGroup,
  CLabel,
  CSelect,
  CSpinner
} from '@coreui/react'
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import Cookies from "universal-cookie";
import configData from "../../config.json";

const UpdatePriority = ({ showModal, onShow, token, user, selectedrows }) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const cookies = new Cookies();

  const [op, setOP] = useState("inc");
  const [delta, setDelta] = useState(100);

  const [isLoaderVisible, setLoaderVisibility] = useState("d-none");

  const onUpdatePriority = (e) => {
    e.preventDefault()

    const data = { "jobs": { "ids": selectedrows }, "priority": { "op": op, "delta": delta } }
    setLoaderVisibility("");
    fetch(configData.API_URL + "/render_job_priority", {
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
      } else if (body.result === "Success") {
        if (op === "inc") {
          selectedrows.map((id) => {
            dispatch({ type: 'setMultipleRenderJobs', action: 'updatePriority', payload: { id: id, number: delta } });
          })
        } else {
          selectedrows.map((id) => {
            dispatch({ type: 'setMultipleRenderJobs', action: 'updatePriority', payload: { id: id, number: -delta } });
          })
        }
        onShow();
        resetData();
      }
    }).catch(error => {
      setLoaderVisibility("d-none");
      console.log(error);
    })
  }

  const resetData = () => {
    setDelta(100);
    setOP("inc");
  }

  return (
    <CModal
      show={showModal}
      onClose={() => {
        onShow()
        setLoaderVisibility("d-none");
      }}>
      <CModalHeader closeButton>
        <CModalTitle className="text-dark">Change Job Priority</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal" className="container">
          <CFormGroup row>
            <CCol>
              <CLabel className="text-dark mb-0">Change Priority*</CLabel>
            </CCol>
            <CCol>
              <CSelect custom name="select" id="select" value={op} onChange={(e) => setOP(e.target.value)}>
                <option value="inc">Increase</option>
                <option value="dec">Decrease</option>
              </CSelect>
            </CCol>
            <CCol>
              <CInput type="number" value={delta} onChange={(e) => setDelta(parseInt(e.target.value))} />
            </CCol>
          </CFormGroup>
          <CFormGroup className="d-flex justify-content-center">
            <CButton
              color="secondary"
              onClick={() => {
                onShow()
                setLoaderVisibility("d-none");
              }}
              className="mr-2"
            >Cancel</CButton>
            <CButton color="info" onClick={onUpdatePriority}>Update</CButton>
            <div className={isLoaderVisible + " mt-1 ml-2"}>
              <CSpinner color="info" size="sm" grow />
            </div>
          </CFormGroup>
        </CForm>
      </CModalBody>
    </CModal>
  )
}
export default UpdatePriority