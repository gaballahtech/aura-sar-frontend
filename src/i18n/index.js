import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const en = {
  "navbar": {
    "home": "Home",
    "dashboard": "Interactive Dashboard",
    "analytics": "Time-Series Analytics",
    "report": "Crowdsource Report",
    "about": "About SAR",
    "language": "Language",
    "theme": "Theme",
    "alerts": "Emergency Alerts",
    "darkMode": "Dark Mode",
    "lightMode": "Light Mode",
    "menuToggle": "Toggle navigation menu",
    "alertItems": {
      "criticalFire": {
        "msg": "Critical fire risk detected in Zone 7",
        "time": "2 min ago",
        "severityLabel": "critical"
      },
      "thermalAnomaly": {
        "msg": "New thermal anomaly near Highway 101",
        "time": "15 min ago",
        "severityLabel": "high"
      },
      "airQuality": {
        "msg": "Air quality dropping in Santa Clara County",
        "time": "1 hour ago",
        "severityLabel": "medium"
      }
    }
  },
  "hero": {
    "headline": "AI & Synthetic Aperture Radar Driven Wildfire Intelligence Platform",
    "subtitle": "Penetrating smoke, clouds, and darkness — SAR technology provides 24/7 wildfire monitoring and early warning capabilities for California and beyond.",
    "liveStats": {
      "live": "Live",
      "activeZones": "Active High-Risk Zones",
      "hazardIndex": "Real-Time Hazard Index",
      "recoveryRate": "Forest Regrowth Recovery Rate"
    },
    "cta": {
      "exploreMap": "Explore Live Map",
      "submitReport": "Submit Field Report"
    }
  },
  "dashboard": {
    "title": "Interactive Wildfire Dashboard",
    "subtitle": "Real-time SAR backscatter analysis, AI risk heatmaps, and thermal anomaly detection",
    "roleToggle": {
      "firefighter": "Emergency Responders / Firefighters",
      "public": "Local Residents / Public"
    },
    "firefighterView": {
      "title": "Firefighter Operations View",
      "mapLayers": "Map Layers",
      "sarBackscatter": "SAR Backscatter Intensity",
      "aiRiskHeatmap": "AI Fire Risk Heatmap",
      "thermalPoints": "Active Thermal Points",
      "earlyWarnings": "Hourly Early Warning Feed",
      "confidence": "AI Confidence",
      "location": "Location",
      "timestamp": "Timestamp",
      "severity": "Severity",
      "autoRefresh": "Auto-refresh (30s)",
      "liveBadge": "LIVE"
    },
    "alertsFeed": {
      "types": {
        "criticalFireRisk": "Critical Fire Risk",
        "thermalAnomaly": "New Thermal Anomaly",
        "airQuality": "Air Quality Alert",
        "windShift": "Wind Shift Warning",
        "perimeterExpansion": "Perimeter Expansion"
      },
      "locations": {
        "caldorFire": "Zone 7 - Caldor Fire",
        "highway101": "Highway 101 Corridor",
        "santaClara": "Santa Clara County",
        "bigSur": "Big Sur Region",
        "shastaTrinity": "Shasta Trinity"
      },
      "times": {
        "2minAgo": "2 min ago",
        "15minAgo": "15 min ago",
        "1hourAgo": "1 hour ago",
        "3hoursAgo": "3 hours ago",
        "4hoursAgo": "4 hours ago",
        "justNow": "Just now"
      }
    },
    "publicView": {
      "title": "Public Safety View",
      "safeZones": "Safe Zones",
      "evacuationRoutes": "Evacuation Routes",
      "airQuality": "Air Quality Index",
      "aqiGood": "Good",
      "aqiModerate": "Moderate",
      "aqiUnhealthy": "Unhealthy",
      "aqiHazardous": "Hazardous"
    },
    "severity": {
      "low": "Low",
      "medium": "Medium",
      "high": "High",
      "critical": "Critical"
    },
    "routeStatus": {
      "open": "Open",
      "advisory": "Advisory",
      "closed": "Closed"
    },
    "congestion": {
      "low": "Light Traffic",
      "moderate": "Moderate Traffic",
      "high": "Heavy Traffic"
    },
    "mapPopup": {
      "confidence": "AI Confidence",
      "intensity": "Intensity",
      "type": "Type",
      "coords": "Coordinates",
      "capacity": "Capacity",
      "current": "Current",
      "available": "Available",
      "occupancy": "Occupancy",
      "types": {
        "active": "Active fire",
        "high-risk": "High risk",
        "medium-risk": "Medium risk"
      }
    }
  },
  "analytics": {
    "title": "Time-Series Analytics & Forest Recovery Tracker",
    "subtitle": "Multi-temporal SAR analysis for vegetation health and post-fire recovery monitoring",
    "comparisonSlider": {
      "title": "Before / During / After Comparison",
      "preFire": "Pre-Fire",
      "duringFire": "During Fire",
      "postFire": "Post-Fire Recovery"
    },
    "sarSnapshot": "SAR Snapshot",
    "comparison": {
      "preFire": { "label": "Pre-Fire", "date": "June 2024", "description": "Healthy vegetation, high moisture content" },
      "during": { "label": "During Fire", "date": "August 2024", "description": "Active burning, complete canopy loss" },
      "postFire": { "label": "Post-Fire Recovery", "date": "March 2025", "description": "Regrowth visible, 73% recovery" }
    },
    "charts": {
      "backscatter": "Radar Backscatter Signal (dB) Over Time",
      "soilMoisture": "Soil Moisture vs Dry Vegetation Density",
      "fuelLoad": "Fuel Load Index",
      "recoveryProgress": "Forest Recovery Progress (%)"
    },
    "timeRange": {
      "6months": "6 Months",
      "1year": "1 Year",
      "3years": "3 Years",
      "5years": "5 Years",
      "label": "Time range"
    },
    "comparisonInfo": {
      "preFireLabel": "Pre-Fire",
      "duringLabel": "During",
      "recoveryLabel": "Recovery",
      "preFireDesc": "High VV backscatter (-8 dB), dense canopy",
      "duringDesc": "VV drop to -18 dB, volume scattering loss",
      "recoveryDesc": "VV at -11 dB, cross-pol increasing",
      "preFireValue": "Pre-Fire: High VV backscatter (-8 dB), dense canopy",
      "duringValue": "During: VV drop to -18 dB, volume scattering loss",
      "recoveryValue": "Recovery: VV at -11 dB, cross-pol increasing"
    },
    "snapshotDetails": {
      "satellite": "Sentinel-1 C-Band VV/VH",
      "coords": "37.5°N, 119.5°W",
      "resolution": "10m resolution"
    },
    "statLabels": {
      "backscatterMean": "VV Backscatter Mean",
      "soilMoisture": "Soil Moisture Index",
      "fuelLoad": "Fuel Load Density"
    },
    "statDescriptions": {
      "backscatterMean": "Approaching pre-fire baseline",
      "soilMoisture": "Above seasonal average",
      "fuelLoad": "Significantly reduced post-fire"
    },
    "series": {
      "backscatter": "VV Polarization",
      "soilMoisture": "Soil Moisture",
      "fuelLoad": "Dry Vegetation Density"
    },
    "axisLabels": {
      "backscatter": "Backscatter (dB)",
      "normalized": "Normalized Index",
      "recovery": "Recovery (%)"
    },
    "controls": {
      "fullscreen": "Toggle fullscreen",
      "download": "Download data (CSV)"
    },
    "sarCatalog": {
      "title": "SAR Scene Catalog",
      "subtitle": "Scenes queried from the ASF asf_search backend (Sentinel-1 GRD, 10m). Falls back to offline demo data when the backend is unreachable.",
      "wktLabel": "WKT Polygon (optional)",
      "wktPlaceholder": "POLYGON (( -122.3 36.0, ... ))",
      "refresh": "Refresh",
      "empty": "No scenes found for the selected range.",
      "live": "LIVE",
      "offline": "Offline demo data",
      "download": "Download",
      "columns": {
        "scene": "Scene",
        "acquisition": "Acquisition",
        "polarization": "Polarization",
        "orbit": "Orbit",
        "size": "Size"
      }
    }
  },
  "report": {
    "title": "Crowdsourced Disaster Verification",
    "subtitle": "Submit real-time field reports to improve AI model accuracy and community awareness",
    "form": {
      "title": "Submit Field Report",
      "photo": "Upload Photo",
      "photoHint": "Drag & drop or click to upload (max 10MB)",
      "clickOrDrag": "Click or drag & drop",
      "photoTooLarge": "Photo exceeds the 10MB size limit.",
      "geolocationUnsupported": "Geolocation is not supported by your browser.",
      "geolocationFailed": "Unable to retrieve your location. Please enable location services or enter coordinates manually.",
      "fillRequired": "Please fill all required fields",
      "location": "GPS Location",
      "locationHint": "Auto-detected or manually enter coordinates",
      "hazardType": "Hazard Type",
      "hazardTypes": {
        "smoke": "Smoke",
        "activeFire": "Active Fire",
        "fallenTrees": "Fallen Trees",
        "landslide": "Landslide"
      },
      "description": "Description",
      "descriptionPlaceholder": "Describe what you observe...",
      "submit": "Submit Report",
      "submitting": "Submitting...",
      "success": "Report submitted successfully!",
      "error": "Failed to submit report. Please try again.",
      "getLocation": "Use Current Location",
      "removePhoto": "Remove photo"
    },
    "communityFeed": {
      "title": "Community Verified Reports",
      "verified": "Verified",
      "pending": "Pending Verification",
      "reportedBy": "Reported by",
      "timeAgo": "time ago",
      "items": {
        "1": { "location": "Big Sur, CA", "coords": "36.27°N, 121.80°W", "description": "Active flames visible on ridge line, moving north", "reporter": "Fire Watcher #847", "time": "15 min ago" },
        "2": { "location": "Santa Cruz Mountains", "coords": "37.12°N, 122.05°W", "description": "Heavy smoke column rising, visibility < 1 mile", "reporter": "Local Resident", "time": "42 min ago" },
        "3": { "location": "Highway 17 Summit", "coords": "37.15°N, 121.98°W", "description": "Multiple large trees blocking both lanes", "reporter": "Commuter", "time": "2 hours ago" },
        "4": { "location": "Pacific Coast Highway", "coords": "34.42°N, 119.70°W", "description": "Debris flow covering road after heavy rain", "reporter": "Caltrans", "time": "4 hours ago" },
        "5": { "location": "East Bay Hills", "coords": "37.85°N, 122.18°W", "description": "Smoke drifting into residential areas", "reporter": "Community Watch", "time": "5 hours ago" }
      }
    }
  },
  "sarEdu": {
    "title": "SAR Technology & NASA Challenge Context",
    "subtitle": "Understanding Synthetic Aperture Radar for wildfire monitoring",
    "frequencies": {
      "title": "SAR Frequency Bands",
      "intro": "Synthetic Aperture Radar operates across different frequency bands, each with unique penetration capabilities and applications. The choice of frequency determines what the radar \"sees\" — from surface details to deep canopy structure.",
      "penetration": "Penetration",
      "useCase": "Use Case",
      "wavelength": "wavelength",
      "keyMissions": "Key Missions:",
      "xBand": {
        "name": "X-Band (9.6 GHz)",
        "wavelength": "~3 cm",
        "penetration": "Low vegetation penetration",
        "useCase": "High-res urban & infrastructure mapping"
      },
      "cBand": {
        "name": "C-Band (5.3 GHz)",
        "wavelength": "~5.6 cm",
        "penetration": "Moderate vegetation penetration",
        "useCase": "General purpose, Sentinel-1, NISAR"
      },
      "lBand": {
        "name": "L-Band (1.25 GHz)",
        "wavelength": "~24 cm",
        "penetration": "Deep vegetation & canopy penetration",
        "useCase": "Biomass, forest structure, UAVSAR, NISAR"
      }
    },
    "polarizations": {
      "title": "Polarization Modes",
      "intro": "Polarization describes the orientation of the electromagnetic wave's electric field. Different polarization combinations reveal different scattering mechanisms and surface properties.",
      "signature": "SAR Signature:",
      "polarizationSuffix": "Polarization",
      "combinationsTitle": "Polarization Combinations for Wildfire Analysis",
      "combinations": {
        "vvVh": { "combo": "VV + VH", "use": "Burn severity mapping, Sentinel-1 standard" },
        "hhHv": { "combo": "HH + HV", "use": "Forest structure, ALOS-PALSAR standard" },
        "quad": { "combo": "Full Quad (HH+HV+VH+VV)", "use": "Complete scattering matrix, UAVSAR, NISAR" }
      },
      "hh": { "desc": "Horizontal transmit, Horizontal receive", "detail": "Strong for surface scattering, urban areas" },
      "vv": { "desc": "Vertical transmit, Vertical receive", "detail": "Strong for surface scattering, water detection" },
      "hv": { "desc": "Horizontal transmit, Vertical receive", "detail": "Cross-pol, volume scattering, vegetation" },
      "vh": { "desc": "Vertical transmit, Horizontal receive", "detail": "Cross-pol, volume scattering, vegetation" }
    },
    "scattering": {
      "title": "Scattering Mechanisms",
      "intro": "Understanding scattering mechanisms is key to interpreting SAR imagery. Each mechanism produces distinct backscatter signatures that reveal surface and volume properties.",
      "signature": "SAR Signature:",
      "decompositionTitle": "Freeman-Durden / Yamaguchi Decomposition",
      "decompositionDesc": "Polarimetric decomposition separates mixed scattering into component mechanisms, enabling quantitative analysis of vegetation structure and fire damage.",
      "decomposition": {
        "surface": { "label": "Surface %", "value": "15-30%", "desc": "Ground contribution" },
        "doubleBounce": { "label": "Double Bounce %", "value": "10-25%", "desc": "Trunk-ground interaction" },
        "volume": { "label": "Volume %", "value": "50-70%", "desc": "Canopy scattering" }
      },
      "surface": { "title": "Surface Scattering", "desc": "Smooth surfaces (water, roads, bare soil)", "sarSignature": "Low backscatter, specular reflection" },
      "doubleBounce": { "title": "Double Bounce", "desc": "Vertical structures (buildings, tree trunks)", "sarSignature": "High backscatter, dihedral corner reflector" },
      "volume": { "title": "Volume Scattering", "desc": "Vegetation canopy, forest biomass", "sarSignature": "Moderate backscatter, random scattering" }
    },
    "nasaResources": {
      "title": "NASA Data Sources & Tools",
      "intro": "AURA SAR leverages multiple NASA and commercial data sources for comprehensive wildfire monitoring. These platforms provide the SAR data foundation for our AI-driven analytics.",
      "categories": {
        "dataAccess": "Data Access",
        "mission": "Mission",
        "airborne": "Airborne",
        "platform": "Platform",
        "commercial": "Commercial"
      },
      "asf": { "title": "ASF Vertex", "desc": "SAR data discovery, access, and download portal for NASA's DAAC", "category": "dataAccess" },
      "nisar": { "title": "NISAR Mission", "desc": "Joint NASA-ISRO L & S band SAR mission for global ecosystem monitoring", "category": "mission" },
      "uavsar": { "title": "UAVSAR", "desc": "Airborne L-band fully polarimetric SAR for detailed regional studies", "category": "airborne" },
      "gee": { "title": "Google Earth Engine", "desc": "Planetary-scale geospatial analysis platform with SAR data catalog", "category": "platform" },
      "capella": { "title": "Capella Space", "desc": "Commercial X-band SAR constellation with sub-meter resolution", "category": "commercial" },
      "explore": "Explore"
    },
    "applications": {
      "title": "SAR Applications",
      "intro": "SAR technology enables diverse applications beyond wildfire monitoring. AURA SAR's framework can be extended to these critical environmental and safety use cases.",
      "wildfire": "Wildfire Monitoring",
      "biomass": "Forest Biomass",
      "flood": "Flood Mapping",
      "deformation": "Surface Deformation",
      "agriculture": "Agriculture",
      "maritime": "Sea Ice & Maritime",
      "wildfireDesc": "Active fire detection, burn severity mapping, post-fire recovery tracking",
      "biomassDesc": "Above-ground biomass estimation, carbon stock monitoring, deforestation alerts",
      "floodDesc": "Flood extent mapping, water level changes, damage assessment",
      "deformationDesc": "InSAR for subsidence, landslides, earthquake deformation, infrastructure monitoring",
      "agricultureDesc": "Crop classification, soil moisture, growth monitoring, yield prediction",
      "maritimeDesc": "Ice extent, thickness, type classification, ship detection, oil spills"
    },
    "learnMore": {
      "title": "Learn More",
      "desc": "Explore SAR theory, processing techniques, and applications",
      "items": ["SAR Handbook (ESA)", "Radar Polarimetry (Lee & Pottier)", "InSAR Principles (Rosen et al.)"]
    },
    "openTools": {
      "title": "Open Source Tools",
      "desc": "Software for SAR processing and analysis",
      "items": ["SNAP (ESA)", "PySAR / ARIA-Tools", "GMTSAR / ISCE", "OpenSARLab (JupyterHub)"]
    },
    "auraPipeline": {
      "title": "AURA SAR Pipeline",
      "desc": "Our processing workflow for wildfire intelligence",
      "items": ["GEE / ASF Data Ingestion", "Pre-processing & Calibration", "AI/ML Feature Extraction", "Real-time Dashboard"]
    }
  },
  "footer": {
    "brand": "AURA SAR",
    "tagline": "AI & Ultra-Radar Analytics for Wildfire Safety",
    "nasaChallenge": "NASA Space Apps Challenge 2025",
    "challengeTheme": "\"Through the Radar Looking Glass\"",
    "columnHeaders": {
      "product": "Product",
      "resources": "Resources",
      "community": "Community",
      "legal": "Legal"
    },
    "links": {
      "github": "GitHub Repository",
      "docs": "Documentation",
      "api": "API Reference",
      "contact": "Contact"
    },
    "productLinks": {
      "dashboard": "Interactive Dashboard",
      "analytics": "Time-Series Analytics",
      "report": "Crowdsource Reports",
      "sarEducation": "SAR Education"
    },
    "resourceLinks": {
      "spaceApps": "NASA Space Apps 2025",
      "asfVertex": "ASF Vertex",
      "nisar": "NISAR Mission",
      "gee": "Google Earth Engine"
    },
    "communityLinks": {
      "github": "GitHub Repository",
      "issues": "Report Issues",
      "contribute": "Contribute",
      "documentation": "Documentation"
    },
    "legalLinks": {
      "privacy": "Privacy Policy",
      "terms": "Terms of Service",
      "dataUsage": "Data Usage",
      "disclaimer": "Disclaimer"
    },
    "copyright": "© 2025 AURA SAR Team. Built for NASA Space Apps Challenge.",
    "disclaimer": "Not for operational emergency use. Official alerts via local authorities.",
    "builtWith": "Built with love for NASA Space Apps Challenge 2025"
  },
  "errorBoundary": {
    "title": "Something went wrong",
    "message": "We encountered an unexpected error. Please refresh the page or try again later.",
    "refresh": "Refresh Page",
    "details": "Error Details"
  },
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "retry": "Retry",
    "close": "Close",
    "save": "Save",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "delete": "Delete",
    "edit": "Edit",
    "view": "View",
    "search": "Search",
    "filter": "Filter",
    "sort": "Sort",
    "refresh": "Refresh",
    "download": "Download",
    "share": "Share",
    "print": "Print",
    "fullscreen": "Fullscreen",
    "exitFullscreen": "Exit Fullscreen",
    "loadMore": "Load More Reports"
  }
};

