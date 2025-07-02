require('dotenv').config()
const path=require("path")
const express=require("express")
const mongoose=require('mongoose')
const cookiePaser=require('cookie-parser')
const  Blog=require('./models/blog')



const userRoute=require('./routes/user')
const blogRoute=require('./routes/blog')
const { error } = require("console")
const { checkForAuthenticationCookie } = require("./middleware/authentication")

const app=express()

app.use(express.static(path.resolve("./public")))

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))

app.use(express.urlencoded({extended:false}))
app.use(cookiePaser())
app.use(checkForAuthenticationCookie("token"))


app.get("/",async(req,res)=>{
  
    const allBlogs=await Blog.find({})
    res.render('home',{
       user:req.user,
       blogs:allBlogs,
    })
})


//cmd-$env:MONGO_URL = "mongodb://127.0.0.1:27017/blogproject"
mongoose.connect(process.env.MONGO_URL).then(console.log("connected")).catch((error)=>{
    console.log("error found")
})



app.use("/user",userRoute)

app.use("/blog",blogRoute)

const PORT=process.env.PORT || 8000;
app.listen(PORT,()=>{})
