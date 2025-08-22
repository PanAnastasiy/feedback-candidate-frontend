export const getAllUsers = async () => {
    return await fetch(`${process.env.REACT_APP_API_HOST}/users`, {
        mode: "cors",
    }).then(function (response) {
        return response.json();
    });
};

export const createUser = async (user: any) => {
    return fetch(`${process.env.REACT_APP_API_HOST}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then(function (response) {
            return response.json();
        })
        .catch(function (error) {
            console.log(error);
        });
};