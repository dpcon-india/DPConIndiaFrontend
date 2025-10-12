export const api = 'https://api.dpconindia.com/api/';
export const BaseApi = 'https://api.dpconindia.com/';
// export const api = 'http://localhost:5000/api/';
// export const BaseApi = 'http://localhost:5000/';

const gettokenlocalStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;
console.log({ gettokenlocalStorage });
export const bearerHeader = {
  headers: {
    Authorization: `Bearer ${gettokenlocalStorage?.token}`,
    Accept: 'application/json',
  },
};
export const formDataHeader = {
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${gettokenlocalStorage?.token}`,
  },
};
