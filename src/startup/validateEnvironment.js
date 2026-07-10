const requiredVariables = [
    "REDIS_A_URL",
    "REDIS_B_URL",
    "REDIS_CONFLICT_URL",
    "PORT"
];

function validateEnvironment() {

    const missing = requiredVariables.filter(
        variable => !process.env[variable]
    );

    if (missing.length > 0) {

        console.error("\nMissing required environment variables:\n");

        missing.forEach(variable =>
            console.error(` - ${variable}`)
        );

        console.error(
            "\nPlease check your .env file.\n"
        );

        process.exit(1);
    }
}

module.exports = validateEnvironment;