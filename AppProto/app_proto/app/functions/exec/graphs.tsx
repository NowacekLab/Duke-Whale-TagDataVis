

// Function
    // takes in object of {graphName: JSON objects} + filename
        // write them to graphing path with graphName
        // TODO: if this is the case (or may not be)
            // then shouldn't all functions have the logging error path be automatically passed

// Function
    // takes in generated csv file path OR dataframe of the csv file
    // there is object of {graphName: function} available
    // iterates over the object
        // for each graphName
            // run function in try/catch block 
            // if success, add resulting JSON object to new object 
    // return {graphName: JSON object}

// Function
    // runs high level functions
    // try/catch 
        // returns {success:, response:}


// TODO: Function for data column values
    // iterates over columns of csv with danfo.js
        // stores in object as {columnName: [values]}