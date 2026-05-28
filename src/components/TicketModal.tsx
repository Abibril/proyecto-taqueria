/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Pedido, DetallePedido, PlatilloMenu, Usuario } from '../types';
import { X, Printer, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface TicketModalProps {
  pedido: Pedido;
  detalles: DetallePedido[];
  platillos: PlatilloMenu[];
  usuarios: Usuario[];
  onClose: () => void;
}

export default function TicketModal({ pedido, detalles, platillos, usuarios, onClose }: TicketModalProps) {
  
  // Find related waiter name
  const mesero = usuarios.find((u) => u.id === pedido.mesero_id);
  const meseroNombre = mesero ? mesero.nombre : 'Mesero Desconocido';

  // Find related chef name
  const cocinero = usuarios.find((u) => u.id === pedido.cocinero_id);
  const cocineroNombre = cocinero ? cocinero.nombre : 'Michi Cocinero (Sin asignar)';

  // Subtotals
  const formatMoney = (val: number) => `$${val.toFixed(2)} MXN`;

  const itemsWithDescription = detalles
    .filter((d) => d.pedido_id === pedido.id)
    .map((d) => {
      const platillo = platillos.find((p) => p.id === d.platillo_id);
      return {
        ...d,
        nombre: platillo ? platillo.item : 'Taco Especial',
        subtotal: d.cantidad * d.precio_unitario,
      };
    });

  const subtotalNeto = pedido.total / 1.16;
  const ivaCalculado = pedido.total - subtotalNeto;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-sm w-full border border-purple-200 shadow-xl relative overflow-hidden flex flex-col my-8">
        
        {/* Pastel purple bar */}
        <div className="bg-purple-50/50 px-5 py-3 border-b border-purple-200/60 flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-slate-800 font-display font-semibold text-sm">
            <span>🐱 Ticket de Venta</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-purple-100 text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Paper Receipt container */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4 print-container" id="printable-ticket">
          
          {/* Header */}
          <div className="text-center border-b border-dashed border-purple-200 pb-4">
            <h3 className="text-lg font-display font-bold text-slate-800 uppercase tracking-tight">Taquería Cat-Cos</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-0.5">🐾 RFC: CCME-980527-MIAU 🐾</p>
            <p className="text-[10px] text-slate-400">Calle de las Esquinas Felinas #13, Col. Tejado</p>
            <p className="text-[10px] text-slate-400">Tel: 55-MIAU-TACO</p>
            <p className="text-[10px] font-bold text-premium font-mono text-purple-600 mt-2 bg-purple-50 inline-block px-3 py-0.5 rounded border border-purple-100">
              Ticket: {pedido.id.toUpperCase()}
            </p>
          </div>

          {/* Metadata */}
          <div className="text-[11px] text-slate-600 space-y-1 bg-purple-50/30 p-2.5 rounded-xl border border-purple-100">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-400">Fecha:</span>
              <span className="font-mono text-slate-700">{new Date(pedido.fecha).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-400">Servicio:</span>
              <span className="font-bold text-slate-700 uppercase">
                {pedido.mesa_o_linea === 'Mesa' ? `Mesa ${pedido.numero_mesa}` : 'Pedido En Línea 🌐'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-400">Mesero:</span>
              <span className="font-bold text-slate-700">{meseroNombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-400">Cocinero:</span>
              <span className="font-medium text-slate-700">{cocineroNombre}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-400">Estado:</span>
              <span className="font-bold uppercase text-[9px] text-purple-700 bg-purple-100/60 border border-purple-200 px-1.5 py-0.2 rounded">
                {pedido.estado}
              </span>
            </div>
          </div>

          {/* Itemized List */}
          <div className="space-y-2 border-b border-dashed border-purple-200 pb-3">
            <h4 className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Productos consumidos</h4>
            <div className="space-y-1.5 text-xs text-slate-700 font-medium">
              {itemsWithDescription.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="font-bold text-purple-600">{item.cantidad}x </span>
                    <span>{item.nombre}</span>
                  </div>
                  <span className="font-mono text-slate-800 shrink-0 ml-2">
                    {formatMoney(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-1 text-xs text-slate-600 border-b border-dashed border-purple-200 pb-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Subtotal Neto:</span>
              <span className="font-mono">{formatMoney(subtotalNeto)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">IVA (16%):</span>
              <span className="font-mono">{formatMoney(ivaCalculado)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-800 pt-1">
              <span>TOTAL A PAGAR:</span>
              <span className="font-mono text-purple-600 font-bold">{formatMoney(pedido.total)}</span>
            </div>
            <div className="flex justify-between font-bold text-[10px] text-slate-600 pt-1 bg-purple-50/20 px-2 py-0.5 rounded border border-purple-100">
              <span>Forma de Cobro:</span>
              <span className="uppercase text-purple-600">{pedido.tipo_pago}</span>
            </div>
          </div>

          {/* Footer message */}
          <div className="text-center pt-2 space-y-2">
            <div className="flex justify-center text-purple-200 gap-1 text-[9px]">
              <span>🐾</span><span>🐾</span><span>🐾</span><span>🐾</span><span>🐾</span>
            </div>
            <p className="text-xs font-bold text-slate-800 italic">🐱 ¡Miau-chas gracias por su visita! 🐱</p>
            <p className="text-[10px] text-slate-500 leading-normal">
              Su miau-satisfacción es nuestro fin. Califica nuestro servicio en redes usando el hashtag <span className="font-bold text-purple-600">#CatCosTacos</span>
            </p>
            <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400">
              <HeartHandshake className="w-3.5 h-3.5 text-purple-500" /> Hecho en México con amor felino
            </div>
          </div>

        </div>

        {/* Action Controls for the modal */}
        <div className="p-4 bg-purple-50/30 border-t border-purple-100 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-200 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Imprimir Ticket
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
