import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

const dataSubmit = document.querySelector('.button');
const gallery = document.querySelector('.gallery');

async function fetchData(searchTerm) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '34772301-2558f091501b1829db2bd0b62',
        q: searchTerm,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });

    const images = response.data.hits;
    if (images.length === 0) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    gallery.innerHTML = '';
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

    new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } catch (error) {
    console.error(error);
  }
}

dataSubmit.addEventListener('click', event => {
  event.preventDefault();
  const searchTerm = document.querySelector('#search-form input').value;
  if (searchTerm === '') {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  fetchData(searchTerm);
});
