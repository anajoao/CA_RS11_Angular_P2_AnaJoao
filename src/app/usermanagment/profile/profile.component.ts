import { Component } from '@angular/core';
import { Utilizador } from '../../model/db.type';
import { AuthService } from '../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user!: Utilizador;
  profileForm: FormGroup;
  isEditing = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.profileForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: [''],
      morada: ['', Validators.required],
      codigo_postal: ['', Validators.required],
      pais: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    this.authService.user().subscribe((user) => {
      if (user) {
        this.user = user;
        this.profileForm.patchValue(user); 
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.patchValue(this.user);
    } else {
      this.profileForm.reset(this.user); 
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const updatedUser = { ...this.user, ...this.profileForm.value };
      this.authService.updateUser(updatedUser).subscribe(() => {
        this.user = updatedUser;
        this.isEditing = false;
        alert("Perfil atualizado com sucesso!");
      });
    }
  }

  passwordsMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('senha')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
