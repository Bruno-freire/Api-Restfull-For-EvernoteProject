const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./app.js']; // Substitua pelo arquivo principal da sua aplicação

const doc = {
  info: {
    title: 'Nome do seu projeto',
    description: 'Descrição do seu projeto',
    version: '1.0.0',
  },
  host: 'localhost:3000', // Substitua pelo host da sua aplicação
  basePath: '/',
  schemes: ['http'],
};

swaggerAutogen(outputFile, endpointsFiles, doc);
