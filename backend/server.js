require ('dotenv').config();
const express=require('express')
const cors=require('cors')
const path=require('path')
const connectDB=require('./config/db')
const authRoutes=require('./routes/authRoutes');
const taskRoutes=require('./routes/taskRoutes');

const app=express();

//Middleware to hande CORS
app.use(
  cors({
    origin:process.env.CLIENT_URL || "*",
    methods:["GET","POST","PUT","DELETE","PATCH"],
    allowedHeaders:["Content-Type","Authorization"]
  })
)

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "AeroTask Backend API is running successfully!" });
});

app.use("/api/v1/auth",authRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/tasks",taskRoutes);

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>console.log(`Server runnning n port ${PORT}`));

module.exports = app;