const express = require('express');
const fs = require("fs");
const cors = require("cors");
const PythonShell = require('python-shell').PythonShell;

const app = express();
const port = 80;

app.use(cors());
app.use(express.json());

app.post("/python",(req, res)=>{
   fs.writeFileSync('test.py',req.body.coded);

   let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    args: [1, 2, 3],
  };
  
  PythonShell.run('test.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    // console.log('results: %j', results);
   res.json({ passOrFail: results});
});
});

app.listen(port, () =>{
    console.log('Example app listening at http://localhost:${port}');
});