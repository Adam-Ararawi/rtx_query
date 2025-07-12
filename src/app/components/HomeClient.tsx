'use client';

import {
  useGetPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from '@/service/post';
import { useState } from 'react';

export default function HomeClient() {
  const { data, error, isLoading } = useGetPostsQuery();
  const [addPost, { isLoading: isAdding }] = useAddPostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const handleAdd = async () => {
    if (!title.trim() || !body.trim()) return alert('Please fill all fields.');
    try {
      await addPost({ title, body }).unwrap();
      setTitle('');
      setBody('');
      alert('Post added successfully!');
    } catch (err) {
      console.error('Failed to add post', err);
    }
  };

  const handleEdit = (post: { id: number; title: string; body: string }) => {
    setEditId(post.id);
    setTitle(post.title);
    setBody(post.body);
  };

  const handleUpdate = async () => {
    if (!editId || !title.trim() || !body.trim()) return alert('Please fill all fields.');
    try {
      await updatePost({ id: editId, title, body }).unwrap();
      setEditId(null);
      setTitle('');
      setBody('');
      alert('Post updated successfully!');
    } catch (err) {
      console.error('Failed to update post', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(id).unwrap();
      alert('Post deleted successfully!');
    } catch (err) {
      console.error('Failed to delete post', err);
    }
  };

  if (isLoading) return <div className="text-center py-10 text-lg font-semibold">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600 font-semibold">Error loading posts</div>;

  return (
    <section className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Create / Update Post</h2>
        <input
          className="border border-gray-300 rounded px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border border-gray-300 rounded px-4 py-2 w-full mb-4 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        {editId ? (
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white px-6 py-2 rounded transition"
          >
            {isUpdating ? 'Updating...' : 'Update Post'}
          </button>
        ) : (
          <button
            onClick={handleAdd}
            disabled={isAdding}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded transition"
          >
            {isAdding ? 'Adding...' : 'Add Post'}
          </button>
        )}
      </div>

      <hr className="border-gray-300" />

      <div className="space-y-6">
        {data?.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.body}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleEdit(post)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-1 rounded transition"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
