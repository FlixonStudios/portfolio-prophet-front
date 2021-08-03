import Axios from "axios";

let baseUrl = 'http://localhost:8000'
//let baseUrl = 'https://portfolio-prophet-sei29.herokuapp.com'
Axios.interceptors.request.use(
    config => {
        if(localStorage.access){
            config.headers.Authorization = `Bearer ${localStorage.access}`;
        }else{
            delete config.headers.Authorization
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

Axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        const originalRequest = error.config;
        let refreshToken = localStorage.refresh;

        if (error.response.status === 401
            && originalRequest.url === `${baseUrl}/api/token/refresh/`) { //`${baseUrl}/api/token/refresh/`
            localStorage.clear()
            return Promise.reject(error);
        }

        if( refreshToken && error.response.status === 401 &&
            !originalRequest._retry) {
            originalRequest._retry = true
            return Axios.post(`${baseUrl}/api/token/refresh/`,
                                { refresh : refreshToken})
                .then(res => {

                    if( res.status === 200){
                        console.log(res.data)
                        localStorage.setItem("access", res.data.access)
                        return Axios(originalRequest);
                    }
                }).catch(err => {

                    //return Axios(originalRequest);
                });
        }
        return Promise.reject(error)
    }
)

export default Axios
