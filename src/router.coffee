# @cjsx React.DOM
React = require 'react'
Router = require 'react-router'
{Route, Redirect, NotFoundRoute} = Router
{App, Dashboard, Tasks, SingleTask, Invalid} = require './components'
CreateReading = require './components/teacher/reading'

routes = (
  <Route path='/' handler={App}>
    <Redirect from='/' to='dashboard' />
    <Route path='dashboard' name='dashboard' handler={Dashboard} />
    <Route path='tasks' name='tasks' handler={Tasks} />
    <Route path='tasks/:id' name='task' handler={SingleTask} />
    <Route path='reading' name='createReading' handler={CreateReading} />
    <Route path='reading/:id' name='editReading' handler={CreateReading} />
    <NotFoundRoute handler={Invalid} />
  </Route>
)

# Remember the router for unit testing
router = Router.create
  routes: routes
  location: Router.HistoryLocation


start = (mountPoint) ->

  router.run (Handler) ->
    React.render(<Handler/>, mountPoint)

module.exports = {start, router}
