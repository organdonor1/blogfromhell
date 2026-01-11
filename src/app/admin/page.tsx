'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { useToast } from '../../hooks/use-toast';
import { ArrowLeft, Plus, Trash2, Edit, Users, Upload, X } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/footer';

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  type: string;
  section: string | null;
  read_time: string | null;
  published: boolean;
  created_at: string;
  image_url: string | null;
  featured: boolean | null;
  trending: boolean | null;
}

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

export default function Admin() {
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [showSubscribers, setShowSubscribers] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    type: 'news',
    section: '',
    read_time: '',
    published: false,
    image_url: '',
    featured: false,
    trending: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';
    
    if (password === correctPassword) {
      setAdminPassword(password);
      setIsAuthenticated(true);
      // Pass password directly since state update is async
      loadPosts(password);
    } else {
      toast({
        title: "Invalid password",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const loadPosts = async (passwordToUse?: string) => {
    const pwd = passwordToUse || adminPassword;
    if (!pwd) {
      toast({ 
        title: "Not authenticated", 
        variant: "destructive" 
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/posts', {
        headers: {
          'x-admin-password': pwd,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load posts');
      }

      const { posts: postsData } = await response.json();
      setPosts(postsData || []);
    } catch (error: any) {
      toast({ 
        title: "Failed to load posts", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const loadSubscribers = async () => {
    if (!adminPassword) {
      toast({ 
        title: "Not authenticated", 
        variant: "destructive" 
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/subscribers', {
        headers: {
          'x-admin-password': adminPassword,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load subscribers');
      }

      const { subscribers: subscribersData } = await response.json();
      setSubscribers(subscribersData || []);
      setShowSubscribers(true);
    } catch (error: any) {
      toast({ 
        title: "Failed to load subscribers", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword) {
      toast({ 
        title: "Not authenticated", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);

    try {
      // Upload image if a new one was selected
      let imageUrl = formData.image_url;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setIsLoading(false);
          return; // Don't proceed if image upload failed
        }
      }

      const postDataToSave = {
        ...formData,
        content: formData.content ? formData.content.trim() || null : null,
        image_url: imageUrl || null,
        section: formData.section || null,
        featured: formData.featured || false,
        trending: formData.trending || false,
      };

      if (editingPost) {
        const response = await fetch('/api/admin/posts', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': adminPassword,
          },
          body: JSON.stringify({
            postId: editingPost.id,
            postData: postDataToSave,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update post');
        }

        toast({ title: "Post updated!" });
      } else {
        const response = await fetch('/api/admin/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': adminPassword,
          },
          body: JSON.stringify(postDataToSave),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create post');
        }

        toast({ title: "Post created!" });
      }
      
      resetForm();
      loadPosts();
    } catch (error: any) {
      toast({ 
        title: "Failed to save post", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!adminPassword) {
      toast({ 
        title: "Not authenticated", 
        variant: "destructive" 
      });
      return;
    }

    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`/api/admin/posts?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': adminPassword,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete post');
      }

      toast({ title: "Post deleted!" });
      loadPosts();
    } catch (error: any) {
      toast({ 
        title: "Failed to delete post",
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image_url: '' });
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) {
      return formData.image_url || null;
    }

    if (!adminPassword) {
      toast({
        title: "Not authenticated",
        variant: "destructive",
      });
      return null;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'x-admin-password': adminPassword,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const { url } = await response.json();
      return url;
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.message?.includes('Bucket not found') || error.message?.includes('bucket')) {
        errorMessage = 'Storage bucket "posts" not found. Please create it in Supabase Dashboard > Storage. Make it public for images to be accessible.';
      }
      toast({
        title: "Failed to upload image",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content || '',
      type: post.type,
      section: post.section || '',
      read_time: post.read_time || '',
      published: post.published,
      image_url: post.image_url || '',
      featured: post.featured || false,
      trending: post.trending || false,
    });
    setImageFile(null);
    setImagePreview(post.image_url || null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      type: 'news',
      section: '',
      read_time: '',
      published: false,
      image_url: '',
      featured: false,
      trending: false,
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingPost(null);
    setShowForm(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center font-serif">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Enter'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showSubscribers) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => setShowSubscribers(false)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <h1 className="text-2xl font-serif">Mailing List Subscribers</h1>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              {subscribers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No subscribers yet</p>
              ) : (
                <div className="space-y-2">
                  {subscribers.map((sub) => (
                    <div key={sub.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span>{sub.email}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(sub.subscribed_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Site
              </Button>
            </Link>
            <h1 className="text-2xl font-serif">Admin</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadSubscribers}>
              <Users className="w-4 h-4 mr-2" /> Subscribers
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" /> New Post
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingPost ? 'Edit Post' : 'New Post'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label>Type</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fiction">Fiction</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Section (optional)</Label>
                  <Select value={formData.section} onValueChange={(v) => setFormData({ ...formData, section: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="News">News</SelectItem>
                      <SelectItem value="Local">Local</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Opinion">Opinion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Image (optional)</Label>
                  <div className="space-y-2">
                    {imagePreview && (
                      <div className="relative w-full h-48 rounded-md overflow-hidden border border-border">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm mb-1">Upload Image</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="cursor-pointer"
                          disabled={uploadingImage}
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm mb-1">Image URL</Label>
                        <Input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={formData.image_url}
                          onChange={(e) => {
                            setFormData({ ...formData, image_url: e.target.value });
                            if (e.target.value) {
                              setImageFile(null); // Clear file when URL is entered
                              setImagePreview(e.target.value);
                            } else if (!imageFile) {
                              setImagePreview(null);
                            }
                          }}
                          disabled={uploadingImage}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload an image file or paste an image URL. Images uploaded will be stored in Supabase Storage.
                    </p>
                  </div>
                </div>

                <div>
                  <Label>Excerpt (optional)</Label>
                  <Input
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Read Time (e.g., "5 min read")</Label>
                  <Input
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Content (optional)</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    placeholder="Post content... (optional)"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(v) => setFormData({ ...formData, featured: v })}
                  />
                  <Label>Featured (shows as main article)</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.trending}
                    onCheckedChange={(v) => setFormData({ ...formData, trending: v })}
                  />
                  <Label>Trending (shows in sidebar)</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(v) => setFormData({ ...formData, published: v })}
                  />
                  <Label>Published</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No posts yet. Create your first one!
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${post.type === 'fiction' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                          {post.type}
                        </span>
                        {!post.published && (
                          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            Draft
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg">{post.title}</h3>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
