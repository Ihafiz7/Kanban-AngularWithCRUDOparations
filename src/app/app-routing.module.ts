import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateNewProjectComponent } from './components/create-new-project/create-new-project.component';
import { MainHomeComponent } from './components/main-home/main-home.component';
import { BoardComponent } from './components/board/board.component';

const routes: Routes = [
  { path: '', redirectTo:'/home',pathMatch:'full'},
  { path: 'home', component: MainHomeComponent},
  { path: 'login', component: CreateNewProjectComponent},
  { path: 'kanban', component: BoardComponent},
  { path: 'login', component: CreateNewProjectComponent},
  { path: '**', component: MainHomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
