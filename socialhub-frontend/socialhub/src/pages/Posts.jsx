import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAllPosts, deletePost } from '../api/postService';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { confirmDelete, showSuccess, showError } from '../utils/alerts';
import { getErrorMessage } from '../utils/errorHandler';

function Posts() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadPosts = () => {
    setLoading(true);
    setLoadError(null);
    getAllPosts()
      .then((response) => setPosts(response.data))
      .catch((err) => setLoadError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getAllPosts()
      .then((response) => setPosts(response.data))
      .catch((err) => setLoadError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (!result.isConfirmed) return;

    setDeletingId(id);
    deletePost(id)
      .then(() => {
        showSuccess('Publicación eliminada.');
        loadPosts();
      })
      .catch((err) => showError(getErrorMessage(err)))
      .finally(() => setDeletingId(null));
  };

  const filteredPosts = posts.filter((post) => {
    const term = search.toLowerCase();
    const matchesSearch = (
      post.title.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term)
    );
    const commentCount = post.comments?.length || 0;
    const matchesFilter = filter === 'all'
      || (filter === 'with-comments' && commentCount > 0)
      || (filter === 'without-comments' && commentCount === 0)
      || filter === 'recent'
      || filter === 'most-commented';
    return matchesSearch && matchesFilter;
  });

  if (filter === 'recent') {
    filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  if (filter === 'most-commented') {
    filteredPosts.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
  }

  if (loading) return <Loading text="Cargando publicaciones..." />;

  return (
    <div>
      <div className="posts-header d-flex justify-content-between align-items-center mb-3">
        <h2>Publicaciones</h2>
        <Link to="/posts/new" className="btn btn-success">Nueva publicación</Link>
      </div>

      {loadError && <ErrorMessage text={loadError} />}

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Buscar por título o contenido..."
      />

      <div className="row g-2 mb-4">
        <div className="col-12 col-md-6 col-lg-4">
          <label className="visually-hidden" htmlFor="post-filter">Filtrar publicaciones</label>
          <select
            id="post-filter"
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="with-comments">Con comentarios</option>
            <option value="without-comments">Sin comentarios</option>
            <option value="recent">Más recientes</option>
            <option value="most-commented">Más comentadas</option>
          </select>
        </div>
      </div>

      {filteredPosts.length === 0 && <p>No se encontraron publicaciones.</p>}
      <div className="posts-grid">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} onDelete={handleDelete} deleting={deletingId === post.id} />
        ))}
      </div>
    </div>
  );
}

export default Posts;
