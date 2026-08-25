import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { StudentFormComponent } from './components/student-form/student-form.component';

const routes: Routes = [
  {path: '' , redirectTo:'career-help-desk', pathMatch: 'full'},
  {path:'career-help-desk', component: StudentFormComponent},
  {path: 'confirmation/:name', component: ConfirmComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
