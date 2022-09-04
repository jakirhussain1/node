const express = require("express");
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.APP_USER}:${process.env.APP_PASS}@cluster0.rxk7ez7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    await client.connect();
    const carCollection = client.db("car-service").collection("car-service");
    app.get("/services",async(req,res)=>{
        const query = {};
        const cursor = carCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get("/service/:id",async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await carCollection.findOne(query);
        res.send(result);
    })
    app.post("/service",async(req,res)=>{
        const newUser = req.body;
        const result = await carCollection.insertOne(newUser);
        res.send(result);
    })
    app.delete("/service/:id",async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await carCollection.deleteOne(query);
        res.send(result);
    })
    app.put("/service/:id",async(req,res)=>{
        const id = req.params.id;
        const update = req.body;
        const filter = {_id:ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
            $set: {update},
      
          };
        const result = await carCollection.updateOne(filter,updateDoc,options);
        res.send(result);
    })


}
run().catch(console.dir)


app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(port, () => {
    console.log("Server Running", port);
})