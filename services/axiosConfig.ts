        // src/services/axiosConfig.js
        import axios from 'axios';

        const instance = axios.create({
          baseURL: 'https://api.example.com',
          //timeout: 5000, 
          headers: {
            'Content-Type': 'application/json',
          },
        });

        export default instance;