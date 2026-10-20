import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, MapPin, Send, CheckCircle, AlertCircle, Loader2, Image, X, Map, Users, Shield, Wind, Flame, TreePine, Mountain, ThumbsUp, ThumbsDown } from 'lucide-react';
import { apiClient, isApiConfigured } from '../services/api';

const hazardTypes = [
  { value: 'smoke', icon: Wind, labelKey: 'report.form.hazardTypes.smoke' },
  { value: 'activeFire', icon: Flame, labelKey: 'report.form.hazardTypes.activeFire' },
  { value: 'fallenTrees', icon: TreePine, labelKey: 'report.form.hazardTypes.fallenTrees' },
  { value: 'landslide', icon: Mountain, labelKey: 'report.form.hazardTypes.landslide' },
];

// Offline-safe persistence: reports queue locally and POST once a backend exists.
const QUEUED_KEY = 'aura_queued_reports';

const loadQueued = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(QUEUED_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

const tabButtonClass = (isActive) => `
  px-6 py-3 rounded-xl font-medium transition-all ${isActive
    ? 'bg-accent text-black'
    : 'bg-card hover:bg-card-hover'
  }`;

export default function Report() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('submit');
  const [formData, setFormData] = useState({
    photo: null,
    photoPreview: null,
    location: '',
    hazardType: 'smoke',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [queuedReports, setQueuedReports] = useState(loadQueued);
  const [liveReports, setLiveReports] = useState([]);
  const [votes, setVotes] = useState({});
  const [visibleCount, setVisibleCount] = useState(3);
  const fileInputRef = useRef(null);
  const tabRefs = useRef([]);
  const reportTabs = ['submit', 'feed'];

  // Real reports from the backend when it is connected.
  useEffect(() => {
    if (!isApiConfigured()) return;
    apiClient.getReports(undefined, 50).then(res => {
      if (res.success && Array.isArray(res.data)) setLiveReports(res.data);
    });
  }, []);

  // Community feed = backend reports + queued (offline) reports. No filler samples.
  const displayReports = [
    ...liveReports.map(r => ({
      id: r.id,
      type: r.hazardType,
      verified: !!r.verified,
      votes: r.votes || 0,
      location: r.location,
      coords: r.coordinates ? `${r.coordinates[0]}, ${r.coordinates[1]}` : r.location,
      reporter: r.reporter || '—',
      description: r.description,
      time: r.timestamp
        ? new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '—',
    })),
    ...queuedReports.map(r => ({
      id: r.id,
      user: true,
      type: r.hazardType,
      verified: false,
      votes: r.votes || 0,
      location: r.location,
      coords: r.lat != null && r.lng != null ? `${r.lat}, ${r.lng}` : r.location,
      reporter: t('report.communityFeed.you'),
      description: r.description,
      time: r.timestamp
        ? new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '—',
    })),
  ];

  const handleTabKeyDown = (e, index) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const next = e.key === 'ArrowRight'
      ? (index + 1) % reportTabs.length
      : (index - 1 + reportTabs.length) % reportTabs.length;
    setActiveTab(reportTabs[next]);
    tabRefs.current[next]?.focus();
  };

  const handleVote = (id, dir) => {
    if (isApiConfigured() && !String(id).startsWith('local-')) {
      apiClient.voteReport(String(id), dir);
    }
    setVotes(prev => {
      const cur = prev[id] || { up: 0, down: 0, mine: null };
      if (cur.mine === dir) {
        return { ...prev, [id]: { up: cur.up - (dir === 'up' ? 1 : 0), down: cur.down - (dir === 'down' ? 1 : 0), mine: null } };
      }
      return {
        ...prev,
        [id]: {
          up: cur.up + (dir === 'up' ? 1 : 0) - (cur.mine === 'up' ? 1 : 0),
          down: cur.down + (dir === 'down' ? 1 : 0) - (cur.mine === 'down' ? 1 : 0),
          mine: dir,
        },
      };
    });
  };

  const handlePhotoUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) {
        setSubmitStatus({ type: 'error', message: t('report.form.photoTooLarge') });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          photo: file,
          photoPreview: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-accent', 'bg-accent/5');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-accent', 'bg-accent/5');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-accent', 'bg-accent/5');
    if (e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  };

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setSubmitStatus({ type: 'error', message: t('report.form.geolocationUnsupported') });
      return;
    }

    setFormData(prev => ({ ...prev, location: t('common.loading') }));
    const formatCoords = (latitude, longitude) =>
      `${Math.abs(latitude).toFixed(6)}°${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude).toFixed(6)}°${longitude >= 0 ? 'E' : 'W'}`;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ ...prev, location: formatCoords(latitude, longitude) }));
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        setFormData(prev => ({ ...prev, location: '' }));
        const message = error && error.code === error.PERMISSION_DENIED
          ? t('report.form.geolocationDenied')
          : t('report.form.geolocationFailed');
        setSubmitStatus({ type: 'error', message });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.photo || !formData.location || !formData.description.trim()) {
      setSubmitStatus({ type: 'error', message: t('report.form.fillRequired') });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const payload = {
      hazardType: formData.hazardType,
      description: formData.description.trim(),
      location: formData.location,
      lat: userLocation?.lat,
      lng: userLocation?.lng,
      photoName: formData.photo?.name || null,
    };

    // Try the real backend first; queue locally when it is unreachable.
    let saved = false;
    try {
      const res = await apiClient.submitReport(payload);
      saved = res?.success === true;
    } catch {
      saved = false;
    }

    if (!saved) {
      const entry = {
        ...payload,
        id: `local-${Date.now()}`,
        timestamp: Date.now(),
        verified: false,
        votes: 0,
      };
      const next = [entry, ...loadQueued()].slice(0, 50);
      try {
        localStorage.setItem(QUEUED_KEY, JSON.stringify(next));
      } catch {
        // storage full/private — report still confirmed below
      }
      setQueuedReports(next);
    }

    setIsSubmitting(false);
    setSubmitStatus({ type: 'success', message: saved ? t('report.form.success') : t('report.form.queuedOffline') });

    setFormData({
      photo: null,
      photoPreview: null,
      location: userLocation ? `${userLocation.lat.toFixed(6)}°N, ${Math.abs(userLocation.lng).toFixed(6)}°${userLocation.lng >= 0 ? 'E' : 'W'}` : '',
      hazardType: 'smoke',
      description: '',
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null, photoPreview: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const HazardBadge = ({ type, verified }) => {
    const hazard = hazardTypes.find(h => h.value === type);
    return (
      <span className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-glass">
        {hazard?.icon && <hazard.icon className="w-4 h-4" />}
        <span>{t(hazard?.labelKey || type)}</span>
        {verified && (
          <span className="flex items-center space-x-0.5 text-accent">
            <Shield className="w-3 h-3" />
            <span>{t('report.communityFeed.verified')}</span>
          </span>
        )}
      </span>
    );
  };

  return (
    <section id="report" className="py-20 sm:py-28" aria-labelledby="report-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="report-title" className="section-title">{t('report.title')}</h2>
          <p className="section-subtitle">{t('report.subtitle')}</p>
        </div>

        <div className="mb-8" role="tablist" aria-label={t('report.title')}>
          <button
            ref={el => (tabRefs.current[0] = el)}
            onClick={() => setActiveTab('submit')}
            onKeyDown={(e) => handleTabKeyDown(e, 0)}
            className={tabButtonClass(activeTab === 'submit')}
            role="tab"
            id="tab-submit"
            aria-selected={activeTab === 'submit'}
            aria-controls="submit-panel"
            tabIndex={activeTab === 'submit' ? 0 : -1}
          >
            <Send className="w-4 h-4 me-2 inline" />
            {t('report.form.title')}
          </button>
          <button
            ref={el => (tabRefs.current[1] = el)}
            onClick={() => setActiveTab('feed')}
            onKeyDown={(e) => handleTabKeyDown(e, 1)}
            className={tabButtonClass(activeTab === 'feed') + ' ms-2'}
            role="tab"
            id="tab-feed"
            aria-selected={activeTab === 'feed'}
            aria-controls="feed-panel"
            tabIndex={activeTab === 'feed' ? 0 : -1}
          >
            <Users className="w-4 h-4 me-2 inline" />
            {t('report.communityFeed.title')}
          </button>
        </div>

        {activeTab === 'submit' && (
          <div id="submit-panel" role="tabpanel" aria-labelledby="tab-submit" tabIndex={0} className="animate-slide-up">
            <form onSubmit={handleSubmit} className="bg-card p-6 sm:p-8 max-w-2xl mx-auto" noValidate>
              {submitStatus && (
                <div
                  role="alert"
                  className={`mb-6 p-4 rounded-xl flex items-center space-x-3 border ${
                    submitStatus.type === 'success'
                      ? 'bg-success border-success'
                      : 'bg-danger border-danger'
                  }`}
                >
                  {submitStatus.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
                  )}
                  <span className="text-sm text-primary">{submitStatus.message}</span>
                </div>
              )}
              <div className="mb-6">
                <label id="photo-upload-label" className="block text-sm font-medium text-secondary mb-3 flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-accent" />
                  <span>{t('report.form.photo')}</span>
                </label>
                <div
                  className={`relative border-2 border-dashed p-5 sm:p-8 text-center transition-all ${
                    formData.photoPreview
                      ? 'border-transparent'
                      : 'border-subtle hover:border-accent/50 hover:bg-accent/5'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    aria-labelledby="photo-upload-label"
                    onChange={(e) => e.target.files[0] && handlePhotoUpload(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="photo-upload"
                    disabled={isSubmitting}
                  />
                  {formData.photoPreview ? (
                    <div className="relative max-w-md mx-auto">
                      <img
                        src={formData.photoPreview}
                        alt="Uploaded photo preview"
                        className="w-full h-64 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute top-2 end-2 p-2 bg-danger text-primary-dark rounded-full hover:bg-danger/80 transition-colors"
                        aria-label={t('report.form.removePhoto')}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Image className="w-12 h-12 mx-auto mb-4 text-muted" />
                      <p className="text-secondary mb-1">{t('report.form.photoHint')}</p>
                      <p className="text-sm text-muted">{t('report.form.clickOrDrag')}</p>
                      <label htmlFor="photo-upload" className="mt-4 inline-block">
                        <span className="btn-secondary">{t('common.upload')}</span>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="report-location" className="block text-sm font-medium text-secondary mb-3 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span>{t('report.form.location')}</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                  <input
                    id="report-location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="34.05 -118.24"
                    className="input-field flex-1 min-w-0 font-mono"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="btn-secondary flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                    disabled={isSubmitting}
                  >
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    <span>{t('report.form.getLocation')}</span>
                  </button>
                </div>
                <p className="text-xs text-muted mt-2 font-mono">{'> '}{t('report.form.locationHint')}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary mb-3 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-accent" />
                  <span>{t('report.form.hazardType')}</span>
                </label>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2" role="radiogroup" aria-label={t('report.form.hazardType')}>
                  {hazardTypes.map((hazard, hIndex) => (
                    <button
                      key={hazard.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, hazardType: hazard.value }))}
                      onKeyDown={(e) => {
                        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
                        e.preventDefault();
                        const dir = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : -1;
                        const next = hazardTypes[(hIndex + dir + hazardTypes.length) % hazardTypes.length];
                        setFormData(prev => ({ ...prev, hazardType: next.value }));
                        document.getElementById(`hazard-${next.value}`)?.focus();
                      }}
                      id={`hazard-${hazard.value}`}
                      className={`relative p-4 rounded-xl text-start transition-all ${
                        formData.hazardType === hazard.value
                          ? 'ring-2 ring-accent bg-accent/10'
                          : 'bg-card hover:bg-card-hover'
                      }`}
                      role="radio"
                      aria-checked={formData.hazardType === hazard.value}
                      tabIndex={formData.hazardType === hazard.value ? 0 : -1}
                    >
                      <div className="flex items-center space-x-3">
                        {hazard.icon && <hazard.icon className="w-6 h-6 text-accent" />}
                        <span className="font-medium text-primary">{t(hazard.labelKey)}</span>
                      </div>
                      {formData.hazardType === hazard.value && (
                        <CheckCircle className="absolute top-2 end-2 w-5 h-5 text-accent" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label htmlFor="report-description" className="block text-sm font-medium text-secondary mb-3">
                  {t('report.form.description')}
                </label>
                <textarea
                  id="report-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('report.form.descriptionPlaceholder')}
                  rows={4}
                  className="textarea-field resize-none"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !formData.photo || !formData.location || !formData.description.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                    {t('report.form.submitting')}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" aria-hidden="true" />
                    {t('report.form.submit')}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'feed' && (
          <div id="feed-panel" role="tabpanel" aria-labelledby="tab-feed" tabIndex={0} className="animate-slide-up">
            <div className="bg-card p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h3 className="font-semibold text-lg flex items-center space-x-2">
                  <Map className="w-5 h-5 text-accent" />
                  <span className="text-primary">{t('report.communityFeed.title')}</span>
                </h3>
                <div className="flex items-center space-x-4 text-sm text-secondary">
                  <span className="flex items-center space-x-1">
                    <Shield className="w-4 h-4 text-accent" />
                    <span>{displayReports.filter(r => r.verified).length} {t('report.communityFeed.verified')}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-warning">
                    <AlertCircle className="w-4 h-4" />
                    <span>{displayReports.filter(r => !r.verified).length} {t('report.communityFeed.pending')}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {displayReports.length === 0 && (
                  <p className="text-center text-xs font-mono text-muted py-10 border border-subtle bg-glass" dir="auto">
                    [ {t('report.communityFeed.empty')} ]
                  </p>
                )}
                {displayReports.slice(0, visibleCount).map(report => {
                  const item = report.user ? report : t(`report.communityFeed.items.${report.id}`, { returnObjects: true });
                  if (!item || typeof item !== 'object') return null;
                  const vote = votes[report.id] || { up: report.votes, down: 0, mine: null };
                  return (
                    <div
                      key={report.id}
                      className="p-6 rounded-xl border border-subtle transition-all bg-glass hover:bg-card-hover"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div className="flex items-center space-x-3">
                          <HazardBadge type={report.type} verified={report.verified} />
                          <div>
                            <p className="font-medium text-primary">{item.location}</p>
                            <p className="text-xs text-muted">{item.coords}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-muted">
                          <span className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{item.reporter}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{item.time}</span>
                          </span>
                        </div>
                      </div>
                      <p className="text-secondary mb-3">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm" role="group" aria-label={t('report.communityFeed.title')}>
                          <button
                            onClick={() => handleVote(report.id, 'up')}
                            aria-pressed={vote.mine === 'up'}
                            aria-label={t('report.communityFeed.upvote')}
                            className={`flex items-center space-x-1 transition-colors ${vote.mine === 'up' ? 'text-accent' : 'text-secondary hover:text-accent'}`}
                          >
                            <ThumbsUp className="w-5 h-5" />
                            <span>{vote.up}</span>
                          </button>
                          <button
                            onClick={() => handleVote(report.id, 'down')}
                            aria-pressed={vote.mine === 'down'}
                            aria-label={t('report.communityFeed.downvote')}
                            className={`flex items-center space-x-1 transition-colors ${vote.mine === 'down' ? 'text-danger' : 'text-secondary hover:text-danger'}`}
                          >
                            <ThumbsDown className="w-5 h-5" />
                            <span>{vote.down}</span>
                          </button>
                        </div>
                        {report.user ? (
                          <span className="text-xs px-3 py-1.5 bg-warning/20 text-warning rounded-full">
                            {t('report.communityFeed.queued')}
                          </span>
                        ) : !report.verified && (
                          <span className="text-xs px-3 py-1.5 bg-warning/20 text-warning rounded-full">
                            {t('report.communityFeed.pending')}
                          </span>
                        )
                      }
                      </div>
                    </div>
                  );
                })}
              </div>

              {visibleCount < displayReports.length && (
                <div className="mt-6 text-center">
                  <button className="btn-secondary" onClick={() => setVisibleCount(displayReports.length)}>
                    {t('common.loadMore')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}