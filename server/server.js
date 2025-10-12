import express from "express";
import cors from "cors";
import jobOffertsRoutes from "./routes//jobOffertsRoutes.js";
import employersRoutes from "./routes/employersRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import settingRoute from "./routes/settingRoutes.js";


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/job-offerts", jobOffertsRoutes);
app.use("/api/employers", employersRoutes);
app.use("/auth", authRoutes);
app.use("/user", settingRoute);

app.listen(PORT, () => console.log(`Serwer działa na porcie: ${PORT}`));
