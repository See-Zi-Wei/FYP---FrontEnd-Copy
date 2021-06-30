import React from 'react'
import _nav from '../../containers/_nav'
import { useDispatch } from 'react-redux'

const Dashboard = () => {
  
  const dispatch = useDispatch()
  dispatch({ type: 'set', currentSidebar: _nav.Dashboard })
  dispatch({ type: 'set', currentModule: 'Dashboard' });

  return (
    <>
    </>
  )
}

export default Dashboard
