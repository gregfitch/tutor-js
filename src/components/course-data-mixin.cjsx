{CourseStore} = require '../flux/course'

module.exports =
  getCourseDataProps: (courseId) ->
    unless courseId?
      {courseId} = @context.router.getCurrentParams()

    dataProps =
      'data-title': CourseStore.getShortName(courseId)
      'data-category': CourseStore.getCategory(courseId)
