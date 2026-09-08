import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Camera, MapPin, Send, CheckCircle, AlertCircle, Loader2, Image, X, Map, Users, Shield } from 'lucide-react';

const hazardTypes = [
  { value: 'smoke', icon: '💨', labelKey: 'report.form.hazardTypes.smoke' },
  { value: 'activeFire', icon: '🔥', labelKey: 'report.form.hazardTypes.activeFire' },
  { value: 'fallenTrees', icon: '🌲', labelKey: 'report.form.hazardTypes.fallenTrees' },
  { value: 'landslide', icon: '🏔️', labelKey: 'report.form.hazardTypes.landslide' },
];

const mockReports = [
  { id: 1, type: 'activeFire', location: 'Big Sur, CA', coords: '36.27°N, 121.80°W', description: 'Active flames visible on ridge line, moving north', verified: true, reporter: 'Fire Watcher #847', time: '15 min ago', votes: 23 },
  { id: 2, type: 'smoke', location: 'Santa Cruz Mountains', coords: '37.12°N, 122.05°W', description: 'Heavy smoke column rising, visibility < 1 mile', verified: true, reporter: 'Local Resident', time: '42 min ago', votes: 18 },
  { id: 3, type: 'fallenTrees', location: 'Highway 17 Summit', coords: '37.15°N, 121.98°W', description: 'Multiple large trees blocking both lanes', verified: false, reporter: 'Commuter', time: '2 hours ago', votes: 12 },
  { id: 4, type: 'landslide', location: 'Pacific Coast Highway', coords: '34.42°N, 119.70°W', description: 'Debris flow covering road after heavy rain', verified: true, reporter: 'Caltrans', time: '4 hours ago', votes: 31 },
  { id: 5, type: 'smoke', location: 'East Bay Hills', coords: '37.85°N, 122.18°W', description: 'Smoke drifting into residential areas', verified: false, reporter: 'Community Watch', time: '5 hours ago', votes: 7 },
];

