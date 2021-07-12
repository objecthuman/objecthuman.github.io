const ul = document.querySelector(".skills-ul");
const skills = [
  "Python",
  "Django",
  "Java Script",
  "React",
  "Node",
  "PostgreSQl",
];
skills.map((skill) => {
  const li = document.createElement("li");
  li.innerHTML += `<li>${skill}</li> <br/>`;
  ul.appendChild(li);
});
const btn = document.querySelector(".btn");

btn.addEventListener("click", (e) => {
  const div = document.querySelector(".container");
  window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
  const gitHubDiv = document.createElement("div");
  gitHubDiv.classList.add("github");
  div.appendChild(gitHubDiv);
  const h4 = document.createElement("h4");
  h4.innerText = "My GitHub Profile";
  gitHubDiv.appendChild(h4);
  div.removeChild(btn);
  fetch("https://api.github.com/users/Neeraj319")
    .then((res) => {
      res
        .json()
        .then((data) => {
          const github = document.querySelector(".github");
          const username = document.createElement("h4");
          username.innerText = `username : ${data.login}`;
          function getAllRepo() {
            console.log("i am called");
            fetch(data.repos_url).then((res) => {
              res
                .json()
                .then((repoData) => {
                  console.log(repoData);
                  repoData.map((repo) => {
                    const link = document.createElement("a");
                    link.classList.add("my-3");
                    link.innerHTML = `${repo["name"]} <br/>`;
                    link.href = repo["html_link"];
                    github.appendChild(link);
                  });
                })
                .catch((err) => console.log(err));
            });
          }
          getAllRepo();
          github.appendChild(username);
        })
        .catch((err) => console.log(err))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});
