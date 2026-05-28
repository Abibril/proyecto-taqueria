/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DatabaseState, PlatilloMenu, Pedido, DetallePedido, Usuario } from '../types';
import { ShoppingBag, Coins, CreditCard, RefreshCw, Plus, Clock, ClipboardList, Send, MapPin, Receipt, Trash2 } from 'lucide-react';
import MenuScreen from './MenuScreen';
import TicketModal from './TicketModal';

interface WaiterPanelProps {
  db: DatabaseState;
  currentUser: Usuario;
  onUpdateDb: (newDb: DatabaseState) => void;
}

export default function WaiterPanel({ db, currentUser, onUpdateDb }: WaiterPanelProps) {
  // Order Configuration State
  const [mesaOLinea, setMesaOLinea] = useState<'Mesa' | 'En Línea'>('Mesa');
  const [numeroMesa, setNumeroMesa] = useState('1');
  const [tipoPago, setTipoPago] = useState<'Efectivo' | 'Tarjeta' | 'Transferencia'>('Efectivo');
  const [cookId, setCookId] = useState<string>(''); // Cook selected for pre-assignment or auto-assigned
  
  // Cart state: keyed by platilloId -> count
  const [cart, setCart] = useState<Record<string, number>>({});
  
  // Selected Order for Ticket Viewer
  const [selectedTicketPedido, setSelectedTicketPedido] = useState<Pedido | null>(null);

  // Filter list of cooks
  const cocineros = db.usuarios.filter((u) => u.rol === 'Cocinero');

  // Set first cook as default if not selected
  React.useEffect(() => {
    if (cocineros.length > 0 && !cookId) {
      setCookId(cocineros[0].id);
    }
  }, [cocineros, cookId]);

  // Cart operations
  const handleAddToOrder = (platillo: PlatilloMenu) => {
    setCart((prev) => ({
      ...prev,
      [platillo.id]: (prev[platillo.id] || 0) + 1,
    }));
  };

  const handleRemoveFromOrder = (platillo: PlatilloMenu) => {
    setCart((prev) => {
      const copy = { ...prev };
      if (copy[platillo.id] > 1) {
        copy[platillo.id] -= 1;
      } else {
        delete copy[platillo.id];
      }
      return copy;
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  // Calculations
  const cartItems = Object.entries(cart).map(([platilloId, qty]) => {
    const platillo = db.platillos_menu.find((p) => p.id === platilloId)!;
    const count = Number(qty);
    return {
      platillo,
      qty: count,
      total: platillo.precio * count,
    };
  });

  const cartTotal = cartItems.reduce((acc, curr) => acc + curr.total, 0);

  // Submit Order to Relational Tables!
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('¡Miau! Agrega al menos un delicioso taco al pedido.');
      return;
    }

    if (!cookId) {
      alert('Por favor registra o selecciona un cocinero para preparar este platillo.');
      return;
    }

    const newPedidoId = `ped_${Date.now()}`;
    
    // 1. Create Pedido record (Primary Key = newPedidoId, FK: mesero_id, cocinero_id)
    const newPedido: Pedido = {
      id: newPedidoId,
      mesero_id: currentUser.id, // Current waiter / admin logs this
      cocinero_id: cookId, // Foreign Key connected to the assigned Cocinero
      mesa_o_linea: mesaOLinea,
      numero_mesa: mesaOLinea === 'Mesa' ? numeroMesa : undefined,
      total: cartTotal,
      tipo_pago: tipoPago,
      estado: 'No preparado', // Starts as "no preparado"
      fecha: new Date().toISOString()
    };

    // 2. Create DetallePedido records (Primary Key = det_ + timestamp + index, FK: pedido_id, platillo_id)
    const newDetalles: DetallePedido[] = cartItems.map((item, idx) => ({
      id: `det_${Date.now()}_${idx}`,
      pedido_id: newPedidoId, // relational Foreign Key!
      platillo_id: item.platillo.id, // relational Foreign Key!
      cantidad: item.qty,
      precio_unitario: item.platillo.precio
    }));

    // Update relational tables in database state
    const updatedDb: DatabaseState = {
      ...db,
      pedidos: [newPedido, ...db.pedidos],
      detalles_pedido: [...db.detalles_pedido, ...newDetalles]
    };

    onUpdateDb(updatedDb);

    // Show ticket right away!
    setSelectedTicketPedido(newPedido);

    // Reset shopping state
    setCart({});
    alert('🐾 ¡Pedido creado perfectamente! Enviado a la mesa del chef.');
  };

  // Waiter delivers order to client ("para que el mesero pueda entregarlos ya sea pedido por linea o en las mesas del cliente")
  const handleDeliverOrder = (pedidoId: string) => {
    const updatedPedidos = db.pedidos.map((ped) => {
      if (ped.id === pedidoId) {
        return { ...ped, estado: 'Entregado' as const };
      }
      return ped;
    });

    onUpdateDb({
      ...db,
      pedidos: updatedPedidos
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* LEFT COLUMN: Menu item grid (for easy selection) */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-purple-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-slate-800 font-display font-bold mb-4">
            <ClipboardList className="w-5 h-5 text-purple-600" />
            <span>Seleccionar Platillos del Menú</span>
          </div>
          <MenuScreen
            menuList={db.platillos_menu}
            onAddToOrder={handleAddToOrder}
            onRemoveFromOrder={handleRemoveFromOrder}
            cartQuantities={cart}
            allowOrdering={true}
          />
        </div>

        {/* Previous Orders & Deliveries tracking */}
        <div className="bg-purple-50/50 rounded-2xl border border-purple-200 p-5">
          <h3 className="text-xs font-display font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            📋 Historial de Mis Pedidos & Estado de Entrega
          </h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Aquí puedes ver el avance de cocina (<i>no preparado, en proceso, hecho</i>) y marcar como <strong>Entregado</strong> cuando esté listo para el cliente.
          </p>

          <div className="space-y-3">
            {db.pedidos.filter(p => currentUser.rol === 'Administrador' || p.mesero_id === currentUser.id).slice(0, 5).map((pedido) => {
              const chef = db.usuarios.find(u => u.id === pedido.cocinero_id);
              const isReady = pedido.estado === 'Hecho';
              const isDelivered = pedido.estado === 'Entregado';

              return (
                <div key={pedido.id} className="bg-white border border-purple-100 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-purple-600">{pedido.id.toUpperCase()}</span>
                      <span className="text-xs text-slate-300">|</span>
                      <span className="text-[10px] font-bold text-slate-600 bg-purple-100/50 px-2.5 py-0.5 rounded-md border border-purple-100">
                        {pedido.mesa_o_linea === 'Mesa' ? `Mesa ${pedido.numero_mesa}` : 'En Línea'}
                      </span>
                      <span className="text-xs text-slate-600 font-bold font-mono">
                        ${pedido.total.toFixed(2)} MXN
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium gap-2 flex flex-wrap">
                      <span>Chef Asignado: <strong className="text-slate-700">{chef?.nombre || 'Ninguno'}</strong></span>
                      <span>•</span>
                      <span>Método: {pedido.tipo_pago}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {/* Status badge */}
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                      isDelivered ? 'bg-green-50 text-green-700 border-green-200' :
                      isReady ? 'bg-blue-50 text-blue-700 border-blue-400 animate-pulse' :
                      pedido.estado === 'En proceso' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {pedido.estado}
                    </span>

                    {/* Deliver Action */}
                    {isReady && (
                      <button
                        onClick={() => handleDeliverOrder(pedido.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] rounded-lg shadow-xs uppercase transition-colors shrink-0 cursor-pointer"
                      >
                        📬 Entregar a Cliente
                      </button>
                    )}

                    {/* View Ticket button */}
                    <button
                      onClick={() => setSelectedTicketPedido(pedido)}
                      className="p-1 px-2 border border-purple-200 text-purple-600 hover:bg-purple-100/60 font-bold rounded-lg text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" /> Ticket
                    </button>
                  </div>
                </div>
              );
            })}

            {db.pedidos.filter(p => currentUser.rol === 'Administrador' || p.mesero_id === currentUser.id).length === 0 && (
              <div className="bg-white border border-purple-100 rounded-xl p-6 text-center text-xs text-slate-400">
                Aún no has registrado pedidos el día de hoy. ¡Empieza a cargar uno arriba! 🐱🌮
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Active Cart and Order Dispatch */}
      <div className="lg:col-span-4">
        <div className="bg-white rounded-2xl border border-purple-200 p-6 shadow-sm sticky top-6 space-y-6">
          
          <div className="border-b border-purple-100 pb-3 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 uppercase tracking-wide">
              <ShoppingBag className="w-4 h-4 text-purple-600" /> Cart Actual 🐾
            </h3>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-xs font-semibold text-red-500 hover:text-red-700 cursor-pointer flex items-center gap-0.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Vaciar
              </button>
            )}
          </div>

          {/* Cart item display */}
          <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.platillo.id} className="flex justify-between items-center bg-purple-50/20 p-2.5 rounded-xl border border-purple-100">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-700">{item.platillo.item}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {item.qty} x ${item.platillo.precio.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800">${item.total.toFixed(2)}</span>
                  <div className="flex items-center bg-white border border-purple-200 rounded-lg overflow-hidden shrink-0 p-0.5">
                    <button
                      onClick={() => handleRemoveFromOrder(item.platillo)}
                      className="p-1 px-1.5 text-purple-600 hover:bg-purple-100 cursor-pointer text-xs font-bold"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleAddToOrder(item.platillo)}
                      className="p-1 px-1.5 text-purple-600 hover:bg-purple-100 cursor-pointer text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {cartItems.length === 0 && (
              <div className="py-8 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
                <ShoppingBag className="w-8 h-8 animate-pulse text-purple-200" />
                <p className="text-xs font-medium">No hay platillos en la bandeja.</p>
                <p className="text-[10px] text-slate-400">Selecciona tacos del menú para armar la orden.</p>
              </div>
            )}
          </div>

          {/* Order settings Form */}
          {cartItems.length > 0 && (
            <form onSubmit={handleSubmitOrder} className="space-y-4 border-t border-purple-150 pt-4">
              
              {/* Service Destination: Table / Online */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-2">
                  Destino del Pedido
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMesaOLinea('Mesa')}
                    className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border flex justify-center items-center gap-1.5 ${
                      mesaOLinea === 'Mesa'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-purple-50 text-purple-700 border-purple-200/55'
                    }`}
                  >
                    <span>🪑 En Mesa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMesaOLinea('En Línea')}
                    className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border flex justify-center items-center gap-1.5 ${
                      mesaOLinea === 'En Línea'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-purple-50 text-purple-700 border-purple-200/55'
                    }`}
                  >
                    <span>🌐 En Línea</span>
                  </button>
                </div>
              </div>

              {/* Table Number setup */}
              {mesaOLinea === 'Mesa' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1">
                    Número de Mesa
                  </label>
                  <select
                    className="w-full bg-white border border-purple-200 rounded-xl p-2 text-xs font-bold text-slate-700"
                    value={numeroMesa}
                    onChange={(e) => setNumeroMesa(e.target.value)}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        Mesa {n}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Chef / Cocinero select (Fulfill: "Ticket with waiter and chef who prepared/delivered") */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1">
                  🧑‍🍳 Asignar Cocinero que Preparó
                </label>
                <select
                  required
                  className="w-full bg-white border border-purple-200 rounded-xl p-2 text-xs font-bold text-slate-700"
                  value={cookId}
                  onChange={(e) => setCookId(e.target.value)}
                >
                  <option value="">-- Seleccionar Cocinero --</option>
                  {cocineros.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} ({c.correo})
                    </option>
                  ))}
                </select>
                {cocineros.length === 0 && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1">
                    ⚠️ No hay cocineros registrados. Por favor entra con rol Cocinero y regístrate para que aparezcan en el ticket.
                  </p>
                )}
              </div>

              {/* Payment selection */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-2">
                  💵 Forma de Cobro
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Efectivo', 'Tarjeta', 'Transferencia'] as const).map((method) => {
                    const isSelected = tipoPago === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setTipoPago(method)}
                        className={`py-2 text-[10px] font-bold rounded-xl transition-all border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-purple-50 text-purple-700 border-purple-200/55 hover:bg-purple-100/40'
                        }`}
                      >
                        {method === 'Efectivo' && <Coins className="w-3.5 h-3.5" />}
                        {method === 'Tarjeta' && <CreditCard className="w-3.5 h-3.5" />}
                        {method === 'Transferencia' && <Send className="w-3.5 h-3.5" />}
                        <span className="text-[9px] mt-1">{method}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="bg-purple-50/20 p-3 rounded-xl border border-purple-100 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono font-medium">${(cartTotal / 1.16).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA Trasladado (16%):</span>
                  <span className="font-mono font-medium">${(cartTotal - cartTotal / 1.16).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800 text-sm border-t border-purple-250 pt-2 mt-2">
                  <span>Total Cuentas:</span>
                  <span className="font-mono text-purple-600 font-bold">${cartTotal.toFixed(2)} MXN</span>
                </div>
              </div>

              {/* Place Order button */}
              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-200 transition-colors"
              >
                <Send className="w-4 h-4" /> Registrar Pedido e Imprimir
              </button>

            </form>
          )}

        </div>
      </div>

      {/* Ticket Modal Overlay */}
      {selectedTicketPedido && (
        <TicketModal
          pedido={selectedTicketPedido}
          detalles={db.detalles_pedido}
          platillos={db.platillos_menu}
          usuarios={db.usuarios}
          onClose={() => setSelectedTicketPedido(null)}
        />
      )}

    </div>
  );
}
