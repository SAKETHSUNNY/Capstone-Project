const express = require('express');
const fs = require('fs');
const filePath = 'data.json';
const cors = require('cors');
const path = require('path');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["http://127.0.0.1:5500"]
}));


app.post("/handletransaction", (req, res) => {

    const date = new Date();

    const newObject = {

        id: req.body.id,
        amount: req.body.amount,
        type: req.body.type,
        name: req.body.name,
        date:`${date.getDate()} - ${date.getMonth()+1} - ${date.getFullYear()}, ${date.getHours()} : ${date.getMinutes()} ${date.getHours() < 12 ? "AM" : "PM"}`,
        status:"Success"

    };

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return;
        }

        let jsonArray;

        try {
            jsonArray = JSON.parse(data);

            if (!Array.isArray(jsonArray)) {
                throw new Error("File content is not an array");
            }
        } catch (parseErr) {
            console.error("Error parsing JSON data:", parseErr);
            return;
        }

        jsonArray.push(newObject);

        fs.writeFile(filePath, JSON.stringify(jsonArray, null, 2), (writeErr) => {
            if (writeErr) {
                console.error("Error writing to the file:", writeErr);
                res.status(500).json({ success: false });
            } else {
                console.log("New object appended successfully!");
                res.status(200).json({ success: true });
            }
        });
    });

});


app.get('/getdata',(req,res)=>{


    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return;
        }

        let jsonArray;

        try {
            jsonArray = JSON.parse(data);

            res.send(jsonArray);

            if (!Array.isArray(jsonArray)) {
                throw new Error("File content is not an array");
            }
        } catch (parseErr) {
            console.error("Error parsing JSON data:", parseErr);
            return;
        }
    });

})

app.listen(8000, () => {
    console.log(`server running at PORT 8000`)
})