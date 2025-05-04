// utils/validation.js 

// these are functions used for server side validation of uer input

import xss from 'xss';

export const validName = (name) => {
    if(!name || typeof name !== 'string' || name.trim().length === 0) {
        throw 'Name must be a non-empty string';
    }
    if(name.length < 2 || name.length > 50) {
        throw 'Name must be between 2 and 50 characters long';
    }
    // sanitize the name to prevent XSS attacks
    name = xss(name);

    return name;
}


export const validEmail = (email) => {
    if(!email || typeof email !== 'string' || email.trim().length === 0) {
        throw 'Email must be a non-empty string';
    }
    // email validation regex from  https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   

    if(!emailRegex.test(email)) {
        throw 'Invalid email format';
    }
    // sanitize the email to prevent XSS attacks
    email = xss(email);

    return email;
}

export const validPassword = (password) => {
    if(!password || typeof password !== 'string' || password.trim().length === 0) {
        throw 'Password must be a non-empty string';
    }

    if(password.length < 6 || password.length > 50) {
        throw 'Password must be between 6 and 50 characters long';
    }

    if(password.includes(' ')) {
        throw 'Password cannot contain spaces';
    }

    // sanitize the password to prevent XSS attacks
    password = xss(password);

    return password;
}

export default  {
    validName,
    validEmail,
    validPassword
}