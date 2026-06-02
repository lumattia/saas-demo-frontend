import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomFieldService } from '../../core/services/custom-field.service';
import { CustomFieldGroup, CustomFieldDefinition, OrderUpdateDTO, CustomFieldType, FieldValidations } from '../../core/models/custom-field.model';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ModuleType } from '../../core/models/tenant.model';
import { EnumService } from '../../core/services/enum.service';
import { SelectInputComponent } from '../../shared/components/inputs/select-input/select-input.component';
import { TextInputComponent } from '../../shared/components/inputs/text-input/text-input.component';
import { NumberInputComponent } from '../../shared/components/inputs/number-input/number-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CanDeactivateComponent } from '../../core/guards/unsaved-changes.guard';
import { ModalService } from '../../shared/services/modal.service';
import { UnsavedChangesModalComponent } from '../../shared/components/modals/unsaved-changes-modal/unsaved-changes-modal.component';
import { ConfirmModalComponent } from '../../shared/components/modals/confirm-modal/confirm-modal.component';

interface GroupFormData {
  name: string;
}

interface FieldFormData {
  groupId: number;
  label: string;
  type: CustomFieldType;
  fieldOrder: number;
  validations: FieldValidations;
}

@Component({
  selector: 'app-custom-fields-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, SelectInputComponent, TextInputComponent, NumberInputComponent, ButtonComponent],
  templateUrl: './custom-fields-page.component.html',
  styleUrls: ['./custom-fields-page.component.css']
})
export class CustomFieldsPageComponent implements OnInit, CanDeactivateComponent {
  private customFieldService = inject(CustomFieldService);
  private enumService = inject(EnumService);
  private fb = inject(FormBuilder);
  private modalService = inject(ModalService);

  selectedModule = signal<ModuleType>(ModuleType.DRESS);
  groups = signal<CustomFieldGroup[]>([]);
  hasUnsavedChanges = signal(false);

  modules: ModuleType[] = [];
  get moduleOptions() {
    return this.modules.map(module => ({
      id: module,
      name: `customFields.form.moduleOptions.${module}`
    }));
  }

  // Group Modal
  showGroupModal = signal(false);
  groupForm: FormGroup;
  editingGroup = signal<CustomFieldGroup | null>(null);

  // Field Modal
  showFieldModal = signal(false);
  fieldForm: FormGroup;
  editingField = signal<CustomFieldDefinition | null>(null);
  selectedGroupId = signal<number | null>(null);

  // Field Type Options
  fieldTypeOptions = [
    { id: CustomFieldType.TEXT, name: 'customFields.fieldTypes.TEXT' },
    { id: CustomFieldType.NUMBER, name: 'customFields.fieldTypes.NUMBER' },
    { id: CustomFieldType.DATE, name: 'customFields.fieldTypes.DATE' },
    { id: CustomFieldType.SELECT, name: 'customFields.fieldTypes.SELECT' },
    { id: CustomFieldType.CHECKBOX, name: 'customFields.fieldTypes.CHECKBOX' }
  ];

  constructor() {
    this.groupForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.fieldForm = this.fb.group({
      label: ['', Validators.required],
      type: [CustomFieldType.TEXT, Validators.required],
      required: [false],
      min: [null],
      max: [null],
      maxLength: [null],
      options: [[]]
    });
  }

  ngOnInit() {
    this.enumService.getAssignableModules().subscribe(modules => {
      this.modules = modules;
      if (modules.length > 0) {
        this.selectedModule.set(modules[0]);
        this.loadGroups();
      }
    });
  }
  getFormControl(form: FormGroup, controlName: string): FormControl {
    return form.get(controlName) as FormControl;
  }
  loadGroups() {
    this.customFieldService.getGroupsByModule(this.selectedModule()).subscribe(groups => {
      this.groups.set(groups);
      this.hasUnsavedChanges.set(false);
    });
  }

  async onModuleChange(module: string) {
    if (this.hasUnsavedChanges()) {
      const modalRef = this.modalService.open(UnsavedChangesModalComponent, {
        open: true
      });
      
      try {
        const shouldContinue = await modalRef.result;
        if (!shouldContinue) {
          return;
        }
      } catch {
        return;
      }
    }
    this.selectedModule.set(module as ModuleType);
    this.loadGroups();
  }

