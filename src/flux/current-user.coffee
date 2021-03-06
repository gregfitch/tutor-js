# coffeelint: disable=no_empty_functions
_ = require 'underscore'
flux = require 'flux-react'

{CourseActions, CourseStore} = require './course'

# Read the CSRF token from document's meta tag.  If not found, log a warning but proceed
# on the assumption that the server knows what it's doing.
CSRF_Token = document.head.querySelector('meta[name=csrf-token]')?.getAttribute("content")
console?.warn?("CSRF token was not found, proceeding without CSRF protection") unless CSRF_Token


# TODO consider putting this with policies?  especially when this same data could be used for other
# roles based stuffs?
# Roles listed in ascending order of rank, where admin will have most permissions
RANKS = [
  'guest'
  'student'
  'teacher'
  'admin'
]

getRankByRole = (roleType) ->
  rank = RANKS.indexOf(roleType)
  console.warn("Warning: #{roleType} does not exist.  Rank of -1 assigned.  Check session status.") if rank < 0

  rank

ROUTES =
  dashboard:
    label: 'Dashboard'
    roles:
      teacher: 'taskplans'
      student: 'viewStudentDashboard'
      default: 'root'
  guide:
    label: 'Performance Forecast'
    roles:
      student: 'viewGuide'
      teacher: 'viewTeacherGuide'
  scores:
    label: 'Student Scores'
    roles:
      teacher: 'viewScores'
  course:
    label: 'Course Roster'
    roles:
      teacher: 'courseSettings'

CurrentUserActions = flux.createActions [
  'setToken'  # (token) ->
  'load'
  'loaded'
  'logout'    # () ->    # API Hooks onto this action and transitions
  'reset'
]

CurrentUserStore = flux.createStore
  actions: [
    CurrentUserActions.setToken
    CurrentUserActions.load
    CurrentUserActions.loaded
    CurrentUserActions.reset
  ]

  _user: {}

  _token: null
  _viewingCourseId: null

  _getRouteByRole: (routeType, menuRole) ->
    ROUTES[routeType].roles[menuRole] or ROUTES[routeType].roles.default
  _getParamsForRoute: (courseId, routeType, menuRole) ->
    if _.isFunction(ROUTES[routeType].params)
      ROUTES[routeType].params(courseId, menuRole)
    else
      {courseId}

  _getCourseRole: (courseId, silent = true) ->
    course = CourseStore.get(courseId)
    courseRoles = course?.roles or [{type: 'guest'}]

    role = _.chain(courseRoles)
      .pluck('type')
      .sortBy((roleType) ->
        # sort by rank -- Teacher role will take precedence over student role for example
        -1 * getRankByRole(roleType)
      )
      .first()
      .value()

    @_setViewingCourse(courseId) unless silent

    role

  _setViewingCourse: (courseId) ->
    @_viewingCourseId = courseId

  _unsetViewingCourse: ->
    @_viewingCourseId = null

  setToken: (@_token) -> # Save the token

  load: -> @_loading = true

  loaded: (results) ->
    @_user = results
    @_loaded = true
    @_loading = false
    @emitChange()

  reset: ->
    @_token = null
    @_user.name = 'Guest'
    @_user.profile_url = null
    @_viewingCourseId = null
    @emitChange()

  exports:
    getToken: -> @_token
    getCSRFToken: -> CSRF_Token
    getName: -> @_user.name
    isAdmin: -> @_user.is_admin
    getProfileUrl: -> @_user.profile_url

    # Loads the store if it's not already loaded or loading
    # Returns false if the store is already loaded, true otherwise
    ensureLoaded: ->
      CurrentUserActions.load() unless @_loaded or @_loading


    getCourseRole: (courseId, silent = true) ->
      @_getCourseRole(courseId, silent)

    getViewingCourseRole: ->
      @_getCourseRole(@_viewingCourseId) if @_viewingCourseId?

    getDashboardRoute: (courseId, silent = true) ->
      menuRole = @_getCourseRole(courseId, silent)
      @_getRouteByRole('dashboard', menuRole)

    getHelpLink: (courseId) ->
      'https://openstaxtutor.zendesk.com'


    # if menu routes are being retrieved, then getCourseRole should store
    # what courseId is being viewed.
    getMenuRoutes: (courseId, silent = false) ->
      menuRole = @_getCourseRole(courseId, silent)
      routes = _.keys(ROUTES)

      _.chain(routes)
        .map((routeType) =>
          routeName = @_getRouteByRole(routeType, menuRole)
          if routeName?
            name: routeName
            params: @_getParamsForRoute(courseId, routeType, menuRole)
            label: ROUTES[routeType].label
        )
        .compact()
        .value()


module.exports = {CurrentUserActions, CurrentUserStore}
