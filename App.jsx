import React from 'react';
import UserProfile from './components/UserProfile';

function App() {
  // Exemplo de dados do usuário
  const user = {
    name: "João Silva",
    email: "joao@exemplo.com",
    avatar: "https://github.com/shadcn.png" // Exemplo de avatar
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com o UserProfile */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Minha Aplicação</h1>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Bem-vindo!</h2>
          <p className="text-gray-600">
            O componente UserProfile está no canto superior direito da tela.
            Você pode ver o ícone do usuário e ao clicar nele, aparecerá um menu dropdown.
          </p>
        </div>
      </main>

      {/* Componente UserProfile */}
      <UserProfile user={user} />
    </div>
  );
}

export default App; 