async function refreshTables() {

    const redisA =
        await fetch("/admin/redis-a/users")
            .then(res => res.json());

    const redisB =
        await fetch("/admin/redis-b/users")
            .then(res => res.json());

    populateTable(
        "redisATable",
        redisA
    );

    populateTable(
        "redisBTable",
        redisB
    );
}

function populateTable(tableId, users) {

    const tbody =
        document.querySelector(
            `#${tableId} tbody`
        );

    tbody.innerHTML = "";

    users.forEach(user => {

        tbody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
            </tr>
        `;
    });
}

function getUserInput() {

    return {
        id:
            document.getElementById("id").value,

        name:
            document.getElementById("name").value,

        email:
            document.getElementById("email").value
    };
}

function setStatus(message) {

    document.getElementById(
        "status"
    ).innerText = message;
}

async function createUser() {

    const user = getUserInput();

    await fetch("/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    setStatus("User created in Redis B");

    refreshTables();
}

async function updateUser() {

    const user = getUserInput();

    await fetch(`/users/${user.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: user.name,
            email: user.email
        })
    });

    setStatus("User updated in Redis B");

    refreshTables();
}

async function deleteUser() {

    const user = getUserInput();

    await fetch(`/users/${user.id}`, {
        method: "DELETE"
    });

    setStatus("User deleted from Redis B");

    refreshTables();
}

async function legacyCreate() {

    const user = getUserInput();

    await fetch("/legacy/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    setStatus(
        "⚠ Redis A write detected. Redirected to Redis B."
    );

    refreshTables();
}

async function legacyUpdate() {

    const user = getUserInput();

    await fetch(`/legacy/users/${user.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: user.name,
            email: user.email
        })
    });

    setStatus(
        "⚠ Redis A update detected. Redirected to Redis B."
    );

    refreshTables();
}

async function legacyDelete() {

    const user = getUserInput();

    await fetch(`/legacy/users/${user.id}`, {
        method: "DELETE"
    });

    setStatus(
        "⚠ Redis A delete detected. Redirected to Redis B."
    );

    refreshTables();
}

async function migrate() {

    const result =
        await fetch("/migrate", {
            method: "POST"
        });

    const data =
        await result.json();

    setStatus(
        JSON.stringify(data)
    );

    refreshTables();
}

refreshTables();