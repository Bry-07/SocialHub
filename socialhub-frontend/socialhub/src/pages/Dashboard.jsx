import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardData } from '../api/dashboardService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getErrorMessage } from '../utils/errorHandler';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    getDashboardData()
      .then((response) => setData(response.data))
      .catch((err) => setLoadError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Cargando estadísticas..." />;
  if (loadError) return <ErrorMessage text={loadError} />;

  return (
    <div>
      <h2>Dashboard</h2>
      <p className="text-muted">Estadísticas generales de la plataforma</p>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="card text-center p-3">
            <h6>Total de publicaciones</h6>
            <h3>{data.totalPosts}</h3>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card text-center p-3">
            <h6>Total de comentarios</h6>
            <h3>{data.totalComments}</h3>
          </div>
        </div>
      </div>
      
      {data.mostCommentedPost && (
        <div className="mb-4">
          <h5>Publicación con más comentarios</h5>
          <div className="card p-3">
            <strong>{data.mostCommentedPost.title}</strong>
            <span className="text-muted">
              {data.mostCommentedPost.commentsCount} comentarios
            </span>
          </div>
        </div>
      )}

      <h5>Últimas publicaciones</h5>
      {data.latestPosts?.length === 0 && <p>No hay publicaciones recientes.</p>}
      {data.latestPosts?.map((post) => (
        <div key={post.id} className="card mb-2 p-2">
          <Link to={`/posts/${post.id}`} className="text-decoration-none">
            {post.title}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
