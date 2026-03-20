import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { finalize, timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SliderModule } from 'primeng/slider';

// Interface baseada no contrato de dados exigido
interface AnalysisResult {
  resumo?: string;
  indicadores?: { envolvidos: number; tarefas: number; prazos: number; riscos: number; conflitos: number; sentimento: number };
  sentimentoDescricao?: string;
  participantes?: string[];
  tarefas?: { descricao: string; envolvido: string; prioridade: string }[];
  prazos?: { descricao: string; data: string; envolvido: string }[];
  riscos?: { descricao: string; envolvido: string }[];
  conflitos?: { descricao: string; envolvido: string }[];
}

@Component({
  selector: 'app-whatsanalizer',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderModule],
  templateUrl: './whatsanalizer.component.html',
  styleUrls: ['./whatsanalizer.component.scss']
})
export class WhatsanalizerComponent {
  private http = inject(HttpClient);

  // --- ESTADO (Signals) ---
  systemPrompt = signal<string>('Analise a conversa de WhatsApp e retorne APENAS um JSON estrito seguindo as chaves solicitadas.');
  selectedModel = signal<string>('GLM-4.7');
  temperature = signal<number>(0.5);
  apiToken = signal<string>('');
  fileContent = signal<string>('');
  
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  
  result = signal<AnalysisResult | null>(null);
  selectedParticipant = signal<string>('Todos');

  // --- COMPUTEDS (Listas Filtradas) ---
  filtroAtivo = computed(() => this.selectedParticipant());

  filteredTarefas = computed(() => this.filtrarPorEnvolvido(this.result()?.tarefas));
  filteredPrazos = computed(() => this.filtrarPorEnvolvido(this.result()?.prazos));
  filteredRiscos = computed(() => this.filtrarPorEnvolvido(this.result()?.riscos));
  filteredConflitos = computed(() => this.filtrarPorEnvolvido(this.result()?.conflitos));

  kpis = computed(() => this.result()?.indicadores || { envolvidos: 0, tarefas: 0, prazos: 0, riscos: 0, conflitos: 0, sentimento: 0 });

  modelOptions = ['GLM-5', 'GLM-4.7', 'GLM-4.5 Flash'];

  // --- MÉTODOS ---

  private filtrarPorEnvolvido(lista: any[] | undefined) {
    if (!lista) return [];
    const participante = this.selectedParticipant().toLowerCase();
    if (participante === 'todos') return lista;
    return lista.filter(item => item.envolvido?.toLowerCase().includes(participante));
  }

  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.name.endsWith('.txt')) {
        this.errorMessage.set('Por favor, insira apenas ficheiros .txt');
        return;
      }
      this.errorMessage.set('');
      const reader = new FileReader();
      reader.onload = (e) => this.fileContent.set(e.target?.result as string);
      reader.readAsText(file);
    }
  }

  getSentimentoEmoji(valor: number): string {
    if (valor <= 2) return '😢';
    if (valor <= 4) return '😕';
    if (valor <= 6) return '😐';
    if (valor <= 8) return '🙂';
    return '😊';
  }

  analisar() {
    if (!this.fileContent() || !this.apiToken()) {
      this.errorMessage.set('Carregue um ficheiro e insira o Token Z.AI.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.result.set(null);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiToken().trim()}`,
      'Content-Type': 'application/json'
    });

    // Ajustes obrigatórios para APIs de IA
    const formatModel = this.selectedModel().toLowerCase().replace(' ', '-');
    let safeTemp = this.temperature();
    if (safeTemp <= 0) safeTemp = 0.01;
    if (safeTemp >= 1) safeTemp = 0.99;

    const body = {
      model: formatModel,
      messages: [
        { role: 'system', content: this.systemPrompt() },
        { role: 'user', content: this.fileContent() }
      ],
      temperature: safeTemp,
      stream: false,
      response_format: { type: "json_object" }
    };

    this.http.post<any>('https://api.z.ai/api/paas/v4/chat/completions', body, { headers })
      .pipe(
        timeout(150000),
        catchError(this.handleError.bind(this)),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          try {
            const contentString = response.choices[0].message.content;
            const parsedData: AnalysisResult = JSON.parse(contentString);
            this.result.set(parsedData);
          } catch (e) {
            this.errorMessage.set('Erro ao processar os dados da IA. Retorno inválido.');
          }
        },
        error: (err) => {
          // Previne que o console do navegador fique cheio de erros vermelhos inúteis
          console.warn('Bloqueio da API tratado pela interface da aplicação.');
        }
      });
  }

  private handleError(error: any) {
    if (error.name === 'TimeoutError') {
      this.errorMessage.set('A análise demorou demasiado tempo (Timeout). Tente novamente com um texto mais curto.');
    } else if (error.status === 429 || error.status === 1302) {
      this.errorMessage.set('Atingimos o limite de requisições (Rate Limit). Por favor, aguarde um momento e tente de novo.');
    } else {
      // Lê o erro real enviado pela Z.AI (ex: "Invalid API Key")
      const apiMsg = error.error?.error?.message || error.error?.message || 'Token inválido ou sem permissão.';
      this.errorMessage.set(`Acesso Recusado: ${apiMsg}`);
    }
    return throwError(() => new Error(this.errorMessage()));
  }
}