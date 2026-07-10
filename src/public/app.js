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

function populateTable(containerId, users) {

    const container =
        document.getElementById(containerId);

    container.innerHTML = "";

    users.forEach(user => {

        const card =
            document.createElement("div");

        card.className = "data-card";

        card.innerHTML = `

            <h4>user:${user.id}</h4>

            <pre>${JSON.stringify(user, null, 4)}</pre>

        `;

        container.appendChild(card);

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

function formatTimestamp(timestamp) {

    return new Date(timestamp).toLocaleString();

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

    migration.conflicts.forEach(conflict => {

        migrationContainer.innerHTML += `

        <div class="conflict-card">

            <h3>${conflict.key}</h3>

            <p>

                <strong>Conflict Type:</strong>

                ${conflict.conflictType}

            </p>

            <p>

                <strong>Reason:</strong>

                ${conflict.reason}

            </p>

            <div class="analysis-box">

                <h4>Recommendation</h4>

                <p>

                    <strong>Suggested Action:</strong>

                    ${conflict.analysis?.suggestedAction === "OVERWRITE"

                        ? "Overwrite Redis B"

                        : conflict.analysis?.suggestedAction === "KEEP_DESTINATION"

                            ? "Keep Redis B"

                            : "Manual Review"}

                </p>

                <p>

                    ${conflict.analysis?.reason ?? "N/A"}

                </p>

                <p>
                    <strong>Source Created At:</strong>
                    ${formatTimestamp(conflict.sourceMetadata.createdAt)}
                </p>

                <p>
                    <strong>Source Updated At:</strong>
                    ${formatTimestamp(conflict.sourceMetadata.updatedAt)}
                </p>

                <p>
                    <strong>Destination Created At:</strong>
                    ${formatTimestamp(conflict.destinationMetadata.createdAt)}
                </p>

                <p>
                    <strong>Destination Updated At:</strong>
                    ${formatTimestamp(conflict.destinationMetadata.updatedAt)}
                </p>

                <p>

                    <strong>Field Data Mismatch</strong>

                </p>

                <ul>

                    ${(conflict.analysis?.conflictingFields ?? [])
                        .map(field=>`<li>${field}</li>`)
                        .join("")}

                </ul>

            </div>

            <div class="conflict-grid">

                <div class="conflict-column">

                    <h4>Source</h4>

                    <pre>

    ${JSON.stringify(conflict.sourceData,null,4)}

                    </pre>

                </div>

                <div class="conflict-column">

                    <h4>Destination</h4>

                    <pre>

    ${JSON.stringify(conflict.destinationData,null,4)}

                    </pre>

                </div>

            </div>

            <button
                class="overwrite"
                onclick="resolveMigrationConflict('${conflict.key}','overwrite')">

                Overwrite Redis B

            </button>

            <button
                class="keep"
                onclick="resolveMigrationConflict('${conflict.key}','skip')">

                Keep Destination

            </button>

        </div>

        `;

    });

    cdc.conflicts.forEach(conflict => {

        cdcContainer.innerHTML += `

        <div class="conflict-card">

            <h3>${conflict.key}</h3>

            <p>

                <strong>Conflict Type:</strong>

                ${conflict.conflictType}

            </p>

            <p>

                <strong>Reason:</strong>

                ${conflict.reason}

            </p>

            <div class="analysis-box">

                <h4>Recommendation</h4>

                <p>

                    <strong>Suggested Action:</strong>

                    ${conflict.analysis?.suggestedAction === "OVERWRITE"

                        ? "Overwrite Redis B"

                        : conflict.analysis?.suggestedAction === "KEEP_DESTINATION"

                            ? "Keep Redis B"

                            : "Manual Review"}

                </p>

                <p>

                    ${conflict.analysis?.reason ?? "N/A"}

                </p>

                <p>
                    <strong>Source Created At:</strong>
                    ${formatTimestamp(conflict.sourceMetadata.createdAt)}
                </p>

                <p>
                    <strong>Source Updated At:</strong>
                    ${formatTimestamp(conflict.sourceMetadata.updatedAt)}
                </p>

                <p>
                    <strong>Destination Created At:</strong>
                    ${formatTimestamp(conflict.destinationMetadata.createdAt)}
                </p>

                <p>
                    <strong>Destination Updated At:</strong>
                    ${formatTimestamp(conflict.destinationMetadata.updatedAt)}
                </p>

                <p>

                    <strong>Field Data Mismatch</strong>

                </p>

                <ul>

                    ${(conflict.analysis?.conflictingFields ?? [])
                        .map(field => `<li>${field}</li>`)
                        .join("")}

                </ul>

            </div>

            <div class="conflict-grid">

                <div class="conflict-column">

                    <h4>Source</h4>

                    <pre>${JSON.stringify(conflict.sourceData, null, 4)}</pre>

                </div>

                <div class="conflict-column">

                    <h4>Destination</h4>

                    <pre>${JSON.stringify(conflict.destinationData, null, 4)}</pre>

                </div>

            </div>

            <button
                class="overwrite"
                onclick="resolveCdcConflict('${conflict.key}','overwrite')">

                Overwrite Redis B

            </button>

            <button
                class="keep"
                onclick="resolveCdcConflict('${conflict.key}','skip')">

                Keep Destination

            </button>

        </div>

        `;

    });
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