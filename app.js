const main = document.querySelector(".main");
const input = document.querySelector("#name");
const gonder = document.querySelector(".gonder");
console.log(new Date());
const insertHTML = function (el) {
  const HTML = `<div class="main-body">
    <img
      src="${el.avatar_url}"
      alt=""
      width="175px"
      style="margin-top: 1rem; border-radius: 10px"
    />
    <span>Ad: ${el.name} (${el.login})</span>
    <span>Takipçi: ${el.followers}</span>
    <span>Takip Edilen: ${el.following}</span>
    <span>Repoları: ${el.public_repos}</span>
  </div>`;
  main.insertAdjacentHTML("afterbegin", HTML);
  console.log(el.repos_url);
};

const insertError = function (err) {
  const errorHTML = `<div class="main-body">
  <span>Kullanıcı bulunamadı... ${err}</span>
</div>`;
  main.insertAdjacentHTML("afterbegin", errorHTML);
};

const abc = function (name) {
  fetch(`https://api.github.com/users/${name}`)
    .then((res) => res.json())
    .then((data) => {
      main.innerHTML = "";
      insertHTML(data);
    })
    .catch((err) => {
      insertError(err);
    });
};

gonder.addEventListener("click", function () {
  let inputValue = input.value.trim();
  abc(inputValue);
  input.value = "";
});
