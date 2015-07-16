{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{JobActions, JobStore} = require './job'
_ = require 'underscore'
moment = require 'moment'

EXPORTING = 'exporting'
EXPORT_QUEUED = 'export_queued'
EXPORTED = 'completed'

PerformanceExportConfig = {

  _job: {}

  _loaded: (obj, id) ->
    @emit('performanceExport.loaded', id)

  _updateExportStatusFor: (id) ->
    (jobData) =>
      exportData = _.clone(jobData)
      exportData.exportFor = id

      @_asyncStatus[id] = exportData.state
      @emit("performanceExport.#{exportData.state}", exportData)
      @emitChange()

  getJobIdFromJobUrl: (jobUrl) ->
    jobUrlSegments = jobUrl.split('/api/jobs/')
    jobId = jobUrlSegments[1] if jobUrlSegments[1]?

    jobId

  saveJob: (jobId, id) ->
    @_job[id] ?= []
    @_job[id].push(jobId)

  export: (id) ->
    @_asyncStatus[id] = EXPORTING
    @emitChange()

  exported: (obj, id) ->
    {job} = obj
    jobId = @getJobIdFromJobUrl(job)

    # export job has been queued
    @emit('performanceExport.queued', {jobId, id})
    @_asyncStatus[id] = EXPORT_QUEUED
    @saveJob(jobId, id)

    # checks job until final status is reached
    checkJob = ->
      JobActions.load(jobId)
    JobActions.checkUntil(jobId, checkJob)

    # whenever this job status is updated, emit the status for performance export
    updateExportStatus = @_updateExportStatusFor(id)
    JobStore.on("job.#{jobId}.*", updateExportStatus)
    JobStore.off("job.#{jobId}.final", updateExportStatus)

  _getJobs: (id) ->
    _.clone(@_job[id])

  exports:
    isExporting: (id) ->
      @_asyncStatus[id] is EXPORTING or @_asyncStatus[id] is EXPORT_QUEUED

    isExported: (id, jobId) ->
      jobId ?= _.last(@_getJobs(id))
      job = JobStore.get(jobId)
      {state} = job if job?
      state is EXPORTED

    getLatestExport: (id) ->
      perfExports = @_get(id)

      _.chain(perfExports)
        .sortBy((perfExport) ->
          perfExport.created_at
        ).last().value()


}

extendConfig(PerformanceExportConfig, new CrudConfig())
{actions, store} = makeSimpleStore(PerformanceExportConfig)
module.exports = {PerformanceExportActions:actions, PerformanceExportStore:store}