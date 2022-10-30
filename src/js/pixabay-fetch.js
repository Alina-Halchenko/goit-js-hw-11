// const axios = require('axios').default;
import axios from 'axios';

export async function fetchPictures(searchedWord, page) {
  const BASE_URL = 'https://pixabay.com/api/?key=30954662-83110fa5e4f5ce54727e82861'

  const response = await axios.get(`${BASE_URL}&q=${searchedWord}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`)
  const images = response.data;
  // console.log(images);

  return images;
}