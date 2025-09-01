// Swagger definition for your API documentation
export const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Gewamu Lunch Wise API",
            version: "1.0.0",
            description: "API documentation for Gewamu Lunch Wise",
        },
        servers: [
            {
                url: "http://localhost:3000/api",
                description: "Local server",
            },
        ],
    },
    // Path to the API docs
    apis: ["./src/pages/api/**/*.ts"], // Adjust if your API files are elsewhere
};
