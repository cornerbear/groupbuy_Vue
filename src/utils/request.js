import axios from 'axios'
import { ElMessage } from 'element-plus'

const instance = axios.create({
  baseURL : 'http://localhost:8888',
  timeout : 4000,
})

export default instance;