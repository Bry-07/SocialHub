import { Link } from 'react-router-dom';

function PostCard({ post, onDelete }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{post.title}</h5>
        <p className="card-text">{post.content}</p>
        <Link to={`/posts/${post.id}`} className="btn btn-primary btn-sm me-2">
          Ver
        </Link>
        <Link to={`/posts/${post.id}/edit`} className="btn btn-secondary btn-sm me-2">
          Editar
        </Link>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(post.id)}>
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default PostCard;