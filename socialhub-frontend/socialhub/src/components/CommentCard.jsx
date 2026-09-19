import { useState } from 'react';

function CommentCard({ comment, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [author, setAuthor] = useState(comment.author);
  const [text, setText] = useState(comment.comment);
  const [errors, setErrors] = useState({});

  const validate = (values) => {
    const nextErrors = {};
    if (!values.author.trim()) nextErrors.author = 'El autor es obligatorio.';
    if (!values.comment.trim()) nextErrors.comment = 'El comentario es obligatorio.';
    return nextErrors;
  };

  const handleSave = () => {
    const nextErrors = validate({ author, comment: text });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onUpdate(comment.id, { author, comment: text });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="card mb-2 p-2">
        <input
          className={`form-control mb-1 ${errors.author ? 'is-invalid' : ''}`}
          value={author}
          onChange={(e) => {
            const value = e.target.value;
            setAuthor(value);
            setErrors(validate({ author: value, comment: text }));
          }}
        />
        {errors.author && <div className="invalid-feedback d-block mb-1">{errors.author}</div>}
        <textarea
          className={`form-control mb-1 ${errors.comment ? 'is-invalid' : ''}`}
          value={text}
          onChange={(e) => {
            const value = e.target.value;
            setText(value);
            setErrors(validate({ author, comment: value }));
          }}
        />
        {errors.comment && <div className="invalid-feedback d-block mb-1">{errors.comment}</div>}
        <div>
          <button className="btn btn-primary btn-sm me-2" onClick={handleSave}>
            Guardar
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditing(false)}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-2 p-2">
      <p className="mb-1"><strong>{comment.author}</strong>: {comment.comment}</p>
      <div>
        <button className="btn btn-secondary btn-sm me-2" onClick={() => setEditing(true)}>
          Editar
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(comment.id)}>
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default CommentCard;