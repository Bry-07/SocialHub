import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Posts from '../pages/Posts';
import CreatePost from '../pages/CreatePost';
import EditPost from '../pages/EditPost';
import PostDetail from '../pages/PostDetail';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/posts/new" element={<CreatePost />} />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="/posts/:id/edit" element={<EditPost />} />
    </Routes>
  );
}

export default AppRoutes;