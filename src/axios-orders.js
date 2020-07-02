import axios from 'axios';

const instance=axios.create({
    baseURL: 'https://react-burger-4addb.firebaseio.com/'
})

export default instance;