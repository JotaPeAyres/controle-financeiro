import axios from 'axios'

// Instância do Axios com configuração base
const api = axios.create({
  baseURL: 'https://localhost:7112/api',
  timeout: 30000, 
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api