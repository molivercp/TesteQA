# DOCUMENTO DE ENTREGA - Teste 2

## 1) Como desenvolveu
Iniciei o desenvolvimento pela estruturação do componente `WhatsanalizerComponent` como um *Standalone Component* no Angular, garantindo que toda a funcionalidade exigida ficasse centralizada. A interface foi desenhada com CSS Grid e Flexbox para garantir a responsividade em ecrãs menores.
* **Estado e Reatividade:** Utilizei a nova API de **Signals** do Angular para gerir o estado (ex: `fileContent`, `isLoading`). Para as listas do dashboard, utilizei `computed()` signals, o que permitiu que o filtro de participantes atualizasse automaticamente as 4 listas (Tarefas, Prazos, Riscos, Conflitos) de forma reativa e muito performante, sem necessidade de subscrições complexas.
* **Integração Z.AI:** O `HttpClient` foi configurado para enviar os dados. O tratamento do JSON foi feito num bloco `try/catch` após a receção da resposta, garantindo que retornos inválidos gerassem mensagens de erro na UI.

## 2) Tratamento de erros
Foram contemplados cenários de Timeout (configurado para 2.5 minutos com operador RxJS `timeout`), Rate Limit (verificação de status 429 ou 1302) e ficheiros inválidos (bloqueio no frontend antes do upload). O loading é local no botão e gerido pelo signal `isLoading`, não bloqueando o resto da aplicação.

## 3) O que faria diferente
Com mais tempo, implementaria contentores Docker para facilitar o ambiente de testes de QA e adicionaria uma camada de testes unitários (Jest) antes dos testes End-to-End com Playwright.