document.addEventListener('DOMContentLoaded', function() {
  let moviesData;
  let peliculaseleccionada;
  const listapelis = document.getElementById('lista');
  const inputbusqueda = document.getElementById('inputBuscar');
  const infoDropdown = document.getElementById('infoDropdown');
  const infoadicionaloffcanvas = document.getElementById('additionalInfoResultOffcanvas');
  const offcanvas = new bootstrap.Offcanvas(document.getElementById('movieOffcanvas'));

  fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then(response => response.json())
    .then(data => {
      moviesData = data;
    })
    .catch(error => {
      console.error('Error al cargar los datos de las películas:', error);
    });

  function mostrarpelis(pelis) {
    listapelis.innerHTML = '';

    if (pelis.length === 0) {
      listapelis.innerHTML = '<p>No se encontraron películas.</p>';
      return;
    }

    pelis.forEach(peli => {
      const listaitem = document.createElement('li');
      listaitem.classList.add('list-group-item');
      const rating = peli.vote_average / 2;
      const starIcons = '<i class="fa fa-star text-warning"></i>'.repeat(Math.floor(rating));
      const halfStarIcon = rating % 1 !== 0 ? '<i class="fa fa-star-half-o text-warning"></i>' : '';
      listaitem.innerHTML = `
        <h4>${peli.title}</h4>
        <p>${peli.tagline}</p>
        <p>Puntuación: ${starIcons}${halfStarIcon}</p>
      `;
      listaitem.addEventListener('click', () => {
        peliculaseleccionada = peli;
        mostrardetallespelis(peli);
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
    const halfStarIcon = rating % 1 !== 0 ? '<i class="fa fa-star-half-o text-warning"></i>' : '';
    ratingestrella.innerHTML = starIcons + halfStarIcon;

    const botoninfoadicional = document.getElementById('additionalInfoBtn');
    botoninfoadicional.addEventListener('click', () => {
      const infoSeleccionada = infoDropdown.value;
      const infoTextos = {
        'Año de lanzamiento': movie.release_date.split('-')[0],
        'Duración del largometraje': movie.runtime + ' minutos',
        'Presupuesto': '$' + movie.budget,
        'Ganancias obtenidas': '$' + movie.revenue,
        'default': 'Selecciona información adicional'
      };
      infoadicionaloffcanvas.textContent = infoTextos[infoSeleccionada] || infoTextos['default'];
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


  