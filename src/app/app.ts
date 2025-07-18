import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpenAIService, OpenAIMessage } from './services/openai.service';

interface ChatMessage {
  role: 'User' | 'AI';
  text: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  userInput = '';
  isLoading = false;
  // messages array to hold chat messages
  messages: ChatMessage[] = [];

  constructor(private openai: OpenAIService) {}

  sendMessage() {
    if (!this.userInput.trim()) return; // Prevent sending empty messages

    this.messages.push({ role: 'User', text: this.userInput });
    // Prepare messages for OpenAI API in the required format
    const apiMessages: OpenAIMessage[] = [
      { role: 'system' as const, content: 'You are a helpful assistant.' },
      ...this.messages.map<OpenAIMessage>((m) => ({
        role: m.role === 'User' ? 'user' : 'assistant',
        content: m.text,
      })),
    ];

    this.isLoading = true;

    //call OpenAI with the conversation history
    this.openai.sendMessage(apiMessages).subscribe({
      next: (res: any) => {
        const reply = res?.choices?.[0]?.message?.content || '(No response)';
        this.messages.push({ role: 'AI', text: reply });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('OpenAI error:', err);
        this.messages.push({
          role: 'AI',
          text: 'Error: Unable to get response.',
        });
        this.isLoading = false;
      },
    });

    this.userInput = ''; // Clear input field after sending
  }
}
