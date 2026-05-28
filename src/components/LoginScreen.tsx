/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Usuario, DatabaseState } from '../types';
import { Cat, Lock, Mail, User, ShieldCheck, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  db: DatabaseState;
  onLogin: (usuario: Usuario) => void;
  onUpdateDb: (newDb: DatabaseState) => void;
}

export default function LoginScreen({ db, onLogin, onUpdateDb }: LoginScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [rol, setRol] = useState<'Mesero' | 'Cocinero' | 'Administrador'>('Mesero');
  
  // Form fields
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  
  // Login fields
  const [loginCorreo, setLoginCorreo] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginCorreo || !loginPassword) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    const matchedUser = db.usuarios.find(
      (u) => u.correo.toLowerCase() === loginCorreo.toLowerCase() && u.password === loginPassword
    );

    if (matchedUser) {
      setSuccessMsg(`¡Miau! Bienvenido de vuelta, ${matchedUser.nombre}.`);
      setTimeout(() => {
        onLogin(matchedUser);
      }, 800);
    } else {
      setErrorMsg('Usuario o contraseña incorrectos. Revisa tus miau-credenciales.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!nombre || !correo || !password) {
      setErrorMsg('Por favor completa todos los campos del registro.');
      return;
    }

    // Check if user already exists
    const exists = db.usuarios.some((u) => u.correo.toLowerCase() === correo.toLowerCase());
    if (exists) {
      setErrorMsg('Este correo ya está registrado en Cat-Cos.');
      return;
    }

    // Create new user (PK: usr_ + timestamp)
    const newUsuario: Usuario = {
      id: `usr_${Date.now()}`,
      nombre,
      correo,
      password,
      rol
    };

    const updatedDb: DatabaseState = {
      ...db,
      usuarios: [...db.usuarios, newUsuario]
    };

    onUpdateDb(updatedDb);
    setSuccessMsg(`¡Miau-tástico! Cuenta de ${rol} creada para ${nombre}.`);
    
    // Auto fill login fields and switch to login
    setLoginCorreo(correo);
    setLoginPassword(password);
    setTimeout(() => {
      setIsRegister(false);
      setErrorMsg('');
      setSuccessMsg('');
    }, 1500);
  };

  // Quick login for testing
  const handleQuickLogin = (user: Usuario) => {
    setSuccessMsg(`Ingresando rápido como ${user.nombre} (${user.rol})...`);
    setTimeout(() => {
      onLogin(user);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-purple-200 p-8 relative overflow-hidden">
        
        {/* Decorative accents */}
        <div className="absolute top-0 left-12 w-6 h-6 bg-purple-100 rounded-tr-lg transform rotate-45 -translate-y-3"></div>
        <div className="absolute top-0 right-12 w-6 h-6 bg-purple-100 rounded-tl-lg transform rotate-45 -translate-y-3"></div>

        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-50 text-purple-600 mb-3 border border-purple-200">
            <Cat className="w-8 h-8 animate-bounce text-purple-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-purple-600 tracking-tight">Cat-Cos</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium italic">🐾 Los Tacos más Purr-fectos del Universo 🐾</p>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold text-center">
            🐱 {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-semibold text-center">
            🐾 {successMsg}
          </div>
        )}

        {/* Login OR Register Form */}
        {!isRegister ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4" id="login-form">
            <h2 className="text-lg font-bold text-slate-700 text-center mb-2">Iniciar Sesión</h2>
            
            <div>
              <label className="block text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  className="w-full pl-9 pr-4 py-2.5 bg-purple-50/50 border border-purple-200 focus:border-purple-400 focus:bg-white focus:outline-none rounded-xl text-slate-800 text-sm font-medium placeholder-purple-300 transition-colors"
                  placeholder="ejemplo@michi.com"
                  value={loginCorreo}
                  onChange={(e) => setLoginCorreo(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  className="w-full pl-9 pr-4 py-2.5 bg-purple-50/50 border border-purple-200 focus:border-purple-400 focus:bg-white focus:outline-none rounded-xl text-slate-800 text-sm font-medium placeholder-purple-300 transition-colors"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Cat className="w-4 h-4" /> Entrar a la Taquería
            </button>

            <div className="text-center mt-4">
              <span className="text-xs text-slate-500">¿Eres un nuevo Michi? </span>
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs font-bold text-purple-600 hover:underline cursor-pointer"
              >
                Regístrate aquí
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4" id="register-form">
            <h2 className="text-lg font-bold text-slate-700 text-center mb-1">Nuevo Registro</h2>
            
            {/* Role selection tab button */}
            <div>
              <label className="block text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-2 text-center">
                Rol del Integrante
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-purple-50 p-1 rounded-xl border border-purple-200">
                {(['Mesero', 'Cocinero', 'Administrador'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRol(r)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      rol === r
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-purple-600 hover:bg-purple-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-1">
                Nombre de Usuario
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  className="w-full pl-9 pr-4 py-2 bg-purple-50/50 border border-purple-200 focus:border-purple-400 focus:bg-white focus:outline-none rounded-xl text-slate-800 text-sm font-medium placeholder-purple-300 transition-colors"
                  placeholder="ej. Michi Gómez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  className="w-full pl-9 pr-4 py-2 bg-purple-50/50 border border-purple-200 focus:border-purple-400 focus:bg-white focus:outline-none rounded-xl text-slate-800 text-sm font-medium placeholder-purple-300 transition-colors"
                  placeholder="gatito@catcos.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-1">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  className="w-full pl-9 pr-4 py-2 bg-purple-50/50 border border-purple-200 focus:border-purple-400 focus:bg-white focus:outline-none rounded-xl text-slate-800 text-sm font-medium placeholder-purple-300 transition-colors"
                  placeholder="Contraseña segura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Sparkles className="w-4 h-4" /> Guardar Nuevo {rol}
            </button>

            <div className="text-center mt-3">
              <span className="text-xs text-slate-500">¿Ya tienes cuenta? </span>
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs font-bold text-purple-600 hover:underline cursor-pointer"
              >
                Inicia sesión aquí
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Quick Testing Access Panel (Invaluable for the client evaluation!): Let them login fast */}
      <div className="w-full max-w-md mt-6 bg-white p-5 rounded-2xl border border-purple-200 shadow-xs text-center">
        <div className="flex items-center justify-center gap-2 text-purple-600 mb-2 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Acceso Rápido de Demostración
        </div>
        <p className="text-[10px] text-slate-500 mb-4">
          Prueba instantáneamente los diferentes roles de la base de datos relacional de Cat-Cos haciendo clic abajo:
        </p>
        <div className="grid grid-cols-3 gap-2">
          {db.usuarios.slice(0, 5).map((user) => (
            <button
              key={user.id}
              onClick={() => handleQuickLogin(user)}
              className="flex flex-col items-center bg-purple-50/50 hover:bg-purple-100/80 border border-purple-100 rounded-xl p-2 transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span className="text-xs font-bold text-slate-700 line-clamp-1">{user.nombre.split(' ')[0]}</span>
              <span className="px-1.5 py-0.5 mt-1 bg-purple-100 text-[8px] text-purple-600 font-bold rounded-md uppercase">
                {user.rol}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
