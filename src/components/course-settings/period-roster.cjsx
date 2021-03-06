React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'
Icon = require '../icon'

{RosterStore, RosterActions} = require '../../flux/roster'
ChangePeriodLink  = require './change-period'
DropStudentLink = require './drop-student'

module.exports = React.createClass
  displayName: 'PeriodRoster'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    period: React.PropTypes.object.isRequired

  renderStudentRow: (student) ->
    <tr key={student.id}>
      <td>{student.first_name}</td>
      <td>{student.last_name}</td>
      <td className="actions">
        <ChangePeriodLink courseId={@props.courseId} student={student} />
        <DropStudentLink student={student} />
      </td>
    </tr>

  render: ->
    students = RosterStore.getActiveStudentsForPeriod(@props.courseId, @props.period.id)
    <div className="period">
      <BS.Table striped bordered condensed hover className="roster">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {for student in _.sortBy(students, 'last_name')
            @renderStudentRow(student)}
        </tbody>
      </BS.Table>
    </div>
