# RETROSPECTIVA

## Maiores Desafios Técnicos
1. **Organização do Estado Reativo:** Substituir o tradicional RxJS por `Signals` no Angular foi um desafio muito interessante. Foi preciso garantir que o filtro de participantes propagasse a atualização para as 4 listas inferiores simultaneamente usando `computed()`.
2. **Setup do Playwright no ecossistema Angular:** Configurar a automação no mesmo repositório do frontend e garantir que os testes conseguiam injetar dados num componente reativo exigiu algumas iterações no DOM (Data-testid).

A transição da lógica de desenvolvimento e estruturação do fluxo de dados da aplicação para a automação e criação de testes foi bastante fluida. Abordar a validação do produto (QA) com a mesma mentalidade estrutural que aplico em outras automações ou painéis ajudou imenso a garantir a cobertura de testes da ferramenta.