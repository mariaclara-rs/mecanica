import axios from 'axios';
import { token } from '../auth';

const api  = axios.create({
    baseURL:'http://localhost:3344',
    headers: {
      'Authorization': token()
    }
});


export default api;