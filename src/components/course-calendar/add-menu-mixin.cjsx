moment = require 'moment'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'

CourseAddMenuMixin =
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    dateFormat: React.PropTypes.string

  getInitialState: ->
    addDate: null

  getDefaultProps: ->
    dateFormat: 'MM-DD-YYYY'

  renderAddActions: ->
    {courseId} = @context.router.getCurrentParams()
    {dateFormat} = @props

    links = [
      {
        text: 'Add iReading'
        to: 'createReading'
        params:
          courseId: courseId
        type: 'reading'
        query:
          date: @state.addDate?.format(dateFormat)
      }, {
        text: 'Add Homework'
        to: 'createHomework'
        params:
          courseId: courseId
        type: 'homework'
        query:
          date: @state.addDate?.format(dateFormat)
      }
    ]

    _.map(links, (link) =>
      href = @context.router.makeHref(link.to, link.params, link.query)
      <BS.MenuItem href={href} key={link.type} ref="#{link.type}Link">{link.text}</BS.MenuItem>
    )

module.exports = CourseAddMenuMixin