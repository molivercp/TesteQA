import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const APP_URL = 'http://localhost:4200';

test.describe('AI Chat Insights - Testes Funcionais', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
  });

  test('Deve bloquear a análise se nenhum ficheiro for enviado', async ({ page }) => {
    // Clica no botão mesmo estando desabilitado/sem ficheiro
    await page.locator('button.btn-analisar').click({ force: true });
    
    // Valida se o sistema se manteve no estado inicial
    await expect(page.locator('.empty-state')).toBeVisible();
  });

  test('O título da página deve estar correto para SEO', async ({ page }) => {
    await expect(page).toHaveTitle(/whatsanalizer/i);
  });
  
  test('Deve mostrar carregamento e erro se submeter sem Token', async ({ page }) => {
    // Tenta contornar bloqueios da UI forçando a chamada
    await page.evaluate(() => {
      const btn = document.querySelector('button.btn-analisar') as HTMLButtonElement;
      if(btn) { btn.disabled = false; btn.click(); }
    });
    
    // Aguarda a mensagem de erro do sistema de validação que criamos
    await expect(page.locator('.alert.error')).toBeVisible();
  });
});

// Lendo o arquivo CSV para massa de dados
const caminhoCSV = path.join(__dirname, 'dados.csv');
const registrosCSV = fs.readFileSync(caminhoCSV, 'utf-8')
  .split('\n')
  .slice(1)
  .filter(linha => linha.trim() !== '');

test.describe('Testes de Validação com Massa Externa (CSV)', () => {
  for (const registro of registrosCSV) {
    const [nomeDoArquivo, mensagemEsperada] = registro.split(',');

    test(`Deve exibir a validação para o ficheiro ${nomeDoArquivo}`, async ({ page }) => {
      await page.goto(APP_URL);
      
      // Simula o erro através da UI interagindo com elementos (neste caso o alerta falhará sem ficheiro)
      await page.evaluate(() => {
        const btn = document.querySelector('button.btn-analisar') as HTMLButtonElement;
        if(btn) { btn.disabled = false; btn.click(); }
      });
      
      await expect(page.locator('.alert.error')).toBeVisible();
    });
  }
});