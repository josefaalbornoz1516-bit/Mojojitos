import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROMOCIONES, SABORES } from '../../data/productos';
import { Producto } from '../../models/producto';
import { CarritoService } from '../../services/carrito.service';
import { ClpPipe } from '../../pipes/clp.pipe';
import { Icono } from '../../components/icono/icono';
import { MojitoIlustracion } from '../../components/mojito-ilustracion/mojito-ilustracion';
import { ProductoImagen } from '../../components/producto-imagen/producto-imagen';
import {
  SelectorSabores,
  SeleccionPromo,
} from '../../components/selector-sabores/selector-sabores';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, ClpPipe, Icono, MojitoIlustracion, ProductoImagen, SelectorSabores],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  protected readonly carrito = inject(CarritoService);
  protected readonly sabores = SABORES;
  protected readonly promociones = PROMOCIONES;

  protected readonly promoAbierta = signal<Producto | null>(null);
  protected readonly aviso = signal('');
  private temporizador?: ReturnType<typeof setTimeout>;

  agregarPromo({ producto, sabores }: SeleccionPromo): void {
    this.carrito.agregar(producto, sabores);
    this.promoAbierta.set(null);
    this.mostrarAviso(`${producto.nombre} agregado al carrito`);
  }

  /** Los packs clásicos se agregan directo; los de sabores abren el selector */
  elegirPromo(promo: Producto): void {
    if (promo.variante === 'clasico') {
      this.agregarPromo({ producto: promo, sabores: [`${promo.litros} Clásico`] });
    } else {
      this.promoAbierta.set(promo);
    }
  }

  private mostrarAviso(texto: string): void {
    this.aviso.set(texto);
    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => this.aviso.set(''), 2500);
  }
}