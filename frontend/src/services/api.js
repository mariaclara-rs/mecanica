import axios from 'axios';
import { token } from '../auth';

const api  = axios.create({
    baseURL:'https://mecanicaapi.vercel.app',
});


export default api;