
const express = require('express');
const http = require('http');
const app = express();
port = 5500;

app.use(cros());
app.get("/", (request, response) => {
    response.send("hello world");
});

//Run server at port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
