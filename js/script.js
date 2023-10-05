document.addEventListener('DOMContentLoaded', async () => {
    let moviesData;
    let selectedMovie;
    const listapelis = document.getElementById('lista');
    const inputbusqueda = document.getElementById('inputBuscar');
    const infoDropdown = document.getElementById('infoDropdown');
    const infoadicionaloffcanvas = document.getElementById('additionalInfoResultOffcanvas');
    const offcanvas = new bootstrap.Offcanvas(document.getElementById('movieOffcanvas'));
  
    try {
      const response = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
      moviesData = await response.json();
    } catch (error) {
      console.error('Error al cargar los datos de las películas:', error);
    }
  
    function mostrarpelis(movies) {
      listapelis.innerHTML = '';
  
      if (movies.length === 0) {
        listapelis.innerHTML = '<p>No se encontraron películas.</p>';
        return;
      }
  
      movies.forEach(movie => {
        const listaitem = document.createElement('li');
        listaitem.classList.add('list-group-item');
        const rating = movie.vote_average / 2;
        const starIcons = '<i class="fa fa-star text-warning"></i>'.repeat(Math.floor(rating));
        const halfStarIcon = (rating % 1 !== 0) ? '<i class="fa fa-star-half-o text-warning"></i>' : '';
        listaitem.innerHTML = `
          <h4>${movie.title}</h4>
          <p>${movie.tagline}</p>
          <p>Puntuación: ${starIcons}${halfStarIcon}</p>
        `;
        listaitem.addEventListener('click', () => {
          selectedMovie = movie;
          mostrardetallespelis(movie);
          offcanvas.show();
        });
        listapelis.appendChild(listaitem);
      });
    }
  
    function mostrardetallespelis(movie) {
      const detalletitulo = document.getElementById('detailTitle');
      const detalleoverview = document.getElementById('detailOverview');
      const detallegeneros = document.getElementById('detailGenres');
      const ratingestrella = document.getElementById('starRating');
  
      detalletitulo.textContent = movie.title;
      detalleoverview.textContent = movie.overview;
      detallegeneros.textContent = 'Géneros: ' + movie.genres.map(genre => genre.name).join(', ');
  
      const rating = movie.vote_average / 2;
      const starIcons = '<i class="fa fa-star text-warning"></i>'.repeat(Math.floor(rating));
      const halfStarIcon = (rating % 1 !== 0) ? '<i class="fa fa-star-half-o text-warning"></i>' : '';
      ratingestrella.innerHTML = starIcons + halfStarIcon;
  
      const botoninfoadicional = document.getElementById('additionalInfoBtn');
      botoninfoadicional.addEventListener('click', () => {
        const infoseleccionada = infoDropdown.value;
  
        switch (infoseleccionada) {
          case 'Año de lanzamiento':
            infoadicionaloffcanvas.textContent = movie.release_date.substring(0, 4);
            break;
          case 'Duración del largometraje':
            infoadicionaloffcanvas.textContent = movie.runtime + ' minutos';
            break;
          case 'Presupuesto':
            infoadicionaloffcanvas.textContent = '$' + movie.budget;
            break;
          case 'Ganancias obtenidas':
            infoadicionaloffcanvas.textContent = '$' + movie.revenue;
            break;
          default:
            infoadicionaloffcanvas.textContent = 'Selecciona información adicional';
        }
      });
    }
  
    infoDropdown.innerHTML = `
      <option selected>Selecciona información adicional</option>
      <option>Año de lanzamiento</option>
      <option>Duración del largometraje</option>
      <option>Presupuesto</option>
      <option>Ganancias obtenidas</option>
    `;
  
    const boton = document.getElementById('btnBuscar');
    boton.addEventListener('click', () => {
      const searchTerm = inputbusqueda.value.trim().toLowerCase();
  
      if (searchTerm === '') {
        mostrarpelis(moviesData);
      } else {
        const pelisfiltradas = moviesData.filter(movie =>
          movie.title.toLowerCase().includes(searchTerm) ||
          movie.genres.some(genre => genre.name.toLowerCase().includes(searchTerm)) ||
          movie.tagline.toLowerCase().includes(searchTerm) ||
          movie.overview.toLowerCase().includes(searchTerm)
        );
        mostrarpelis(pelisfiltradas);
      }
    });
  });
  