{Testing, expect, _, ReactTestUtils} = require '../helpers/component-testing'

LearningGuide = require '../../../src/flux/learning-guide'
Buttons = require '../../../src/components/student-dashboard/practice-buttons'

COURSE_ID  = '1'
GUIDE_DATA = require '../../../api/courses/1/guide.json'

describe 'Learning Guide Practice Buttons', ->
  it 'renders practice button', ->
    LearningGuide.Student.actions.loaded(GUIDE_DATA, COURSE_ID)
    Testing.renderComponent( Buttons,
      props: { courseId: COURSE_ID }
    ).then ({dom, element}) ->
      expect(dom).not.to.be.null
      expect(dom.querySelector('button.practice')).not.to.be.null


  it 'are disabled if Student Scores sections are empty', ->
    LearningGuide.Student.actions.loaded({"title": "Physics"}, COURSE_ID)
    Testing.renderComponent( Buttons,
      props: { courseId: COURSE_ID }
    ).then ({dom, element}) ->
      expect(dom).to.be.null
