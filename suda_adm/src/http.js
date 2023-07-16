import axios from 'axios'

const Http = axios.create({
    baseURL:'http://localhost:3000/admin/api',
})

export default Http