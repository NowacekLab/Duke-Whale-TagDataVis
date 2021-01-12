

const fs = require('fs');

async function csvJSON(filePath){

     const ret= await new Promise (resolve=>{fs.readFile(filePath, 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        var result={};
        var lines=data.split("\n");

        var headers=lines[0].split(",");

        //initiaize an array for each columm
        for(var i=0;i<headers.length;i++){
            result[headers[i]]=[];
        }
        //for each line
        for(var i=1;i<lines.length;i++){
            var currentline=lines[i].split(",");
            //push each item into corresponding array
            for(var j=0;j<headers.length;j++){
                result[headers[j]].push(parseFloat(currentline[j]));
            }
        }
        resolve(result);
        

      })})
      return ret;
  }

//test script, file_path is the csv file path
csvJSON("/Users/zepingluo/Development/Nowacek_JS/mn19_066aprh.csv").then(res=>(console.log(res)));