  // Group Modal Methods
  openGroupModal(group?: CustomFieldGroup) {
    if (group) {
      this.editingGroup.set(group);
      this.groupForm.patchValue({ name: group.name });
    } else {
      this.editingGroup.set(null);
      this.groupForm.reset();
    }
    this.showGroupModal.set(true);
  }

  closeGroupModal() {
    this.showGroupModal.set(false);
    this.groupForm.reset();
    this.editingGroup.set(null);
  }

  saveGroup() {
    if (this.groupForm.invalid) return;

    const formData = this.groupForm.value as GroupFormData;

    if (this.editingGroup()) {
      this.customFieldService.updateGroup({
        id: this.editingGroup()!.id,
        name: formData.name,
        module: this.selectedModule(),
        groupOrder: this.editingGroup()!.groupOrder
      }).subscribe(() => {
        this.closeGroupModal();
        this.loadGroups();
      });
    } else {
      this.customFieldService.createGroup({
        name: formData.name,
        module: this.selectedModule(),
        groupOrder: this.groups().length
      }).subscribe(() => {
        this.closeGroupModal();
        this.loadGroups();
      });
    }
  }

  // Field Modal Methods
  openFieldModal(groupId: number, field?: CustomFieldDefinition) {
    this.selectedGroupId.set(groupId);
    
    if (field) {
      this.editingField.set(field);
      this.fieldForm.patchValue({
        label: field.label,
        type: field.type,
        required: field.validations?.required || false,
        min: field.validations?.min || null,
        max: field.validations?.max || null,
        maxLength: field.validations?.maxLength || null,
        options: field.validations?.options || []
      });
    } else {
      this.editingField.set(null);
      this.fieldForm.reset({
        type: CustomFieldType.TEXT,
        required: false,
        options: []
      });
    }
    this.showFieldModal.set(true);
  }

  closeFieldModal() {
    this.showFieldModal.set(false);
    this.fieldForm.reset();
    this.editingField.set(null);
    this.selectedGroupId.set(null);
  }

  saveField() {
    if (this.fieldForm.invalid || !this.selectedGroupId()) return;

    const formData = this.fieldForm.value;
    const validations: FieldValidations = {
      required: formData.required || false,
      min: formData.min || undefined,
      max: formData.max || undefined,
      maxLength: formData.maxLength || undefined,
      options: formData.options || []
    };

    if (this.editingField()) {
      this.customFieldService.updateDefinition({
        id: this.editingField()!.id,
        groupId: this.selectedGroupId()!,
        label: formData.label,
        type: formData.type,
        fieldOrder: this.editingField()!.fieldOrder,
        validations
      }).subscribe(() => {
        this.closeFieldModal();
        this.loadGroups();
      });
    } else {
      const group = this.groups().find(g => g.id === this.selectedGroupId());
      this.customFieldService.createDefinition({
        groupId: this.selectedGroupId()!,
        label: formData.label,
        type: formData.type,
        fieldOrder: group ? group.definitions.length : 0,
        validations
      }).subscribe(() => {
        this.closeFieldModal();
        this.loadGroups();
      });
    }
  }

