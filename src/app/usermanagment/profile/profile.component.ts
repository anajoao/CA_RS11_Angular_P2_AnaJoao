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
  passwordForm: FormGroup;
  isEditing = false;
  isEditingPassword = false;

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

    this.passwordForm = this.fb.group({
      senha: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['']
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

  toggleEditPassword(): void {
    this.isEditingPassword = !this.isEditingPassword;
    if (!this.isEditingPassword) {
      this.passwordForm.reset();
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      let updatedUser = { ...this.user, ...this.profileForm.value };
      this.authService.updateUser(updatedUser).subscribe(() => {
        this.user = updatedUser;
        this.isEditing = false;
        alert("Perfil atualizado com sucesso!");
      });
    }
  }

  savePassword(): void {
    if (this.passwordForm.valid) {
      let newPassword = this.passwordForm.get('senha')?.value;
      let updatedUser = { ...this.user, senha: newPassword };
      
      this.authService.updateUser(updatedUser).subscribe(() => {
        this.user = updatedUser;
        this.isEditingPassword = false;
        alert("Senha atualizada com sucesso!");

        this.passwordForm.reset();
      });
    }
  }

  passwordsMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    let password = form.get('senha')?.value;
    let confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
