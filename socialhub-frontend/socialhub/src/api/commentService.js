import api from './axiosConfig';

export const getCommentsByPost = (postId) => api.get(`/posts/${postId}/comments`);

export const createComment = (postId, commentData) =>
    api.post(`/posts/${postId}/comments`, commentData);

export const updateComment = (id, commentData) => api.put(`/comments/${id}`, commentData);

export const deleteComment = (id) => api.delete(`/comments/${id}`);