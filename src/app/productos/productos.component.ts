import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProductosService, Producto } from '../services/productos.service';
import { v4 as uuid } from 'uuid';
import {
  codigoProductoValidator,
  precioRangoValidator,
  nombreMinimoValidator,
  costoValidoValidator,
} from '../validators/products.validator';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  formulario!: FormGroup;
  editando = false;
  cargando = false;
  displayedColumns: string[] = [
    'codigo',
    'nombre',
    'costo',
    'precio',
    'valor',
    'acciones',
  ];

  constructor(private productosSrv: ProductosService) {}

  ngOnInit() {
    this.inicializarFormulario();
    this.configurarValorReactivo(); // ⬅️ cálculo automático de "valor"
    this.cargarProductos();
  }

  inicializarFormulario() {
    this.formulario = new FormGroup({
      id: new FormControl(uuid()),
      codigo: new FormControl('', [
        Validators.required,
        codigoProductoValidator,
      ]),
      nombre: new FormControl('', [Validators.required, nombreMinimoValidator]),
      costo: new FormControl(0, [Validators.required, costoValidoValidator]),
      precio: new FormControl(0, [Validators.required, precioRangoValidator]),
      valor: new FormControl(0), // control incluido en el form
    });
  }

  /** Mantiene valor = precio - costo, pero:
   *  - Respeta el valor del backend al hacer editar() (patchValue con emitEvent:false)
   *  - Recalcula solo cuando el usuario cambia costo o precio
   */
  private configurarValorReactivo() {
    const costoCtrl = this.formulario.get('costo') as FormControl;
    const precioCtrl = this.formulario.get('precio') as FormControl;
    const valorCtrl = this.formulario.get('valor') as FormControl;

    const recalcular = () => {
      const costo = Number(costoCtrl.value) || 0;
      const precio = Number(precioCtrl.value) || 0;
      const nuevoValor = +(precio - costo).toFixed(2);
      // Actualizamos sin disparar ciclos (ni valueChanges)
      valorCtrl.patchValue(nuevoValor, { emitEvent: false });
    };

    // Suscribimos a cambios del usuario
    costoCtrl.valueChanges.subscribe(() => {
      // Solo recalcula si NO estamos haciendo patchValue de edición
      if (!this.editando || this.usuarioTocoCampos()) recalcular();
    });
    precioCtrl.valueChanges.subscribe(() => {
      if (!this.editando || this.usuarioTocoCampos()) recalcular();
    });
  }

  /** Heurística simple: si hay touched en alguno, asumimos interacción del usuario */
  private usuarioTocoCampos(): boolean {
    return (
      this.formulario.get('costo')?.touched === true ||
      this.formulario.get('precio')?.touched === true
    );
  }

  cargarProductos() {
    this.cargando = true;
    this.productosSrv.listar().subscribe((data) => {
      this.productos = data;
      this.cargando = false;
    });
  }

  guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    // ya viene calculado en el control "valor"
    const producto = this.formulario.value as Producto;

    if (this.editando) {
      this.productosSrv.actualizar(producto).subscribe(() => {
        this.cargarProductos();
        this.cancelar();
      });
    } else {
      producto.id = uuid();
      this.productosSrv.agregar(producto).subscribe((data) => {
        this.productos.push(data);
        this.cancelar();
      });
    }
  }

  editar(producto: Producto) {
    // Respetar valor del backend: NO recalcular al cargar
    this.formulario.patchValue(producto, { emitEvent: false });
    this.editando = true;
  }

  eliminar(id: string) {
    if (!confirm('¿Eliminar producto?')) return;
    this.productosSrv.eliminar(id).subscribe(() => this.cargarProductos());
  }

  cancelar() {
    this.editando = false;
    this.inicializarFormulario();
  }

  // Getters para acceder a los controles en el HTML
  get codigo() {
    return this.formulario.get('codigo')!;
  }
  get nombre() {
    return this.formulario.get('nombre')!;
  }
  get costo() {
    return this.formulario.get('costo')!;
  }
  get precio() {
    return this.formulario.get('precio')!;
  }
}
