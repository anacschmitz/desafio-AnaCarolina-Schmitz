import readline from "readline";

class CaixaDaLanchonete {
    calcularValorDaCompra(metodoDePagamento, itens) {
      const cardapio = new Cardapio();
      let total;
      if (
        itens.some(item => item.startsWith('chantily')) &&
        !itens.some(item => item.startsWith('cafe'))
      ) {
        return 'Item extra não pode ser pedido sem o principal';
      } else if (
        itens.some(item => item.startsWith('queijo')) &&
        !itens.some(item => item.startsWith('sanduiche'))
      ) {
        return 'Item extra não pode ser pedido sem o principal';
      }else if (cardapio.validarCodigo(itens) === false){
        return 'Item inválido!';
      } else if (cardapio.validarQtd(itens) === false){
        return 'Quantidade inválida!';
      } else if (itens.length === 0) {
        return 'Não há itens no carrinho de compra!';
      } else{
        total = cardapio.calcularTotal(itens);
        if (metodoDePagamento == 'dinheiro'){
          total = total - (total * 0.05);
          const totalFormatado = total.toFixed(2);
          return `R$ ${totalFormatado.replace('.', ',')}`
        }else if (metodoDePagamento == 'credito'){
          total = total + (total * 0.03);
          const totalFormatado = total.toFixed(2);
          return `R$ ${totalFormatado.replace('.', ',')}`
        }else if (metodoDePagamento == 'debito'){
          const totalFormatado = total.toFixed(2);
          return `R$ ${totalFormatado.replace('.', ',')}`
      } else {
        return 'Forma de pagamento inválida!'
      }

    }
}}

class Cardapio {
  constructor() {
    this.cardapio = ["cafe; 3.0", "chantily; 1.50", "suco; 6.20", "sanduiche; 6.50",
    "queijo; 2.0", "salgado; 7.25", "combo1; 9.50", "combo2; 7.50"];
  }
    mostrarCardapio(){
        console.log("| codigo    | descrição                   | valor   |");
        console.log("|-----------|-----------------------------|---------|");
        console.log("| cafe      | Café                        | R$ 3,00 |");
        console.log("| chantily  | Chantily (extra do Café)    | R$ 1,50 |");
        console.log("| suco      | Suco Natural                | R$ 6,20 |");
        console.log("| sanduiche | Sanduíche                   | R$ 6,50 |");
        console.log("| queijo    | Queijo (extra do Sanduíche) | R$ 2,00 |");
        console.log("| salgado   | Salgado                     | R$ 7,25 |");
        console.log("| combo1    | 1 Suco e 1 Sanduíche        | R$ 9,50 |");
        console.log("| combo2    | 1 Café e 1 Sanduíche        | R$ 7,50 |");
    }

    validarCodigo(itens) {
      for (const item of itens) {
        const [codigo] = item.split(',');
        if (!this.cardapio.some(menuItem => menuItem.startsWith(codigo))) {
          return false;
        }
      }
      return true;
    }

    validarQtd(itens) {
      for (const item of itens) {
        const partes = item.split(',');
        const qtd = parseFloat(partes[1]);
    
        if (isNaN(qtd) || qtd === 0) {
          return false;
        }
      }
    
      return true;
    }

    validarItem(itens) {
      if (itens.length === 0){
            return false;
          }
      return true;
    }

    calcularTotal(itens){
      let listaValores = [];
      for (const item of itens) {
        const [codigo, qtd] = item.split(',');
    
        const itemEncontrado = this.cardapio.find(itemCardapio => {
          const [itemCodigo] = itemCardapio.split(';');
          return itemCodigo === codigo;
        });
    
        if (itemEncontrado) {
          const [, valor] = itemEncontrado.split('; ');
          const totalItem = parseFloat(valor) * parseInt(qtd);
          listaValores.push(totalItem);
        }
      }
      const soma = listaValores.reduce((total, valor) => total + valor, 0);
      return soma;         
      }

    }

class RealizarPedido {
    constructor() {
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
    }

    pedido() {
      const listaPedido = [];
      const caixa = new CaixaDaLanchonete();
      
    
      const fazerPedido = () => {
        this.rl.question('Digite o código da opção desejada: ', (pedido) => {
          listaPedido.push(pedido);
        
          this.rl.question('Deseja adicionar mais algum ítem?\n[1] - SIM\n[2] - NÃO ',
            async (resposta) => {
              if (resposta === '1') {
                fazerPedido();
              } else {
                const metodoDePagamento = await this.escolherPagamento();
                this.rl.close();
                const valor = caixa.calcularValorDaCompra(metodoDePagamento, listaPedido);
                }
              });
              
            });
            }
            fazerPedido();
          }

          escolherPagamento() {
            return new Promise((resolve) => {
              let metodoDePagamento;
              this.rl.question('Escolha a forma de pagamento: \n[1] - Dinheiro\n[2] - Débito\n[3] - Crédito ', (formaDePagamento) => {
                if (formaDePagamento === '1') {
                  metodoDePagamento = 'dinheiro';
                } else if (formaDePagamento === '2') {
                  metodoDePagamento = 'debito';
                } else if (formaDePagamento === '3') {
                  metodoDePagamento = 'credito';
                  this.rl.close();
                } else {
                  metodoDePagamento = 'Forma de pagamento inválida!';
                  this.escolherPagamento().then(resolve);
                  return;
                }
                resolve(metodoDePagamento);
              });
            });
          }
          
}

export { CaixaDaLanchonete };
export {Cardapio}
export { RealizarPedido }
