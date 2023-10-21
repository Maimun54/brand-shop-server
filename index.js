
const express = require('express')
const app =express();
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port =process.env.PORT || 5000

//middleware 
app.use(cors())
app.use(express.json());
// brandShop407
//vLt7j7G8TAQGTBp3



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pl4mu3l.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

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
    // await client.connect();

     const brandCollection =client.db('brandDB').collection('brand')
     const cartCollection =client.db('brandDB').collection('cart')

    
     app.post('/myCart',async(req,res)=>{
        const newProduct =req.body
        const result = await cartCollection.insertOne(newProduct)
        res.send(result)
     })
     app.get('/myCart',async(req,res)=>{
      const cursor =cartCollection.find()
      const result =await cursor.toArray()
      res.send(result)
    })
    app.get('/myCart/:id',async(req,res)=>{
      const id =req.params.id
      const query={_id:id}
      const result =await cartCollection.findOne(query)
      res.send(result)
    })
    // delete date from my cart page
    
    app.delete('/myCart/:id',async(req,res)=>{
      const id =req.params.id
      console.log(59,id)
      const query ={_id: id}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })

    app.post('/product',async(req,res)=>{
      const newProduct =req.body
      const result = await brandCollection.insertOne(newProduct)
      res.send(result)
   })
     app.get('/product',async(req,res)=>{
      const cursor =brandCollection.find()
      const result =await cursor.toArray()
      res.send(result)
    })
   
    
    //find single data by brand name

    
    app.get('/product/:brandName',async(req,res)=>{
      const brandName =req.params.brandName
      const query={brand_name:brandName}
      const cursor =brandCollection.find(query)
      const result =await cursor.toArray(cursor)
      res.send(result)
    })
    
    app.get('/products/:id',async(req,res)=>{
      const id =req.params.id
      const query={_id:new ObjectId(id)}
      const result =await brandCollection.findOne(query)
      res.send(result)
    })
  //update single data by _id

  app.put('/products/:id',async(req,res)=>{
    const id =req.params.id
    const filter ={_id: new ObjectId(id)}
    const options = { upsert: true };
     const updateProduct=req.body;
     const product ={
    $set:{    
      pname:updateProduct.pname,
      brand_name:updateProduct.brand_name,
      image:updateProduct.image,
      type:updateProduct.type,
      price:updateProduct.price,
      description:updateProduct.description,
      rating:updateProduct.rating
    }
  }
  const result = await brandCollection.updateOne(filter,product,options)
   res.send(result)
  })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('Brand shop server is Running')
})

app.listen(port,()=>{
    console.log(`Brand shop server is running Port${port}`);
})