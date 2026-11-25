import { Component, computed, input, output, signal } from '@angular/core';
import { Producto } from '../../models/producto';
import { PACK_FAMILIAR, SABORES, precioPackFamiliar } from '../../data/productos';
import { ClpPipe } from '../../pipes/clp.pipe';
import { Icono } from '../icono/icono';
import { MojitoIlustracion } from '../mojito-ilustracion/mojito-ilustracion';

export interface SeleccionPromo {
  /** Producto a agregar (en el Pack Familiar lleva el precio y los litros calculados) */
  producto: Producto;
  /** Ej: ['2 Clásico', '1 Pink'] */
  sabores: string[];
}

@Component({
  selector: 'app-selector-sabores',
  imports: [ClpPipe, Icono, MojitoIlustracion],
  templateUrl: './selector-sabores.html',
  styleUrl: './selector-sabores.scss',
})
export class SelectorSabores {
  readonly promo = input.required<Producto>();
  readonly cerrar = output<void>();
  readonly confirmar = output<SeleccionPromo>();

  protected readonly sabores = SABORES;
  protected readonly cantidades = signal<Record<string, number>>({});

  protected readonly familiar = computed(() => this.promo().variante === 'familiar');
  /** Litros mínimos y máximos que se pueden elegir */
  protected readonly minimo = computed(() =>
    this.familiar() ? PACK_FAMILIAR.minimo : this.promo().litros,
  );
  protected readonly maximo = computed(() => this.promo().litros);

  protected readonly elegidos = computed(() =>
    Object.values(this.cantidades()).reduce((suma, n) => suma + n, 0),
  );
  /** Ya no se pueden agregar más litros */
  protected readonly lleno = computed(() => this.elegidos() >= this.maximo());
  /** Se puede agregar al carrito */
  protected readonly listo = computed(
    () => this.elegidos() >= this.minimo() && this.elegidos() <= this.maximo(),
  );

  // --- Pack Familiar ---
  private readonly clasicos = computed(() => this.cantidad('clasico'));
  private readonly frutales = computed(() => this.elegidos() - this.clasicos());

  /** Precio actual del pack (o de la promo fija) */
  protected readonly precio = computed(() =>
    this.familiar()
      ? precioPackFamiliar(this.clasicos(), this.frutales())
      : this.promo().precio,
  );

  /** Lo que costaría comprando cada litro por separado */
  private readonly precioNormal = computed(() =>
    this.sabores.reduce((suma, sabor) => suma + sabor.precio * this.cantidad(sabor.id), 0),
  );

  protected readonly ahorro = computed(() => {
    const precio = this.precio();
    return precio ? this.precioNormal() - precio : 0;
  });

  protected readonly porLitro = computed(() => {
    const precio = this.precio();
    return precio ? Math.round(precio / this.elegidos()) : 0;
  });

  /** Cuánto baja cada litro si agrega uno más (para incentivar) */
  protected readonly bajaPorLitro = computed(() => {
    const actual = PACK_FAMILIAR.precioPorLitro[this.elegidos()];
    const siguiente = PACK_FAMILIAR.precioPorLitro[this.elegidos() + 1];
    return actual && siguiente ? actual.clasico - siguiente.clasico : 0;
  });

  cantidad(id: string): number {
    return this.cantidades()[id] ?? 0;
  }

  cambiar(id: string, delta: number): void {
    const nueva = this.cantidad(id) + delta;
    if (nueva < 0 || (delta > 0 && this.lleno())) return;
    this.cantidades.update((c) => ({ ...c, [id]: nueva }));
  }

  agregar(): void {
    if (!this.listo()) return;
    const lista = this.sabores
      .filter((sabor) => this.cantidad(sabor.id) > 0)
      .map((sabor) => `${this.cantidad(sabor.id)} ${sabor.nombre.replace('Mojojito ', '')}`);

    const promo = this.promo();
    const producto: Producto = this.familiar()
      ? {
          ...promo,
          nombre: `${promo.nombre} ${this.elegidos()} litros`,
          precio: this.precio()!,
          litros: this.elegidos(),
          etiqueta: `${this.elegidos()} litros`,
        }
      : promo;

    this.confirmar.emit({ producto, sabores: lista });
  }
}