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

  const formatDate = (value) => value
    ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(value))
    : 'Fecha no disponible';

  return (
    <div>
      <h2>Dashboard</h2>
      <p className="text-muted">Estadísticas generales de la plataforma</p>

      <div className="row g-3 mb-4 dashboard-stats">
        <div className="col-12 col-md-6">
          <div className="card dashboard-stat-card p-3">
            <span className="dashboard-stat-label">Total de publicaciones</span>
            <h3>{data.totalPosts}</h3>
            <span className="dashboard-stat-detail">Contenido compartido</span>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card dashboard-stat-card p-3">
            <span className="dashboard-stat-label">Total de comentarios</span>
            <h3>{data.totalComments}</h3>
            <span className="dashboard-stat-detail">Conversaciones activas</span>
          </div>
        </div>
      </div>
      
      {data.mostCommentedPost && (
        <div className="mb-4 dashboard-featured-section">
          <div className="section-heading">
            <span className="section-kicker">Lo más conversado</span>
            <h5>Publicación con más comentarios</h5>
          </div>
          <div className="card dashboard-featured-card p-3">
            <div className="dashboard-featured-icon" aria-hidden="true">#</div>
            <div className="dashboard-featured-content">
              <strong>{data.mostCommentedPost.title}</strong>
              <div className="dashboard-meta">
                <span>{formatDate(data.mostCommentedPost.createdAt)}</span>
                <span className="dashboard-comment-count">
                  {data.mostCommentedPost.commentsCount} comentarios
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="section-heading latest-heading">
        <span className="section-kicker">Actividad reciente</span>
        <h5>Últimas 5 publicaciones</h5>
      </div>
      {data.latestPosts?.length === 0 && <p>No hay publicaciones recientes.</p>}
      <div className="dashboard-latest-grid">
        {data.latestPosts?.map((post) => (
          <div key={post.id} className="card dashboard-latest-card p-3">
            <div>
              <Link to={`/posts/${post.id}`} className="text-decoration-none dashboard-latest-title">
                {post.title}
              </Link>
              <div className="dashboard-meta">
                <span>{formatDate(post.createdAt)}</span>
                {post.commentsCount !== undefined && <span>{post.commentsCount} comentarios</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
