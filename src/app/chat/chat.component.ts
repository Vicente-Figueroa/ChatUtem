import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  message!: string;
  email!: string;
  query!: string;
  conversation: string[] = [];
  loading = true;
  messageCount = 0;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getInitialMessage();
  }

  getInitialMessage() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.get('https://utem-01-6d0e6ff9d456.herokuapp.com/chat', { headers: headers }).subscribe(
//    this.http.get('http://localhost:5000/chat', { headers: headers }).subscribe(
      (response: any) => {
        this.message = this.formatMessage(response.message);
        this.conversation.push(this.message);
        console.log(this.message);
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener el mensaje inicial:', error);
        this.loading = false;
      }
    );
  }

  askQuestion() {
    this.loading = true;
    if (this.query) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      const body = { query: this.query };

      this.http.post('https://utem-01-6d0e6ff9d456.herokuapp.com/chat', body, { headers: headers }).subscribe(
      //this.http.post('http://localhost:5000/chat', body, { headers: headers }).subscribe(
        (response: any) => {
          this.message = this.formatMessage(response.message);
          this.conversation.push(`Tu: ${this.query}`);
          this.conversation.push(this.message);
          console.log(this.message);

          this.query = '';
          this.messageCount++;
          console.log(this.messageCount);
          this.loading = false;

        },
        (error) => {
          console.error('Error al enviar la pregunta:', error);
          // Manejar el error de acuerdo a tus necesidades
        }
      );
    }
  }
  formatMessage(message: string): string {
    // Reemplazar los asteriscos y saltos de línea por etiquetas HTML correspondientes
    message = message.replace(/\n/g, '<br>'); // Reemplazar saltos de línea por <br>
    message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Convertir **texto** a <strong>texto</strong>
    message = message.replace(/\*(.*?)\*/g, '<li>$1</li>'); // Convertir *texto* a <li>texto</li>

    // Añadir <ul> alrededor de los <li> elementos
    message = message.replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');

    // Asegurar que los <ul> no estén anidados incorrectamente
    message = message.replace(/<\/ul>\s*<ul>/g, '');

    return message;
  }


}