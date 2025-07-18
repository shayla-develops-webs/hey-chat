import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// export the role union & interface OpenAIMessage
export type OpenAIRole = 'system' | 'user' | 'assistant';
export interface OpenAIMessage {
  role: OpenAIRole;
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private apiKey = environment.openAiApiKey;
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(private http: HttpClient) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is missing. Set it in environment.ts');
    }
  }

  sendMessage(messages: OpenAIMessage[]): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    });

    const body = {
      model: 'gpt-4o-mini',
      messages,
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
