# Node.js com serverless framework

> Este é o projeto de exemplo para o curso [Node.js com serverless framework](tbd) na Alura.

Este projeto tem como objetivo guiar seu aprendizado durante o curso, e para isso, ele está dividido em branches, cada um com um objetivo diferente. Cada branch representa um passo do curso, e você pode navegar entre elas para ver o código de cada etapa.

Além disso, existem dois branches: `completo-vm` e `completo-serverless`, cada um com sua própria documentação, que contém os códigos completos do projeto em cada um dos ambientes que ele está rodando.

## Executando localmente

O projeto foi feito da forma mais simples possível para facilitar o uso. Não foram usados nenhum framework ou biblioteca para o front-end.

Todo o projeto roda a partir do arquivo `index.mjs`, que é o arquivo principal do projeto. Para executá-lo, basta rodar o comando:

```bash
node index.mjs
```

Ou se preferir, você pode usar o [nodemon](https://www.npmjs.com/package/nodemon) para executar o projeto:

```bash
npm run dev
```

Isso vai garantir que você não precise ficar reiniciando o servidor a cada alteração que fizer. Todo o front-end da aplicação está na pasta `interface`, toda a API da aplicação está dentro do arquivo `index.mjs`.

Depois de executar o projeto, você pode acessar a aplicação em `http://localhost:3000`.
