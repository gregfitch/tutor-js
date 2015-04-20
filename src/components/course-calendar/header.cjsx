moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'

CourseCalendarHeader = React.createClass
  displayName: 'CourseCalendarHeader'

  propTypes:
    duration: React.PropTypes.oneOf(['month','week','day']).isRequired
    setDate: React.PropTypes.func
    date: (props, propName, componentName) ->
      unless moment.isMoment(props[propName])
        new Error("#{propName} should be a moment for #{componentName}")
    format: React.PropTypes.string.isRequired

  getDefaultProps: ->
    duration: 'month'
    format: 'MMMM YYYY'

  getInitialState: ->
    date: @props.date or moment()

  componentDidUpdate: ->
    {setDate} = @props
    setDate?(@state.date)

  handleNavigate: (subtractOrAdd, clickEvent) ->
    {duration, setDate} = @props
    clickEvent.preventDefault()
    @setState(
      date: @state.date.clone()[subtractOrAdd](1, duration)
    )

  handleNext: (clickEvent) ->
    @handleNavigate('add', clickEvent)

  handlePrevious: (clickEvent) ->
    @handleNavigate('subtract', clickEvent)

  render: ->
    {date} = @state
    {format, duration} = @props

    <BS.Row className='calendar-header'>
      <BS.Col xs={4}>
        <a href='#' className='calendar-header-control previous' onClick={@handlePrevious}>&lt;</a>
      </BS.Col>
      <BS.Col xs={4} className='calendar-header-label'>{date.format(format)}</BS.Col>
      <BS.Col xs={4}>
        <a href='#' className='calendar-header-control next' onClick={@handleNext}>&gt;</a>
      </BS.Col>
    </BS.Row>


module.exports = CourseCalendarHeader