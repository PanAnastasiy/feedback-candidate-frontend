export const login = async ({ username, password }: any) => {
    return fetch(`http://localhost:8080/technologies/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password }),
    })
        .then(function (response) {
            return response.json();
        })
        .catch(function (error) {
            console.log(error);
        });
};