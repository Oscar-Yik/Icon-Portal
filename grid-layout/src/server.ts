import layoutApp from "./app";
import mongo from './database/mongo'
const app = layoutApp(mongo)

const port = process.env.PORT || 8092;
app.listen(port, () => console.log(`Server running on port ${port}`));