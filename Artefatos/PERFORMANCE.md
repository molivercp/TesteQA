# RELATÓRIO DE PERFORMANCE

## Análise (Google Lighthouse)
A aplicação foi auditada localmente. Os resultados mostraram-se muito eficientes, dado que o projeto foi construído num único *Standalone Component* no Angular, sem bibliotecas pesadas de terceiros (exceto o módulo essencial do PrimeNG para o Slider).

* **First Contentful Paint (FCP):** < 1.0s
* **Largest Contentful Paint (LCP):** < 1.5s
* **Cumulative Layout Shift (CLS):** 0.0 (Graças à estrutura de CSS Grid pré-definida no Dashboard).

Como os processamentos pesados (parsing do chat) e a gestão de estado complexa estão do lado do cliente utilizando Signals, o servidor fica livre, mantendo a responsividade da UI extremamente rápida.