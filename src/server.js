const express = require("express")

const routes = require("./routes")

const app = express()
app.use(express.json())

app.use(routes)

app.get("/", (request, response) => {
  response.send("Hello World!")
})

const PORT = 3333
app.listen(PORT, () => console.log(`Server is Running on Port ${PORT}`))