# CENÁRIOS DE TESTE AUTOMATIZADOS (Playwright)

## 1. Cenários Funcionais (Caminho Feliz e Exceções)

**Cenário 1: Upload e Análise com Sucesso**
* **Dado** que o utilizador está na página inicial
* **Quando** faz o upload de um ficheiro `.txt` válido e insere o Token
* **E** clica em "Enviar para Análise"
* **Então** o dashboard deve exibir os KPIs, o resumo e o sentimento.

**Cenário 2: Validação de Ficheiro Vazio**
* **Dado** que o utilizador está na página inicial
* **Quando** clica no botão "Enviar para Análise" sem anexar um ficheiro
* **Então** o sistema deve exibir a mensagem de erro "Carregue um ficheiro e insira o Token Z.AI."

**Cenário 3: Filtro de Participantes**
* **Dado** que o dashboard de resultados está visível
* **Quando** o utilizador seleciona um participante no filtro dropdown
* **Então** as listas de Tarefas, Prazos, Riscos e Conflitos devem ser atualizadas para mostrar apenas os dados desse participante.

**Cenário 4: Validação de Acessibilidade Básica**
* **Dado** que o utilizador acede à aplicação
* **Então** o título da página deve conter "AI Chat Insights".

## 2. Teste Orientado a Dados (Data-Driven com .csv)

**Cenário 5: Validação de formatos e limites de ficheiros**
* **Dado** que o utilizador tenta fazer upload de ficheiros inválidos
* **Quando** os dados são injetados a partir do ficheiro `dados.csv` (ex: PDF, imagens, ficheiros muito pesados)
* **Então** o sistema deve bloquear a ação e exibir a mensagem de erro correspondente mapeada no ficheiro CSV.