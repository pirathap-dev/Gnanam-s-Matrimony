import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, Eye, Filter, Trash2, AlertTriangle, X, FileText, Image as ImageIcon, ArrowLeft, ArrowRight, ZoomIn, ZoomOut, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // holds submission to confirm delete
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pdfViewer, setPdfViewer] = useState({ open: false, url: '', page: 1, loading: false, isImage: false, zoom: 1, maxReached: false });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/admin/login');
          return;
        }
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/submissions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubmissions(response.data.data);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
        console.error('Failed to fetch', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [navigate]);

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/submissions/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(submissions.map(sub => sub._id === id ? { ...sub, status: newStatus } : sub));
      if (selectedSubmission?._id === id) {
        setSelectedSubmission({ ...selectedSubmission, status: newStatus });
      }
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error('Failed to update status. Please try again.');
    }
  };

  const handleDeleteClick = (submission) => {
    setDeleteConfirm(submission);
    setDeletePassword('');
    setDeleteError('');
  };

  const handleDeleteConfirm = async () => {
    if (!deletePassword) {
      setDeleteError('Please enter your admin password to confirm deletion.');
      return;
    }

    setDeleting(true);
    setDeleteError('');

    try {
      // First verify the admin password by attempting a login
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        username: 'admin', // We just need to verify password
        password: deletePassword,
      });

      // Password verified, proceed with deletion
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/submissions/${deleteConfirm._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSubmissions(submissions.filter(sub => sub._id !== deleteConfirm._id));
      if (selectedSubmission?._id === deleteConfirm._id) {
        setSelectedSubmission(null);
      }
      setDeleteConfirm(null);
      setDeletePassword('');
      toast.success('User deleted permanently. (Note: Cloudinary image CDN cache may take a few minutes to clear)', { duration: 6000 });
    } catch (error) {
      if (error.response?.status === 401) {
        setDeleteError('Incorrect password. Deletion cancelled.');
        toast.error('Incorrect password.');
      } else {
        setDeleteError('Failed to delete. Please try again.');
        toast.error('Failed to delete profile.');
      }
      console.error('Delete failed', error);
    } finally {
      setDeleting(false);
    }
  };

  // Handle PDF viewing gracefully by converting to PNG via Cloudinary
  const handleViewFile = (url) => {
    if (!url) return;
    
    if (url.includes('localhost')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    
    let viewUrl = url;
    if (url.endsWith('.pdf')) {
      viewUrl = viewUrl.replace(/\.pdf$/, '');
      viewUrl = viewUrl.replace('/raw/upload/', '/image/upload/');
      setPdfViewer({ open: true, url: viewUrl, page: 1, loading: true, isImage: false, zoom: 1, maxReached: false });
      return;
    }
    
    window.open(viewUrl, '_blank', 'noopener,noreferrer');
  };

  const handleViewProfileImage = (url) => {
    if (!url) return;
    setPdfViewer({ open: true, url, page: 1, loading: true, isImage: true, zoom: 1, maxReached: true });
  };

  const handleDownloadPDF = async () => {
    const toastId = toast.loading('Compiling document for download...');
    try {
      const doc = new jsPDF();
      let pageCount = 1;
      let hasMore = true;
      
      while (hasMore) {
        try {
          const imgUrl = `${pdfViewer.url.replace('/upload/', `/upload/pg_${pageCount}/`)}.png`;
          const res = await fetch(imgUrl);
          if (!res.ok) {
             hasMore = false;
             break;
          }
          const blob = await res.blob();
          
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
          
          const img = new window.Image();
          img.src = base64;
          await new Promise(r => img.onload = r);
          
          if (pageCount > 1) {
            doc.addPage();
            doc.setPage(pageCount);
          }
          
          const pdfWidth = doc.internal.pageSize.getWidth();
          const pdfHeight = (img.height * pdfWidth) / img.width;
          
          doc.addImage(img, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
          pageCount++;
        } catch (e) {
          hasMore = false;
        }
      }
      
      if (pageCount === 1) throw new Error('No pages found or network error');
      
      doc.save('document.pdf');
      toast.success('Downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to download PDF', { id: toastId });
    }
  };

  const handleDownloadImage = async () => {
    const toastId = toast.loading('Downloading image...');
    try {
      const res = await fetch(pdfViewer.url);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'profile_image.jpg';
      a.click();
      toast.success('Downloaded successfully!', { id: toastId });
    } catch (err) {
      toast.error('Failed to download image', { id: toastId });
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) return <div className="min-h-screen flex text-xl justify-center items-center font-bold">Loading Dashboard...</div>;

  return (
    <div className="flex h-screen bg-gray-100 font-sans relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gnanam-red text-white flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 sm:p-6 text-lg sm:text-xl font-bold border-b border-red-800 flex justify-between items-center">
          <span>Admin Panel</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-red-800 rounded-lg font-medium transition-colors text-sm sm:text-base">
            <Filter size={18} /> All Profiles
          </button>
        </nav>
        <div className="p-4 border-t border-red-800">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-800 rounded-lg font-medium transition-colors text-sm sm:text-base">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h2 className="font-bold text-lg text-gray-800">Submissions</h2>
          <button onClick={logout} className="p-2 hover:bg-gray-100 rounded-lg text-gnanam-red">
            <LogOut size={20} />
          </button>
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <h2 className="hidden lg:block text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Submissions</h2>
          
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3">
            {submissions.map((sub) => (
              <div key={sub._id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{sub.name}</h3>
                    <p className="text-sm text-gray-500">{sub.age} • {sub.religion} - {sub.caste}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    sub.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    sub.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {sub.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">{new Date(sub.createdAt).toLocaleDateString()}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedSubmission(sub)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-gnanam-orange/10 text-gnanam-orange hover:bg-gnanam-orange/20 py-2.5 rounded-lg text-sm font-semibold transition-colors active:scale-95"
                  >
                    <Eye size={16} /> View
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(sub)}
                    className="flex items-center justify-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors active:scale-95"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {submissions.length === 0 && (
              <div className="py-12 text-center text-gray-500 bg-white rounded-xl">No submissions found.</div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                    <th className="p-3 sm:p-4 font-semibold">Name</th>
                    <th className="p-3 sm:p-4 font-semibold">Age</th>
                    <th className="p-3 sm:p-4 font-semibold hidden md:table-cell">Religion/Caste</th>
                    <th className="p-3 sm:p-4 font-semibold hidden lg:table-cell">Date</th>
                    <th className="p-3 sm:p-4 font-semibold">Status</th>
                    <th className="p-3 sm:p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 sm:p-4 font-medium text-gray-900">{sub.name}</td>
                      <td className="p-3 sm:p-4 text-gray-600">{sub.age}</td>
                      <td className="p-3 sm:p-4 text-gray-600 hidden md:table-cell">{sub.religion} - {sub.caste}</td>
                      <td className="p-3 sm:p-4 text-gray-600 hidden lg:table-cell">{new Date(sub.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 sm:p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          sub.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          sub.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {sub.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <button 
                            onClick={() => setSelectedSubmission(sub)}
                            className="text-gnanam-orange hover:text-orange-800 flex items-center gap-1 text-sm font-semibold transition-colors"
                          >
                            <Eye size={16} /> View
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(sub)}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-semibold transition-colors"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {submissions.length === 0 && (
                    <tr><td colSpan="6" className="p-8 text-center text-gray-500">No submissions found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Details Modal / Panel */}
          {selectedSubmission && (
            <div className="fixed inset-0 bg-black/50 flex justify-end z-50" onClick={(e) => { if (e.target === e.currentTarget) setSelectedSubmission(null); }}>
              <div className="w-full max-w-2xl bg-white h-full overflow-y-auto p-4 sm:p-6 lg:p-8 shadow-2xl animate-fade-in-right">
                <div className="flex justify-between items-center mb-6 sm:mb-8 border-b pb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 truncate pr-4">{selectedSubmission.name}'s Profile</h3>
                  <button onClick={() => setSelectedSubmission(null)} className="text-gray-500 hover:text-gray-800 text-xl font-bold p-2 hover:bg-gray-100 rounded-full flex-shrink-0">&times;</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-6 gap-x-6 sm:gap-x-8 mb-6 sm:mb-8">
                  <div><span className="block text-xs sm:text-sm text-gray-500 mb-1">Age & Gender</span><p className="font-medium text-base sm:text-lg">{selectedSubmission.age}, {selectedSubmission.gender}</p></div>
                  <div><span className="block text-xs sm:text-sm text-gray-500 mb-1">Location</span><p className="font-medium text-base sm:text-lg">{selectedSubmission.location}</p></div>
                  <div><span className="block text-xs sm:text-sm text-gray-500 mb-1">Religion & Caste</span><p className="font-medium text-base sm:text-lg">{selectedSubmission.religion}, {selectedSubmission.caste}</p></div>
                  <div><span className="block text-xs sm:text-sm text-gray-500 mb-1">Education</span><p className="font-medium text-base sm:text-lg">{selectedSubmission.education}</p></div>
                  <div><span className="block text-xs sm:text-sm text-gray-500 mb-1">Job</span><p className="font-medium text-base sm:text-lg">{selectedSubmission.job}</p></div>
                  <div><span className="block text-xs sm:text-sm text-gray-500 mb-1">Phone / WhatsApp</span><p className="font-medium text-base sm:text-lg">{selectedSubmission.phone} / {selectedSubmission.whatsapp}</p></div>
                </div>

                <div className="mb-6 sm:mb-8">
                  <span className="block text-xs sm:text-sm text-gray-500 mb-2">Family Details</span>
                  <p className="bg-gray-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">{selectedSubmission.familyDetails}</p>
                </div>
                <div className="mb-6 sm:mb-8">
                  <span className="block text-xs sm:text-sm text-gray-500 mb-2">About</span>
                  <p className="bg-gray-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">{selectedSubmission.description}</p>
                </div>

                <div className="mb-6 sm:mb-8 bg-gnanam-cream p-4 sm:p-6 rounded-xl">
                  <h4 className="font-bold mb-3 sm:mb-4 text-gnanam-red text-sm sm:text-base">Partner Preferences</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
                    <p><strong>Age:</strong> {selectedSubmission.preferences.ageRange}</p>
                    <p><strong>Religion:</strong> {selectedSubmission.preferences.religion}</p>
                    <p><strong>Location:</strong> {selectedSubmission.preferences.location}</p>
                  </div>
                </div>

                <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {selectedSubmission.profileImageUrl && (
                    <button onClick={() => handleViewProfileImage(selectedSubmission.profileImageUrl)} className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 sm:p-3.5 rounded-lg font-medium text-sm sm:text-base transition-colors active:scale-95 w-full">
                      <ImageIcon size={18} /> View Profile Image
                    </button>
                  )}
                  {selectedSubmission.horoscopeFileUrl && (
                    <button onClick={() => handleViewFile(selectedSubmission.horoscopeFileUrl)} className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 sm:p-3.5 rounded-lg font-medium text-sm sm:text-base transition-colors active:scale-95 w-full">
                      <FileText size={18} /> View Horoscope
                    </button>
                  )}
                </div>

                <div className="border-t pt-4 sm:pt-6">
                  <span className="block text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Update Status</span>
                  <div className="flex flex-wrap gap-2 sm:gap-4">
                    {['new', 'contacted', 'matched'].map(status => (
                      <button 
                        key={status}
                        onClick={() => updateStatus(selectedSubmission._id, status)}
                        className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-semibold capitalize text-sm sm:text-base active:scale-95 transition-all ${
                          selectedSubmission.status === status 
                            ? 'bg-gnanam-red text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delete Button inside Panel */}
                <div className="mt-6 sm:mt-8 border-t pt-4 sm:pt-6">
                  <button 
                    onClick={() => handleDeleteClick(selectedSubmission)}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 py-3 sm:py-3.5 rounded-lg font-bold text-sm sm:text-base transition-colors active:scale-95 border border-red-200"
                  >
                    <Trash2 size={18} /> Delete This Profile Permanently
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal with Password */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4" onClick={(e) => { if (e.target === e.currentTarget) { setDeleteConfirm(null); setDeletePassword(''); setDeleteError(''); }}}>
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-fade-in-up">
                <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-red-100 rounded-full mb-4 sm:mb-5">
                  <AlertTriangle size={28} className="text-red-600 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">Confirm Deletion</h3>
                <p className="text-gray-600 text-center text-sm sm:text-base mb-2">
                  You are about to permanently delete <strong className="text-gray-900">{deleteConfirm.name}</strong>'s profile.
                </p>
                <p className="text-red-500 text-xs sm:text-sm text-center mb-5 sm:mb-6 font-medium">
                  This will also remove the profile image and horoscope from Cloudinary. This action cannot be undone.
                </p>
                
                <div className="mb-4 sm:mb-5">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Enter Admin Password to Confirm</label>
                  <input 
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Your admin password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm sm:text-base"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleDeleteConfirm(); }}
                    autoFocus
                  />
                  {deleteError && <p className="text-red-500 text-xs sm:text-sm mt-2 font-medium">{deleteError}</p>}
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => { setDeleteConfirm(null); setDeletePassword(''); setDeleteError(''); }}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm sm:text-base transition-colors active:scale-95"
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm sm:text-base transition-colors active:scale-95 disabled:opacity-60"
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Delete Permanently'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* In-App PDF Viewer Modal */}
          {pdfViewer.open && (
            <div className="fixed inset-0 bg-black/95 flex flex-col z-[80] animate-fade-in-up">
              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-3 sm:p-5 text-white border-b border-gray-800/80 relative min-h-[60px]">
                <h3 className="text-base sm:text-2xl font-bold flex items-center gap-2 pr-12">
                  <span className="truncate max-w-[150px] sm:max-w-none">{pdfViewer.isImage ? 'Profile Image' : 'Document'}</span>
                  {!pdfViewer.isImage && (
                    <span className="text-gnanam-orange text-xs sm:text-base font-semibold px-2 sm:px-3 py-1 bg-gray-900 rounded-full flex-shrink-0">Page {pdfViewer.page}</span>
                  )}
                </h3>
                
                <div className="flex items-center gap-2 sm:gap-4 mt-3 sm:mt-0 w-full sm:w-auto">
                  <button onClick={() => setPdfViewer(prev => ({ ...prev, zoom: prev.zoom + 0.2 }))} className="p-2 sm:p-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-white flex-shrink-0" title="Zoom In">
                    <ZoomIn size={18} />
                  </button>
                  <button onClick={() => setPdfViewer(prev => ({ ...prev, zoom: Math.max(0.2, prev.zoom - 0.2) }))} className="p-2 sm:p-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-white flex-shrink-0" title="Zoom Out">
                    <ZoomOut size={18} />
                  </button>
                  <button 
                    onClick={pdfViewer.isImage ? handleDownloadImage : handleDownloadPDF} 
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gnanam-red hover:bg-red-800 text-white font-bold text-sm sm:text-base rounded-lg sm:ml-2 whitespace-nowrap"
                  >
                    <Download size={16} /> <span>Download</span>
                  </button>
                </div>

                <button 
                  onClick={() => setPdfViewer({ ...pdfViewer, open: false })} 
                  className="absolute top-2 right-2 sm:static p-2 hover:bg-gray-800 text-gray-300 hover:text-white rounded-full transition-colors sm:ml-4 flex-shrink-0"
                >
                  <X size={24} className="sm:w-7 sm:h-7" />
                </button>
              </div>
              
              <div className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-8 relative bg-[#0f0f0f]">
                {pdfViewer.loading && (
                  <div className="absolute flex flex-col items-center gap-3 text-white z-10 animate-pulse">
                    <div className="w-10 h-10 border-4 border-gray-600 border-t-gnanam-orange rounded-full animate-spin"></div>
                    <span className="font-bold tracking-widest text-sm">LOADING...</span>
                  </div>
                )}
                
                <div className="w-full h-full flex items-start justify-center overflow-auto p-4 sm:p-8">
                  <div style={{ width: `${pdfViewer.zoom * 100}%`, transition: 'width 0.25s ease-out' }} className="flex justify-center flex-shrink-0">
                    <img 
                      src={pdfViewer.isImage ? pdfViewer.url : `${pdfViewer.url.replace('/upload/', `/upload/pg_${pdfViewer.page}/`)}.png`} 
                      alt={`Document View`}
                      style={{ height: pdfViewer.zoom === 1 ? '85vh' : 'auto' }}
                      className={`max-w-full object-contain shadow-[0_0_40px_rgba(0,0,0,0.5)] pointer-events-auto ${pdfViewer.loading ? 'opacity-0' : 'opacity-100'}`}
                      onLoad={() => setPdfViewer(prev => ({ ...prev, loading: false }))}
                      onError={(e) => {
                        if (!pdfViewer.isImage && pdfViewer.page > 1) {
                          toast.error("You've reached the end of the document.");
                          setPdfViewer(prev => ({ ...prev, page: prev.page - 1, loading: false, maxReached: true }));
                        } else {
                          toast.error("Failed to load document.");
                          setPdfViewer(prev => ({ ...prev, loading: false }));
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {!pdfViewer.isImage && (
                <div className="p-4 border-t border-gray-800 flex justify-center gap-4 bg-black/80">
                  <button 
                    disabled={pdfViewer.page === 1}
                    onClick={() => setPdfViewer(prev => ({ ...prev, page: prev.page - 1, loading: true, maxReached: false }))}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 font-bold transition-colors active:scale-95"
                  >
                    <ArrowLeft size={18} className="hidden sm:block" /> Previous
                  </button>
                  <button 
                    disabled={pdfViewer.maxReached}
                    onClick={() => setPdfViewer(prev => ({ ...prev, page: prev.page + 1, loading: true }))}
                    className="flex items-center gap-2 px-8 py-3 bg-gnanam-red text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-800 font-bold shadow-xl shadow-red-900/20 transition-all active:scale-95"
                  >
                    Next Page <ArrowRight size={18} className="hidden sm:block" /> 
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
