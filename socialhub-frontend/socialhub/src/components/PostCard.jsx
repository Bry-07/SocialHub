import { Link } from 'react-router-dom';

function PostCard({ post, onDelete, deleting }) {
  const formattedDate = post.createdAt
    ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(post.createdAt))
    : 'Fecha no disponible';
  const commentCount = post.comments?.length || 0;

  return (
    <div className="card post-card mb-3">
      <div className="card-body">
        <div className="post-card-heading">
          <h5 className="card-title">{post.title}</h5>
          <div className="post-card-meta">
            <span>{formattedDate}</span>
            <span>{commentCount} {commentCount === 1 ? 'comentario' : 'comentarios'}</span>
          </div>
        </div>
        <p className="card-text post-card-content">{post.content}</p>
        <div className="post-card-actions">
          <Link to={`/posts/${post.id}`} className="btn btn-primary btn-sm me-2">
            Ver
          </Link>
          <Link to={`/posts/${post.id}/edit`} className="btn btn-secondary btn-sm me-2">
            Editar
          </Link>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(post.id)} disabled={deleting}>
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;