React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

{CoursePeriodsNavShell} = require '../course-periods-nav'

LearningGuide = require '../../flux/learning-guide'

Guide = require './guide'

module.exports = React.createClass
  displayName: 'LearningGuideTeacherDisplay'
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId:  React.PropTypes.string.isRequired

  getInitialState: ->
    periods = LearningGuide.Teacher.store.get(@props.courseId)
    periodId: _.first(periods)?.period_id

  selectPeriod: (period) ->
    @setState(periodId: period.id)

  renderHeading: ->
    periods = LearningGuide.Teacher.store.get(@props.courseId)
    <div className='guide-heading'>
      <h3 className='guide-group-title'>Learning Forecast</h3>
      <Router.Link activeClassName='' to='viewTeacherDashBoard'
        className='btn btn-default pull-right'
        params={courseId: @props.courseId}>
        Return to Dashboard
      </Router.Link>
      <CoursePeriodsNavShell
        periods={periods}
        handleSelect={@selectPeriod}
        intialActive={@state.periodId}
        courseId={@props.courseId} />
    </div>

  renderEmptyMessage: ->
    <div>No questions worked.</div>

  returnToDashboard: ->
    @context.router.transitionTo('viewTeacherDashBoard', {courseId: @props.courseId})

  render: ->
    {courseId} = @props
    <BS.Panel className='learning-guide teacher'>
      <Guide
        courseId={courseId}
        weakerTitle="The weakest topics"
        heading={@renderHeading()}
        emptyMessage={@renderEmptyMessage()}
        onReturn={@returnToDashboard}
        allSections={LearningGuide.Teacher.store.getSectionsForPeriod(courseId, @state.periodId)}
        chapters={LearningGuide.Teacher.store.getChaptersForPeriod(courseId, @state.periodId)}
      />
    </BS.Panel>
