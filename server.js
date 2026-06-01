const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");
const dotenv = require('dotenv');
// load environment variables from .env file
dotenv.config();


async function startServer() {
    try {
        // connect to database
        await MongoDB.connect(process.env.DB_URI);
        console.log('Connected to the database successfully');

        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database', error);
        process.exit(1);
    }
}
// start server
startServer();