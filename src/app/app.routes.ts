import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicInputComponent } from './dynamic-input/dynamic-input.component';
import { DynamicSectionComponent } from './dynamic-section/dynamic-section.component';

export const routes: Routes = [
  { path: 'dynamic-input', component: DynamicInputComponent },
  { path: 'dynamic-section', component: DynamicSectionComponent },
  { path: '', redirectTo: '/dynamic-section', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/dynamic-section' }, // Wildcard route for unknown paths
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
