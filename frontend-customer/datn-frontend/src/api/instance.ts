import axios, { AxiosInstance } from 'axios'
import Enviroment from '../utils/checkEnviroment'

class Http {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: Enviroment('api'),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

const http = new Http().instance

export default http
