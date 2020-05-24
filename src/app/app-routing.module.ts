import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserListComponent } from './users/user-list/user-list.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { UserUpdateComponent } from './users/user-update/user-update.component';
import { UserDetailsComponent } from './users/user-details/user-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UserListComponent, data: { title: 'Liste de Utilisateurs'} },
  { path: 'user-create', component: UserCreateComponent, data: { title: 'Nouveau Utilisateur' } },
  { path: 'user-update/:id', component: UserUpdateComponent, data: { title: 'Modifier Utilisateur' } },
  { path: 'user-details/:id', component: UserDetailsComponent, data: { title: 'Utilisateur' } }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
