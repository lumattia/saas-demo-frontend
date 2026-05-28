import { Routes } from '@angular/router';
import { CustomFieldsPageWrapperComponent } from '../features/custom-fields/custom-fields-page-wrapper.component';
import { CustomFieldsPageComponent } from '../features/custom-fields/custom-fields-page.component';
import { UnsavedChangesGuard } from '../core/guards/unsaved-changes.guard';

export const customFieldsRoutes: Routes = [
  {
    path: 'custom-fields',
    component: CustomFieldsPageWrapperComponent,
    children: [
      {
        path: '',
        component: CustomFieldsPageComponent,
        canDeactivate: [UnsavedChangesGuard],
      },
    ],
  },
];
