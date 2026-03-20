# GUIA DE EXECUÇÃO

## Pré-requisitos
* Node.js (versão 18+)
* Angular CLI

## 1. Executar a Aplicação (Etapa 1)
No terminal, na raiz do repositório, aceda à pasta do projeto e inicie o servidor:
\`\`\`bash
cd whatsanalizer
npm install
npm start
\`\`\`
A aplicação ficará disponível em `http://localhost:4200`.

## 2. Executar os Testes Automatizados (Etapa 2)
Com a aplicação a correr num terminal, abra um novo terminal, aceda à mesma pasta e execute o Playwright:
\`\`\`bash
cd whatsanalizer
npx playwright test
\`\`\`
Para ver o relatório visual dos testes, execute:
\`\`\`bash
npx playwright show-report
\`\`\`