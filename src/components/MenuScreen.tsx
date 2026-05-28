/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlatilloMenu } from '../types';
import { ShoppingCart, Heart, Plus, Minus, Info } from 'lucide-react';

// Use direct path literals for generated graphics
const pastorImg = '/src/assets/images/cat_pastor_taco_1779925938296.png';
const carnitasImg = '/src/assets/images/cat_carnitas_taco_1779925956309.png';
const bistecImg = '/src/assets/images/cat_bistec_taco_1779925975871.png';

interface MenuScreenProps {
  menuList: PlatilloMenu[];
  onAddToOrder?: (platillo: PlatilloMenu) => void;
  onRemoveFromOrder?: (platillo: PlatilloMenu) => void;
  cartQuantities?: Record<string, number>;
  allowOrdering?: boolean;
}

export default function MenuScreen({
  menuList,
  onAddToOrder,
  onRemoveFromOrder,
  cartQuantities = {},
  allowOrdering = false,
}: MenuScreenProps) {
  
  // Clean mapper for the generated images or fallbacks
  const getPlatilloImage = (imgKey: string) => {
    if (imgKey === 'cat_pastor_taco') return pastorImg;
    if (imgKey === 'cat_carnitas_taco') return carnitasImg;
    if (imgKey === 'cat_bistec_taco') return bistecImg;
    
    // Fallbacks if another item
    return `https://picsum.photos/seed/${imgKey}/300/200`;
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-white border border-purple-200 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 text-center md:text-left">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-widest text-[10px]">
            👨‍🍳 Recetas Felinas del Callejón
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-800">
            ¡Tacos preparados con garra! 🐾
          </h2>
          <p className="text-xs text-slate-500 max-w-lg font-medium leading-relaxed">
            Todos nuestros tacos se sirven con tortilla de maíz doble calentada al vapor, cebollita asada, cilantro, piña de los trompos de pastor o chicharrón crujiente. ¡Miau-tásticos!
          </p>
        </div>
        
        {/* Adorable Mini Cat-Illustration Frame */}
        <div className="w-20 h-20 bg-purple-55 bg-purple-100 rounded-full border border-purple-200 flex items-center justify-center shrink-0 shadow-xs relative">
          <span className="text-3xl">🐱🌮</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuList.map((platillo) => {
          const count = cartQuantities[platillo.id] || 0;
          return (
            <div
              key={platillo.id}
              className="bg-white rounded-2xl border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col relative group"
            >
              {/* Image box */}
              <div className="h-44 bg-purple-50/50 relative overflow-hidden flex items-center justify-center">
                <img
                  src={getPlatilloImage(platillo.imagen)}
                  alt={platillo.item}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-white font-mono">
                  ${platillo.precio.toFixed(2)} MXN
                </div>
              </div>

              {/* Description */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-base group-hover:text-purple-600 transition-colors">
                      {platillo.item}
                    </h3>
                    <button className="text-purple-300 hover:text-purple-500 transition-colors">
                      <Heart className="w-4 h-4 fill-current text-transparent hover:text-red-400" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    {platillo.descripcion}
                  </p>
                </div>

                {/* Buy / Counter controls */}
                <div className="pt-3 border-t border-purple-50 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold tracking-wider flex items-center gap-1 font-mono uppercase">
                    <Info className="w-3.5 h-3.5 text-purple-400" /> ID: {platillo.id}
                  </span>

                  {allowOrdering && onAddToOrder ? (
                    <div className="flex items-center gap-2">
                      {count > 0 ? (
                        <div className="flex items-center bg-purple-50 border border-purple-200 rounded-lg overflow-hidden p-0.5">
                          <button
                            onClick={() => onRemoveFromOrder && onRemoveFromOrder(platillo)}
                            className="p-1 px-2 text-purple-700 hover:bg-purple-200 rounded font-bold text-xs cursor-pointer transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-purple-900 font-bold text-xs font-mono min-w-[20px] text-center">
                            {count}
                          </span>
                          <button
                            onClick={() => onAddToOrder(platillo)}
                            className="p-1 px-2 text-purple-700 hover:bg-purple-200 rounded font-bold text-xs cursor-pointer transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAddToOrder(platillo)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-[11px] transition-colors cursor-pointer shadow-xs hover:shadow-md"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> Agregar
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] bg-purple-50 text-purple-600 font-bold px-2 py-0.5 rounded-md border border-purple-100 uppercase">
                      Ver en Pedidos
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
