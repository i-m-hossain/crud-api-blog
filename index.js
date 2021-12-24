const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectID = require('mongodb').ObjectID;
const port = 5000;

//middleware
app.use(express.json());


// Replace the uri string with your MongoDB deployment's connection string.

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.krune.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("CRUD");
        const blogsCollection = database.collection("blogs");
        //post data
        app.post('/blogs', async (req, res) => {
            const blog = req.body
            const result = await blogsCollection.insertOne(blog);
            res.json(result)
        })

        //get all blogs
        app.get('/blogs', async (req, res) => {
            const query = {};
            const cursor = blogsCollection.find(query);
            const result = await cursor.toArray();
            res.json(result)
        })
        //get a single blog 
        app.get('/blogs/:id', async (req, res) => {
            const blogId = req.params.id;
            const query = { _id: ObjectID(blogId) };
            const result = await blogsCollection.findOne(query);
            res.json(result)
        })
        //update blog 
        app.put('/blogs/:id', async (req, res) => {
            const blogId = req.params.id;
            const blog = req.body;
            const filter = { _id: ObjectID(blogId) };
            const updateBlog = {
                $set: {
                    title: blog.title,
                    body: blog.body
                },
            };
            const result = await blogsCollection.updateOne(filter, updateBlog);
            res.json(result)
        })
        app.delete('/blogs/:id', async(req,res)=>{
            const blogId = req.params.id;
            const query = { _id: ObjectID(blogId) };
            const result = await blogsCollection.deleteOne(query);
            res.json(result)
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})