const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next){
  const { id } = request.params;
  if (!isUuid(id)){
      return response.status(400).json({ "error" : "Invalid repository ID." });
  }
  return next();
}

app.use('/repositories/:id', validateRepositoryId);

app.get("/repositories", (request, response) => {
  const { title } = request.query;
  console.log(title);
  const results = title 
      ? repositories.filter(repository => repository.title.includes(title)) 
      : repositories;

  return response.json(results);  
});

app.post("/repositories", (request, response) => {
  const { title, url, techs }  = request.body;
  const repository = { id: uuid(), title , url, techs, likes: 0 };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs }  = request.body;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  const repository = {
    id, 
    title, 
    url, 
    techs,
    likes: repositories[repositoryIndex].likes,
  }

  if (repositoryIndex === -1) {
    return response.status(400).json({"erro" : "Repository does not exists."}); 
  }

  repositories[repositoryIndex] = repository;
  return response.json(repository);  
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex,1);
  } else { 
    return response.status(400).json({"erro" : "Repository does not exists."}); 
  }
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex === -1) {
    return response.status(400).json({"erro" : "Repository does not exists."}); 
  }

  repositories[repositoryIndex].likes++;
  
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
