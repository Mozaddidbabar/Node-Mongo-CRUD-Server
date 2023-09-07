const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors())
app.use(express.json())


// User: newuser
// Password: JioVZYJQKmydaB9s

// local mongodb compass
// const uri = "mongodb://localhost:27017";

// MongoDB atlas
const uri = "mongodb+srv://newuser:JioVZYJQKmydaB9s@cluster0.jjosm.mongodb.net/?retryWrites=true&w=majority";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("Users");
    const userCollection = database.collection("individualUser");

    // READ or get api
    app.get('/users', async(req, res)=>{
        const query = {};
        const cursor = userCollection.find(query);
        const users = await cursor.toArray()

        // console.log(users)
        res.send(users)
    })

    app.get('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}

        const result = await userCollection.findOne(query);
        res.send(result);

  })

    // CREATE or post api
    app.post('/users', async(req, res)=>{
        const user = req.body;

        const result = await userCollection.insertOne(user);
        res.json(result);
        console.log('hitting the post', req.body);
    })

    // UPDATE or put api
    app.put('/users/:id', async(req, res)=>{
      const id = req.params.id;
      // console.log(new ObjectId(id));
      const filter = { _id: new ObjectId(id) };
      const user = req.body;
      const options = { upsert: true };
      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email
        }
      }
      const result = await userCollection.updateOne(filter, updatedUser, options);
      console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`)
      res.send(result);

    })

    // DELETE or delete api
    app.delete('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id)}

        const result = await userCollection.deleteOne(query)
        console.log(result);
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send("Simple CRUD Server is RUNNIng");
})

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
})