const main = document.querySelector('.main');
const input = document.querySelector('#name');
const gonder = document.querySelector('.gonder');

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
  main.insertAdjacentHTML('afterbegin', HTML);
};

const insertError = function (err) {
  const errorHTML = `<div class="main-body">
  <span>Kullanıcı bulunamadı... ${err}</span>
</div>`;
  main.insertAdjacentHTML('afterbegin', errorHTML);
};

const fetchProfil = async function (name) {
  try {
    const res = await fetch(`https://api.github.com/users/${name}`);
    const data = await res.json();
    if (data.message === 'Not Found') insertError(data.message);
    else insertHTML(data);
  } catch (err) {
    console.log(err);
  }
};

gonder.addEventListener('click', function () {
  let inputValue = input.value.trim();
  main.textContent = '';
  fetchProfil(inputValue);
  input.value = '';
});
