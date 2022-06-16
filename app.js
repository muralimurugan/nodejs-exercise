const express = require('express');
const app = express();
const PORT = 3000;
const axios = require("axios");
const fs = require('fs');
require('dotenv').config();

app.use(express.json());

//API -1
app.post('/',(req,res)=> {                       
   const integerList = req.body && req.body.numbers;
   if(integerList.length < 10000) { // validate by integer list should be less than 10000
    fs.writeFile('numbers.json', JSON.stringify(req.body.numbers), (err) => {  
        // Catch this!
        if (err) throw err;
    
        res.status(201).send('Integers saved');
    });
   } else {
    res.status(400).send('Integer list should be less than 10000');
   }
   
})

//API -2
app.get('/', (req,res)=> {
    const K = Number(req.query.K);
    const N = req.query.N;
    fs.readFile('numbers.json', (err, data) => {
        if (err) throw err;
        const loadedNumbers =  JSON.parse(data);
        const slicedNumber = loadedNumbers.slice(0,N);
        if(slicedNumber.includes(K)) {
            res.status(200).json({data: K});
        } else {
            res.status(200).json({data: -1});
        }
    });
    
})

//API -3
app.get('/holiday', async (req,res) => {
    const date =  new Date();
    const year = date.getFullYear();
    const month = date.getMonth()+ 1;
    const options = {
      method: 'GET',
      url: `https://calendarific.com/api/v2/holidays?&api_key=${process.env.API_KEY}&country=IN&year=${year}&month=${month}`
    };
    axios.request(options).then(function (output) {
        const nextHoliday = output && output.data && output.data.response && output.data.response.holidays.length && output.data.response.holidays[0];
        res.status(200).send(nextHoliday);
    }).catch(function (error) {
        console.error(error);
    });
})

app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`);
})