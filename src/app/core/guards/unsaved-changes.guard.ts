import { inject, Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ModalService } from '../../shared/services/modal.service';
import { UnsavedChangesModalComponent } from '../../shared/components/modals/unsaved-changes-modal/unsaved-changes-modal.component';

export interface CanDeactivateComponent {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<CanDeactivateComponent> {
  private modalService = inject(ModalService);
  
  canDeactivate(
    component: CanDeactivateComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (component.canDeactivate && component.canDeactivate()) {
      const modalRef = this.modalService.open(UnsavedChangesModalComponent, {
        open: true
      });
      
      return modalRef.result;
    }
    return true;
  }
}
