import React, { Component } from 'react'
import { connect } from 'react-redux'
import MileStoneReview from 'components/review/MileStoneReview'
import * as actionCreators from 'actions'
import * as helpers from '../utils/helpers'

@connect(state => (
  {
    applyHistory: state.applyHistory,
    H5Tasks: state.H5Tasks,
    projectVersionDetail: state.projectVersionDetail,
    versionApplyStatus: state.versionApplyStatus,
    versionPermission: state.versionPermission,
    projectInfo: state.h5ProjectInfo
  }), actionCreators)

export default
class MileStoneReviewPage extends Component {

  /**
   * user_id都会传，为空的时候值展示内容
   * operation每次都会传，值只可能是create,modify
   * application_status是客户端im消息
   */
  constructor() {
    super()
    this.state = {
      uid: helpers.getSearchString('user_id') || require('utils').getToken().user_id
    }
  }

  componentDidMount() {
    let {uid} =this.state
    let that = this
    //请求项目的版本详细页
    let options = {
      projectId: this.props.params.pid,
      versionId: this.props.params.vid,
      applyId: this.props.params.aid,
      uid: uid
    }
    that.props.clearProjectVersionDetail()
    that.props.clearH5VersionTasks()
    that.props.clearVersionPermission()
    this.props.clearApplyHistory()
    this.props.fetchApplyHistory(
      {
        projectId: this.props.params.pid,
        versionId: this.props.params.vid
      })
    if (uid) {
      that.props.fetchProjectH5ApplyStatus(options)
    }
    that.props.fetchH5ProjectInfo(options)
    that.props.fetchProjectNoVersionDetail(options)
    that.props.fetchProjectH5VersionTasks(options)
  }
  componentWillUnmount(){
    this.props.clearProjectVersionDetail()
    this.props.clearH5VersionTasks()
    this.props.clearVersionPermission()
  }
  render() {
    let {uid} = this.state
    const {projectVersionDetail, H5Tasks} = this.props
    if (projectVersionDetail && projectVersionDetail.isFail){
      return (
        <div className="no-permission">项目版本被删除了</div>
      )
    }
    if (projectVersionDetail &&
            projectVersionDetail.project_id &&
            H5Tasks &&
            typeof H5Tasks.items !== 'undefined') {
      return (
              <div className="milestone-review overflow-y">
                <div className="project-page">
                  <MileStoneReview {...this.props} uid={uid} />
                </div>
              </div>
            )
    } else {
      return (
              <div className="page-loading"></div>
            )
    }
  }
}
