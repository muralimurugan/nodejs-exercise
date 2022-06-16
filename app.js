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
    const N = Number(req.query.N);
    fs.readFile('numbers.json', (err, data) => {
        if (err) throw err;
        const loadedNumbers =  JSON.parse(data);
        const slicedNumber = loadedNumbers.slice(N); //Slice array from Nth postion
        const largestInteger = slicedNumber.sort((a,b)=> b - a); //Sort Integer from sliced List
        const largestIntegerIndex = loadedNumbers.indexOf(Number(largestInteger[0])) //Find index of largestNumber from List
        if(largestIntegerIndex && largestInteger[0]) {
            res.status(200).json({largestInteger: largestInteger[0] , largestIntegerIndex: largestIntegerIndex});
        } else {
            res.status(200).json({largestIntegerIndex: -1});
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