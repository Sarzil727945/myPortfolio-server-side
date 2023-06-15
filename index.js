const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
// send massage 
const nodemailer = require("nodemailer");
const mg = require('nodemailer-mailgun-transport');


// middleware 
app.use(cors());
app.use(express.json());

const auth = {
  auth: {
    api_key: process.env.EMAIL_API_KEY,
    domain: process.env.EMAIL_DOMAIN,
  }
}
const transporter = nodemailer.createTransport(mg(auth));

// send confirmation email 
const sendConfirmationEmail = (user) => {
  transporter.sendMail({
    from: "sarzilmuntaha@gmail.com", // verified sender email
    to: user.email, // recipient email
    subject: "Developed with Sarzil Muntaha", // Subject line
    text: "Hello world!", // plain text body
    html: `
    <div>
    <p>Dear ${user.name},</p>
      <p>Thank you so much. Developed with Sarzil Muntaha Contact Form Submission successful !!</p>
    </div>
    `, // html body
  }, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('');
    }
  });
}

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2a9l2qr.mongodb.net/?retryWrites=true&w=majority`;

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

    // server link start
    const usersCollection = client.db('portfolio').collection('users');
    // server link end 

    // user data post dataBD start 
    app.post('/user', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user)

      // send an email 
      sendConfirmationEmail(user)

      res.send(result);
    });
    // user data post dataBD exit


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Portfolio server running')
})
app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
})


