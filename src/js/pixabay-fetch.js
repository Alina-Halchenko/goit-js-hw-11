const axios = require('axios').default;

export async function fetchPictures(searchedWord) {
  const BASE_URL = 'https://pixabay.com/api/?key=30954662-83110fa5e4f5ce54727e82861'

  const response = await axios.get(`${BASE_URL}&q=${searchedWord}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`)
  const images = response.data;
  console.log(images);

  return images;
}