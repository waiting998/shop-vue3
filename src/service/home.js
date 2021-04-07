import axios from '../untils/axios'
export function getHome() {
    return axios.get('/index-infos')
}