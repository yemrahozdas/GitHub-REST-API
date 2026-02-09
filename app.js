const main = document.querySelector('.main');
const input = document.querySelector('#name');
const gonder = document.querySelector('.gonder');

const insertHTML = function (el) {
  const HTML = `
    <div class="card">
      <div class="user-info">
        <img src="${el.avatar_url}" alt="${el.name}" />
        <h2>${el.name || el.login}</h2>
        <h3><a href="${el.html_url}" target="_blank" style="color: inherit; text-decoration: none;">@${el.login}</a></h3>
      </div>
      
      <div class="stats">
        <div>
          <strong>${el.followers}</strong>
          <span>Takipçi</span>
        </div>
        <div>
          <strong>${el.following}</strong>
          <span>Takip Edilen</span>
        </div>
        <div>
          <strong>${el.public_repos}</strong>
          <span>Repo</span>
        </div>
      </div>
    </div>
  `;
  main.innerHTML = HTML;
};

const insertError = function (err) {
  const errorHTML = `<div class="error">
  <span>${err}</span>
</div>`;
  main.innerHTML = errorHTML;
};

window.fetchProfil = async function (name) {
  main.innerHTML =
    '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Yükleniyor...</div>';
  try {
    const res = await fetch(`https://api.github.com/users/${name}`);

    if (!res.ok) {
      if (res.status === 404) throw new Error('Kullanıcı bulunamadı');
      if (res.status === 403)
        throw new Error(
          'API Erişim limiti aşıldı. Lütfen daha sonra tekrar deneyin.',
        );
      throw new Error(`Bir hata oluştu: ${res.status}`);
    }

    const data = await res.json();
    insertHTML(data);
  } catch (err) {
    insertError(err.message);
  }
};

const searchUser = function () {
  let inputValue = input.value.trim();
  if (inputValue) {
    window.fetchProfil(inputValue);
    input.value = '';
  }
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const fetchUserList = async (query) => {
  if (query.length < 3) {
    main.innerHTML = '';
    return;
  }

  try {
    const res = await fetch(
      `https://api.github.com/search/users?q=${query}&per_page=5`,
    );
    if (!res.ok) throw new Error('API limit or error');

    const data = await res.json();
    renderUserList(data.items);
  } catch (err) {
    console.error(err);
  }
};

const renderUserList = (users) => {
  if (!users || users.length === 0) {
    main.innerHTML = '<div class="error">Kullanıcı bulunamadı</div>';
    return;
  }

  const html = users
    .map(
      (user) => `
    <div class="user-list-item" onclick="fetchProfil('${user.login}')">
      <img src="${user.avatar_url}" alt="${user.login}">
      <div class="user-text">
        <strong>${user.login}</strong>
        <span>Kullanıcı</span>
      </div>
      <i class="fas fa-chevron-right user-arrow"></i>
    </div>
  `,
    )
    .join('');

  main.innerHTML = html;
};

input.addEventListener(
  'input',
  debounce((e) => {
    const val = e.target.value.trim();
    if (val.length >= 3) {
      fetchUserList(val);
    } else {
      main.innerHTML = '';
    }
  }, 500),
);

gonder.addEventListener('click', searchUser);

input.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    searchUser();
  }
});
