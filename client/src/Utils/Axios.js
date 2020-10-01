import Axios from 'axios';

const apiUrl = 'http://localhost:5001/api/v1';

export const api = Axios.create({ baseURL: apiUrl });