import { CaixaDaLanchonete } from "./caixa-da-lanchonete.js";

const caixa = new CaixaDaLanchonete();

const resultado = caixa.calcularValorDaCompra('credito', ['cafe,1', 'suco,2', 'sanduiche,3']);
console.log(resultado)