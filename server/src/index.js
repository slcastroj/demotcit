const { app } = require("./server.js");

const port = 5001;
app.listen(port, () => {
    console.log(`Initialized express.js server at http://localhost:${port}/`);
});