import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { v4 as uuid } from 'uuid';

export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  costo: number;
  precio: number;
  valor: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private productos: Producto[] = [];
  constructor() {
    const raw = localStorage.getItem('productos');
    this.productos = raw
      ? JSON.parse(raw)
      : [
          {
            id: uuid(),
            codigo: 'PRD001',
            nombre: 'Hamburguesa',
            costo: 100,
            precio: 150,
            valor: 50,
          },
          {
            id: uuid(),
            codigo: 'PRD002',
            nombre: 'Papas Fritas',
            costo: 50,
            precio: 75,
            valor: 25,
          },
        ];
  }

  private guardar() {
    localStorage.setItem('productos', JSON.stringify(this.productos));
  }

  listar() {
    return of(this.productos).pipe(delay(500));
  }

  agregar(producto: Producto) {
    producto.id = uuid();
    this.productos.push(producto);
    this.guardar();
    return of(producto).pipe(delay(400));
  }
  actualizar(producto: Producto) {
    const idx = this.productos.findIndex((p) => p.id === producto.id);
    if (idx >= 0) this.productos[idx] = producto;
    this.guardar();
    return of(producto).pipe(delay(400));
  }
  eliminar(id: string) {
    this.productos = this.productos.filter((p) => p.id !== id);
    this.guardar();
    return of(true).pipe(delay(300));
  }
}
