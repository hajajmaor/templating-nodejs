import express from "express";
import axios from "axios";
import { urlencoded } from "body-parser";
import path from "path";
const app = express();

const viewsDirPath = path.join(__dirname, "templates", "views");
app.use(urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", viewsDirPath);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  // console.log("test");

  res.render("index");
});

app.post("/login", (req, res) => {
  const { name, password } = req.body;

  if (name === "admin" && password === "admin") {
    res.render("success", {
      username: name,
    });
  } else {
    res.render("failure");
  }
});

app.get("/repos", async (req, res) => {
  const username = req.query.username || "myogeshchavan97";
  try {
    const result = await axios.get(
      `https://api.github.com/users/${username}/repos`
    );
    const repos = result.data.map(
      (repo: { name: any; html_url: any; description: any }) => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
      })
    );
    res.render("repos", {
      repos,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error while getting list of repositories");
  }
});

app.listen(3000, () => {
  console.log("server started on port http://localhost:3000");
});
