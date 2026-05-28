/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { getInitialDatabaseState, saveDatabaseState, DatabaseState, Usuario, SEED_USUARIOS, SEED_MENUS, SEED_PEDIDOS, SEED_DETALLES_PEDIDO } from './types';
import LoginScreen from './components/LoginScreen';
import MenuScreen from './components/MenuScreen';
import WaiterPanel from './components/WaiterPanel';
import ChefPanel from './components/ChefPanel';
import DBVisualizer from './components/DBVisualizer';
import { Cat, LogOut, Shield, Database, ChefHat, ClipboardList, BookOpen, Coffee, Footprints } from 'lucide-react';

export default function App() {
  const [db, setDb] = useState<DatabaseState>(() => getInitialDatabaseState());
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  
  // Tab router
  const [activeTab, setActiveTab] = useState<'menu' | 'waiter' | 'chef' | 'database'>('menu');

  // Handle db state updates and persist to localStorage
  const handleUpdateDb = (newDb: DatabaseState) => {
    setDb(newDb);
    saveDatabaseState(newDb);
  };

  const handleResetDb = () => {
    const freshDb: DatabaseState = {
      usuarios: SEED_USUARIOS,
      platillos_menu: SEED_MENUS,
      pedidos: SEED_PEDIDOS,
      detalles_pedido: SEED_DETALLES_PEDIDO
    };
    setDb(freshDb);
    saveDatabaseState(freshDb);
    alert('🐾 ¡La base de datos relacional de Cat-Cos ha sido restaurada con éxito!');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('menu');
  };

  // Login handler
  const handleLogin = (user: Usuario) => {
    setCurrentUser(user);
    // Route to appropriate panel based on role
    if (user.rol === 'Cocinero') {
      setActiveTab('chef');
    } else if (user.rol === 'Mesero') {
      setActiveTab('waiter');
    } else {
      setActiveTab('menu');
    }
  };

  // If nobody is logged in, force LoginScreen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-purple-50/30 text-purple-950 font-sans">
        
        {/* Top Header decoration */}
        <div className="bg-purple-600 text-purple-100 py-2.5 px-4 text-center text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
          <span>🐾 ¡Bienvenido a la taquería más adorable! Regístrate para comenzar a tomar pedidos. 🌮 🐾</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <LoginScreen db={db} onLogin={handleLogin} onUpdateDb={handleUpdateDb} />
        </div>

        {/* Footer */}
        <footer className="w-full text-center py-8 border-t border-purple-100 text-xs text-purple-500 font-medium space-y-1">
          <p>© 2026 Taquería Cat-Cos, S.A. de C.V.</p>
          <p className="flex items-center justify-center gap-1">
            Diseñado con color morado pastel y mucho amor gatuno <Cat className="w-3 h-3 fill-purple-400 text-purple-400" />
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50/40 text-slate-800 font-sans flex flex-col justify-between">

      {/* Main Bar (Geometric Balance Styled) */}
      <header className="bg-white border-b border-purple-200 h-16 flex items-center justify-between px-6 sticky top-0 z-40 shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-sm border border-purple-400">
            <Cat className="w-5 h-5 animate-pulse" />
          </div>
          <h1 className="text-2xl font-display font-bold text-purple-600 tracking-tight">
            Cat-cos <span className="text-slate-400 font-light italic">Taquería</span>
          </h1>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-purple-50/80 p-1 rounded-xl border border-purple-100">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-600 hover:bg-purple-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Menú de Tacos
          </button>

          <button
            onClick={() => setActiveTab('waiter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'waiter'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-600 hover:bg-purple-100'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" /> Tomar Pedido
          </button>

          <button
            onClick={() => setActiveTab('chef')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'chef'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-600 hover:bg-purple-100'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" /> Cocina Estatus
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'database'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-600 hover:bg-purple-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Base de Datos (PK/FK)
          </button>
        </nav>

        {/* User profile & Logout */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end text-right">
            <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest leading-none">
              {currentUser.rol}
            </span>
            <span className="text-sm font-semibold text-slate-700">{currentUser.nombre}</span>
          </div>
          
          <div className="w-10 h-10 bg-purple-100 rounded-lg border border-purple-200 flex items-center justify-center font-bold text-sm text-purple-700">
            🐾
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-all cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile-only Nav Selector */}
      <div className="md:hidden bg-white border-b border-purple-150 p-2 flex justify-around shrink-0 gap-1">
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex-1 py-2 rounded-lg text-center text-[10px] font-black uppercase ${
            activeTab === 'menu' ? 'bg-purple-600 text-white' : 'text-purple-700 hover:bg-purple-50'
          }`}
        >
          Menú
        </button>
        <button
          onClick={() => setActiveTab('waiter')}
          className={`flex-1 py-2 rounded-lg text-center text-[10px] font-black uppercase ${
            activeTab === 'waiter' ? 'bg-purple-600 text-white' : 'text-purple-700 hover:bg-purple-50'
          }`}
        >
          Pedidos
        </button>
        <button
          onClick={() => setActiveTab('chef')}
          className={`flex-1 py-2 rounded-lg text-center text-[10px] font-black uppercase ${
            activeTab === 'chef' ? 'bg-purple-600 text-white' : 'text-purple-700 hover:bg-purple-50'
          }`}
        >
          Cocina
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`flex-1 py-2 rounded-lg text-center text-[10px] font-black uppercase ${
            activeTab === 'database' ? 'bg-purple-600 text-white' : 'text-purple-700 hover:bg-purple-50'
          }`}
        >
          Relaciones
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
        
        {/* Dynamic Warning Notification for Role mismatches during demo */}
        <div className="p-4 bg-white border-l-4 border-l-purple-600 rounded-r-2xl shadow-xs text-sm font-medium flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="flex items-center gap-2">
            <span className="text-lg">🐾</span>
            <span className="text-slate-600 font-medium">
              Usted está navegando como <strong className="text-purple-700 uppercase font-bold">{currentUser.rol}</strong>. Para simular el flujo completo de cocina o pedidos, puedes cambiar de pestaña o utilizar el alternador rápido.
            </span>
          </p>
          <button
            onClick={() => {
              const rolls: Usuario['rol'][] = ['Mesero', 'Cocinero', 'Administrador'];
              const currentIdx = rolls.indexOf(currentUser.rol);
              const nextRol = rolls[(currentIdx + 1) % rolls.length];
              
              // Find first user with next role
              const matched = db.usuarios.find(u => u.rol === nextRol);
              if (matched) {
                handleLogin(matched);
              }
            }}
            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase rounded-lg shadow-sm transition-colors shrink-0 cursor-pointer"
          >
            🔀 Alternar Rol Rápido
          </button>
        </div>

        {/* Tab Switcher Router Block */}
        <div className="transition-all duration-300">
          {activeTab === 'menu' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-slate-700">Menú del Día</h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold border border-purple-200 text-purple-600 uppercase">Tacos</span>
                  <span className="px-3 py-1 bg-purple-200 rounded-full text-xs font-semibold text-purple-700 uppercase">Bebidas</span>
                </div>
              </div>
              <MenuScreen
                menuList={db.platillos_menu}
                allowOrdering={false}
              />
            </div>
          )}

          {activeTab === 'waiter' && (
            <div className="animate-fade-in">
              <WaiterPanel
                db={db}
                currentUser={currentUser}
                onUpdateDb={handleUpdateDb}
              />
            </div>
          )}

          {activeTab === 'chef' && (
            <div className="animate-fade-in">
              <ChefPanel
                db={db}
                currentUser={currentUser}
                onUpdateDb={handleUpdateDb}
              />
            </div>
          )}

          {activeTab === 'database' && (
            <div className="animate-fade-in">
              <DBVisualizer
                db={db}
                onResetDb={handleResetDb}
              />
            </div>
          )}
        </div>

      </main>

      {/* Footer Status Bar (Extracted from Geometric Balance Theme HTML) */}
      <footer className="h-10 bg-white border-t border-purple-100 flex items-center justify-between px-6 text-[10px] text-slate-400 shrink-0">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> 
            Google Sheets: Conectado
          </span>
          <span className="hidden sm:inline">Ventas Totales Hoy: {db.pedidos.length}</span>
          <span className="hidden sm:inline">Platillos en Carta: {db.platillos_menu.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-purple-100 text-purple-600 px-2.5 py-0.5 rounded border border-purple-200 uppercase font-black tracking-wider text-[8px]">
            {currentUser.rol} Mode
          </span>
          <span>© 2026 Cat-Cos • 100% Persistido</span>
        </div>
      </footer>

    </div>
  );
}

