const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const userOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
          title: "User API Docs",
          version: "1.0.0",
          description: "API documentation for users",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
  apis: ["./src/routes/user/*.js"]
};

const userSpecs = swaggerJSDoc(userOptions);

const adminOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
          title: "Admin API Docs",
          version: "1.0.0",
          description: "API documentation for users",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
  apis: ["./src/routes/admin/*.js"]
};


const adminSpecs = swaggerJSDoc(adminOptions);

module.exports = { adminSpecs, userSpecs };