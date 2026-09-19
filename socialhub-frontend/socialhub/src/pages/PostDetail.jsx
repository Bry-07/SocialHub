import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostById } from '../api/postService';
import {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} from '../api/commentService';
import CommentCard from '../components/CommentCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { confirmDelete, showSuccess, showError } from '../utils/alerts';
import { getErrorMessage } from '../utils/errorHandler';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [newAuthor, setNewAuthor] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentErrors, setCommentErrors] = useState({});
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [savingComment, setSavingComment] = useState(false);
  const [updatingCommentId, setUpdatingCommentId] = useState(null);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const validateComment = (values) => {
    const nextErrors = {};
    if (!values.author.trim()) nextErrors.author = 'El autor es obligatorio.';
    if (!values.comment.trim()) nextErrors.comment = 'El comentario es obligatorio.';
    return nextErrors;
  };

  const updateCommentField = (field, value) => {
    const values = { author: newAuthor, comment: newComment, [field]: value };
    if (field === 'author') setNewAuthor(value);
    if (field === 'comment') setNewComment(value);
    setCommentErrors(validateComment(values));
  };

  const loadComments = () => {
    setCommentsLoading(true);
    getCommentsByPost(id)
      .then((response) => {
        setComments(response.data);
        setPost((currentPost) => currentPost ? { ...currentPost, comments: response.data } : currentPost);
      })
      .catch((err) => showError(getErrorMessage(err)))
      .finally(() => setCommentsLoading(false));
  };

  useEffect(() => {
    getPostById(id)
      .then((response) => setPost(response.data))
      .catch((err) => setLoadError(getErrorMessage(err)))
      .finally(() => setLoading(false));
    getCommentsByPost(id)
      .then((response) => {
        setComments(response.data);
        setPost((currentPost) => currentPost ? { ...currentPost, comments: response.data } : currentPost);
      })
      .catch((err) => showError(getErrorMessage(err)))
      .finally(() => setCommentsLoading(false));
  }, [id]);

  const handleCreateComment = (e) => {
    e.preventDefault();
    const nextErrors = validateComment({ author: newAuthor, comment: newComment });
    setCommentErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSavingComment(true);
    createComment(id, { author: newAuthor, comment: newComment })
      .then(() => {
        setNewAuthor('');
        setNewComment('');
        setCommentErrors({});
        showSuccess('Comentario agregado.');
        loadComments();
      })
      .catch((err) => showError(getErrorMessage(err)))
      .finally(() => setSavingComment(false));
  };

  const handleUpdateComment = (commentId, data) => {
    setUpdatingCommentId(commentId);
    updateComment(commentId, data)
      .then(() => {
        showSuccess('Comentario actualizado.');
        loadComments();
      })
      .catch((err) => showError(getErrorMessage(err)))
      .finally(() => setUpdatingCommentId(null));
  };

  const handleDeleteComment = async (commentId) => {
    const result = await confirmDelete();
    if (!result.isConfirmed) return;

    setDeletingCommentId(commentId);
    deleteComment(commentId)
      .then(() => {
        showSuccess('Comentario eliminado.');
        loadComments();
      })
      .catch((err) => showError(getErrorMessage(err)))
      .finally(() => setDeletingCommentId(null));
  };

  if (loading) return <Loading text="Cargando publicación..." />;
  if (loadError) return <ErrorMessage text={loadError} />;

  return (
    <div>
      <h2>{post.title} ({post.comments?.length || 0} comentarios)</h2>
      <p>{post.content}</p>
      <Link to={`/posts/${id}/edit`} className="btn btn-secondary btn-sm mb-4">
        Editar
      </Link>

      <h4>Comentarios</h4>
      {commentsLoading ? <Loading text="Cargando comentarios..." /> : (
        <>
          {comments.length === 0 && <p>No hay comentarios todavía.</p>}
          {comments.map((c) => (
            <CommentCard
              key={c.id}
              comment={c}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
              updating={updatingCommentId === c.id}
              deleting={deletingCommentId === c.id}
            />
          ))}
        </>
      )}

      <h5 className="mt-4">Agregar comentario</h5>
      <form onSubmit={handleCreateComment}>
        <div className="mb-2">
          <input
            className={`form-control ${commentErrors.author ? 'is-invalid' : ''}`}
            placeholder="Tu nombre"
            value={newAuthor}
            onChange={(e) => updateCommentField('author', e.target.value)}
          />
          {commentErrors.author && <div className="invalid-feedback">{commentErrors.author}</div>}
        </div>
        <div className="mb-2">
          <textarea
            className={`form-control ${commentErrors.comment ? 'is-invalid' : ''}`}
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => updateCommentField('comment', e.target.value)}
          />
          {commentErrors.comment && <div className="invalid-feedback">{commentErrors.comment}</div>}
        </div>
        <button className="btn btn-success btn-sm" type="submit" disabled={savingComment}>
          {savingComment ? 'Guardando comentario...' : 'Comentar'}
        </button>
      </form>
    </div>
  );
}

export default PostDetail;
