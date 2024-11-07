import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loginmodal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './loginmodal.component.html',
  styleUrl: './loginmodal.component.css'
})
export class LoginmodalComponent {
  @Output() close = new EventEmitter<void>(); 

  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  onLogin(){
    this.authService.login(this.email, this.password).subscribe(success => {
      if (success) {
        this.close.emit(); 
      } else {
        this.errorMessage = 'Credenciais inválidas! Tente novamente.'; 
      }
    });
  }

  closeModal(){
    this.errorMessage = '';
    this.close.emit(); 
  }
}
