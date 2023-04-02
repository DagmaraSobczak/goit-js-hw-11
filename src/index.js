import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

const dataSubmit = document.querySelector('.button');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

async function fetchData(searchTerm, page) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '34772301-2558f091501b1829db2bd0b62',
        q: searchTerm,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page,
      },
    });

    const images = response.data.hits;
    const totalHits = response.data.totalHits;
    if (images.length === 0) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (page === 1) {
      gallery.innerHTML = '';
    }

    images.forEach(image => {
      const galleryItem = document.createElement('div');
      galleryItem.classList.add('photo-card');

      const img = document.createElement('img');
      img.src = image.webformatURL;
      img.alt = image.tags;
      img.loading = 'lazy';

      const info = document.createElement('div');
      info.classList.add('info');

      const likes = document.createElement('p');
      likes.classList.add('info-item');
      likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

      const views = document.createElement('p');
      views.classList.add('info-item');
      views.innerHTML = `<b>Views:</b> ${image.views}`;

      const comments = document.createElement('p');
      comments.classList.add('info-item');
      comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

      const downloads = document.createElement('p');
      downloads.classList.add('info-item');
      downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

      info.appendChild(likes);
      info.appendChild(views);
      info.appendChild(comments);
      info.appendChild(downloads);

      galleryItem.appendChild(img);
      galleryItem.appendChild(info);

      gallery.appendChild(galleryItem);
    });
    if (currentPage === 1) {
      loadMore.style.display = 'block';
    } else if (
      images.length < 40 ||
      images.length + (currentPage - 1) * 40 === totalHits
    ) {
      loadMore.style.display = 'none';
      Notiflix.Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
    } else {
      loadMore.style.display = 'block';
    }
    new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } catch (error) {
    console.error(error);
  }
}
let currentPage = 1;
let currentSearchTerm = '';

dataSubmit.addEventListener('click', event => {
  event.preventDefault();
  const searchTerm = document.querySelector('#search-form input').value;
  if (searchTerm === '') {
    loadMore.style.display = 'none';
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if (searchTerm !== currentSearchTerm) {
    currentPage = 1;
    currentSearchTerm = searchTerm;
    loadMore.classList.remove('visible');
  } else {
    currentPage++;
  }

  fetchData(currentSearchTerm, currentPage);
});
function loadMoreImg() {
  currentPage++;
  fetchData(currentSearchTerm, currentPage);
}
loadMore.addEventListener('click', loadMoreImg);
