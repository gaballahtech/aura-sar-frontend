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
    "lightMode": "Light Mode"
  },
  "hero": {
    "headline": "AI & Synthetic Aperture Radar Driven Wildfire Intelligence Platform",
    "subtitle": "Penetrating smoke, clouds, and darkness — SAR technology provides 24/7 wildfire monitoring and early warning capabilities for California and beyond.",
    "liveStats": {
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
      "severity": "Severity"
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
      "5years": "5 Years"
    }
  },
  "report": {
    "title": "Crowdsourced Disaster Verification",
    "subtitle": "Submit real-time field reports to improve AI model accuracy and community awareness",
    "form": {
      "title": "Submit Field Report",
      "photo": "Upload Photo",
      "photoHint": "Drag & drop or click to upload (max 10MB)",
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
      "getLocation": "Use Current Location"
    },
    "communityFeed": {
      "title": "Community Verified Reports",
      "verified": "Verified",
      "pending": "Pending Verification",
      "reportedBy": "Reported by",
      "timeAgo": "time ago"
    }
  },
  "sarEdu": {
    "title": "SAR Technology & NASA Challenge Context",
    "subtitle": "Understanding Synthetic Aperture Radar for wildfire monitoring",
    "frequencies": {
      "title": "SAR Frequency Bands",
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
      "hh": "HH: Horizontal transmit, Horizontal receive",
      "vv": "VV: Vertical transmit, Vertical receive",
      "hv": "HV: Horizontal transmit, Vertical receive (cross-pol)",
      "vh": "VH: Vertical transmit, Horizontal receive (cross-pol)"
    },
    "scattering": {
      "title": "Scattering Mechanisms",
      "surface": "Surface Scattering: Smooth surfaces (water, roads)",
      "doubleBounce": "Double Bounce: Vertical structures (buildings, tree trunks)",
      "volume": "Volume Scattering: Vegetation canopy, forest biomass"
    },
    "nasaResources": {
      "title": "NASA Data Sources & Tools",
      "asf": "ASF Vertex - SAR data discovery & download",
      "nisar": "NISAR Mission - L & S band global coverage",
      "uavsar": "UAVSAR - Airborne L-band polarimetric SAR",
      "gee": "Google Earth Engine - Planetary-scale analysis",
      "capella": "Capella Space - Commercial X-band SAR constellation"
    }
  },
  "footer": {
    "brand": "AURA SAR",
    "tagline": "AI & Ultra-Radar Analytics for Wildfire Safety",
    "nasaChallenge": "NASA Space Apps Challenge 2025",
    "challengeTheme": "\"Through the Radar Looking Glass\"",
    "links": {
      "github": "GitHub Repository",
      "docs": "Documentation",
      "api": "API Reference",
      "contact": "Contact"
    },
    "copyright": "© 2025 AURA SAR Team. Built for NASA Space Apps Challenge.",
    "disclaimer": "Not for operational emergency use. Official alerts via local authorities."
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
    "exitFullscreen": "Exit Fullscreen"
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
    "lightMode": "الوضع الفاتح"
  },
  "hero": {
    "headline": "منصة ذكاء حرائق الغابات المدعومة بالذكاء الاصطناعي ورادار الفتحة التركيبية",
    "subtitle": "اختراق الدخان والغيوم والظلام — توفر تقنية رادار الفتحة التركيبية مراقبة حرائق الغابات على مدار الساعة وقدرات الإنذار المبكر لكاليفورنيا وما وراءها.",
    "liveStats": {
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
      "severity": "الشدة"
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
      "5years": "5 سنوات"
    }
  },
  "report": {
    "title": "التحقق المجتمعي من الكوارث",
    "subtitle": "إرسال تقارير ميدانية في الوقت الفعلي لتحسين دقة نموذج الذكاء الاصطناعي ووعي المجتمع",
    "form": {
      "title": "إرسال تقرير ميداني",
      "photo": "رفع صورة",
      "photoHint": "اسحب وأفلِت أو انقر للرفع (الحد الأقصى 10 ميجابايت)",
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
      "getLocation": "استخدام الموقع الحالي"
    },
    "communityFeed": {
      "title": "تقارير المجتمع المُتحقق منها",
      "verified": "مُحقق",
      "pending": "قيد التحقق",
      "reportedBy": "أبلغ بواسطة",
      "timeAgo": "منذ"
    }
  },
  "sarEdu": {
    "title": "تقنية رادار الفتحة التركيبية وسياق تحدي ناسا",
    "subtitle": "فهم رادار الفتحة التركيبية لمراقبة حرائق الغابات",
    "frequencies": {
      "title": "نطاقات ترددات رادار الفتحة التركيبية",
      "xBand": {
        "name": "نطاق X (9.6 جيجاهرتز)",
        "wavelength": "~3 سم",
        "penetration": "اختراق منخفض للغطاء النباتي",
        "useCase": "رسم خراضي عالي الدقة للمناطق الحضرية والبنية التحتية"
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
      "hh": "HH: إرسال أفقي، استقبال أفقي",
      "vv": "VV: إرسال عمودي، استقبال عمودي",
      "hv": "HV: إرسال أفقي، استقبال عمودي (استقطاب متقاطع)",
      "vh": "VH: إرسال عمودي، استقبال أفقي (استقطاب متقاطع)"
    },
    "scattering": {
      "title": "آليات الانتثار",
      "surface": "انتثار السطح: الأسطح الملساء (المياه، الطرق)",
      "doubleBounce": "الانتثار المزدوج: الهياكل العمودية (المباني، جذوع الأشجار)",
      "volume": "انتثار الحجم: مظلة الغطاء النباتي، الكتلة الحيوية للغابات"
    },
    "nasaResources": {
      "title": "مصادر وأدوات بيانات ناسا",
      "asf": "قمة ASF - اكتشاف وتحميل بيانات رادار الفتحة التركيبية",
      "nisar": "مهمة نيسار - تغطية عالمية بالنطاقين L و S",
      "uavsar": "يوإفيسار - رادار الفتحة التركيبية المحمول جوالاً بالنطاق L",
      "gee": "محرك جوجل للأرض - تحليل على نطاق كوكبي",
      "capella": "كابيلا سبيس - كوكبة رادار الفتحة التركيبية التجارية بالنطاق X"
    }
  },
  "footer": {
    "brand": "أورا سار",
    "tagline": "الذكاء الاصطناعي والتحليلات فائقة الرادار لسلامة حرائق الغابات",
    "nasaChallenge": "تحدي ناسا لتطبيقات الفضاء 2025",
    "challengeTheme": "\"من خلال مرآة الرادار\"",
    "links": {
      "github": "مستودع جيت هب",
      "docs": "التوثيق",
      "api": "مرجع واجهة البرمجة",
      "contact": "تواصل معنا"
    },
    "copyright": "© 2025 فريق أورا سار. تم تطويره لتحدي ناسا لتطبيقات الفضاء.",
    "disclaimer": "غير مخصص للاستخدام التشغيلي في الطوارئ. التنبيهات الرسمية عبر السلطات المحلية."
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
    "exitFullscreen": "الخروج من ملء الشاشة"
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