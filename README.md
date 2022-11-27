# Node.js com serverless framework

> Este é o projeto de exemplo para o curso [Node.js com serverless framework](tbd) na Alura.

Este projeto tem como objetivo guiar seu aprendizado durante o curso, e para isso, ele está dividido em branches, cada um com um objetivo diferente. Cada branch representa um passo do curso, e você pode navegar entre elas para ver o código de cada etapa.

Além disso, existem dois branches: `completo-vm` e `completo-serverless`, cada um com sua própria documentação, que contém os códigos completos do projeto em cada um dos ambientes que ele está rodando.

> **Atenção**: É importante que você utilize a versão 16 do Node.js. Se você utiliza o [ASDF](https://asdf-vm.com/#/), você pode instalar a versão 16 com o comando `asdf install` na pasta já que temos a configuração no arquivo `.tool-versions`. Se você está usando [NVM](https://github.com/nvm-sh/nvm), você pode instalar a versão 16 com o comando `nvm use`.

## Executando localmente

O projeto foi feito da forma mais simples possível para facilitar o uso. Não foram usados nenhum framework ou biblioteca para o front-end.

O projeto roda simultaneamente localmente e no ambiente do AWS lambda. Você pode executar a API offline usando o comando:

```bash
npm run dev
```

Ou, você pode rodar localmente tanto a interface quanto a API usando o comando:

```bash
npm start
```

Depois de executar o projeto, você pode acessar a aplicação em `http://localhost:8000` e a api estará disponível em `http://localhost:3000`.

> __Importante__: As variáveis de ambiente do curso não estão setadas no projeto para o deploy na AWS, para isso você precisa seguir os passos no curso e criar os parâmetros para o ambiente de produção, os parâmetros para desenvolvimento estão setados no arquivo `serverless.yml`.
