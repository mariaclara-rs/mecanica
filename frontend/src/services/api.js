import axios from 'axios';
import { token } from '../auth';

const api  = axios.create({
    baseURL:'https://mecanicaapi.vercel.app',
    headers: {
      'Authorization': token(),
      'Access-Control-Allow-Origin': "*",
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
    }
});


export default api;