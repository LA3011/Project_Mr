import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AKi - API Documentation',
      version: '1.0.0',
      description: 'Documentación de la API de Productos y Usuarios',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    './src/routes/*.ts', 
    './dist/routes/*.js',
    './src/routes/**/*.ts',
    './dist/routes/**/*.ts',
    path.join(__dirname, '../routes/**/*.ts'),
    path.join(__dirname, '../../dist/routes/**/*.js'),
  ], 
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);