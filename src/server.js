require("express-async-errors")


const database = require("./database/sqlite")
const AppError = require("./utils/AppError")
const express = require("express")



const routes = require("./routes")

database() 

const app = express()
app.use(express.json())

app.use(routes)


app.get("/", (request, response) => {
  response.send("Hello World!")
})

app.use(( error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "Error",
      message: error.message
    })
  }

  console.error(error)

  return response.status(500).json({
    status: "Error",
    message: "Internal server error"
  })
})
const PORT = 3333
app.listen(PORT, () => console.log(`Server is Running on Port ${PORT}`))