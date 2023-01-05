'use strict';

import { PixabayApi } from './pixabay-api';
import createGalleryCard from './templates/gallery-card.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const divEl = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

let gallery = new SimpleLightbox('.photo-card a');

const pixabayApi = new PixabayApi();

function handleSearchPhoto(event) {
  event.preventDefault();

  pixabayApi.query = event.target.elements.searchQuery.value.trim();

  pixabayApi.resetPage();

  if (!pixabayApi.query) {
    return;
  }

  amountData(pixabayApi.query);
}

async function handleLoadMore() {
  try {
    pixabayApi.incrementPage();
    const { data } = await pixabayApi.fetchPhotos();

    if (pixabayApi.page === data.hits.total) {
      btnLoadMore.classList.add('is-hidden');
    }

    createMarkUp(data);
    gallery.refresh();

    const totalPages = Math.ceil(data.totalHits / pixabayApi.per_page);
    if (pixabayApi.page === totalPages) {
      Notiflix.Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
      btnLoadMore.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function amountData() {
  try {
    const { data } = await pixabayApi.fetchPhotos();

    btnLoadMore.classList.remove('is-hidden');

    if (!data.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      btnLoadMore.classList.add('is-hidden');
      return;
    }
    if (data.totalHits < pixabayApi.per_page) {
      btnLoadMore.classList.add('is-hidden');
    }

    clearForm();
    createMarkUp(data);
    gallery.refresh();
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  } catch (error) {
    console.log(error);
  }
}

function createMarkUp(data) {
  divEl.insertAdjacentHTML('beforeend', createGalleryCard(data.hits));
}

function clearForm() {
  divEl.innerHTML = '';
}

btnLoadMore.addEventListener('click', handleLoadMore);
formEl.addEventListener('submit', handleSearchPhoto);
