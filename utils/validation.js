// utils/validation.js 

// these are functions used for server side validation of uer input

import xss from 'xss';

export const validName = (name) => {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw 'Name must be a non-empty string';
    }
    if (name.length < 2 || name.length > 50) {
        throw 'Name must be between 2 and 50 characters long';
    }
    // sanitize the name to prevent XSS attacks
    name = xss(name);

    return name;
}


export const validEmail = (email) => {
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
        throw 'Email must be a non-empty string';
    }
    // email validation regex from  https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    if (!emailRegex.test(email)) {
        throw 'Invalid email format';
    }
    // sanitize the email to prevent XSS attacks
    email = xss(email);

    return email;
}

export const validPassword = (password) => {
    if (!password || typeof password !== 'string' || password.trim().length === 0) {
        throw 'Password must be a non-empty string';
    }

    if (password.length < 6 || password.length > 50) {
        throw 'Password must be between 6 and 50 characters long';
    }

    if (password.includes(' ')) {
        throw 'Password cannot contain spaces';
    }

    // sanitize the password to prevent XSS attacks
    password = xss(password);

    return password;
}

export const validCourseTitle = (title) => {
    if (!title || typeof title !== 'string') throw 'Course title is required and must be a string';
    title = xss(title.trim());
    if (title.length === 0) throw 'Course title cannot be empty';
    return title;
};

export const validateDateOrder = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate > endDate) throw 'Start date cannot be after end date';
    return { startDate, endDate };
};

export const checkEmpty = (string, name) => {
    string = xss(string.trim());
    if (!string) throw `${name} cannot be empty`;
    return string;
};

export const validDate = (date) => {
    if (!date || typeof date !== 'string') throw 'Date is required and must be a string';
    date = xss(date.trim());
    if (date.length === 0) throw 'Date cannot be empty';
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) throw "Date is invalid";
    return dateObj;
};

export function formatDateForInput(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function formatForDatetimeLocal(dateStr) {
    const date = new Date(dateStr);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
  }
  

const parseLocalDate = (str) => {
    const [year, month, day] = str.split('-');
    return new Date(Number(year), Number(month) - 1, Number(day));
  };
  


export default {
    validName,
    validEmail,
    validPassword,
    validCourseTitle,
    validateDateOrder,
    checkEmpty,
    validDate,
    formatDateForInput,
    formatForDatetimeLocal
}