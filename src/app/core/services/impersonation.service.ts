import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImpersonationService {
  private impersonatingUserIdSignal = signal<number | null>(null);
  impersonatingUserId = this.impersonatingUserIdSignal.asReadonly();
  isImpersonating = computed(() => this.impersonatingUserIdSignal() !== null);

  startImpersonation(userId: number) {
    this.impersonatingUserIdSignal.set(userId);
    localStorage.setItem('impersonating_user_id', userId.toString());
  }

  stopImpersonation() {
    this.impersonatingUserIdSignal.set(null);
    localStorage.removeItem('impersonating_user_id');
    window.location.reload();
  }

  loadFromStorage() {
    const stored = localStorage.getItem('impersonating_user_id');
    if (stored) {
      const userId = parseInt(stored, 10);
      if (!isNaN(userId)) {
        this.impersonatingUserIdSignal.set(userId);
      }
    }
  }
}
