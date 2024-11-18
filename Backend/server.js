const express = require("express");
const mongoose = require("mongoose");
const Signup=require('./models/Signup')
const bcryptjs=require('bcryptjs')
const bodyParser=require('body-parser')
const cors=require('cors')

const app = express();

app.use(bodyParser.json())
app.use(cors())

mongoose
    .connect("mongodb://localhost:27017/weatherapp")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(err);
    });

app.post("/user/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const signup = await Signup.findOne({ email });
        if (signup) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashPassword = await bcryptjs.hash(password, 10);

        const newSignup = new Signup({
            name: name,
            email: email,
            password: hashPassword,
        });

        await newSignup.save();

        res.status(201).json({ message: "User Created Successfully" });
    } catch (error) {
        console.log("Error :", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/user/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const signup = await Signup.findOne({ email })

        const isMatch = await bcryptjs.compare(password, signup.password)

        if (!signup || !isMatch) {
            res.status(400).json({ message: "Invalid Email or Password" })
        }
        else {
            res.status(200).json({
                message: "Login Successfull",
                signup: {
                    _id: signup._id,
                    name: signup.name,
                    email: signup.email,
                }
            })
        }
    } catch (error) {
        console.log("Error :", error.message)
        res.status(400).json({ message: "Invalid Email or Password" })
    }
})



app.listen(3000, () => {
    console.log("Server Started");
});
