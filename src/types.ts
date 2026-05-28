/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Usuario {
  id: string; // Primary Key
  nombre: string;
  correo: string;
  password?: string; // stored securely in plain sight for educational/mock purposes
  rol: 'Mesero' | 'Cocinero' | 'Administrador';
}

export interface PlatilloMenu {
  id: string; // Primary Key
  item: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

export interface Pedido {
  id: string; // Primary Key
  mesero_id: string; // Foreign Key to Usuario.id (Mesero)
  cocinero_id: string | null; // Foreign Key to Usuario.id (Cocinero, can be null until assigned/prepared)
  mesa_o_linea: 'Mesa' | 'En Línea';
  numero_mesa?: string; // Empty if En Línea
  total: number;
  tipo_pago: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  estado: 'No preparado' | 'En proceso' | 'Hecho' | 'Entregado';
  fecha: string; // ISO string
}

export interface DetallePedido {
  id: string; // Primary Key
  pedido_id: string; // Foreign Key to Pedido.id
  platillo_id: string; // Foreign Key to PlatilloMenu.id
  cantidad: number;
  precio_unitario: number;
}

// Complete Relational State structure
export interface DatabaseState {
  usuarios: Usuario[];
  platillos_menu: PlatilloMenu[];
  pedidos: Pedido[];
  detalles_pedido: DetallePedido[];
}

export const SEED_MENUS: PlatilloMenu[] = [
  {
    id: 'platillo_1',
    item: 'Taco al Pastor Dulce',
    descripcion: 'Carne marinada con achiote y especias asadas lentamente al trompo con piñita dulce, cebollita y cilantro.',
    precio: 18.00,
    imagen: 'cat_pastor_taco' // Reference for local generated rendering or fallback
  },
  {
    id: 'platillo_2',
    item: 'Taco de Carnitas Purr-fectas',
    descripcion: 'Deliciosas carnitas de cerdo confitadas en cazo de cobre, jugosas por dentro y crujientes por fuera.',
    precio: 20.00,
    imagen: 'cat_carnitas_taco'
  },
  {
    id: 'platillo_3',
    item: 'Taco de Bistec Felino',
    descripcion: 'Fino corte de bistec de res sazonado y cocinado a la plancha sobre tortillas calientes hechas a mano.',
    precio: 22.00,
    imagen: 'cat_bistec_taco'
  },
  {
    id: 'platillo_4',
    item: 'Volcanes Campechanos',
    descripcion: 'Tortilla tostada con queso asadero fundido, bistec jugoso, longaniza doradita y chicharrón de la casa.',
    precio: 26.00,
    imagen: 'cat_pastor_taco'
  },
  {
    id: 'platillo_5',
    item: 'Quesabrosa Gringa',
    descripcion: 'Doble tortilla de harina gigante, abundante queso derretido y deliciosa carne al pastor con piña.',
    precio: 38.00,
    imagen: 'cat_carnitas_taco'
  },
  {
    id: 'platillo_6',
    item: 'Consomé Gatito Calentito',
    descripcion: 'Caldo de borrego sazonado con garbanzo, arroz, cebolla picada y cilantro fresco. Ideal para apapachar.',
    precio: 28.00,
    imagen: 'cat_bistec_taco'
  }
];

export const SEED_USUARIOS: Usuario[] = [
  {
    id: 'usr_admin',
    nombre: 'Michi Admin',
    correo: 'admin@catcos.com',
    password: 'admin',
    rol: 'Administrador'
  },
  {
    id: 'usr_mesero1',
    nombre: 'Garfield García',
    correo: 'garfield@catcos.com',
    password: '123',
    rol: 'Mesero'
  },
  {
    id: 'usr_mesero2',
    nombre: 'Félix Martínez',
    correo: 'felix@catcos.com',
    password: '123',
    rol: 'Mesero'
  },
  {
    id: 'usr_cocinero1',
    nombre: 'Chef Bigotes',
    correo: 'bigotes@catcos.com',
    password: '123',
    rol: 'Cocinero'
  },
  {
    id: 'usr_cocinero2',
    nombre: 'Tom Guisados',
    correo: 'tom@catcos.com',
    password: '123',
    rol: 'Cocinero'
  }
];

export const SEED_PEDIDOS: Pedido[] = [
  {
    id: 'ped_1',
    mesero_id: 'usr_mesero1',
    cocinero_id: 'usr_cocinero1',
    mesa_o_linea: 'Mesa',
    numero_mesa: '4',
    total: 76.00,
    tipo_pago: 'Efectivo',
    estado: 'Entregado',
    fecha: '2026-05-27T18:30:00Z'
  },
  {
    id: 'ped_2',
    mesero_id: 'usr_mesero2',
    cocinero_id: 'usr_cocinero2',
    mesa_o_linea: 'En Línea',
    total: 58.00,
    tipo_pago: 'Tarjeta',
    estado: 'Hecho',
    fecha: '2026-05-27T23:05:00Z'
  },
  {
    id: 'ped_3',
    mesero_id: 'usr_mesero1',
    cocinero_id: null,
    mesa_o_linea: 'Mesa',
    numero_mesa: '2',
    total: 38.00,
    tipo_pago: 'Transferencia',
    estado: 'No preparado',
    fecha: '2026-05-27T23:45:00Z'
  }
];

export const SEED_DETALLES_PEDIDO: DetallePedido[] = [
  // Del ped_1: 2 pastores (36) + 2 carnitas (40) = 76
  {
    id: 'det_1_1',
    pedido_id: 'ped_1',
    platillo_id: 'platillo_1',
    cantidad: 2,
    precio_unitario: 18.00
  },
  {
    id: 'det_1_2',
    pedido_id: 'ped_1',
    platillo_id: 'platillo_2',
    cantidad: 2,
    precio_unitario: 20.00
  },
  // Del ped_2: 1 bistec (22) + 1 gringa (38) = 58
  {
    id: 'det_2_1',
    pedido_id: 'ped_2',
    platillo_id: 'platillo_3',
    cantidad: 1,
    precio_unitario: 22.00
  },
  {
    id: 'det_2_2',
    pedido_id: 'ped_2',
    platillo_id: 'platillo_5',
    cantidad: 1,
    precio_unitario: 38.00
  },
  // Del ped_3: 1 gringa (38) = 38
  {
    id: 'det_3_1',
    pedido_id: 'ped_3',
    platillo_id: 'platillo_5',
    cantidad: 1,
    precio_unitario: 38.00
  }
];

export const getInitialDatabaseState = (): DatabaseState => {
  const localVal = localStorage.getItem('cat_cos_db');
  if (localVal) {
    try {
      const parsed = JSON.parse(localVal);
      // Validate structure roughly
      if (parsed.usuarios && parsed.platillos_menu && parsed.pedidos && parsed.detalles_pedido) {
        return parsed as DatabaseState;
      }
    } catch (e) {
      console.error('Error parsing Cat-Cos DB', e);
    }
  }

  // Create initial state
  const state: DatabaseState = {
    usuarios: SEED_USUARIOS,
    platillos_menu: SEED_MENUS,
    pedidos: SEED_PEDIDOS,
    detalles_pedido: SEED_DETALLES_PEDIDO
  };
  localStorage.setItem('cat_cos_db', JSON.stringify(state));
  return state;
};

export const saveDatabaseState = (state: DatabaseState) => {
  localStorage.setItem('cat_cos_db', JSON.stringify(state));
};
