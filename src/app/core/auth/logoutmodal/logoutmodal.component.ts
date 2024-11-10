import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logoutmodal',
  standalone: true,
  imports: [],
  templateUrl: './logoutmodal.component.html',
  styleUrl: './logoutmodal.component.css'
})
export class LogoutmodalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();

  constructor(
    private authService: AuthService, private router: Router) {}

  confirmLogout() {
    this.authService.logout();
    this.closeModal();
    this.router.navigate(['/']);
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
}
