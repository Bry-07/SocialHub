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
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadPosts = () => {
    setLoading(true);
    setLoadError(null);
    getAllPosts()
      .then((response) => setPosts(response.data))
      .catch((err) => setLoadError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id) => {
    const result = await confirmDelete();
    if (!result.isConfirmed) return;

    deletePost(id)
      .then(() => {
        showSuccess('Publicación eliminada.');
        loadPosts();
      })
      .catch((err) => showError(getErrorMessage(err)));
  };

  const filteredPosts = posts.filter((post) => {
    const term = search.toLowerCase();
    return (
      post.title.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term)
    );
  });

  if (loading) return <Loading text="Cargando publicaciones..." />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Publicaciones</h2>
        <Link to="/posts/new" className="btn btn-success">Nueva publicación</Link>
      </div>

      {loadError && <ErrorMessage text={loadError} />}

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Buscar por título o contenido..."
      />

      {filteredPosts.length === 0 && <p>No se encontraron publicaciones.</p>}
      {filteredPosts.map((post) => (
        <PostCard key={post.id} post={post} onDelete={handleDelete} />
      ))}
    </div>
  );
}

export default Posts;
