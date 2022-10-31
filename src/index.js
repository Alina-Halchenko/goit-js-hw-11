import './css/styles.css';
import Notiflix from 'notiflix';
import pictureMarkupHdb from './templates/pictures-markup.hbs';
import { fetchPictures } from './js/pixabay-fetch.js';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import debounce from 'lodash.debounce';


const Handlebars = require("handlebars");
const DEBOUNCE_DELAY = 300;
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

refs.searchBtn.disabled = true;

refs.input.addEventListener('input', debounce(onClickInpit, DEBOUNCE_DELAY));
refs.form.addEventListener('submit', onSearchClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);


async function onSearchClick(evt){
  cleanMarkup();
  evt.preventDefault();
  
  const {
    elements: { searchQuery }
  } = evt.currentTarget;
  // console.log(searchQuery.value);
  searchedWord = searchQuery.value.trim();

  try {
    const fetchedPicturesResult = await fetchPictures(searchedWord, page);
    if(fetchedPicturesResult.hits.length <= 0){
      return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.(check for 0 length)')
    }

    createPicturesMarkup(fetchedPicturesResult);
    lightbox = new SimpleLightbox('.gallery a', {captionDelay: 250});
    lightbox.refresh();
    Notiflix.Notify.success(`Hooray! We found ${fetchedPicturesResult.totalHits} images`);
    setTimeout(loadBtnAppear, 2000);  

    if (fetchedPicturesResult.hits.length < 40 && fetchedPicturesResult.hits.length !== 0){
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.(initialcheck)")
      return
    };
  } catch(err) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
  }
}


async function onLoadMoreClick(){
  try {
    page +=1;
    console.log(page, 'page Number')
    const moreImagesLoaded = await fetchPictures(searchedWord, page);
    const lastPageChecker = Math.ceil(moreImagesLoaded.totalHits / 40);

    console.log(moreImagesLoaded, 'fetch for load');
    console.log(lastPageChecker, 'page checker')
    lightbox.refresh();
    createPicturesMarkup(moreImagesLoaded);

    if (page === lastPageChecker) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results.(loadbuttoncheck)");
    }
  } catch(err) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    refs.loadMoreBtn.classList.add('is-hidden');
  }
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

function onClickInpit(evt){
  if(evt.target.value.trim()){
    refs.searchBtn.disabled = false;
  } else {
    refs.searchBtn.disabled = true;
  }
}
