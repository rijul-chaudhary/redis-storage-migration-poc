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

async function appACreate() {

    const user = getUserInput();

    await fetch("/appA/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    setStatus("User created in App A");

    refreshTables();
}

async function appAUpdate() {

    const user = getUserInput();

    await fetch(`/appA/users/${user.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: user.name,
            email: user.email
        })
    });

    setStatus("User updated in App A");

    refreshTables();
}

async function appADelete() {

    const user = getUserInput();

    await fetch(`/appA/users/${user.id}`, {
        method: "DELETE"
    });

    setStatus("User deleted from App A");

    refreshTables();
}

async function appBCreate() {

    const user = getUserInput();

    await fetch("/appB/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    setStatus("User created in App B");

    refreshTables();
}

async function appBUpdate() {

    const user = getUserInput();

    await fetch(`/appB/users/${user.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: user.name,
            email: user.email
        })
    });

    setStatus("User updated in App B");

    refreshTables();
}

async function appBDelete() {

    const user = getUserInput();

    await fetch(`/appB/users/${user.id}`, {
        method: "DELETE"
    });

    setStatus("User deleted from App B");

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