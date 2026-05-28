/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DatabaseState, Pedido, DetallePedido, PlatilloMenu, Usuario } from '../types';
import { ChefHat, Flame, Clock, Sparkles, CheckCircle2, Play, Bell } from 'lucide-react';

interface ChefPanelProps {
  db: DatabaseState;
  currentUser: Usuario;
  onUpdateDb: (newDb: DatabaseState) => void;
}

export default function ChefPanel({ db, currentUser, onUpdateDb }: ChefPanelProps) {
  
  // Transition order state in our relational database table
  const moveOrderState = (pedidoId: string, newState: 'No preparado' | 'En proceso' | 'Hecho' | 'Entregado') => {
    const updatedPedidos = db.pedidos.map((p) => {
      if (p.id === pedidoId) {
        // If unassigned, auto assign this chef to the order to fulfill the ticket preparation rule!
        const updatedChef = p.cocinero_id ? p.cocinero_id : currentUser.id;
        return {
          ...p,
          estado: newState,
          cocinero_id: updatedChef,
        };
      }
      return p;
    });

    onUpdateDb({
      ...db,
      pedidos: updatedPedidos
    });
  };

  // Helper to fetch details of a specific order
  const getOrderSummaryHTML = (pedidoId: string) => {
    const details = db.detalles_pedido.filter((d) => d.pedido_id === pedidoId);
    return details.map((d) => {
      const p = db.platillos_menu.find((plat) => plat.id === d.platillo_id);
      return (
        <div key={d.id} className="text-xs text-purple-950 font-medium">
          • <strong className="text-purple-700">{d.cantidad}x</strong> {p?.item || 'Taco Secreto'}
        </div>
      );
    });
  };

  // Filter orders by assigned to this chef OR unassigned, excluding delivered ones
  const activeOrders = db.pedidos.filter((p) => {
    const isAssignedToMe = p.cocinero_id === currentUser.id;
    return (currentUser.rol === 'Administrador' || isAssignedToMe) && p.estado !== 'Entregado';
  });

  // Split into columns
  const noPreparados = activeOrders.filter((p) => p.estado === 'No preparado');
  const enProceso = activeOrders.filter((p) => p.estado === 'En proceso');
  const hechos = activeOrders.filter((p) => p.estado === 'Hecho');

  return (
    <div className="space-y-6">

      {/* Chef Profile Intro Banner */}
      <div className="bg-white border border-purple-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <div className="w-14 h-14 bg-purple-100 rounded-full border border-purple-200 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            🐾🍳
          </div>
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-display font-semibold text-slate-800 leading-tight">
              Estación de Sazón Felino: {currentUser.nombre} 👨‍🍳
            </h2>
            <p className="text-xs font-medium text-slate-500">
              Cocina activa: {currentUser.rol} de Cat-Cos • Preparando con puro amor e higiene gatuna.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="bg-purple-50/50 border border-purple-150 px-4 py-2 rounded-2xl text-center min-w-[80px]">
            <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Pendientes</div>
            <div className="text-base font-bold text-slate-700 mt-0.5">{noPreparados.length}</div>
          </div>
          <div className="bg-purple-50/50 border border-purple-150 px-4 py-2 rounded-2xl text-center min-w-[80px]">
            <div className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider">En Fuego</div>
            <div className="text-base font-bold text-yellow-600 mt-0.5 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-yellow-500 animate-pulse" /> {enProceso.length}
            </div>
          </div>
          <div className="bg-purple-50/50 border border-purple-150 px-4 py-2 rounded-2xl text-center min-w-[80px]">
            <div className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Listos</div>
            <div className="text-base font-bold text-green-600 mt-0.5">{hechos.length}</div>
          </div>
        </div>
      </div>

      {/* Main KANBAN Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1: NO PREPARADO */}
        <div className="bg-white rounded-3xl border border-purple-200 p-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-purple-100">
            <span className="flex items-center gap-1.5 font-bold text-xs text-slate-700 uppercase tracking-widest">
              ❌ No preparado ({noPreparados.length})
            </span>
            <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-ping"></span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
            {noPreparados.map((order) => {
              const waiter = db.usuarios.find(u => u.id === order.mesero_id);
              return (
                <div key={order.id} className="bg-white border border-purple-100 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
                  <div className="flex justify-between items-start pl-1">
                    <div>
                      <span className="font-mono text-[9px] font-bold text-purple-600 mr-2 bg-purple-50 px-1.5 py-0.5 rounded">
                        {order.id.toUpperCase()}
                      </span>
                      <span className="font-bold text-slate-700 text-xs uppercase">
                        {order.mesa_o_linea === 'Mesa' ? `Mesa ${order.numero_mesa}` : 'En Línea'}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-400" /> {new Date(order.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="bg-purple-50/30 p-2.5 rounded-xl border border-purple-100 space-y-1">
                    {getOrderSummaryHTML(order.id)}
                  </div>

                  <div className="pt-2 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-500 font-medium pl-1">
                    <span>Mesero: <strong className="text-slate-700">{waiter?.nombre || 'Default'}</strong></span>
                    <button
                      onClick={() => moveOrderState(order.id, 'En proceso')}
                      className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-[10px] uppercase rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" /> Preparar
                    </button>
                  </div>
                </div>
              );
            })}

            {noPreparados.length === 0 && (
              <div className="text-center py-12 text-xs text-slate-400">
                🍵 ¡Bandeja limpia! No hay tacos pendientes.
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 2: EN PROCESO */}
        <div className="bg-white rounded-3xl border border-purple-200 p-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-purple-100">
            <span className="flex items-center gap-1.5 font-bold text-xs text-yellow-700 uppercase tracking-widest">
              🔥 En proceso ({enProceso.length})
            </span>
            <Flame className="w-4 h-4 text-yellow-500 animate-pulse" />
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
            {enProceso.map((order) => {
              const waiter = db.usuarios.find(u => u.id === order.mesero_id);
              return (
                <div key={order.id} className="bg-white border border-purple-100 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-yellow-450 bg-yellow-400"></div>
                  <div className="flex justify-between items-start pl-1">
                    <div>
                      <span className="font-mono text-[9px] font-bold text-purple-600 mr-2 bg-purple-50 px-1.5 py-0.5 rounded">
                        {order.id.toUpperCase()}
                      </span>
                      <span className="font-bold text-slate-700 text-xs uppercase">
                        {order.mesa_o_linea === 'Mesa' ? `Mesa ${order.numero_mesa}` : 'En Línea'}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-amber-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Fuego Activo
                    </span>
                  </div>

                  <div className="bg-yellow-50/20 p-2.5 rounded-xl border border-yellow-100/50 space-y-1">
                    {getOrderSummaryHTML(order.id)}
                  </div>

                  <div className="pt-2 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-500 font-medium pl-1">
                    <span>Mesero: <strong className="text-slate-700">{waiter?.nombre || 'Default'}</strong></span>
                    <button
                      onClick={() => moveOrderState(order.id, 'Hecho')}
                      className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] uppercase rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Bell className="w-3 h-3" /> Hecho
                    </button>
                  </div>
                </div>
              );
            })}

            {enProceso.length === 0 && (
              <div className="text-center py-12 text-xs text-yellow-500 font-semibold">
                🍳 Ningún taco en el comal ahora mismo.
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 3: HECHO */}
        <div className="bg-white rounded-3xl border border-purple-200 p-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-purple-100">
            <span className="flex items-center gap-1.5 font-bold text-xs text-green-700 uppercase tracking-widest">
              ✅ Hecho / Listo ({hechos.length})
            </span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
            {hechos.map((order) => {
              const waiter = db.usuarios.find(u => u.id === order.mesero_id);
              return (
                <div key={order.id} className="bg-white border border-purple-100 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-400"></div>
                  <div className="flex justify-between items-start pl-1">
                    <div>
                      <span className="font-mono text-[9px] font-bold text-purple-600 mr-2 bg-purple-50 px-1.5 py-0.5 rounded">
                        {order.id.toUpperCase()}
                      </span>
                      <span className="font-bold text-slate-700 text-xs uppercase">
                        {order.mesa_o_linea === 'Mesa' ? `Mesa ${order.numero_mesa}` : 'En Línea'}
                      </span>
                    </div>
                    <span className="text-[9px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200 uppercase">
                      Listo
                    </span>
                  </div>

                  <div className="bg-green-50/20 p-2.5 rounded-xl border border-green-150 space-y-1">
                    {getOrderSummaryHTML(order.id)}
                  </div>

                  <div className="pt-2 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-400 pl-1">
                    <span>Mesa / Línea asignada</span>
                    <span className="text-[10px] text-purple-500 italic font-medium">
                      Listo en mesa
                    </span>
                  </div>
                </div>
              );
            })}

            {hechos.length === 0 && (
              <div className="text-center py-12 text-xs text-slate-400">
                🔔 Aún no hay tacos calientes esperando entrega.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
