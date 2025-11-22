import express from "express";
import cors from "cors";

const app = express();
const PORT = 5050;

// middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// debug route for testing
app.post("/api/debug", (req, res) => {
  console.log("📩 Request body:", req.body);
  res.json({ received: req.body });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
