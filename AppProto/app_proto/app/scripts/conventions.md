# Data Flow

## Single Point of Entry

- main.py is the single point of entry
  - it is the module that is packaged
    - DEVELOPMENT -->" 'python'/'python3' main.py **SINGLE_COMMAND_LINE_ARG_STRING** (see 'Communication')"
    - PRODUCTION --> " 'main'/'main.exe' **SINGLE_COMMAND_LINE_ARG_STRING** "

## Error Handling

- **logger** handles errors
  - all, if not most, functions are wrapped with the logger
  - the logger has a try/except with each function call
    - so a function call failing goes to the logger, and the logger RETURNS "Error" to communicate with the JavaScript
  - ACTION logs --> module:function format indication of execution
  - ERROR logs --> where the errors are logged in full so they can be seen and sent to developers

## Communication

- **Command line arguments sent to the single point of entry MUST adhere to one standard form**

  - Must be a single string
  - Key-value args separated by "-"
  - Key-value args joined as key:value

- Unless otherwise needed by the JavaScript (e.g. for FileActions and UploadProgress components extra 'prints' are needed)...
  - The only form of communication will be "Error" (see Error Handling above) if there is an error or another form communicated by a function

# Duties

- main.py
  - single point of entry
- settings.py
  - holds variables, including, but not limited to, the BASE_DIR variable for other modules to use as a single source of truth
- csvmat.py
  -
