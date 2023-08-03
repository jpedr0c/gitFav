export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.dataUsers = [
      {
        login: 'jpedr0c',
        name: 'João Pedro Cardoso',
        public_repos: '28',
        followers: '35',
      },
      {
        login: 'peguimasid',
        name: 'Guilhermo Masid',
        public_repos: '52',
        followers: '90',
      },
    ]
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = document.querySelector('table tbody');
    this.update();
  }

  update() {
    this.removeAllFavorites();

    this.dataUsers.forEach( user => {
      const row = this.createRow();
      
      row.querySelector('.user a').href = `https://github.com/${user.login}`;
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`;
      row.querySelector('.user img').alt = `Imagem de perfil do ${user.login} no github`;
      row.querySelector('.user .user-description p').textContent = user.name;
      row.querySelector('.user .user-description span').textContent = user.login;
      row.querySelector('.repositories').textContent = user.public_repos;
      row.querySelector('.followers').textContent = user.followers;

      this.tbody.append(row);
    })
  }

  createRow() {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="user">
        <a href="https://github.com/jpedr0c" target="_blank">
          <img src="https://github.com/jpedr0c.png" alt="Avatar">
          <div class="user-description">
            <p>João Pedro Cardoso</p>
            <span>/jpedr0c</span>
          </div>
        </a>
      </td>
      <td class="repositories">28</td>
      <td class="followers">35</td>
      <td>
        <button class="action">Remover</button>
      </td>`;
      
      return tr;
  }

  removeAllFavorites() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove();
    });
  }
}