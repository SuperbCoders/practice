# @application.factory 'Log', [ ->
#   class Log
#     log_message = (message) ->
#       if typeof message == 'object'
#         console.log 'Dumping object : '
#         console.log message
#       else
#         console.log('Log : '+message)

#     debug_message = (message) ->
#       console.log('Debug : '+message)

#     log: log_message
#     debug: debug_message

#   new Log()
# ]