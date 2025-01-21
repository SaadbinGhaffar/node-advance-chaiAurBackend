import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config();
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`App Running on PORT${process.env.PORT}`);
    });
  })
  .catch((eror) => console.log("MONGODB connection Failed"));
