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

function getAppAInput() {

    return {
        id:
            document.getElementById(
                "appAId"
            ).value,

        name:
            document.getElementById(
                "appAName"
            ).value,

        email:
            document.getElementById(
                "appAEmail"
            ).value
    };
}

function getAppBInput() {

    return {
        id:
            document.getElementById(
                "appBId"
            ).value,

        name:
            document.getElementById(
                "appBName"
            ).value,

        email:
            document.getElementById(
                "appBEmail"
            ).value
    };
}

function setStatus(message) {

    document.getElementById(
        "status"
    ).innerText = message;
}

async function appACreate() {

    const user = getAppAInput();

    const response =
        await fetch("/appA/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

    if (response.ok) {

        setStatus(
            `User ID ${user.id} created in App A`
        );

    } else {

        const error =
            await response.json();

        setStatus(
            error.error
        );
    }

    await refreshTables();
    await loadConflicts();  
}

async function appAUpdate() {

    const user = getAppAInput();

    const response =
        await fetch(
            `/appA/users/${user.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    name: user.name,
                    email: user.email
                })
            }
        );

    if (response.ok) {

        setStatus(
            `User ID ${user.id} updated in App A`
        );

    } else {

        const error =
            await response.json();

        setStatus(
            error.error
        );
    }

    await refreshTables();
    await loadConflicts();
}

async function appADelete() {

    const user = getAppAInput();

    const response =
        await fetch(
            `/appA/users/${user.id}`,
            {
                method: "DELETE"
            }
        );

    if (response.ok) {

        setStatus(
            `User ID ${user.id} deleted from App A`
        );

    } else {

        const error =
            await response.json();

        setStatus(
            error.error
        );
    }

    await refreshTables();
    await loadConflicts();
}

async function appBCreate() {

    const user = getAppBInput();

    const response =
        await fetch("/appB/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

    if (response.ok) {

        setStatus(
            `User ID ${user.id} created in App B`
        );

    } else {

        const error =
            await response.json();

        setStatus(
            error.error
        );
    }

    await refreshTables();
    await loadConflicts();
}

async function appBUpdate() {

    const user = getAppBInput();

    const response =
        await fetch(
            `/appB/users/${user.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    name: user.name,
                    email: user.email
                })
            }
        );

    if (response.ok) {

        setStatus(
            `User ID ${user.id} updated in App B`
        );

    } else {

        const error =
            await response.json();

        setStatus(
            error.error
        );
    }

    await refreshTables();
    await loadConflicts();
}

async function appBDelete() {

    const user = getAppBInput();

    const response =
        await fetch(
            `/appB/users/${user.id}`,
            {
                method: "DELETE"
            }
        );

    if (response.ok) {

        setStatus(
            `User ID ${user.id} deleted from App B`
        );

    } else {

        const error =
            await response.json();

        setStatus(
            error.error
        );
    }

    await refreshTables();
    await loadConflicts();
}

async function migrate() {

    const result =
        await fetch("/migrate", {
            method: "POST"
        });

    const data =
        await result.json();

    setStatus(
        `Migration completed | Migrated: ${data.summary.migratedUsers} | Synced: ${data.summary.synchronizedUsers} | Conflicts: ${data.summary.conflictsDetected}`
    );

    await refreshTables();
    await loadConflicts();
}

async function loadConflicts() {

    const migration =
        await fetch(
            "/conflicts/migration"
        ).then(res => res.json());

    const cdc =
        await fetch(
            "/conflicts/cdc"
        ).then(res => res.json());

    const migrationContainer =
        document.getElementById(
            "migrationConflicts"
        );

    const cdcContainer =
        document.getElementById(
            "cdcConflicts"
        );

    migrationContainer.innerHTML = "";

    cdcContainer.innerHTML = "";

    migration.conflicts.forEach(
        conflict => {

            migrationContainer.innerHTML += `
                <div class="conflict-card">

                    <h3>${conflict.key}</h3>

                    <div class="conflict-side">

                        <h4>Redis A</h4>

                            <p>ID: ${conflict.redisA.id}</p>
                            <p>Name: ${conflict.redisA.name}</p>
                            <p>Email: ${conflict.redisA.email}</p>

                     </div>

                    <div class="conflict-side">

                        <h4>Redis B</h4>

                            <p>ID: ${conflict.redisB.id}</p>
                            <p>Name: ${conflict.redisB.name}</p>
                            <p>Email: ${conflict.redisB.email}</p>

                    </div>

                <button
                    onclick="
                        resolveMigrationConflict(
                            '${conflict.key}',
                            'overwrite'
                        )
                    "
                >
                    Overwrite Redis B
                </button>

                <button
                    onclick="
                        resolveMigrationConflict(
                            '${conflict.key}',
                            'skip'
                        )
                    "
                >
                    Skip
                </button>

                 </div>
            `;
        }
    );

    cdc.conflicts.forEach(
        conflict => {

            cdcContainer.innerHTML += `
                <div class="conflict-card">

                    <h3>${conflict.key}</h3>

                    <p>
                        Redis A:
                        ${conflict.redisA.name}
                    </p>

                    <p>
                        Redis B:
                        ${conflict.redisB.name}
                    </p>

                    <button
                        onclick="
                            resolveCdcConflict(
                                '${conflict.key}',
                                'overwrite'
                            )
                        "
                    >
                        Overwrite Redis B
                    </button>

                    <button
                        onclick="
                            resolveCdcConflict(
                                '${conflict.key}',
                                'skip'
                            )
                        "
                    >
                        Skip
                    </button>

                </div>
            `;
        }
    );
}

async function resolveMigrationConflict(
    key,
    action
) {

    const response =
        await fetch(
            "/conflicts/migration/resolve",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    key,
                    action
                })
            }
        );

    const data =
        await response.json();

    setStatus(
        data.message || data.error
    );

    await refreshTables();

    await loadConflicts();
}

async function resolveCdcConflict(
    key,
    action
) {

    const response =
        await fetch(
            "/conflicts/cdc/resolve",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    key,
                    action
                })
            }
        );

    const data =
        await response.json();

    setStatus(
        data.message || data.error
    );

    await refreshTables();

    await loadConflicts();
}

refreshTables();

loadConflicts();

setInterval(async () => {

    await refreshTables();

    await loadConflicts();

}, 3000);