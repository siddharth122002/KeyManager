const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User')
dotenv.config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connected successfully db")
    } catch (e) {
        console.log("ERER")
    }
}
connectDB();
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("works")
})

const isLoggedIn = (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.send({ msg: "session expired", status: 201 });
    }
    req.user = token;
    next()
}

app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    const user = await User.findOne({ name })
    if (!user) {
        return res.send({ msg: "wrong username or password", status: 201 })
    }
    if (user.password !== password) {
        return res.send({ msg: "wrong username or password", status: 201 })
    }
    const token = user.name;
    return res.send({ msg: "success", status: 200, token: token })
})
app.post('/signup', async (req, res) => {
    const { name, password } = req.body;
    const user = await User.findOne({ name })
    if (user) {
        return res.send({ msg: "user exists", status: 201 })
    }
    const newUser = await User.create({
        name,
        password
    });
    await newUser.save();
    res.send({ msg: "user created successfully", status: 200 });
})


app.get('/passwords', isLoggedIn, async (req, res) => {
    const user = await User.findOne({ name: req.user });
    const allPasswords = await user.populate('allData');
    res.send({ allPasswords, status: 200 })
})

app.post('/save', isLoggedIn, async (req, res) => {
    const { Name, Pass } = req.body;
    const user = await User.findOne({ name: req.user })
    user.allData.push({ Name, Pass });
    await user.save();
    res.send({ msg: "saved successfully", status: 200 })
})


app.delete('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ name: req.user });
    user.allData = user.allData.filter((pass) => (pass._id.toString() !== id));
    await user.save();
    const allPasswords = user.allData;
    res.send({ allPasswords, status: 200 })
})


app.put('/update/:id', isLoggedIn, async (req, res) => {
    const Name = req.body.updatedWeb;
    const Pass = req.body.updatedPass;
    const id = req.params.id;
    const user = await User.findOne({ name: req.user }).populate('allData');

    const passwordEntry = user.allData.id(id);
    passwordEntry.Name = Name;
    passwordEntry.Pass = Pass;
    await user.save();

    res.send({ allPasswords: user, status: 200 })

})


app.listen(process.env.PORT, () => {
    console.log("Running on", process.env.PORT)
})
