import { Producto } from '../models/producto';

/**
 * PACK FAMILIAR: de 6 a 10 litros, el cliente elige los sabores.
 * Precio por litro según el tamaño del pack: mientras más litros, más barato cada uno.
 * El Clásico sale más barato que los sabores frutales, igual que en la carta.
 * Para cambiar precios, edita solo esta tabla.
 */
export const PACK_FAMILIAR = {
  minimo: 6,
  maximo: 10,
  precioPorLitro: {
    6: { clasico: 4790, sabor: 5990 },
    7: { clasico: 4690, sabor: 5890 },
    8: { clasico: 4590, sabor: 5790 },
    9: { clasico: 4490, sabor: 5690 },
    10: { clasico: 4390, sabor: 5590 },
  } as Record<number, { clasico: number; sabor: number }>,
};

/** Precio del Pack Familiar (termina en 90), o null si la cantidad está fuera de 6 a 10 */
export function precioPackFamiliar(clasicos: number, sabores: number): number | null {
  const tarifa = PACK_FAMILIAR.precioPorLitro[clasicos + sabores];
  if (!tarifa) return null;
  const total = clasicos * tarifa.clasico + sabores * tarifa.sabor;
  return Math.ceil(total / 100) * 100 - 10;
}

export const SABORES: Producto[] = [
  {
    id: 'clasico',
    nombre: 'Mojojito Clásico',
    descripcion: 'Limón + menta',
    precio: 5990,
    imagen: 'productos/mojojito-clasico.webp',
    color: '#b7e84b',
    tipo: 'sabor',
    litros: 1,
  },
  {
    id: 'pink',
    nombre: 'Mojojito Pink',
    descripcion: 'Frutilla + limón + menta',
    precio: 6990,
    imagen: 'productos/mojojito-pink.webp',
    color: '#ff6b9a',
    tipo: 'sabor',
    litros: 1,
  },
  {
    id: 'passion',
    nombre: 'Mojojito Passion',
    descripcion: 'Maracuyá + limón + menta',
    precio: 6990,
    imagen: 'productos/mojojito-passion.webp',
    color: '#ffc93c',
    tipo: 'sabor',
    litros: 1,
  },
  {
    id: 'berry',
    nombre: 'Mojojito Berry',
    descripcion: 'Frambuesa + limón + menta',
    precio: 6990,
    imagen: 'productos/mojojito-berry.webp',
    color: '#d63a6a',
    tipo: 'sabor',
    litros: 1,
  },
  {
    id: 'mango',
    nombre: 'Mojojito Mango',
    descripcion: 'Mango + limón + menta',
    precio: 6990,
    imagen: 'productos/mojojito-mango.webp',
    color: '#ff8b45',
    tipo: 'sabor',
    litros: 1,
  },
];

export const PROMOCIONES: Producto[] = [
  {
    id: 'duo-clasico',
    nombre: 'Dúo Clásico',
    descripcion: '2 litros de Mojojito Clásico',
    precio: 10990,
    imagen: 'productos/duo-mojojitos.webp',
    color: '#b7e84b',
    tipo: 'promo',
    litros: 2,
    etiqueta: '2 litros',
    variante: 'clasico',
  },
  {
    id: 'duo-sabores',
    nombre: 'Dúo Sabores',
    descripcion: '¡Combina 2 sabores frutales!',
    precio: 12490,
    imagen: 'productos/duo-mojojitos.webp',
    color: '#ff6b9a',
    tipo: 'promo',
    litros: 2,
    etiqueta: '2 litros',
    variante: 'sabores',
  },
  {
    id: 'junta-clasica',
    nombre: 'La Junta Clásica',
    descripcion: '4 litros de Mojojito Clásico',
    precio: 19990,
    imagen: 'productos/pack-la-junta.webp',
    color: '#b7e84b',
    tipo: 'promo',
    litros: 4,
    etiqueta: '4 litros',
    variante: 'clasico',
  },
  {
    id: 'junta-sabores',
    nombre: 'La Junta Sabores',
    descripcion: '¡Elige 4 sabores frutales!',
    precio: 24990,
    imagen: 'productos/pack-la-junta.webp',
    color: '#ff8b45',
    tipo: 'promo',
    litros: 4,
    etiqueta: '4 litros',
    variante: 'sabores',
  },
  {
    id: 'pack-familiar',
    nombre: 'Pack Familiar',
    descripcion: 'Arma tu pack de 6 a 10 litros con los sabores que quieras',
    // Precio "desde": 6 litros de Clásico
    precio: precioPackFamiliar(PACK_FAMILIAR.minimo, 0)!,
    imagen: 'productos/pack-la-junta.webp',
    color: '#b7e84b',
    tipo: 'promo',
    litros: PACK_FAMILIAR.maximo,
    etiqueta: '6 a 10 litros',
    variante: 'familiar',
  },
];