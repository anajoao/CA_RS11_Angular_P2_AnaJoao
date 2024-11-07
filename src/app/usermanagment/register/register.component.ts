import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { Utilizador } from '../../model/db.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      senha: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
        ]
      ],
      morada: ['', Validators.required],
      codigo_postal: ['', Validators.required],
      pais: ['', Validators.required]
    });
  }

  // Método para registar o utilizador
  registerUser() {
    if (this.registerForm.invalid) {
      return;
    }

    const novoUtilizador: Utilizador = {
      ...this.registerForm.value,
      admin: false // Define o utilizador como não-admin por padrão
    };

    this.authService.checkEmailExists(novoUtilizador.email).subscribe((exists) => {
      if (exists) {
        this.errorMessage = 'O e-mail já está em uso. Escolha outro.';
      } else {
        this.authService.registerUser(novoUtilizador).subscribe(() => {
          alert('Registo concluído com sucesso!');
          this.router.navigate(['/home']); // Redireciona para a página inicial
        });
      }
    });
  }

  get senha() {
    return this.registerForm.get('senha');
  }
}