  // Delete Methods
  async confirmDelete(type: 'group' | 'field', id: number, name: string) {
    const titleKey = type === 'group' ? 'customFields.modals.deleteGroup' : 'customFields.modals.deleteField';
    const messageKey = type === 'group' ? 'customFields.modals.deleteGroupConfirm' : 'customFields.modals.deleteFieldConfirm';
    
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      open: true,
      title: titleKey,
      message: messageKey,
      messageParams: { name }
    });
    
    try {
      const confirmed = await modalRef.result;
      
      if (confirmed) {
        if (type === 'group') {
          this.customFieldService.deleteGroup(id).subscribe(() => {
            this.loadGroups();
          });
        } else {
          this.customFieldService.deleteDefinition(id).subscribe(() => {
            this.loadGroups();
          });
        }
      }
    } catch {
      // Modal was dismissed
    }
  }

  // Drag and Drop Methods
  onGroupDragStart(event: DragEvent, group: CustomFieldGroup) {
    event.dataTransfer?.setData('text/plain', group.id.toString());
    event.dataTransfer?.setData('type', 'group');
  }

  onGroupDrop(event: DragEvent, targetIndex: number) {
    event.preventDefault();
    const groupId = parseInt(event.dataTransfer?.getData('text/plain') || '0');
    const type = event.dataTransfer?.getData('type');

    if (type !== 'group' || !groupId) return;

    const currentGroups = [...this.groups()];
    const sourceIndex = currentGroups.findIndex(g => g.id === groupId);

    if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
      const [movedGroup] = currentGroups.splice(sourceIndex, 1);
      currentGroups.splice(targetIndex, 0, movedGroup);
      this.groups.set(currentGroups);
      this.hasUnsavedChanges.set(true);
    }
  }

  onFieldDragStart(event: DragEvent, field: CustomFieldDefinition, groupId: number) {
    event.dataTransfer?.setData('text/plain', field.id.toString());
    event.dataTransfer?.setData('type', 'field');
    event.dataTransfer?.setData('groupId', groupId.toString());
  }

  onFieldDrop(event: DragEvent, targetField: CustomFieldDefinition, groupId: number) {
    event.preventDefault();
    const fieldId = parseInt(event.dataTransfer?.getData('text/plain') || '0');
    const type = event.dataTransfer?.getData('type');
    const sourceGroupId = parseInt(event.dataTransfer?.getData('groupId') || '0');

    if (type !== 'field' || !fieldId || sourceGroupId !== groupId) return;

    const currentGroups = [...this.groups()];
    const groupIndex = currentGroups.findIndex(g => g.id === groupId);
    if (groupIndex === -1) return;

    const currentFields = [...currentGroups[groupIndex].definitions];
    const sourceIndex = currentFields.findIndex(f => f.id === fieldId);
    const targetIndex = currentFields.findIndex(f => f.id === targetField.id);

    if (sourceIndex !== -1 && targetIndex !== -1 && sourceIndex !== targetIndex) {
      const [movedField] = currentFields.splice(sourceIndex, 1);
      currentFields.splice(targetIndex, 0, movedField);
      currentGroups[groupIndex].definitions = currentFields;
      this.groups.set(currentGroups);
      this.hasUnsavedChanges.set(true);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // Batch Save
  saveOrders() {
    const groupOrders: OrderUpdateDTO[] = this.groups().map((group, index) => ({
      id: group.id,
      order: index
    }));

    const fieldOrders: OrderUpdateDTO[] = this.groups().flatMap(group =>
      group.definitions.map((field, index) => ({
        id: field.id,
        order: index
      }))
    );

    this.customFieldService.updateOrders(this.selectedModule(), {
      groupOrders,
      fieldOrders
    }).subscribe(() => {
      this.hasUnsavedChanges.set(false);
    });
  }

  // Conditional Validation Display
  get currentFieldType(): CustomFieldType {
    return this.fieldForm.get('type')?.value || CustomFieldType.TEXT;
  }

  showMinValidation(): boolean {
    return this.currentFieldType === CustomFieldType.NUMBER;
  }

  showMaxValidation(): boolean {
    return this.currentFieldType === CustomFieldType.NUMBER;
  }

  showMaxLengthValidation(): boolean {
    return this.currentFieldType === CustomFieldType.TEXT;
  }

  showOptionsValidation(): boolean {
    return this.currentFieldType === CustomFieldType.SELECT;
  }

  addOption() {
    const options = this.fieldForm.get('options')?.value || [];
    this.fieldForm.patchValue({ options: [...options, ''] });
  }

  removeOption(index: number) {
    const options = this.fieldForm.get('options')?.value || [];
    options.splice(index, 1);
    this.fieldForm.patchValue({ options });
  }

  updateOption(index: number, value: string) {
    const options = this.fieldForm.get('options')?.value || [];
    options[index] = value;
    this.fieldForm.patchValue({ options });
  }

  canDeactivate(): boolean | Promise<boolean> {
    return !this.hasUnsavedChanges();
  }
}
