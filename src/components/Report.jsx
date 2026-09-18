import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, MapPin, Send, CheckCircle, AlertCircle, Loader2, Image, X, Map, Users, Shield, Wind, Flame, TreePine, Mountain, ThumbsUp, ThumbsDown } from 'lucide-react';

const hazardTypes = [
  { value: 'smoke', icon: Wind, labelKey: 'report.form.hazardTypes.smoke' },
  { value: 'activeFire', icon: Flame, labelKey: 'report.form.hazardTypes.activeFire' },
  { value: 'fallenTrees', icon: TreePine, labelKey: 'report.form.hazardTypes.fallenTrees' },
  { value: 'landslide', icon: Mountain, labelKey: 'report.form.hazardTypes.landslide' },
];

const mockReports = [
  { id: 1, type: 'activeFire', location: 'Big Sur, CA', coords: '36.27°N, 121.80°W', description: 'Active flames visible on ridge line, moving north', verified: true, reporter: 'Fire Watcher #847', time: '15 min ago', votes: 23 },
  { id: 2, type: 'smoke', location: 'Santa Cruz Mountains', coords: '37.12°N, 122.05°W', description: 'Heavy smoke column rising, visibility < 1 mile', verified: true, reporter: 'Local Resident', time: '42 min ago', votes: 18 },
  { id: 3, type: 'fallenTrees', location: 'Highway 17 Summit', coords: '37.15°N, 121.98°W', description: 'Multiple large trees blocking both lanes', verified: false, reporter: 'Commuter', time: '2 hours ago', votes: 12 },
  { id: 4, type: 'landslide', location: 'Pacific Coast Highway', coords: '34.42°N, 119.70°W', description: 'Debris flow covering road after heavy rain', verified: true, reporter: 'Caltrans', time: '4 hours ago', votes: 31 },
  { id: 5, type: 'smoke', location: 'East Bay Hills', coords: '37.85°N, 122.18°W', description: 'Smoke drifting into residential areas', verified: false, reporter: 'Community Watch', time: '5 hours ago', votes: 7 },
];

const tabButtonClass = (isActive) => `
  px-6 py-3 rounded-xl font-medium transition-all ${isActive
    ? 'bg-accent-green text-primary-dark'
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
  const [votes, setVotes] = useState(() =>
    Object.fromEntries(mockReports.map(r => [r.id, { up: r.votes, down: 2, mine: null }]))
  );
  const [visibleCount, setVisibleCount] = useState(3);
  const fileInputRef = useRef(null);
  const tabRefs = useRef([]);
  const reportTabs = ['submit', 'feed'];

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
    e.currentTarget.classList.add('border-accent-green', 'bg-accent-green/5');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-accent-green', 'bg-accent-green/5');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-accent-green', 'bg-accent-green/5');
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

    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitStatus({ type: 'success', message: t('report.form.success') });

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
          <span className="flex items-center space-x-0.5 text-accent-green">
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

        <div className="mb-8" role="tablist" aria-label="Report sections">
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
            <form onSubmit={handleSubmit} className="bg-card max-w-2xl mx-auto" noValidate>
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
                  <Camera className="w-5 h-5 text-accent-green" />
                  <span>{t('report.form.photo')}</span>
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                    formData.photoPreview
                      ? 'border-transparent'
                      : 'border-subtle hover:border-accent-green/50 hover:bg-accent-green/5'
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
                        className="absolute top-2 end-2 p-2 bg-danger text-white rounded-full hover:bg-danger/80 transition-colors"
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
                  <MapPin className="w-5 h-5 text-accent-green" />
                  <span>{t('report.form.location')}</span>
                </label>
                <div className="relative">
                  <input
                    id="report-location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder={t('report.form.locationHint')}
                    className="input-field pe-32"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="absolute end-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-accent-green/20 text-accent-green rounded-xl text-sm font-medium hover:bg-accent-green/30 transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    <MapPin className="w-4 h-4 me-1 inline" />
                    {t('report.form.getLocation')}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary mb-3 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-accent-green" />
                  <span>{t('report.form.hazardType')}</span>
                </label>
                <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label={t('report.form.hazardType')}>
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
                          ? 'ring-2 ring-accent-green bg-accent-green/10'
                          : 'bg-card hover:bg-card-hover'
                      }`}
                      role="radio"
                      aria-checked={formData.hazardType === hazard.value}
                      tabIndex={formData.hazardType === hazard.value ? 0 : -1}
                    >
                      <div className="flex items-center space-x-3">
                        {hazard.icon && <hazard.icon className="w-8 h-8 text-accent-green" />}
                        <span className="font-medium text-primary">{t(hazard.labelKey)}</span>
                      </div>
                      {formData.hazardType === hazard.value && (
                        <CheckCircle className="absolute top-2 end-2 w-5 h-5 text-accent-green" />
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
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 me-2 animate-spin" />
                    {t('report.form.submitting')}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 me-2" />
                    {t('report.form.submit')}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'feed' && (
          <div id="feed-panel" role="tabpanel" aria-labelledby="tab-feed" tabIndex={0} className="animate-slide-up">
            <div className="bg-card">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h3 className="font-semibold text-lg flex items-center space-x-2">
                  <Map className="w-5 h-5 text-accent-green" />
                  <span className="text-primary">{t('report.communityFeed.title')}</span>
                </h3>
                <div className="flex items-center space-x-4 text-sm text-secondary">
                  <span className="flex items-center space-x-1">
                    <Shield className="w-4 h-4 text-accent-green" />
                    <span>{mockReports.filter(r => r.verified).length} {t('report.communityFeed.verified')}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-warning">
                    <AlertCircle className="w-4 h-4" />
                    <span>{mockReports.filter(r => !r.verified).length} {t('report.communityFeed.pending')}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {mockReports.slice(0, visibleCount).map(report => {
                  const item = t(`report.communityFeed.items.${report.id}`, { returnObjects: true });
                  if (!item || typeof item !== 'object') return null;
                  const vote = votes[report.id] || { up: report.votes, down: 2, mine: null };
                  return (
                    <div
                      key={report.id}
                      className="p-5 rounded-xl border border-subtle transition-all bg-card-hover"
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
                            className={`flex items-center space-x-1 transition-colors ${vote.mine === 'up' ? 'text-accent-green' : 'text-secondary hover:text-accent-green'}`}
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
                        {!report.verified && (
                          <span className="text-xs px-3 py-1.5 bg-accent-green/20 text-accent-green rounded-full">
                            {t('report.communityFeed.pending')}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {visibleCount < mockReports.length && (
                <div className="mt-6 text-center">
                  <button className="btn-secondary" onClick={() => setVisibleCount(mockReports.length)}>
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