export default function Report() {
  const { t } = useTranslation();
  const { theme } = useTheme();
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
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) {
        alert(t('report.form.photoHint').replace('(max 10MB)', ''));
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
      alert('Geolocation is not supported by your browser');
      return;
    }

    setFormData(prev => ({ ...prev, location: t('common.loading') }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = `${latitude.toFixed(6)}°N, ${Math.abs(longitude).toFixed(6)}°${longitude >= 0 ? 'E' : 'W'}`;
        setFormData(prev => ({ ...prev, location: coords }));
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        setFormData(prev => ({ ...prev, location: '' }));
        alert('Unable to retrieve your location. Please enable location services or enter coordinates manually.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.photo || !formData.location || !formData.description.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please fill all required fields' });
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
      <span className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-white/10">
        <span>{hazard?.icon}</span>
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
            onClick={() => setActiveTab('submit')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'submit'
                ? 'bg-accent-green text-primary-dark'
                : `${theme === 'dark' ? 'bg-white/5 text-white/80 hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
            }`}
            role="tab"
            aria-selected={activeTab === 'submit'}
            aria-controls="submit-panel"
          >
            <Send className="w-4 h-4 mr-2 inline" />
            {t('report.form.title')}
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ml-2 ${
              activeTab === 'feed'
                ? 'bg-accent-green text-primary-dark'
                : `${theme === 'dark' ? 'bg-white/5 text-white/80 hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
            }`}
            role="tab"
            aria-selected={activeTab === 'feed'}
            aria-controls="feed-panel"
          >
            <Users className="w-4 h-4 mr-2 inline" />
            {t('report.communityFeed.title')}
          </button>
        </div>

        {activeTab === 'submit' && (
          <div id="submit-panel" role="tabpanel" className="animate-slide-up">
            <form onSubmit={handleSubmit} className={`${theme === 'dark' ? 'glass-card' : 'stat-card-light'} max-w-2xl mx-auto`} noValidate>
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-3 flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-accent-green" />
                  <span>{t('report.form.photo')}</span>
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                    formData.photoPreview
                      ? 'border-transparent'
                      : `${theme === 'dark' ? 'border-white/20 hover:border-accent-green/50' : 'border-gray-300 hover:border-accent-green/50'}`
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
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
                        className="absolute top-2 right-2 p-2 bg-accent-red/90 text-white rounded-full hover:bg-accent-red transition-colors"
                        aria-label="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Image className="w-12 h-12 mx-auto mb-4 text-white/40" />
                      <p className="text-white/60 mb-1">{t('report.form.photoHint')}</p>
                      <p className="text-sm text-white/40">Click or drag & drop</p>
                      <label htmlFor="photo-upload" className="mt-4 inline-block">
                        <span className="btn-secondary">{t('common.upload') || 'Browse Files'}</span>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-3 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-accent-green" />
                  <span>{t('report.form.location')}</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder={t('report.form.locationHint')}
                    className={`${theme === 'dark' ? 'input-field' : 'input-field-light'} pr-32`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-accent-green/20 text-accent-green rounded-xl text-sm font-medium hover:bg-accent-green/30 transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    <MapPin className="w-4 h-4 mr-1 inline" />
                    {t('report.form.getLocation')}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-3 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-accent-green" />
                  <span>{t('report.form.hazardType')}</span>
                </label>
                <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Hazard type">
                  {hazardTypes.map(hazard => (
                    <button
                      key={hazard.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, hazardType: hazard.value }))}
                      className={`relative p-4 rounded-xl text-left transition-all ${
                        formData.hazardType === hazard.value
                          ? 'ring-2 ring-accent-green bg-accent-green/10'
                          : `${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`
                      }`}
                      role="radio"
                      aria-checked={formData.hazardType === hazard.value}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{hazard.icon}</span>
                        <span className="font-medium">{t(hazard.labelKey)}</span>
                      </div>
                      {formData.hazardType === hazard.value && (
                        <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-accent-green" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-white/80 mb-3">
                  {t('report.form.description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('report.form.descriptionPlaceholder')}
                  rows={4}
                  className={`${theme === 'dark' ? 'input-field' : 'input-field-light'} resize-none`}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {submitStatus && (
                <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
                  submitStatus.type === 'success'
                    ? 'bg-green-500/20 border border-green-500/30'
                    : 'bg-red-500/20 border border-red-500/30'
                }`}>
                  {submitStatus.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}
                  <span className="text-sm">{submitStatus.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !formData.photo || !formData.location || !formData.description.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t('report.form.submitting')}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    {t('report.form.submit')}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'feed' && (
          <div id="feed-panel" role="tabpanel" className="animate-slide-up">
            <div className={`${theme === 'dark' ? 'glass-card' : 'stat-card-light'}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h3 className="font-semibold text-lg flex items-center space-x-2">
                  <Map className="w-5 h-5 text-accent-green" />
                  <span>{t('report.communityFeed.title')}</span>
                </h3>
                <div className="flex items-center space-x-4 text-sm text-white/60">
                  <span className="flex items-center space-x-1">
                    <Shield className="w-4 h-4 text-accent-green" />
                    <span>{mockReports.filter(r => r.verified).length} {t('report.communityFeed.verified')}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-orange-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>{mockReports.filter(r => !r.verified).length} {t('report.communityFeed.pending')}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {mockReports.map(report => {
                  const hazard = hazardTypes.find(h => h.value === report.type);
                  return (
                    <div
                      key={report.id}
                      className={`p-5 rounded-xl border transition-all ${
                        theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div className="flex items-center space-x-3">
                          <HazardBadge type={report.type} verified={report.verified} />
                          <div>
                            <p className="font-medium text-white">{report.location}</p>
                            <p className="text-xs text-white/50">{report.coords}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-white/50">
                          <span className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{report.reporter}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{report.time}</span>
                          </span>
                        </div>
                      </div>
                      <p className="text-white/80 mb-3">{report.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <button className="flex items-center space-x-1 text-white/60 hover:text-accent-green transition-colors">
                            <span className="w-5 h-5">👍</span>
                            <span>{report.votes}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-white/60 hover:text-red-400 transition-colors">
                            <span className="w-5 h-5">👎</span>
                            <span>2</span>
                          </button>
                        </div>
                        {!report.verified && (
                          <button className="text-xs px-3 py-1.5 bg-accent-green/20 text-accent-green rounded-full hover:bg-accent-green/30 transition-colors">
                            {t('report.communityFeed.verified')}?
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 text-center">
                <button className="btn-secondary">
                  {t('common.loadMore') || 'Load More Reports'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}