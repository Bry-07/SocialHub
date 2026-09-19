import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost } from '../api/postService';
import { showSuccess, showError } from '../utils/alerts';
import { getErrorMessage } from '../utils/errorHandler';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [errors, setErrors] = useState({});

  const validate = (values) => {
    const nextErrors = {};
    if (!values.title.trim()) nextErrors.title = 'El título es obligatorio.';
    if (values.title.length > 150) nextErrors.title = 'El título no puede superar los 150 caracteres.';
    if (!values.content.trim()) nextErrors.content = 'El contenido es obligatorio.';
    if (!values.author.trim()) nextErrors.author = 'El autor es obligatorio.';
    return nextErrors;
  };

  const updateField = (field, value) => {
    const values = { title, content, author, [field]: value };
    if (field === 'title') setTitle(value);
    if (field === 'content') setContent(value);
    if (field === 'author') setAuthor(value);
    setErrors(validate(values));
  };

  useEffect(() => {
    getPostById(id)
      .then((response) => {
        setTitle(response.data.title);
        setContent(response.data.content);
        setAuthor(response.data.author || '');
      })
      .catch((err) => showError(getErrorMessage(err)));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate({ title, content, author });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    updatePost(id, { title, content, author })
      .then(() => {
        showSuccess('Publicación actualizada.');
        navigate(`/posts/${id}`);
      })
      .catch((err) => showError(getErrorMessage(err)));
  };

  return (
    <div>
      <h2>Editar publicación</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            maxLength={150}
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
        <div className="mb-3">
          <label className="form-label">Autor</label>
          <input
            className={`form-control ${errors.author ? 'is-invalid' : ''}`}
            value={author}
            onChange={(e) => updateField('author', e.target.value)}
          />
          {errors.author && <div className="invalid-feedback">{errors.author}</div>}
        </div>
        <button className="btn btn-secondary" type="submit">Actualizar</button>
      </form>
    </div>
  );
}

export default EditPost;
