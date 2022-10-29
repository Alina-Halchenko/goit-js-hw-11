import './css/styles.css';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;


const Handlebars = require("handlebars");
const template = Handlebars.compile("Name: {{name}}");
console.log(template({ name: "Nils" }));
