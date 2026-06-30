import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'ubicacion',
    loadChildren: () => import('./ubicacion/ubicacion.module').then( m => m.UbicacionPageModule)
  },
  {
    path: 'historial',
    loadChildren: () => import('./paginas-cliente/historial/historial.module').then( m => m.HistorialPageModule)
  },
  {
    path: 'mascotas',
    loadChildren: () => import('./paginas-cliente/mascotas/mascotas.module').then( m => m.MascotasPageModule)
  },
  
  {
    path: 'ver-veterinarios',
    loadChildren: () => import('./paginas-cliente/ver-veterinarios/ver-veterinarios.module').then( m => m.VerVeterinariosPageModule)
  },
  {
    path: 'gestion-mascotas',
    loadChildren: () => import('./paginas-admin/gestion-mascotas/gestion-mascotas.module').then( m => m.GestionMascotasPageModule)
  },
  {
    path: 'gestion-citas',
    loadChildren: () => import('./paginas-admin/gestion-citas/gestion-citas.module').then( m => m.GestionCitasPageModule)
  },
  {
    path: 'gestion-duenos',
    loadChildren: () => import('./paginas-admin/gestion-duenos/gestion-duenos.module').then( m => m.GestionDuenosPageModule)
  },
  {
    path: 'gestion-veterinarios',
    loadChildren: () => import('./paginas-admin/gestion-veterinarios/gestion-veterinarios.module').then( m => m.GestionVeterinariosPageModule)
  },
  {
    path: 'gestion-estadisticas',
    loadChildren: () => import('./paginas-admin/gestion-estadisticas/gestion-estadisticas.module').then( m => m.GestionEstadisticasPageModule)
  },
  {
    path: 'tab6',
    loadChildren: () => import('./tab6/tab6.module').then( m => m.Tab6PageModule)
  },
  {
    path: 'tab7',
    loadChildren: () => import('./tab7/tab7.module').then( m => m.Tab7PageModule)
  },
  {
    path: 'chat-admin',
    loadChildren: () => import('./paginas-admin/chat-admin/chat-admin.module').then( m => m.ChatAdminPageModule)
  },
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
