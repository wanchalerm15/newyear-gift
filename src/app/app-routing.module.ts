import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SocketGuard } from './guards/socket.guard';
import { ManagerComponent } from './manager/manager.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [SocketGuard] },
  { path: 'add', component: ManagerComponent, canActivate: [SocketGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
