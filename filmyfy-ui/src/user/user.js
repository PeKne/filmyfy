/**
 * Lists all registered users
 * @returns {Promise<Response>}
 * @author Martin Balucha
 */
export function list() { //todo
    /*
    const url = 'http://localhost:8080/pa165/rest/user';
    return fetch(url, options)
        .then((response) => {
           if (response.ok) {
               return response.json();
           }
        });

     */
}

export function changePassword(id, oldPassword, newPassword, token) {
    const url = 'http://localhost:8080/pa165/rest/user/change-password';
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': token},
        body: JSON.stringify({
            id: id,
            oldPassword: oldPassword,
            newPassword: newPassword
        })
    };
    return fetch(url, requestOptions)
        .then((response) => {
            if (response.ok) {
                return response;
            }
            const error = new Error();
            error.message = 'Error occurred during password change';
            throw error;
        })
        .then(response => response || {});
}


export function update(id, name, surname, email, phone, token) {
    const url = 'http://localhost:8080/pa165/rest/user/';
    const requestOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'authorization': token
        },
        body: JSON.stringify({
            id: id,
            name: name,
            surname: surname,
            email: email,
            phone: phone
        })
    };
    return fetch(url, requestOptions)
        .then(response => {
            if (response.ok) {
                return response;
            }
            console.log(response.status);
            const error = new Error();
            error.message = 'Error occurred during user update';
            throw error;
        })
        .then(response => response || {});
}

/**
 * Retrieves a user with the given id
 * @param id user's id
 * @returns {Promise<Response>} a user with the given id.
 * @trows Error, if no such user has been found
 */
export function find(id) {
    const url = `http://localhost:8080/pa165/rest/user/${id}`;
    return fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            const error = new Error();
            error.message = 'Error fetching the user';
            throw error;
        })
        .then(response => response || {});
}
