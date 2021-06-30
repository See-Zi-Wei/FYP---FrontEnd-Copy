import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const initialState = {
  sidebarShow: 'responsive',
  prevPage: '',
  activeUsers: [],
  inactiveUsers: [],
  renderJobs: [],
  renderFrames: [],
  compJobs: [],
  renderHosts: [],
  assetSearch: [],
  pipelineTasks: [],
  projectData: [],
  episodes: [],
  projectLinks: [],
  notes: []
}

const changeState = (state = initialState, { type, action, payload, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'setMultipleRenderJobs':
      switch (action) {
        case 'update':
          return {
            ...state,
            ...rest,
            renderJobs: state.renderJobs.map((render) => {
              if (render.job_id === payload.id) {
                return {
                  ...render,
                  status: payload.statusIndex,
                }
              } else {
                return render
              }
            })
          }
        case 'delete':
          state.renderJobs.map((render, index) => {
            if (render.job_id === payload.id) {
              state.renderJobs.splice(index, 1)
            }
          })
          return {
            ...state,
            ...rest,
            renderJobs: state.renderJobs.map((render) => {
              return render // dont know why isit needed but MUST HAVE!!!
            })
          }
        case 'updateQueueFailed':
          return {
            ...state,
            ...rest,
            renderJobs: state.renderJobs.map((render) => {
              if (render.job_id === payload.id) {
                return {
                  ...render,
                  status: "Queue",
                  failed_frames: 0,
                  queued_frames: render.queued_frames + render.failed_frames,
                }
              } else {
                return render
              }
            })
          }
        case 'updatePriority':
          return {
            ...state,
            ...rest,
            renderJobs: state.renderJobs.map((render) => {
              if (render.job_id === payload.id) {
                return {
                  ...render,
                  priority: render.priority + payload.number
                }
              } else {
                return render
              }
            })
          }
        case 'updateProgress':
          console.log("Update Render Jobs Progress Bar");
          return {
            ...state,
            ...rest,
            renderJobs: state.renderJobs.map((render) => {
              if (render.job_id === payload.job_id) {
                return {
                  ...render,
                  done_frames: payload.done_frames,
                  failed_frames: payload.failed_frames,
                  queued_frames: payload.queued_frames,
                  running_frames: payload.running_frames,
                  total_frames: payload.total_frames,
                  elapsed_time: payload.elapsed_time,
                  hosts_busy: payload.hosts_busy,
                  status: payload.status
                }
              } else {
                return render
              }
            })
          }
      }
    case 'setMultipleRenderFrames':
      return {
        ...state,
        ...rest,
        renderFrames: state.renderFrames.map((frame) => {
          if (frame.frame_id === payload.id) {
            return {
              ...frame,
              status: payload.statusIndex,
            }
          } else {
            return frame
          }
        })
      }
    case 'setMultipleCompJobs':
      switch (action) {
        case 'update':
          return {
            ...state,
            ...rest,
            compJobs: state.compJobs.map((comp) => {
              if (comp.job_id === payload.id) {
                return {
                  ...comp,
                  status: payload.statusIndex,
                }
              } else {
                return comp
              }
            })
          }
        case 'delete':
          state.compJobs.map((comp, index) => {
            if (comp.job_id === payload.id) {
              state.compJobs.splice(index, 1)
            }
          })
          return {
            ...state,
            ...rest,
            compJobs: state.compJobs.map((comp) => {
              return comp // dont know why isit needed but MUST HAVE!!!
            })
          }
        case 'updateProgress':
          console.log("Update Comp Jobs Progress");
          return {
            ...state,
            ...rest,
            compJobs: state.compJobs.map((comp) => {
              if (comp.job_id === payload.job_id) {
                return {
                  ...comp,
                  elapsed_time: payload.elapsed_time,
                  host_name: payload.host_name,
                  status: payload.status
                }
              } else {
                return comp
              }
            })
          }
      }
    case 'setMultipleRenderHosts':
      switch (action) {
        case 'update':
          return {
            ...state,
            ...rest,
            renderHosts: state.renderHosts.map((host) => {
              if (host.host_id === payload.id) {
                return {
                  ...host,
                  status: payload.statusIndex,
                }
              } else {
                return host
              }
            })
          }
        case 'delete':
          state.renderHosts.map((host, index) => {
            if (host.host_id === payload.id && host.status === "Unknown") {
              state.renderHosts.splice(index, 1)
            }
          })
          return {
            ...state,
            ...rest,
            renderHosts: state.renderHosts.map((host) => {
              return host // dont know why isit needed but MUST HAVE!!!
            })
          }
        case 'updateHost':
          return {
            ...state,
            ...rest,
            renderHosts: state.renderHosts.map((host) => {
              if (host.host_id === payload.host_id) {
                return {
                  ...host,
                  host_tags: payload.host_tags,
                }
              } else {
                return host
              }
            })
          }
        case 'updateRedshift':
          return {
            ...state,
            ...rest,
            renderHosts: state.renderHosts.map((host) => {
              if (host.host_id === payload.host_id) {
                return {
                  ...host,
                  license_redshift: payload.license_redshift,
                }
              } else {
                return host
              }
            })
          }
        case 'updateProgress':
          console.log("Update Render Hosts Progress");
          return {
            ...state,
            ...rest,
            renderHosts: state.renderHosts.map((host) => {
              if (host.host_id === payload.host_id) {
                return {
                  ...host,
                  license_redshift: payload.license_redshift,
                  host_tags: payload.host_tags,
                  status: payload.status,
                  cpu: payload.cpu,
                  ram: payload.ram,
                  render_job: payload.render_job,
                  render_job_time: payload.render_job_time,
                }
              } else {
                return host
              }
            })
          }
      }
    default:
      return state
  }
}

const persistConfig = {
  key: 'root',
  storage,
  // Only persist data from asset search
  whitelist: ['assetSearch', 'prevPage']
}

const persistedReducer = persistReducer(persistConfig, changeState)

export default () => {
  let store = createStore(persistedReducer)
  let persistor = persistStore(store)
  return { store, persistor }
}