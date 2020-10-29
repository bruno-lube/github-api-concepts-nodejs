const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

function validateUuid(request, response, next) {
  const uuid = request.params.id;

  if (!isUuid(uuid)) {
    return response.status(400).json({ "message": "Repository Id is invalid" });
  }
  return next();
}

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(newRepository);

  return response.json(newRepository);
});

app.put("/repositories/:id", validateUuid, (request, response) => {
  const id = request.params.id;
  const { title, url, techs } = request.body;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).json({ "message": "Repository Id not found" });
  }

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", validateUuid, (request, response) => {
  const id = request.params.id;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ "message": "Repository Id not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateUuid, (request, response) => {
  const id = request.params.id;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ "message": "Repository Id not found" });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json({ "likes": likes });
});

module.exports = app;
