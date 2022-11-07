import axios from 'axios';
import { token } from '../auth';

const api  = axios.create({
    baseURL:'https://apimecanica.vercel.app',
    headers: {
      'Authorization': token()
    }
});


export default api;