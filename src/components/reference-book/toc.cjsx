React = require 'react'
Router = require 'react-router'
_  = require 'underscore'
BS = require 'react-bootstrap'

{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'
ChapterSectionMixin = require '../chapter-section-mixin'

Section = React.createClass
  displayName: 'ReferenceBookTocSection'
  mixins: [ChapterSectionMixin]
  propTypes:
    section: React.PropTypes.object.isRequired
    onMenuSelection: React.PropTypes.func.isRequired
  componentWillMount: ->
    @setState(skipZeros: false)
  render: ->
    {courseId, activeSection, query} = @props
    sections = @sectionFormat(@props.section.chapter_section)
    activeSection = @sectionFormat(activeSection)
    className = 'active' if sections is activeSection

    <ul className="section" data-depth={@props.section.chapter_section.length}>
      <li data-section={sections}>
        <Router.Link
          className={className}
          onClick={@props.onMenuSelection}
          to='viewReferenceBookSection'
          params={{courseId: courseId, section: sections}}
          query={query}
        >
          <span className="section-number">{sections}</span>
          {@props.section.title}
        </Router.Link>
      </li>
      { _.map @props.section.children, (child) =>
        <li key={child.id} data-section={@sectionFormat(child.chapter_section)}>
          <Section
            courseId={courseId}
            activeSection={activeSection}
            query={query}
            onMenuSelection={@props.onMenuSelection}
            section={child} />
        </li> }
    </ul>


module.exports = React.createClass
  displayName: 'ReferenceBookTOC'
  mixins: [ChapterSectionMixin]
  propTypes:
    onMenuSelection: React.PropTypes.func
  componentWillMount: ->
    @setState(skipZeros: false)
  componentDidMount:  -> @scrollSelectionIntoView()
  componentDidUpdate: -> @scrollSelectionIntoView()
  scrollSelectionIntoView: ->
    {section} = @props
    return unless section
    section = @sectionFormat(section)

    root = React.findDOMNode(@)
    li = root.querySelector("[data-section='#{section}']")
    return unless li

    beforeTop = li.offsetTop - root.offsetTop < root.scrollTop
    pastBottom = (li.offsetTop - root.offsetTop + li.clientHeight) >
      (root.scrollTop + root.clientHeight)
    li.scrollIntoView() if beforeTop or pastBottom


  render: ->
    {courseId, section, ecosystemId, query} = @props
    toc = ReferenceBookStore.getToc(ecosystemId)
    <div className="toc">
      { _.map toc.children, (child) =>
        <Section
          courseId={courseId}
          query={query}
          activeSection={section}
          onMenuSelection={@props.onMenuSelection}
          key={child.id}
          section={child} /> }
    </div>
