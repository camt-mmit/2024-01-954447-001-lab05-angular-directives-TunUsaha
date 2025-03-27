import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dynamic-input',
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.scss'],
})
export class DynamicInputComponent {
  @Input() index: number = 0; // Index of the input within the section
  @Input() sectionIndex: number = 0; // Index of the parent section
  @Output() remove = new EventEmitter<void>(); // Emits when the input is removed
  @Output() valueChange = new EventEmitter<number>(); // Emits when the value changes

  value: number = 0; // Holds the current value of the input

  /**
   * Handles changes to the input value and emits the updated value.
   * @param event - The input change event
   */
  onValueChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.value = parseFloat(inputElement.value) || 0; // Convert value to number or default to 0
    this.valueChange.emit(this.value); // Notify the parent about the value change
  }

  /**
   * Emits an event to notify the parent component to remove this input.
   */
  onRemove() {
    this.remove.emit();
  }
}
