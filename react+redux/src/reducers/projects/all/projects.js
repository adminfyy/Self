// 所有项目列表

import { actionTypes } from 'constants'
// import {data} from '../mock'

const initialState = {page: 0, spage: 0}

export default function (state = initialState, action = null) {
  const { type, projects, isSearch, keyword, init, project, projectInfo } = action

  function reData(item) {
    if(projects.users){
      projects.users.items.forEach(user => {
        if (item.project_info.manager_uid + '' === user.user_id + '') {
          item['project_info']['manager_name'] = user.org_exinfo.real_name
          return
        }
      })
    }
  }

  function mapData(items) {
    return items.map(item => {
      reData(item)
      return item
    })
  }

  switch (type) {
    case actionTypes.RECEIVE_PROJECTS:
      projects.items = mapData(projects.items)
      if (isSearch) {
        return {
          ...projects,
          isSearch,
          keyword,
          spage: init ? 0 : state.spage + 1,
          page: 1
        }
      }
      state.items = state.items || []
      return {
        ...projects,
        items: state.items.concat(projects.items),
        isSearch,
        keyword,
        page: state.page + 1,
        spage: state.spage
      }
    case actionTypes.UPDATE_ALL_PROJECT:

      let items = state.items && state.items.map(item => {
        if (+item.project_info.project_id === +project.project_id) {
          item.project_info.subscribed = project.subscribe
        }
        return item
      })

      return {
        ...state,
        items: items || [],
        isSearch,
        keyword,
        page: state.page,
        spage: state.spage
      }


    case actionTypes.CLEAR_PROJECTS:
      return {
        ...projects,
        page: 0,
        spage: 0
      }
    case actionTypes.UPDATE_PROJECTS:
      state.items.map((item) => {
        if(+item.project_info.project_id === +projectInfo.project_id){
          item.project_info = {
            ...item.project_info,
            ...projectInfo
          }
        }
        return item
      })
      return {
        ...state
      }
    default:
      return state
  }
}
