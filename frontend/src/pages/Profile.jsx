import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { profileService } from '../services';
import { getStoredUser, storeAuthToken, clearAuth, formatPrice } from '../utils/helpers';

// ── Tiny helpers ──────────────────────────────────────────────
function Avatar({ user, size = 'lg' }) {
  const dim = size === 'lg' ? 'w-24 h-24 text-3xl' : 'w-10 h-10 text-base';
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  if (user?.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={user.name}
        className={`${dim} rounded-full object-cover ring-4 ring-white dark:ring-slate-700 shadow-lg`}
      />
    );
  }
  return (
    <div className={`${dim} rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-black text-white ring-4 ring-white dark:ring-slate-700 shadow-lg`}>
      {initials}
    </div>
  );
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  const styles = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-bold ${styles[type]}`}
    >
      <span>{type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
      <span>{msg}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">✕</button>
    </motion.div>
  );
}

function Section({ title, icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <h2 className="font-black text-slate-800 dark:text-white text-base">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

const statusColors = {
  pending:   'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export default function Profile() {
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Edit states
  const [editingInfo, setEditingInfo] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form data
  const [infoForm, setInfoForm] = useState({ name: '', phone: '', bio: '' });
  const [addressForm, setAddressForm] = useState({ city: '', address: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  // ── Load profile ──────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          profileService.getProfile(),
          profileService.getOrderHistory(),
        ]);
        const p = profileRes.data.data;
        setProfile(p);
        setInfoForm({ name: p.name || '', phone: p.phone || '', bio: p.bio || '' });
        setAddressForm({ city: p.city || '', address: p.address || '' });
        setOrders(ordersRes.data.data || []);
      } catch {
        showToast('Failed to load profile', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Save personal info ────────────────────────────────────────
  const handleSaveInfo = async () => {
    if (!infoForm.name.trim()) return showToast('Name is required', 'error');
    setSaving(true);
    try {
      const res = await profileService.updateProfile(infoForm);
      const updated = res.data.data;
      setProfile(prev => ({ ...prev, ...updated }));
      // Update localStorage so Navbar reflects new name
      const storedUser = getStoredUser();
      if (storedUser) {
        localStorage.setItem('user', JSON.stringify({ ...storedUser, name: updated.name }));
        window.dispatchEvent(new Event('storage'));
      }
      setEditingInfo(false);
      showToast('Profile updated!');
    } catch (e) {
      showToast(e.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Save address ──────────────────────────────────────────────
  const handleSaveAddress = async () => {
    setSaving(true);
    try {
      const res = await profileService.updateProfile(addressForm);
      setProfile(prev => ({ ...prev, ...res.data.data }));
      setEditingAddress(false);
      showToast('Address saved!');
    } catch {
      showToast('Could not save address', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Upload avatar ─────────────────────────────────────────────
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await profileService.updateAvatar(fd);
      setProfile(prev => ({ ...prev, avatar_url: res.data.data.avatar_url }));
      showToast('Avatar updated!');
    } catch {
      showToast('Avatar upload failed', 'error');
    } finally {
      setAvatarLoading(false);
    }
  };

  // ── Change password ───────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword)
      return showToast('Passwords do not match', 'error');
    if (pwForm.newPassword.length < 6)
      return showToast('Password must be at least 6 characters', 'error');
    setSaving(true);
    try {
      await profileService.changePassword(pwForm.currentPassword, pwForm.newPassword);
      showToast('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
    } catch (e) {
      showToast(e.response?.data?.message || 'Password change failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete account ────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    try {
      await profileService.deleteAccount();
      clearAuth();
      navigate('/');
    } catch {
      showToast('Could not delete account', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-semibold">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Hero Banner */}
      <div className="relative h-36 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Card */}
        <div className="relative -mt-14 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              {/* Avatar */}
              <div className="relative">
                <Avatar user={profile} size="lg" />
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarLoading}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center text-sm shadow-lg transition disabled:opacity-50"
                  title="Change photo"
                >
                  {avatarLoading ? <span className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : '📷'}
                </button>
                <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </div>

              {/* Name & meta */}
              <div className="flex-1">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{profile?.name}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{profile?.email}</p>
                {profile?.bio && (
                  <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 italic">"{profile.bio}"</p>
                )}
                <div className="flex flex-wrap gap-3 mt-3">
                  {profile?.city && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      📍 {profile.city}
                    </span>
                  )}
                  {profile?.phone && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      📞 {profile.phone}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    📦 {orders.length} orders
                  </span>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setEditingInfo(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition"
                >
                  ✏️ Edit Profile
                </button>
                <Link
                  to="/orders"
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl transition"
                >
                  📦 All Orders
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* ── Personal Info ── */}
            <Section title="Personal Information" icon="👤">
              <AnimatePresence mode="wait">
                {editingInfo ? (
                  <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                        <input
                          value={infoForm.name} onChange={e => setInfoForm(p => ({ ...p, name: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                        <input
                          value={infoForm.phone} onChange={e => setInfoForm(p => ({ ...p, phone: e.target.value }))}
                          placeholder="+250 7XX XXX XXX"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bio / About Me</label>
                      <textarea
                        value={infoForm.bio} onChange={e => setInfoForm(p => ({ ...p, bio: e.target.value }))}
                        rows={3} placeholder="Tell us a little about yourself..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleSaveInfo} disabled={saving}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition disabled:opacity-60 flex items-center gap-2">
                        {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : null}
                        Save Changes
                      </button>
                      <button onClick={() => setEditingInfo(false)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition hover:bg-slate-200">
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    {[
                      { label: 'Full Name', value: profile?.name, icon: '👤' },
                      { label: 'Email Address', value: profile?.email, icon: '📧' },
                      { label: 'Phone Number', value: profile?.phone || 'Not set', icon: '📞' },
                      { label: 'Bio', value: profile?.bio || 'No bio yet', icon: '✍️' },
                    ].map(f => (
                      <div key={f.label} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40">
                        <span className="text-lg mt-0.5">{f.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{f.label}</p>
                          <p className="text-slate-800 dark:text-white font-semibold mt-0.5">{f.value}</p>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setEditingInfo(true)} className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline mt-2">
                      ✏️ Edit information
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Section>

            {/* ── Delivery Address ── */}
            <Section title="Delivery Address" icon="📍">
              <AnimatePresence mode="wait">
                {editingAddress ? (
                  <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">City / District</label>
                      <input
                        value={addressForm.city} onChange={e => setAddressForm(p => ({ ...p, city: e.target.value }))}
                        placeholder="e.g. Kigali, Gasabo"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Street Address / Sector</label>
                      <textarea
                        value={addressForm.address} onChange={e => setAddressForm(p => ({ ...p, address: e.target.value }))}
                        rows={2} placeholder="e.g. KG 123 St, near Kigali Heights..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleSaveAddress} disabled={saving}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition disabled:opacity-60 flex items-center gap-2">
                        {saving && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                        Save Address
                      </button>
                      <button onClick={() => setEditingAddress(false)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition">
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {profile?.city || profile?.address ? (
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl space-y-1">
                        {profile.city && <p className="font-bold text-slate-800 dark:text-white">📍 {profile.city}</p>}
                        {profile.address && <p className="text-slate-600 dark:text-slate-300 text-sm">{profile.address}</p>}
                      </div>
                    ) : (
                      <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center">
                        <p className="text-3xl mb-2">📍</p>
                        <p className="text-slate-500 font-semibold text-sm">No address saved yet</p>
                        <p className="text-slate-400 text-xs mt-1">Add your address for faster checkout</p>
                      </div>
                    )}
                    <button onClick={() => setEditingAddress(true)} className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline mt-4 block">
                      {profile?.city ? '✏️ Edit address' : '➕ Add address'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Section>

            {/* ── Recent Orders ── */}
            <Section title="Recent Orders" icon="📦">
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-4xl mb-3">🍽️</p>
                  <p className="text-slate-500 font-semibold">No orders yet</p>
                  <Link to="/" className="mt-3 inline-block text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                    Browse the menu →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/60 transition">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white text-sm">Order #{order.id}</p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          {order.items?.filter(Boolean).slice(0, 2).map(i => i.name).join(', ')}
                          {order.items?.length > 2 ? ` +${order.items.length - 2} more` : ''}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('en-RW', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || statusColors.pending}`}>
                          {order.status}
                        </span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                          {formatPrice(order.total_price)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length > 5 && (
                    <Link to="/orders" className="block text-center text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline mt-2">
                      View all {orders.length} orders →
                    </Link>
                  )}
                </div>
              )}
            </Section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* ── Stats Card ── */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-black text-lg mb-4">Your Stats</h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Orders', value: orders.length, icon: '📦' },
                  { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: '✅' },
                  {
                    label: 'Total Spent',
                    value: formatPrice(orders.reduce((s, o) => s + Number(o.total_price), 0)),
                    icon: '💰',
                  },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between bg-white/15 rounded-xl px-4 py-3">
                    <span className="text-sm font-semibold flex items-center gap-2">{s.icon} {s.label}</span>
                    <span className="font-black">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Account Settings ── */}
            <Section title="Account Settings" icon="⚙️">
              <div className="space-y-2">
                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition text-left"
                >
                  <span className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                    🔐 Change Password
                  </span>
                  <span className="text-slate-400 text-xs">{showChangePassword ? '▲' : '▼'}</span>
                </button>

                <AnimatePresence>
                  {showChangePassword && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleChangePassword}
                      className="overflow-hidden space-y-3 pt-2"
                    >
                      {[
                        { key: 'currentPassword', label: 'Current Password', placeholder: '••••••••' },
                        { key: 'newPassword', label: 'New Password', placeholder: 'Min. 6 characters' },
                        { key: 'confirmPassword', label: 'Confirm New Password', placeholder: '••••••••' },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{f.label}</label>
                          <input
                            type="password"
                            value={pwForm[f.key]}
                            onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
                          />
                        </div>
                      ))}
                      <button type="submit" disabled={saving}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-sm disabled:opacity-60">
                        Update Password
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                <Link
                  to="/cart"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition text-sm font-bold text-slate-700 dark:text-slate-200"
                >
                  🛒 My Cart
                </Link>

                <Link
                  to="/orders"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition text-sm font-bold text-slate-700 dark:text-slate-200"
                >
                  📦 Order History
                </Link>

                <button
                  onClick={() => { clearAuth(); navigate('/login'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition text-sm font-bold text-red-600 dark:text-red-400"
                >
                  🚪 Sign Out
                </button>
              </div>
            </Section>

            {/* ── Danger Zone ── */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/40 overflow-hidden">
              <div className="px-6 py-4 border-b border-red-100 dark:border-red-900/40">
                <h2 className="font-black text-red-600 dark:text-red-400 text-base flex items-center gap-2">⚠️ Danger Zone</h2>
              </div>
              <div className="p-6">
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-2.5 border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition text-sm"
                  >
                    🗑️ Delete My Account
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold">
                      This will permanently delete your account and all data. This cannot be undone.
                    </p>
                    <button onClick={handleDeleteAccount}
                      className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition text-sm">
                      Yes, Delete My Account
                    </button>
                    <button onClick={() => setShowDeleteConfirm(false)}
                      className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition text-sm">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
