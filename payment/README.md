# Configuração do Gateway de Pagamento

Este diretório contém os arquivos necessários para integração com o gateway de pagamento.

## Como usar

1. No arquivo `gateway.js`, configure a URL do seu gateway de pagamento usando:
```javascript
paymentConfig.setGatewayUrl('SUA_URL_DO_GATEWAY_AQUI');
```

2. Para iniciar um pagamento, chame:
```javascript
paymentConfig.redirectToGateway(productId, price);
```

## Comportamento

- Na primeira tentativa de compra: mostra mensagem de indisponibilidade
- Na segunda tentativa ou mais: redireciona para o gateway de pagamento

## Exemplo de Uso

```javascript
// No seu arquivo de produto
document.querySelector('#buyButton').addEventListener('click', () => {
    paymentConfig.redirectToGateway('produto123', '99.99');
});
```

## Configuração do Gateway

Para configurar seu gateway de pagamento:

1. Adicione o script no seu HTML:
```html
<script src="/payment/gateway.js"></script>
```

2. Configure a URL do gateway:
```javascript
paymentConfig.setGatewayUrl('https://seu-gateway.com/pagamento');
```
