import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import pictureMarkupHdb from './templates/pictures-markup.hbs';
import { fetchPictures } from './js/pixabay-fetch.js'

const Handlebars = require("handlebars");
// const axios = require('axios').default;

const refs = {
  input: document.querySelector('.search-form input'),
  searchBtn: document.querySelector('.search-btn'),
  loadMoreBtn: document.querySelector('.load-more'),
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery')
}
let searchedWord = ''

refs.form.addEventListener('submit', onSearchClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);


function onSearchClick(evt){
  evt.preventDefault();
  cleanMarkup();

  const {
    elements: { searchQuery }
  } = evt.currentTarget;
  console.log(searchQuery.value);

  searchedWord = searchQuery.value.trim();

  fetchPictures(searchedWord).then( res => 
    {if(res.hits.length <= 0){
      return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    }
    console.log(res.totalHits)
    Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images`);
    return createPicturesMarkup(res)}
  ).catch(err => 
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'))
  
}

function onLoadMoreClick(){
  
}

function createPicturesMarkup(res){
  const picturesMarkup = pictureMarkupHdb(res.hits);
  refs.gallery.insertAdjacentHTML('beforeend', picturesMarkup)
  return picturesMarkup;
}


function cleanMarkup(){
  refs.gallery.innerHTML = '';
}


