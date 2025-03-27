import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  ComponentFactoryResolver,
} from '@angular/core';

import { DynamicInputComponent } from '../dynamic-input/dynamic-input.component';

@Component({
  selector: 'app-dynamic-section',

  templateUrl: './dynamic-section.component.html',

  styleUrls: ['./dynamic-section.component.scss'],
})
export class DynamicSectionComponent implements OnInit {
  @ViewChild('sectionContainer', { read: ViewContainerRef, static: true })
  sectionContainer!: ViewContainerRef;

  private sectionRefs: Array<{
    sectionIndex: number;

    inputs: ComponentRef<DynamicInputComponent>[];

    total: number;
  }> = [];

  constructor(private resolver: ComponentFactoryResolver) {}

  ngOnInit() {
    // เพิ่ม Section 1 โดยอัตโนมัติเมื่อหน้าโหลด

    this.addSection();
  }

  // เพิ่ม Section ใหม่

  addSection() {
    const sectionIndex = this.sectionRefs.length + 1;

    // สร้าง container สำหรับ Section

    const sectionDiv = document.createElement('div');

    sectionDiv.className = 'section-container';

    sectionDiv.style.marginBottom = '20px';

    sectionDiv.style.padding = '15px';

    sectionDiv.style.border = '1px solid #ccc';

    sectionDiv.style.borderRadius = '8px';

    // หัวข้อ Section

    const sectionTitle = document.createElement('h3');

    sectionTitle.textContent = `Section ${sectionIndex}`;

    sectionDiv.appendChild(sectionTitle);

    // ปุ่มเพิ่ม Input

    const addInputButton = document.createElement('button');

    addInputButton.textContent = '+ Input';

    addInputButton.className = 'btn btn-primary';

    addInputButton.style.marginRight = '10px';

    addInputButton.addEventListener('click', () => this.addInput(sectionIndex));

    sectionDiv.appendChild(addInputButton);

    // ปุ่มลบ Section

    const removeSectionButton = document.createElement('button');

    removeSectionButton.textContent = '🗑 Remove Section';

    removeSectionButton.className = 'btn btn-danger';

    removeSectionButton.addEventListener('click', () =>
      this.removeSection(sectionIndex),
    );

    sectionDiv.appendChild(removeSectionButton);

    // Container สำหรับ Input

    const inputsContainer = document.createElement('div');

    inputsContainer.id = `inputs-container-${sectionIndex}`;

    inputsContainer.style.marginTop = '10px';

    sectionDiv.appendChild(inputsContainer);

    // แสดง Total ของ Section

    const totalDisplay = document.createElement('div');

    totalDisplay.id = `total-display-${sectionIndex}`;

    totalDisplay.style.marginTop = '10px';

    totalDisplay.style.fontWeight = 'bold';

    totalDisplay.textContent = `Total: 0`;

    sectionDiv.appendChild(totalDisplay);

    // เพิ่ม Section ลงใน DOM

    this.sectionContainer.element.nativeElement.appendChild(sectionDiv);

    // บันทึกข้อมูล Section

    this.sectionRefs.push({
      sectionIndex,

      inputs: [],

      total: 0,
    });

    // เพิ่ม Input แรกใน Section โดยอัตโนมัติ

    this.addInput(sectionIndex);
  }

  // ลบ Section

  removeSection(sectionIndex: number) {
    const section = this.sectionRefs.find(
      (sec) => sec.sectionIndex === sectionIndex,
    );

    if (section) {
      // ทำลาย Input ใน Section

      section.inputs.forEach((inputRef) => inputRef.destroy());

      // ลบ Section ออกจาก DOM

      const sectionDiv = document.getElementById(
        `inputs-container-${sectionIndex}`,
      )?.parentElement;

      sectionDiv?.remove();

      // ลบข้อมูล Section

      this.sectionRefs = this.sectionRefs.filter(
        (sec) => sec.sectionIndex !== sectionIndex,
      );
    }
  }

  // เพิ่ม Input ใน Section

  addInput(sectionIndex: number) {
    const section = this.sectionRefs.find(
      (sec) => sec.sectionIndex === sectionIndex,
    );

    if (section) {
      const inputsContainer = document.getElementById(
        `inputs-container-${sectionIndex}`,
      );

      if (!inputsContainer) {
        console.error(`Inputs container for section ${sectionIndex} not found`);

        return;
      }

      // สร้าง Component Input ใหม่

      const factory = this.resolver.resolveComponentFactory(
        DynamicInputComponent,
      );

      const inputRef = this.sectionContainer.createComponent(factory);

      inputRef.instance.index = section.inputs.length + 1; // ตั้งค่า Index

      inputRef.instance.sectionIndex = sectionIndex; // กำหนด Section Index

      inputRef.instance.valueChange.subscribe(() =>
        this.updateSectionTotal(sectionIndex),
      );

      inputRef.instance.remove.subscribe(() =>
        this.removeInput(sectionIndex, inputRef),
      );

      inputsContainer.appendChild(inputRef.location.nativeElement);

      section.inputs.push(inputRef);

      this.updateSectionTotal(sectionIndex);
    }
  }

  // ลบ Input และอัปเดต Total

  removeInput(
    sectionIndex: number,

    inputRef: ComponentRef<DynamicInputComponent>,
  ) {
    const section = this.sectionRefs.find(
      (sec) => sec.sectionIndex === sectionIndex,
    );

    if (section) {
      const index = section.inputs.indexOf(inputRef);

      if (index !== -1) {
        section.inputs.splice(index, 1);

        inputRef.destroy();

        // รีเซ็ตหมายเลข Index ใหม่

        section.inputs.forEach((input, idx) => {
          input.instance.index = idx + 1;
        });

        this.updateSectionTotal(sectionIndex);
      }
    }
  }

  // อัปเดต Total สำหรับ Section ที่ระบุ

  private updateSectionTotal(sectionIndex: number) {
    const section = this.sectionRefs.find(
      (sec) => sec.sectionIndex === sectionIndex,
    );

    if (section) {
      section.total = section.inputs.reduce(
        (sum, input) => sum + (input.instance.value || 0),

        0,
      );

      const totalDisplay = document.getElementById(
        `total-display-${sectionIndex}`,
      );

      if (totalDisplay) {
        totalDisplay.textContent = `Total: ${section.total}`;
      }
    }
  }
}
