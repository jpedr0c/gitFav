import { GitHubUser } from "./GitHubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
    this.onAdd();
  }

  load() {
    this.dataUsers = JSON.parse(localStorage.getItem('@gitFav')) || [];
    this.favoritesTableIfEmpty();
  }

  save() {
    localStorage.setItem('@gitFav', JSON.stringify(this.dataUsers));
  }

  async add(username) {
    try {
      const isUserExist = this.dataUsers.find(user => user.login === username)

      if (isUserExist)
        throw new Error('Usuário já favoritado');

      const user = await GitHubUser.search(username);
  
      if (user.login === undefined)
        throw new Error('Usuário não encontrado!'); 

      this.dataUsers = [user, ...this.dataUsers];
      this.update();
      this.save();
    } catch(error) {
      alert(error.message);
    }

  }

  delete(user) {
    const filteredUsers = this.dataUsers.filter( entry => entry.login !== user.login);

    this.dataUsers = filteredUsers;
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = document.querySelector('table tbody');
    this.update();
  }

  onAdd() {
    const addButton = this.root.querySelector('.search button')
    let input = this.root.querySelector('.search input');

    addButton.onclick = () => {
      this.add(input.value);

      input.value = '';
    };
  }

  update() {
    this.removeAllFavorites();

    if (this.dataUsers.length <= 0)
      this.favoritesTableIfEmpty();

    this.dataUsers.forEach( user => {
      const row = this.createRow();
      
      row.querySelector('.user a').href = `https://github.com/${user.login}`;
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`;
      row.querySelector('.user img').alt = `Imagem de perfil do ${user.login} no github`;
      row.querySelector('.user .user-description p').textContent = user.name;
      row.querySelector('.user .user-description span').textContent = user.login;
      row.querySelector('.repositories').textContent = user.public_repos;
      row.querySelector('.followers').textContent = user.followers;

      row.querySelector('.action').onclick = () => {
        const isConfirmDelete = confirm("Tem certeza que deseja remover este usuário?");

        if (isConfirmDelete) {
          this.delete(user);
        }
      }

      this.tbody.append(row);
    })
  }

  favoritesTableIfEmpty() {
    const tableBody = document.querySelector('table tbody');
    const row = document.createElement('tr');

    if (this.dataUsers.length == 0) {
        row.innerHTML = `
          <td class="noFavorite" colspan="4" align="center">
            <div class="box">
              <img src="./assets/star.svg" alt="">
              <h2>Nenhum favorito ainda</h2>
            </div>
          </td>`;
        
      tableBody.append(row);
    }
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