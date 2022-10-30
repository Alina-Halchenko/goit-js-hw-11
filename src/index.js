import './css/styles.css';
import Notiflix from 'notiflix';
import pictureMarkupHdb from './templates/pictures-markup.hbs';
import { fetchPictures } from './js/pixabay-fetch.js';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const Handlebars = require("handlebars");
// const axios = require('axios').default;

const refs = {
  input: document.querySelector('.search-form input'),
  searchBtn: document.querySelector('.search-btn'),
  loadMoreBtn: document.querySelector('.load-more'),
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery')
}
let searchedWord = '';
let page = 1;
let lightbox;

refs.form.addEventListener('submit', onSearchClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);


function onSearchClick(evt){
  cleanMarkup();
  evt.preventDefault();
  

  const {
    elements: { searchQuery }
  } = evt.currentTarget;
  console.log(searchQuery.value);
  searchedWord = searchQuery.value.trim();

  fetchPictures(searchedWord, page).then( res => 
    {if(res.hits.length <= 0){
      return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    }
    if (res.hits.length < 40 && res.hits.length !== 0){
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
      createPicturesMarkup(res);

      lightbox = new SimpleLightbox('.gallery a', {captionDelay: 250});
      lightbox.refresh();
      return;
    };

    Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images`);
    setTimeout(loadBtnAppear, 2000);
    
    createPicturesMarkup(res);
    lightbox = new SimpleLightbox('.gallery a', {captionDelay: 250});
    lightbox.refresh();
    return}
    
  ).catch(err => 
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'))
    
}

function onLoadMoreClick(evt){
  page +=1;
  evt.preventDefault()

  fetchPictures(searchedWord, page).then( res => 
    {if (res.hits.length < 40 && res.hits.length !== 0){
      refs.loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      lightbox.refresh();
      return createPicturesMarkup(res)
    }

    lightbox.refresh();
    return createPicturesMarkup(res)})
}

function createPicturesMarkup(res){
  const picturesMarkup = pictureMarkupHdb(res.hits);
  refs.gallery.insertAdjacentHTML('beforeend', picturesMarkup)
  return picturesMarkup;
}


function cleanMarkup(){
  refs.gallery.innerHTML = '';
  page = 1;
  refs.loadMoreBtn.classList.add('is-hidden');
}

function loadBtnAppear(){
  refs.loadMoreBtn.classList.remove('is-hidden')
}



