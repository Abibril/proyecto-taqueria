/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DatabaseState } from '../types';
import { Database, Key, Link2, Table, HelpCircle, RefreshCw } from 'lucide-react';

interface DBVisualizerProps {
  db: DatabaseState;
  onResetDb: () => void;
}

type TabType = 'diagram' | 'usuarios' | 'menu' | 'pedidos' | 'detalles';

export default function DBVisualizer({ db, onResetDb }: DBVisualizerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('diagram');
  const [hoveredRelation, setHoveredRelation] = useState<string | null>(null);

  const totalUsers = db.usuarios.length;
  const totalMenu = db.platillos_menu.length;
  const totalPedidos = db.pedidos.length;
  const totalDetalles = db.detalles_pedido.length;

  return (
    <div className="bg-white rounded-2xl border border-purple-200/85 p-6 shadow-xs">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-purple-100 pb-4 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100/70">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-display font-medium text-slate-800 flex items-center gap-2">
              Base de Datos Relacional de Cat-Cos 🐾
            </h2>
            <p className="text-xs text-slate-500">
              Visualizador interactivo de Tablas, Llaves Primarias (PK) y Llaves Foráneas (FK)
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (confirm('¿Miau? ¿Deseas reiniciar la base de datos a los valores de fábrica?')) {
              onResetDb();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-650 bg-red-50 hover:bg-red-100/70 border border-red-200/40 rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Restaurar DB Inicial
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('diagram')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            activeTab === 'diagram'
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-purple-50 text-purple-700 border-purple-200/50 hover:bg-purple-105'
          }`}
        >
          🕸️ Diagrama de Relaciones
        </button>
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            activeTab === 'usuarios'
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-purple-50 text-purple-700 border-purple-200/50 hover:bg-purple-105'
          }`}
        >
          👥 Tabla: `usuarios` ({totalUsers})
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            activeTab === 'menu'
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-purple-50 text-purple-700 border-purple-200/50 hover:bg-purple-105'
          }`}
        >
          🌮 Tabla: `platillos_menu` ({totalMenu})
        </button>
        <button
          onClick={() => setActiveTab('pedidos')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            activeTab === 'pedidos'
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-purple-50 text-purple-700 border-purple-200/50 hover:bg-purple-105'
          }`}
        >
          📝 Tabla: `pedidos` ({totalPedidos})
        </button>
        <button
          onClick={() => setActiveTab('detalles')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            activeTab === 'detalles'
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-purple-50 text-purple-700 border-purple-200/50 hover:bg-purple-105'
          }`}
        >
          📊 Tabla: `detalles_pedido` ({totalDetalles})
        </button>
      </div>

      {/* Main visual panel */}
      <div className="bg-purple-50/10 rounded-2xl border border-purple-150 p-5 min-h-[400px]">
        {activeTab === 'diagram' && (
          <div className="space-y-6">
            <div className="bg-purple-100 border border-purple-200 rounded-xl p-3.5 text-xs text-purple-800 flex items-start gap-2.5">
              <HelpCircle className="w-5 h-5 shrink-0 text-purple-600" />
              <div>
                <strong>¿Cómo funciona el esquema de Cat-Cos?</strong> Cada tabla posee una llave principal (<strong>PK - Primary Key</strong>) identificada con un ícono de llave dorada 🔑. Las flechas o uniones representan nuestras llaves foráneas (<strong>FK - Foreign Key</strong>) 🔗 que vinculan los datos (ej: relacionar qué mesero inició qué pedido, o qué platillo pertenece a qué detalle de venta). Pasa el ratón por encima de los enlaces 🔗 para destacar las relaciones.
              </div>
            </div>

            {/* Relations Diagram Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative mt-4">
              
              {/* TABLE USARIOS */}
              <div className="bg-white rounded-xl border border-purple-200 shadow-sm overflow-hidden flex flex-col">
                <div className="bg-purple-600 px-3.5 py-2.5 text-white font-extrabold text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Table className="w-4.5 h-4.5" /> usuarios</span>
                  <span className="bg-purple-800 text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold">Relacional</span>
                </div>
                <div className="p-3 text-xs divide-y divide-purple-50">
                  <div className="py-1.5 flex justify-between items-center bg-yellow-50/80 px-1 rounded">
                    <span className="font-mono text-purple-950 font-semibold flex items-center gap-1">
                      <Key className="w-3 h-3 text-yellow-600" /> id
                    </span>
                    <span className="text-[10px] text-yellow-800 font-extrabold uppercase">PK varchar</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="font-mono text-gray-700 pl-4">nombre</span>
                    <span className="text-[10px] text-gray-400">varchar</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="font-mono text-gray-700 pl-4">correo</span>
                    <span className="text-[10px] text-gray-400">varchar</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="font-mono text-gray-700 pl-4">password</span>
                    <span className="text-[10px] text-gray-400">varchar</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="font-mono text-purple-800 font-bold pl-4">rol</span>
                    <span className="text-[10px] text-purple-500 font-semibold">enum</span>
                  </div>
                </div>
                <div className="p-2 bg-purple-50 border-t border-purple-100 text-center text-[10px] text-purple-600 italic">
                  Registros: {totalUsers} usuarios
                </div>
              </div>

              {/* TABLE PLATILLOS MENU */}
              <div className="bg-white rounded-xl border border-purple-200 shadow-sm overflow-hidden flex flex-col">
                <div className="bg-purple-600 px-3.5 py-2.5 text-white font-extrabold text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Table className="w-4.5 h-4.5" /> platillos_menu</span>
                  <span className="bg-purple-800 text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold">Relacional</span>
                </div>
                <div className="p-3 text-xs divide-y divide-purple-50">
                  <div className="py-1.5 flex justify-between items-center bg-yellow-50/80 px-1 rounded">
                    <span className="font-mono text-purple-950 font-semibold flex items-center gap-1">
                      <Key className="w-3 h-3 text-yellow-600" /> id
                    </span>
                    <span className="text-[10px] text-yellow-800 font-extrabold uppercase">PK varchar</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="font-mono text-gray-700 pl-4">item</span>
                    <span className="text-[10px] text-gray-400">varchar</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="font-mono text-gray-700 pl-4">descripcion</span>
                    <span className="text-[10px] text-gray-400">text</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="font-mono text-gray-700 pl-4">precio</span>
                    <span className="text-[10px] text-gray-400">decimal</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="font-mono text-gray-700 pl-4">imagen</span>
                    <span className="text-[10px] text-gray-400">varchar</span>
                  </div>
                </div>
                <div className="p-2 bg-purple-50 border-t border-purple-100 text-center text-[10px] text-purple-600 italic">
                  Registros: {totalMenu} tacos/bebidas
                </div>
              </div>

              {/* TABLE PEDIDOS */}
              <div className="bg-white rounded-xl border border-purple-200 shadow-sm overflow-hidden flex flex-col relative">
                {/* Visual Connector Lines Highlights for UI */}
                <div className="bg-purple-600 px-3.5 py-2.5 text-white font-extrabold text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Table className="w-4.5 h-4.5" /> pedidos</span>
                  <span className="bg-purple-800 text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold">Relacional</span>
                </div>
                <div className="p-3 text-xs divide-y divide-purple-50">
                  <div className="py-1.5 flex justify-between items-center bg-yellow-50/80 px-1 rounded">
                    <span className="font-mono text-purple-950 font-semibold flex items-center gap-1">
                      <Key className="w-3 h-3 text-yellow-600" /> id
                    </span>
                    <span className="text-[10px] text-yellow-800 font-extrabold uppercase">PK varchar</span>
                  </div>

                  <div 
                    onMouseEnter={() => setHoveredRelation('mesero_id')}
                    onMouseLeave={() => setHoveredRelation(null)}
                    className={`py-1.5 flex justify-between items-center px-1 rounded transition-colors cursor-help ${
                      hoveredRelation === 'mesero_id' ? 'bg-purple-200 text-purple-950' : 'bg-purple-50 text-purple-900'
                    }`}
                  >
                    <span className="font-mono font-bold flex items-center gap-1 pl-2">
                      <Link2 className="w-3 h-3 text-purple-600" /> mesero_id
                    </span>
                    <span className="text-[9px] font-extrabold uppercase bg-purple-200 text-purple-800 px-1 rounded">
                      FK ➜ usuarios
                    </span>
                  </div>

                  <div 
                    onMouseEnter={() => setHoveredRelation('cocinero_id')}
                    onMouseLeave={() => setHoveredRelation(null)}
                    className={`py-1.5 flex justify-between items-center px-1 rounded transition-colors cursor-help ${
                      hoveredRelation === 'cocinero_id' ? 'bg-purple-200 text-purple-950' : 'bg-purple-50 text-purple-900'
                    }`}
                  >
                    <span className="font-mono font-bold flex items-center gap-1 pl-2">
                      <Link2 className="w-3 h-3 text-purple-600" /> cocinero_id
                    </span>
                    <span className="text-[9px] font-extrabold uppercase bg-purple-200 text-purple-800 px-1 rounded">
                      FK ➜ usuarios
                    </span>
                  </div>

                  <div className="py-1.5 flex justify-between">
                    <span className="font-mono text-gray-700 pl-4">mesa_o_linea</span>
                    <span className="text-[10px] text-gray-400">enum</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="font-mono text-gray-700 pl-4">numero_mesa</span>
                    <span className="text-[10px] text-gray-400">varchar</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="font-mono text-gray-700 pl-4">total</span>
                    <span className="text-[10px] text-gray-400 font-semibold">decimal</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="font-mono text-gray-700 pl-4">tipo_pago</span>
                    <span className="text-[10px] text-gray-400">enum</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="font-mono text-gray-700 pl-4">estado</span>
                    <span className="text-[10px] text-gray-400">enum</span>
                  </div>
                </div>
                <div className="p-2 bg-purple-50 border-t border-purple-100 text-center text-[10px] text-purple-600 italic">
                  Registros: {totalPedidos} pedidos
                </div>
              </div>

              {/* TABLE DETALLES PEDIDO */}
              <div className="bg-white rounded-xl border border-purple-200 shadow-sm overflow-hidden flex flex-col">
                <div className="bg-purple-600 px-3.5 py-2.5 text-white font-extrabold text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Table className="w-4.5 h-4.5" /> detalles_pedido</span>
                  <span className="bg-purple-800 text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold">Relacional</span>
                </div>
                <div className="p-3 text-xs divide-y divide-purple-50">
                  <div className="py-1.5 flex justify-between items-center bg-yellow-50/80 px-1 rounded">
                    <span className="font-mono text-purple-950 font-semibold flex items-center gap-1">
                      <Key className="w-3 h-3 text-yellow-600" /> id
                    </span>
                    <span className="text-[10px] text-yellow-800 font-extrabold uppercase">PK varchar</span>
                  </div>

                  <div 
                    onMouseEnter={() => setHoveredRelation('pedido_id')}
                    onMouseLeave={() => setHoveredRelation(null)}
                    className={`py-1.5 flex justify-between items-center px-1 rounded transition-colors cursor-help ${
                      hoveredRelation === 'pedido_id' ? 'bg-purple-200 text-purple-950' : 'bg-purple-50 text-purple-900'
                    }`}
                  >
                    <span className="font-mono font-bold flex items-center gap-1 pl-2">
                      <Link2 className="w-3 h-3 text-purple-600" /> pedido_id
                    </span>
                    <span className="text-[9px] font-extrabold uppercase bg-purple-200 text-purple-800 px-1 rounded">
                      FK ➜ pedidos
                    </span>
                  </div>

                  <div 
                    onMouseEnter={() => setHoveredRelation('platillo_id')}
                    onMouseLeave={() => setHoveredRelation(null)}
                    className={`py-1.5 flex justify-between items-center px-1 rounded transition-colors cursor-help ${
                      hoveredRelation === 'platillo_id' ? 'bg-purple-200 text-purple-950' : 'bg-purple-50 text-purple-900'
                    }`}
                  >
                    <span className="font-mono font-bold flex items-center gap-1 pl-2">
                      <Link2 className="w-3 h-3 text-purple-600" /> platillo_id
                    </span>
                    <span className="text-[9px] font-extrabold uppercase bg-purple-200 text-purple-800 px-1 rounded">
                      FK ➜ platillos
                    </span>
                  </div>

                  <div className="py-1.5 flex justify-between col-span-2">
                    <span className="font-mono text-gray-700 pl-4">cantidad</span>
                    <span className="text-[10px] text-gray-400">integer</span>
                  </div>
                  <div className="py-1.5 flex justify-between col-span-2">
                    <span className="font-mono text-gray-700 pl-4">precio_unitario</span>
                    <span className="text-[10px] text-gray-400">decimal</span>
                  </div>
                </div>
                <div className="p-2 bg-purple-50 border-t border-purple-100 text-center text-[10px] text-purple-600 italic">
                  Registros: {totalDetalles} detalles
                </div>
              </div>

            </div>

            {/* Relation Summary box */}
            <div className="bg-white rounded-xl border border-purple-100 p-4 mt-4 shadow-inner">
              <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                🔗 Integridad de Llaves Foráneas Activas
              </h4>
              <ul className="text-xs text-purple-700 space-y-1 bg-purple-50/50 p-3 rounded-lg border border-purple-100">
                <li className="flex items-center gap-2">
                  <span className="text-purple-500 font-bold">✔</span> 
                  <code>pedidos.mesero_id</code> se enlaza con <code>usuarios.id</code> de rol <i>Mesero</i> o <i>Administrador</i>.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500 font-bold">✔</span> 
                  <code>pedidos.cocinero_id</code> se enlaza con <code>usuarios.id</code> de rol <i>Cocinero</i> (cuando toma el pedido).
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500 font-bold">✔</span> 
                  <code>detalles_pedido.pedido_id</code> se enlaza con la llave primaria de <code>pedidos.id</code>.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500 font-bold">✔</span> 
                  <code>detalles_pedido.platillo_id</code> se conecta con <code>platillos_menu.id</code> para jalar descripciones y precios.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab - usuarios */}
        {activeTab === 'usuarios' && (
          <div className="overflow-x-auto">
            <h3 className="text-sm font-bold text-purple-900 mb-2">Registros de Usuarios en `usuarios`</h3>
            <table className="w-full text-left text-xs text-purple-900 bg-white rounded-xl border border-purple-100 overflow-hidden">
              <thead className="bg-purple-100 text-purple-950 uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-4 py-3">id (PK) 🔑</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Correo Correo</th>
                  <th className="px-4 py-3">Password</th>
                  <th className="px-4 py-3 text-right">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {db.usuarios.map((usr) => (
                  <tr key={usr.id} className="hover:bg-purple-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-purple-700">{usr.id}</td>
                    <td className="px-4 py-3 font-semibold">{usr.nombre}</td>
                    <td className="px-4 py-3 text-purple-600">{usr.correo}</td>
                    <td className="px-4 py-3 font-mono text-purple-450">{usr.password}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                        usr.rol === 'Administrador' ? 'bg-red-100 text-red-700' :
                        usr.rol === 'Cocinero' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {usr.rol}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab - platillos_menu */}
        {activeTab === 'menu' && (
          <div className="overflow-x-auto">
            <h3 className="text-sm font-bold text-purple-900 mb-2">Registros de Menú en `platillos_menu`</h3>
            <table className="w-full text-left text-xs text-purple-900 bg-white rounded-xl border border-purple-100 overflow-hidden">
              <thead className="bg-purple-100 text-purple-950 uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-4 py-3">id (PK) 🔑</th>
                  <th className="px-4 py-3">Nombre del Platillo</th>
                  <th className="px-4 py-3">Descripción</th>
                  <th className="px-4 py-3 text-right">Precio unitario ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {db.platillos_menu.map((menu) => (
                  <tr key={menu.id} className="hover:bg-purple-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-purple-700">{menu.id}</td>
                    <td className="px-4 py-3 font-bold">{menu.item}</td>
                    <td className="px-4 py-3 text-purple-600 line-clamp-2 mt-1">{menu.descripcion}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">${menu.precio.toFixed(2)} MXN</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab - pedidos */}
        {activeTab === 'pedidos' && (
          <div className="overflow-x-auto">
            <h3 className="text-sm font-bold text-purple-900 mb-2">Registros de Pedidos en `pedidos`</h3>
            <table className="w-full text-left text-xs text-purple-900 bg-white rounded-xl border border-purple-100 overflow-hidden">
              <thead className="bg-purple-100 text-purple-950 uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-4 py-3">id (PK) 🔑</th>
                  <th className="px-4 py-3">mesero_id (FK) 🔗</th>
                  <th className="px-4 py-3">cocinero_id (FK) 🔗</th>
                  <th className="px-4 py-3">Destino</th>
                  <th className="px-4 py-3">Método</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Total ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {db.pedidos.map((ped) => (
                  <tr key={ped.id} className="hover:bg-purple-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-purple-700">{ped.id}</td>
                    <td className="px-4 py-3 font-mono text-purple-600">{ped.mesero_id}</td>
                    <td className="px-4 py-3 font-mono text-purple-600">
                      {ped.cocinero_id || <span className="text-gray-400 italic">No asignado</span>}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {ped.mesa_o_linea === 'Mesa' ? `Mesa ${ped.numero_mesa}` : 'En Línea'}
                    </td>
                    <td className="px-4 py-3">{ped.tipo_pago}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-extrabold text-[9px] uppercase ${
                        ped.estado === 'Entregado' ? 'bg-green-150 text-green-700 bg-green-50' :
                        ped.estado === 'Hecho' ? 'bg-blue-100 text-blue-700' :
                        ped.estado === 'En proceso' ? 'bg-yellow-105 bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {ped.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-purple-950">${ped.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab - detalles_pedido */}
        {activeTab === 'detalles' && (
          <div className="overflow-x-auto">
            <h3 className="text-sm font-bold text-purple-900 mb-2">Registros de Detalles de Pedido en `detalles_pedido`</h3>
            <table className="w-full text-left text-xs text-purple-900 bg-white rounded-xl border border-purple-100 overflow-hidden">
              <thead className="bg-purple-100 text-purple-950 uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-4 py-3">id (PK) 🔑</th>
                  <th className="px-4 py-3">pedido_id (FK) 🔗</th>
                  <th className="px-4 py-3">platillo_id (FK) 🔗</th>
                  <th className="px-4 py-3">Cantidad</th>
                  <th className="px-4 py-3 text-right">Precio unitario ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {db.detalles_pedido.map((det) => (
                  <tr key={det.id} className="hover:bg-purple-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-purple-700">{det.id}</td>
                    <td className="px-4 py-3 font-mono text-purple-600">{det.pedido_id}</td>
                    <td className="px-4 py-3 font-mono text-purple-600">{det.platillo_id}</td>
                    <td className="px-4 py-3 font-bold">{det.cantidad} pzs</td>
                    <td className="px-4 py-3 text-right font-mono">${det.precio_unitario.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
