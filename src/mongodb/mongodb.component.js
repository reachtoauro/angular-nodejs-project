const { MongoClient } = require("mongodb");

const uri = "insert your mongoDB SRV connection string here";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function run() {
  try {
    await client.connect();
    const database = client.db('sample_mflix');
    const collection = database.collection('movies');

    // create a document to be inserted
    const doc = { name: "Red", town: "kanto" };
    const result = await collection.insertOne(doc);
    console.log(
      `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,
    );

    
    // Query for a movie that has the title 'Back to the Future'
    const query = { title: 'Back to the Future' };
    const movie = await collection.findOne(query);
    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