const ar = {
  "navbar": {
    "home": "الرئيسية",
    "dashboard": "لوحة التحكم التفاعلية",
    "analytics": "التحليلات الزمنية",
    "report": "التقارير المجتمعية",
    "about": "حول رادار الفتحة التركيبية",
    "language": "اللغة",
    "theme": "السمة",
    "alerts": "تنبيهات الطوارئ",
    "darkMode": "الوضع الداكن",
    "lightMode": "الوضع الفاتح",
    "menuToggle": "تبديل قائمة التنقل",
    "alertItems": {
      "criticalFire": {
        "msg": "تم رصد خطر حرائق حرج في المنطقة 7",
        "time": "قبل دقيقتين",
        "severityLabel": "حرج"
      },
      "thermalAnomaly": {
        "msg": "شذوذ حراري جديد بالقرب من الطريق 101",
        "time": "قبل 15 دقيقة",
        "severityLabel": "عالي"
      },
      "airQuality": {
        "msg": "انخفاض جودة الهواء في مقاطعة سانتا كلارا",
        "time": "قبل ساعة",
        "severityLabel": "متوسط"
      }
    }
  },
  "hero": {
    "headline": "منصة ذكاء حرائق الغابات المدعومة بالذكاء الاصطناعي ورادار الفتحة التركيبية",
    "subtitle": "اختراق الدخان والغيوم والظلام — توفر تقنية رادار الفتحة التركيبية مراقبة حرائق الغابات على مدار الساعة وقدرات الإنذار المبكر لكاليفورنيا وما وراءها.",
    "liveStats": {
      "live": "مباشر",
      "activeZones": "مناطق عالية الخطورة النشطة",
      "hazardIndex": "مؤشر الخطر في الوقت الفعلي",
      "recoveryRate": "معدل تعافي نمو الغابات"
    },
    "cta": {
      "exploreMap": "استكشاف الخريطة الحية",
      "submitReport": "إرسال تقرير ميداني"
    }
  },
  "dashboard": {
    "title": "لوحة تحكم حرائق الغابات التفاعلية",
    "subtitle": "تحليل ارتداد رادار الفتحة التركيبية في الوقت الفعلي، وخرائط الحرارة لمخاطر الحرائق بالذكاء الاصطناعي، وكشف الشذوذ الحراري",
    "roleToggle": {
      "firefighter": "فرق الاستجابة للطوارئ / رجال الإطفاء",
      "public": "السكان المحليون / الجمهور"
    },
    "firefighterView": {
      "title": "عرض عمليات رجال الإطفاء",
      "mapLayers": "طبقات الخريطة",
      "sarBackscatter": "شدة ارتداد رادار الفتحة التركيبية",
      "aiRiskHeatmap": "خريطة حرارة مخاطر الحرائق بالذكاء الاصطناعي",
      "thermalPoints": "النقاط الحرارية النشطة",
      "earlyWarnings": "تغذية الإنذار المبكر بالساعة",
      "confidence": "ثقة الذكاء الاصطناعي",
      "location": "الموقع",
      "timestamp": "الوقت",
      "severity": "الشدة",
      "autoRefresh": "تحديث تلقائي (30 ثانية)",
      "liveBadge": "مباشر"
    },
    "alertsFeed": {
      "types": {
        "criticalFireRisk": "خطر حريق حرج",
        "thermalAnomaly": "شذوذ حراري جديد",
        "airQuality": "تنبيه جودة الهواء",
        "windShift": "تحذير من تحول الرياح",
        "perimeterExpansion": "توسع محيط الحريق"
      },
      "locations": {
        "caldorFire": "المنطقة 7 - حريق كالدور",
        "highway101": "ممر الطريق السريع 101",
        "santaClara": "مقاطعة سانتا كلارا",
        "bigSur": "منطقة بيغ سور",
        "shastaTrinity": "شاستا ترينيتي"
      },
      "times": {
        "2minAgo": "قبل دقيقتين",
        "15minAgo": "قبل 15 دقيقة",
        "1hourAgo": "قبل ساعة واحدة",
        "3hoursAgo": "قبل 3 ساعات",
        "4hoursAgo": "قبل 4 ساعات",
        "justNow": "للتو"
      }
    },
    "publicView": {
      "title": "عرض السلامة العامة",
      "safeZones": "المناطق الآمنة",
      "evacuationRoutes": "مسارات الإخلاء",
      "airQuality": "مؤشر جودة الهواء",
      "aqiGood": "جيد",
      "aqiModerate": "معتدل",
      "aqiUnhealthy": "غير صحي",
      "aqiHazardous": "خطر"
    },
    "severity": {
      "low": "منخفضة",
      "medium": "متوسطة",
      "high": "عالية",
      "critical": "حرجة"
    },
"routeStatus": {
      "open": "مفتوح",
      "advisory": "تنبيه",
      "closed": "مغلق"
    },
    "congestion": {
      "low": "حركة مرور خفيفة",
      "moderate": "حركة مرور متوسطة",
      "high": "حركة مرور كثيفة"
    },
    "mapPopup": {
      "confidence": "ثقة الذكاء الاصطناعي",
      "intensity": "الشدة",
      "type": "النوع",
      "coords": "الإحداثيات",
      "capacity": "السعة",
      "current": "الحالي",
      "available": "المتاح",
      "occupancy": "الإشغال",
      "types": {
        "active": "حريق نشط",
        "high-risk": "خطر مرتفع",
        "medium-risk": "خطر متوسط"
      }
    }
  },
  "analytics": {
    "title": "التحليلات الزمنية ومتعقب تعافي الغابات",
    "subtitle": "تحليل رادار الفتحة التركيبية متعدد الأوقات لصحة الغطاء النباتي ومراقبة التعافي بعد الحرائق",
    "comparisonSlider": {
      "title": "مقارنة قبل / أثناء / بعد",
      "preFire": "قبل الحريق",
      "duringFire": "أثناء الحريق",
      "postFire": "تعافي ما بعد الحريق"
    },
    "sarSnapshot": "لقطة رادار الفتحة التركيبية",
    "comparison": {
      "preFire": { "label": "قبل الحريق", "date": "يونيو 2024", "description": "غطاء نباتي صحي، محتوى رطوبة مرتفع" },
      "during": { "label": "أثناء الحريق", "date": "أغسطس 2024", "description": "احتراق نشط، فقدان كامل للمظلة" },
      "postFire": { "label": "تعافي ما بعد الحريق", "date": "مارس 2025", "description": "نمو جديد ظاهر، تعافي بنسبة 73٪" }
    },
    "charts": {
      "backscatter": "إشارة ارتداد الرادار (ديسيبيل) مع مرور الوقت",
      "soilMoisture": "رطوبة التربة مقابل كثافة الغطاء النباتي الجاف",
      "fuelLoad": "مؤشر حمل الوقود",
      "recoveryProgress": "تقدم تعافي الغابات (%)"
    },
    "timeRange": {
      "6months": "6 أشهر",
      "1year": "سنة واحدة",
      "3years": "3 سنوات",
      "5years": "5 سنوات",
      "label": "الفترة الزمنية"
    },
    "comparisonInfo": {
      "preFireLabel": "قبل الحريق",
      "duringLabel": "أثناء",
      "recoveryLabel": "التعافي",
      "preFireDesc": "ارتداد VV عالي (-8 ديسيبيل)، مظلة كثيفة",
      "duringDesc": "انخفاض VV إلى -18 ديسيبيل، فقدان الانتثار الحجمي",
      "recoveryDesc": "VV عند -11 ديسيبيل، زيادة الاستقطاب المتقاطع",
      "preFireValue": "قبل الحريق: ارتداد VV عالي (-8 ديسيبيل)، مظلة كثيفة",
      "duringValue": "أثناء: انخفاض VV إلى -18 ديسيبيل، فقدان الانتثار الحجمي",
      "recoveryValue": "التعافي: VV عند -11 ديسيبيل، زيادة الاستقطاب المتقاطع"
    },
    "snapshotDetails": {
      "satellite": "سينتينل-1 النطاق C VV/VH",
      "coords": "37.5°شمالاً، 119.5°غرباً",
      "resolution": "دقة 10 متر"
    },
    "statLabels": {
      "backscatterMean": "متوسط ارتداد VV",
      "soilMoisture": "مؤشر رطوبة التربة",
      "fuelLoad": "كثافة حمل الوقود"
    },
    "statDescriptions": {
      "backscatterMean": "يقترب من خط الأساس قبل الحريق",
      "soilMoisture": "فوق المتوسط الموسمي",
      "fuelLoad": "انخفض بشكل ملحوظ بعد الحريق"
    },
    "series": {
      "backscatter": "الاستقطاب VV",
      "soilMoisture": "رطوبة التربة",
      "fuelLoad": "كثافة الغطاء النباتي الجاف"
    },
    "axisLabels": {
      "backscatter": "الاستطاعة المرتجعة (dB)",
      "normalized": "المؤشر المعياري",
      "recovery": "التعافي (%)"
    },
    "controls": {
      "fullscreen": "تبديل ملء الشاشة",
      "download": "تنزيل البيانات (CSV)"
    },
    "sarCatalog": {
      "title": "كتالوج مشاهد الرادار",
      "subtitle": "مشاهد من خادم ASF asf_search (سينتينل-1 GRD، دقة 10م). يُستخدم وضع تجريبي دون اتصال عند تعذر الوصول إلى الخادم.",
      "wktLabel": "مضلع WKT (اختياري)",
      "wktPlaceholder": "POLYGON (( -122.3 36.0, ... ))",
      "refresh": "تحديث",
      "empty": "لا توجد مشاهد للنطاق المحدد.",
      "live": "مباشر",
      "offline": "بيانات تجريبية دون اتصال",
      "download": "تحميل",
      "columns": {
        "scene": "المشهد",
        "acquisition": "الالتقاط",
        "polarization": "الاستقطاب",
        "orbit": "المدار",
        "size": "الحجم"
      }
    }
  },
  "report": {
    "title": "التحقق المجتمعي من الكوارث",
    "subtitle": "إرسال تقارير ميدانية في الوقت الفعلي لتحسين دقة نموذج الذكاء الاصطناعي ووعي المجتمع",
    "form": {
      "title": "إرسال تقرير ميداني",
      "photo": "رفع صورة",
      "photoHint": "اسحب وأفلِت أو انقر للرفع (الحد الأقصى 10 ميجابايت)",
      "clickOrDrag": "انقر أو اسحب وأفلِت",
      "photoTooLarge": "الصورة تتجاوز حد 10 ميجابايت.",
      "geolocationUnsupported": "تحديد الموقع غير مدعوم في متصفحك.",
      "geolocationFailed": "تعذر تحديد موقعك. يرجى تفعيل خدمات الموقع أو إدخال الإحداثيات يدوياً.",
      "fillRequired": "يرجى ملء جميع الحقول المطلوبة",
      "location": "موقع نظام تحديد المواقع",
      "locationHint": "يتم اكتشافه تلقائياً أو أدخل الإحداثيات يدوياً",
      "hazardType": "نوع الخطر",
      "hazardTypes": {
        "smoke": "دخان",
        "activeFire": "حريق نشط",
        "fallenTrees": "أشجار ساقطة",
        "landslide": "انزلاق أرضي"
      },
      "description": "الوصف",
      "descriptionPlaceholder": "صف ما تراه...",
      "submit": "إرسال التقرير",
      "submitting": "جاري الإرسال...",
      "success": "تم إرسال التقرير بنجاح!",
      "error": "فشل إرسال التقرير. يرجى المحاولة مرة أخرى.",
      "getLocation": "استخدام الموقع الحالي",
      "removePhoto": "إزالة الصورة"
    },
    "communityFeed": {
      "title": "تقارير المجتمع المُتحقق منها",
      "verified": "مُحقق",
      "pending": "قيد التحقق",
      "reportedBy": "أبلغ بواسطة",
      "timeAgo": "منذ",
      "items": {
        "1": { "location": "بيغ سور، كاليفورنيا", "coords": "36.27°شمالاً، 121.80°غرباً", "description": "لهب نشط ظاهر على خط التلال، يتحرك شمالاً", "reporter": "رقيب الحرائق #847", "time": "قبل 15 دقيقة" },
        "2": { "location": "جبال سانتا كروز", "coords": "37.12°شمالاً، 122.05°غرباً", "description": "عمود دخان كثيف يرتفع، الرؤية أقل من ميل واحد", "reporter": "ساكن محلي", "time": "قبل 42 دقيقة" },
        "3": { "location": "ممر الطريق السريع 17", "coords": "37.15°شمالاً، 121.98°غرباً", "description": "أشجار كبيرة متعددة تسد الحارتين", "reporter": "مسافر يومي", "time": "قبل ساعتين" },
        "4": { "location": "طريق ساحل المحيط الهادئ", "coords": "34.42°شمالاً، 119.70°غرباً", "description": "تدفق حطام يغطي الطريق بعد أمطار غزيرة", "reporter": "كالتيرانز", "time": "قبل 4 ساعات" },
        "5": { "location": "تلال الخليج الشرقي", "coords": "37.85°شمالاً، 122.18°غرباً", "description": "دخان ينجرف إلى المناطق السكنية", "reporter": "مراقبة المجتمع", "time": "قبل 5 ساعات" }
      }
    }
  },
  "sarEdu": {
    "title": "تقنية رادار الفتحة التركيبية وسياق تحدي ناسا",
    "subtitle": "فهم رادار الفتحة التركيبية لمراقبة حرائق الغابات",
    "frequencies": {
      "title": "نطاقات ترددات رادار الفتحة التركيبية",
      "intro": "يعمل رادار الفتحة التركيبية عبر نطاقات تردد مختلفة، ولكل نطاق قدرات اختراق وتطبيقات فريدة. يحدد اختيار التردد ما \"يراه\" الرادار — من تفاصيل السطح إلى البنية العميقة للمظلة.",
      "penetration": "الاختراق",
      "useCase": "حالة الاستخدام",
      "wavelength": "الطول الموجي",
      "keyMissions": "المهام الرئيسية:",
      "xBand": {
        "name": "نطاق X (9.6 جيجاهرتز)",
        "wavelength": "~3 سم",
        "penetration": "اختراق منخفض للغطاء النباتي",
        "useCase": "رسم خرائط عالي الدقة للمناطق الحضرية والبنية التحتية"
      },
      "cBand": {
        "name": "نطاق C (5.3 جيجاهرتز)",
        "wavelength": "~5.6 سم",
        "penetration": "اختراق معتدل للغطاء النباتي",
        "useCase": "أغراض عامة، سنتينل-1، نيسار"
      },
      "lBand": {
        "name": "نطاق L (1.25 جيجاهرتز)",
        "wavelength": "~24 سم",
        "penetration": "اختراق عميق للغطاء النباتي والغطاء الشجري",
        "useCase": "الكتلة الحيوية، بنية الغابات، يوإفيسار، نيسار"
      }
    },
    "polarizations": {
      "title": "أوضاع الاستقطاب",
      "intro": "يصف الاستقطاب اتجاه المجال الكهربائي للموجة الكهرومغناطيسية. تكشف توليفات الاستقطاب المختلفة آليات الانتثار المختلفة وخصائص السطح.",
      "signature": "البصمة الرادارية:",
      "polarizationSuffix": "استقطاب",
      "combinationsTitle": "التوليفات الاستقطابية لتحليل حرائق الغابات",
      "combinations": {
        "vvVh": { "combo": "VV + VH", "use": "رسم خرائط شدة الحرق، معيار سنتينل-1" },
        "hhHv": { "combo": "HH + HV", "use": "بنية الغابات، معيار ألوس-بالسار" },
        "quad": { "combo": "استقطاب رباعي كامل (HH+HV+VH+VV)", "use": "مصفوفة الانتثار الكاملة، يوإفيسار، نيسار" }
      },
      "hh": { "desc": "إرسال أفقي، استقبال أفقي", "detail": "قوي لانتثار السطح والمناطق الحضرية" },
      "vv": { "desc": "إرسال عمودي، استقبال عمودي", "detail": "قوي لانتثار السطح واكتشاف المياه" },
      "hv": { "desc": "إرسال أفقي، استقبال عمودي", "detail": "استقطاب متقاطع، انتثار حجمي، غطاء نباتي" },
      "vh": { "desc": "إرسال عمودي، استقبال أفقي", "detail": "استقطاب متقاطع، انتثار حجمي، غطاء نباتي" }
    },
    "scattering": {
      "title": "آليات الانتثار",
      "intro": "فهم آليات الانتثار هو المفتاح لتفسير صور رادار الفتحة التركيبية. تنتج كل آلية بصمات ارتداد مميزة تكشف خصائص السطح والحجم.",
      "signature": "البصمة الرادارية:",
      "decompositionTitle": "تحليل فريمان-ديردن / Yamaguchi",
      "decompositionDesc": "يفصل تحليل الاستقطاب الانتثار المختلط إلى آليات مكونة، مما يتيح التحليل الكمي لبنية الغطاء النباتي وأضرار الحرائق.",
      "decomposition": {
        "surface": { "label": "السطح %", "value": "15-30%", "desc": "مساهمة الأرض" },
        "doubleBounce": { "label": "الانتثار المزدوج %", "value": "10-25%", "desc": "تفاعل الجذع مع الأرض" },
        "volume": { "label": "الحجم %", "value": "50-70%", "desc": "انتثار المظلة" }
      },
      "surface": { "title": "انتثار السطح", "desc": "الأسطح الملساء (المياه، الطرق، التربة العارية)", "sarSignature": "ارتداد منخفض، انعكاس مرآوي" },
      "doubleBounce": { "title": "الانتثار المزدوج", "desc": "الهياكل العمودية (المباني، جذوع الأشجار)", "sarSignature": "ارتداد مرتفع، عاكس زاوية ثنائي السطح" },
      "volume": { "title": "انتثار الحجم", "desc": "مظلة الغطاء النباتي، الكتلة الحيوية للغابات", "sarSignature": "ارتداد معتدل، انتشار عشوائي" }
    },
    "nasaResources": {
      "title": "مصادر وأدوات بيانات ناسا",
      "intro": "تعتمد أورا سار على مصادر بيانات متعددة من ناسا والمصادر التجارية لمراقبة شاملة لحرائق الغابات. توفر هذه المنصات أساس بيانات رادار الفتحة التركيبية لتحليلاتنا المدعومة بالذكاء الاصطناعي.",
      "categories": {
        "dataAccess": "الوصول إلى البيانات",
        "mission": "مهمة",
        "airborne": "محمول جواً",
        "platform": "منصة",
        "commercial": "تجاري"
      },
      "asf": { "title": "قمة ASF", "desc": "بوابة اكتشاف ووصول وتحميل بيانات رادار الفتحة التركيبية لمركز ناسا DAAC", "category": "dataAccess" },
      "nisar": { "title": "مهمة نيسار", "desc": "مهمة مشتركة بين ناسا وإيسرو بالنطاقين L وS لمراقبة النظم البيئية العالمية", "category": "mission" },
      "uavsar": { "title": "يوإفيسار", "desc": "رادار فتحة تركيبية محمول جواً بالنطاق L واستقطاب كامل لدراسات إقليمية مفصلة", "category": "airborne" },
      "gee": { "title": "محرك جوجل للأرض", "desc": "منصة تحليل جغرافية مكانية على نطاق كوكبي مع كتالوج بيانات رادار الفتحة التركيبية", "category": "platform" },
      "capella": { "title": "كابيلا سبيس", "desc": "كوكبة رادار فتحة تركيبية تجارية بالنطاق X بدقة دون المتر", "category": "commercial" },
      "explore": "استكشف"
    },
    "applications": {
      "title": "تطبيقات رادار الفتحة التركيبية",
      "intro": "تتيح تقنية رادار الفتحة التركيبية تطبيقات متنوعة تتجاوز مراقبة حرائق الغابات. يمكن توسيع إطار أورا سار ليشمل حالات الاستخدام البيئية والأمنية الحرجة هذه.",
      "wildfire": "مراقبة الحرائق",
      "biomass": "الكتلة الحيوية للغابات",
      "flood": "رسم خرائط الفيضانات",
      "deformation": "تشوه السطح",
      "agriculture": "الزراعة",
      "maritime": "الجليد البحري والملاحة",
      "wildfireDesc": "اكتشاف الحرائق النشطة، رسم خرائط شدة الحرق، تتبع التعافي بعد الحريق",
      "biomassDesc": "تقدير الكتلة الحيوية فوق الأرض، مراقبة مخزون الكربون، تنبيهات إزالة الغابات",
      "floodDesc": "رسم خرائط نطاق الفيضان، تغيرات منسوب المياه، تقييم الأضرار",
      "deformationDesc": "الإنترفيرومتري للهبوط والانهيارات الأرضية والزلازل ومراقبة البنية التحتية",
      "agricultureDesc": "تصنيف المحاصيل، رطوبة التربة، مراقبة النمو، توقع الإنتاجية",
      "maritimeDesc": "مدى الجليد، السماكة، تصنيف النوع، اكتشاف السفن، الانسكابات النفطية"
    },
    "learnMore": {
      "title": "تعلم المزيد",
      "desc": "استكشف نظرية رادار الفتحة التركيبية وتقنيات المعالجة والتطبيقات",
      "items": ["دليل رادار الفتحة التركيبية (إيسا)", "قياس الاستقطاب الراداري (لي وبوتييه)", "مبادئ الإعصارية (روزن وآخرون)"]
    },
    "openTools": {
      "title": "أدوات مفتوحة المصدر",
      "desc": "برمجيات لمعالجة وتحليل رادار الفتحة التركيبية",
      "items": ["SNAP (إيسا)", "PySAR / ARIA-Tools", "GMTSAR / ISCE", "OpenSARLab (JupyterHub)"]
    },
    "auraPipeline": {
      "title": "خط معالجة أورا سار",
      "desc": "سير العمل لدينا لذكاء حرائق الغابات",
      "items": ["استيعاب البيانات عبر GEE/ASF", "المعالجة الأولية والمعايرة", "استخراج الميزات بالذكاء الاصطناعي", "لوحة التحكم في الوقت الفعلي"]
    }
  },
  "footer": {
    "brand": "أورا سار",
    "tagline": "الذكاء الاصطناعي والتحليلات فائقة الرادار لسلامة حرائق الغابات",
    "nasaChallenge": "تحدي ناسا لتطبيقات الفضاء 2025",
    "challengeTheme": "\"من خلال مرآة الرادار\"",
    "columnHeaders": {
      "product": "المنتج",
      "resources": "الموارد",
      "community": "المجتمع",
      "legal": "قانوني"
    },
    "links": {
      "github": "مستودع جيت هب",
      "docs": "التوثيق",
      "api": "مرجع واجهة البرمجة",
      "contact": "تواصل معنا"
    },
    "productLinks": {
      "dashboard": "لوحة التحكم التفاعلية",
      "analytics": "التحليلات الزمنية",
      "report": "التقارير المجتمعية",
      "sarEducation": "التعليم الراداري"
    },
    "resourceLinks": {
      "spaceApps": "تحدي ناسا لتطبيقات الفضاء 2025",
      "asfVertex": "قمة ASF",
      "nisar": "مهمة نيسار",
      "gee": "محرك جوجل للأرض"
    },
    "communityLinks": {
      "github": "مستودع جيت هب",
      "issues": "الإبلاغ عن مشكلات",
      "contribute": "المساهمة",
      "documentation": "التوثيق"
    },
    "legalLinks": {
      "privacy": "سياسة الخصوصية",
      "terms": "شروط الخدمة",
      "dataUsage": "استخدام البيانات",
      "disclaimer": "إخلاء المسؤولية"
    },
    "copyright": "© 2025 فريق أورا سار. تم تطويره لتحدي ناسا لتطبيقات الفضاء.",
    "disclaimer": "غير مخصص للاستخدام التشغيلي في الطوارئ. التنبيهات الرسمية عبر السلطات المحلية.",
    "builtWith": "تم تطويره بحب لتحدي ناسا لتطبيقات الفضاء 2025"
  },
  "errorBoundary": {
    "title": "حدث خطأ ما",
    "message": "واجهنا خطأ غير متوقع. يرجى تحديث الصفحة أو المحاولة مرة أخرى لاحقاً.",
    "refresh": "تحديث الصفحة",
    "details": "تفاصيل الخطأ"
  },
  "common": {
    "loading": "جاري التحميل...",
    "error": "حدث خطأ",
    "retry": "إعادة المحاولة",
    "close": "إغلاق",
    "save": "حفظ",
    "cancel": "إلغاء",
    "confirm": "تأكيد",
    "delete": "حذف",
    "edit": "تعديل",
    "view": "عرض",
    "search": "بحث",
    "filter": "تصفية",
    "sort": "ترتيب",
    "refresh": "تحديث",
    "download": "تحميل",
    "share": "مشاركة",
    "print": "طباعة",
    "fullscreen": "ملء الشاشة",
    "exitFullscreen": "الخروج من ملء الشاشة",
    "loadMore": "تحميل المزيد من التقارير"
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;