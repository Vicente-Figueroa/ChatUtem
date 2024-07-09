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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getInitialMessage();
  }

  getInitialMessage() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.get('https://utem-01-6d0e6ff9d456.herokuapp.com/chat', { headers: headers }).subscribe(
      (response: any) => {
        this.message = response.message.replace(/```/g, '').replace(/\n/g, '');
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
    if (this.query) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      const body = { query: this.query };

      this.http.post('https://utem-01-6d0e6ff9d456.herokuapp.com/chat', body, { headers: headers }).subscribe(
        (response: any) => {
          this.message = response.message.replace(/```/g, '').replace(/\n/g, '');
          this.conversation.push(`Tu: ${this.query}`);
          this.conversation.push(this.message);
          console.log(this.message);

          this.query = '';
          this.messageCount++;
          console.log(this.messageCount);
   
        },
        (error) => {
          console.error('Error al enviar la pregunta:', error);
          // Manejar el error de acuerdo a tus necesidades
        }
      );
    }
  }


}