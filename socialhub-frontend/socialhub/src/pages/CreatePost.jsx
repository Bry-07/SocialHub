import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/postService';
import { showSuccess, showError } from '../utils/alerts';
import { getErrorMessage } from '../utils/errorHandler';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const validate = (values) => {
    const nextErrors = {};
    if (!values.title.trim()) nextErrors.title = 'El título es obligatorio.';
    if (values.title.length > 150) nextErrors.title = 'El título no puede superar los 150 caracteres.';
    if (!values.content.trim()) nextErrors.content = 'El contenido es obligatorio.';
    return nextErrors;
  };

  const updateField = (field, value) => {
    const values = { title, content, [field]: value };
    if (field === 'title') setTitle(value);
    if (field === 'content') setContent(value);
    setErrors(validate(values));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate({ title, content });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    createPost({ title, content })
      .then(() => {
        showSuccess('Publicación creada.');
        navigate('/posts');
      })
      .catch((err) => showError(getErrorMessage(err)))
      .finally(() => setSaving(false));
  };

  return (
    <div>
      <h2>Nueva publicación</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            value={title}
            onChange={(e) => updateField('title', e.target.value)}
          />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Contenido</label>
          <textarea
            className={`form-control ${errors.content ? 'is-invalid' : ''}`}
            value={content}
            onChange={(e) => updateField('content', e.target.value)}
          />
          {errors.content && <div className="invalid-feedback">{errors.content}</div>}
        </div>
        <button className="btn btn-success" type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
