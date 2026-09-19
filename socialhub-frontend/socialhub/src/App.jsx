import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container app-content">
        <AppRoutes />
      </main>
      <footer className="app-footer">SocialHub <span>•</span> Comparte ideas, crea comunidad</footer>
    </div>
  );
}

export default App;