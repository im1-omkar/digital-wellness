import type { Guide, Resource, ResourceSource } from "@wellness/contracts";

export const catalogCheckedAt = "2026-11-11";

export const categorySeeds = [
  {
    slug: "screen-time",
    name: "Screen time",
    description: "See or shape how much time you spend in selected apps and on your device.",
    sortOrder: 1
  },
  {
    slug: "focus",
    name: "Focus tools",
    description: "Reduce distractions during a study session or a task you choose.",
    sortOrder: 2
  },
  {
    slug: "notifications-sleep",
    name: "Notifications & routines",
    description: "Set quieter periods and decide which alerts can still reach you.",
    sortOrder: 3
  },
  {
    slug: "privacy-safety",
    name: "Privacy & safety",
    description: "Review account controls and learn practical digital safety habits.",
    sortOrder: 4
  }
] as const;

function source(url: string, label: string, sourceType: ResourceSource["sourceType"]): ResourceSource {
  return { url, label, sourceType, checkedAt: catalogCheckedAt };
}

export const resourceSeeds: Resource[] = [
  {
    id: "seed-apple-screen-time",
    slug: "apple-screen-time",
    name: "Apple Screen Time",
    category: { slug: "screen-time", name: "Screen time" },
    purpose: "Review device and app use, set time allowances, and schedule periods when selected apps are unavailable.",
    bestFor: "Students using an iPhone or iPad who want built-in usage summaries and app limits.",
    goalTags: ["screen-time", "bedtime", "routine"],
    platforms: ["iPhone", "iPad", "Mac"],
    costLabel: "built_in",
    costDetails: "Included with supported Apple operating systems; no separate wellness-tool purchase. Device cost and OS availability still apply.",
    accountRequirements: "Basic settings are on the device. Sharing Screen Time settings and reports across Apple devices requires the same Apple Account on those devices.",
    privacyNotes: "Usage reports include app and website activity. Apple's support guide says cross-device sharing shares settings and reports across devices using the same Apple Account; leave sharing off if you do not want that sync.",
    accessibilityNotes: "Configured in iOS/iPadOS Settings. VoiceOver, text size, and other system accessibility options are available, though this hub has not independently audited every screen.",
    limitations: "Features and menu names depend on OS version. Limits can be overridden by the device owner, and the reports describe use rather than explain whether that use is a problem.",
    quickStart: "Open Settings → Screen Time, then choose a schedule or time allowance. Start with one small, adjustable limit.",
    lastVerifiedAt: catalogCheckedAt,
    sources: [
      source("https://support.apple.com/en-ie/guide/iphone/iphbfa595995/27/ios/27", "Set up Screen Time for yourself on iPhone", "support"),
      source("https://support.apple.com/en-euro/guide/iphone/iphb0c7313c9/27/ios/27", "Screen Time schedules and time allowances", "support")
    ]
  },
  {
    id: "seed-apple-focus",
    slug: "apple-focus",
    name: "Apple Focus",
    category: { slug: "focus", name: "Focus tools" },
    purpose: "Silence or allow selected notifications and schedule a focus mode for study, sleep, or another activity.",
    bestFor: "iPhone users who want to quiet notifications without installing another app.",
    goalTags: ["focus", "notifications", "bedtime"],
    platforms: ["iPhone", "iPad", "Mac", "Apple Watch"],
    costLabel: "built_in",
    costDetails: "Included with supported Apple operating systems; no separate app purchase.",
    accountRequirements: "A device is required. Sharing Focus settings across Apple devices uses the same Apple Account. Sharing Focus Status can tell people in supported apps that notifications are silenced.",
    privacyNotes: "Review Share Across Devices and Share Focus Status. The latter can communicate your silenced-notifications status to other people; it does not hide messages or replace notification privacy settings.",
    accessibilityNotes: "Set up from Settings or Control Center. System accessibility controls apply; this hub has not independently audited every Focus screen.",
    limitations: "Focus mainly changes notifications and selected app behavior; it does not block every distraction. Some options vary by device and OS version.",
    quickStart: "Open Settings → Focus, choose Do Not Disturb or create a custom Focus, then allow only the people and apps you need.",
    lastVerifiedAt: catalogCheckedAt,
    sources: [
      source("https://support.apple.com/en-gb/guide/iphone/iphd6288a67f/ios", "Set up a Focus on iPhone", "support"),
      source("https://support.apple.com/en-ng/guide/iphone/iph5c3f5b77b/ios", "Turn on or schedule a Focus", "support")
    ]
  },
  {
    id: "seed-android-digital-wellbeing",
    slug: "android-digital-wellbeing",
    name: "Android Digital Wellbeing",
    category: { slug: "screen-time", name: "Screen time" },
    purpose: "Review app use, set app timers, schedule Bedtime mode, or pause selected apps with Focus mode.",
    bestFor: "Android phone users who want a built-in place to try a screen-time or bedtime routine.",
    goalTags: ["screen-time", "focus", "bedtime", "routine"],
    platforms: ["Android phones and tablets (availability varies)"],
    costLabel: "built_in",
    costDetails: "Built into supported Android devices; no separate Digital Wellbeing purchase.",
    accountRequirements: "Use the device Settings app. Google's help page says the first launch asks the user to set up a profile; exact availability and setup can vary by device maker.",
    privacyNotes: "The feature can display app screen time, opens, and notifications. Storage and sync behavior can depend on the phone and enabled services; review your device maker's privacy settings before turning on optional sync.",
    accessibilityNotes: "The feature lives in Android Settings, but device makers can change its layout and labels. Use Android accessibility features and confirm the route on the specific device.",
    limitations: "Google notes that steps vary on some phones. Some work or school accounts may not work with app timers, and timer controls can be removed or changed by the device owner.",
    quickStart: "Open Settings → Digital Wellbeing, choose Focus mode or Bedtime mode, and select one small change to try.",
    lastVerifiedAt: catalogCheckedAt,
    sources: [
      source("https://support.google.com/android/answer/9346420?hl=en", "Manage how you spend time on your Android phone", "support")
    ]
  },
  {
    id: "seed-windows-focus",
    slug: "windows-focus",
    name: "Windows Focus",
    category: { slug: "focus", name: "Focus tools" },
    purpose: "Run a timed focus session, turn on Do Not Disturb, and optionally hide taskbar badges and flashing indicators.",
    bestFor: "Windows 11 students who want a built-in study timer and quieter notifications.",
    goalTags: ["focus", "notifications", "study"],
    platforms: ["Windows 11"],
    costLabel: "built_in",
    costDetails: "Included with Windows 11; the Clock app is needed for the full session view.",
    accountRequirements: "Uses Windows Settings and the Clock app. The basic focus session does not require a separate wellness-tool account.",
    privacyNotes: "The feature silences alerts during a session; missed notifications remain available in Notification Center. It is not an activity-tracking or notification-deletion tool.",
    accessibilityNotes: "Settings and Clock provide standard Windows navigation. Check the current Windows accessibility controls and use keyboard shortcuts if preferred.",
    limitations: "Microsoft says Focus works with focus periods in Clock; reinstall Clock if it was removed. The exact controls can change with Windows updates.",
    quickStart: "Open Settings → System → Focus, choose a short duration, and start a session. Review Do Not Disturb options before relying on it.",
    lastVerifiedAt: catalogCheckedAt,
    sources: [
      source("https://support.microsoft.com/en-us/windows/experience/focus-stay-on-task-without-distractions-in-windows", "Focus: Stay on task without distractions", "support")
    ]
  },
  {
    id: "seed-windows-do-not-disturb",
    slug: "windows-do-not-disturb",
    name: "Windows Do Not Disturb",
    category: { slug: "notifications-sleep", name: "Notifications & routines" },
    purpose: "Silence notification banners manually or at selected times while keeping missed alerts in Notification Center.",
    bestFor: "Windows 11 users who want fewer pop-up alerts but still need to review what arrived later.",
    goalTags: ["notifications", "focus", "routine"],
    platforms: ["Windows 11"],
    costLabel: "built_in",
    costDetails: "Included with Windows 11; no separate app purchase.",
    accountRequirements: "Configured in Windows Settings. No separate wellness-tool account is required.",
    privacyNotes: "Do Not Disturb changes how alerts appear; missed notifications are sent to Notification Center. Adjust lock-screen preview settings separately if alerts may contain sensitive details.",
    accessibilityNotes: "Notification settings are part of Windows Settings. Priority notifications can be configured to allow selected apps, calls, or reminders.",
    limitations: "It reduces interruptions rather than blocking apps or deleting notifications. Conditions and menu names may change between Windows releases.",
    quickStart: "Open Settings → System → Notifications, then configure automatic Do Not Disturb times and priority notifications.",
    lastVerifiedAt: catalogCheckedAt,
    sources: [
      source("https://support.microsoft.com/en-us/windows/experience/notifications-and-do-not-disturb-in-windows", "Notifications and Do Not Disturb in Windows", "support")
    ]
  },
  {
    id: "seed-leechblock",
    slug: "leechblock-ng",
    name: "LeechBlock NG",
    category: { slug: "focus", name: "Focus tools" },
    purpose: "Create schedules or time allowances for websites you choose to block in Firefox.",
    bestFor: "Students who want a configurable website blocker and are comfortable reviewing browser-extension permissions.",
    goalTags: ["focus", "study", "browser"],
    platforms: ["Firefox desktop", "Firefox for Android"],
    costLabel: "open_source",
    costDetails: "Free extension released under Mozilla Public License 2.0. The developer invites voluntary contributions.",
    accountRequirements: "Install from Firefox Add-ons; no LeechBlock account is required for its basic blocking features.",
    privacyNotes: "The Firefox Add-ons listing says the developer reports no data collection. The extension still requests broad tab, navigation, and website access so it can apply your block rules; review permissions and the developer's explanation before installing.",
    accessibilityNotes: "The add-on is a browser interface. Keyboard access and screen-reader behavior should be checked on your browser/version before depending on it.",
    limitations: "It works inside supported Firefox browsers, not every app or browser on the device. Blocking rules can be changed by a user with access to the extension settings.",
    quickStart: "Install from Firefox Add-ons, open the extension's Options, add a small site list, and set one schedule before expanding it.",
    lastVerifiedAt: catalogCheckedAt,
    sources: [
      source("https://addons.mozilla.org/en-US/firefox/addon/leechblock-ng/", "LeechBlock NG on Firefox Add-ons", "product"),
      source("https://www.proginosko.com/leechblock/documentation/", "LeechBlock NG documentation", "support"),
      source("https://addons.mozilla.org/en-US/firefox/addon/leechblock-ng/versions/", "LeechBlock NG version history and license", "license")
    ]
  },
  {
    id: "seed-cold-turkey",
    slug: "cold-turkey-blocker",
    name: "Cold Turkey Blocker",
    category: { slug: "focus", name: "Focus tools" },
    purpose: "Block selected websites on a computer, with paid options for scheduled blocks, application blocking, and locking features.",
    bestFor: "Windows or Mac users who want stronger desktop website blocks and have checked which features are paid.",
    goalTags: ["focus", "study", "browser"],
    platforms: ["Windows", "macOS"],
    costLabel: "freemium",
    costDetails: "Free version includes timed website blocks, exceptions, and statistics. Pro is a one-time purchase; scheduled blocks, app blocking, and locking features require Pro. Price is shown at purchase and may vary by region; a 7-day Pro trial is offered.",
    accountRequirements: "The desktop app requires installation and operating-system permissions. A purchase is handled through the provider's payment processor; no separate social account is needed for basic use.",
    privacyNotes: "The developer's user guide says settings and statistics are stored on the computer and not collected. The privacy policy covers website and payment processing separately; review it before installing or buying.",
    accessibilityNotes: "This is installed desktop software with blocking controls. Accessibility behavior has not been independently audited by this hub; try the free features before relying on a locked block.",
    limitations: "Windows and macOS only. Do not label the full scheduling or app-blocking workflow as free; those features are paid. Strong blocks can be difficult to undo until a timer ends.",
    quickStart: "Try the free timed website block first. Before buying, confirm that the specific feature you need is included in Pro and review the lock behavior.",
    lastVerifiedAt: catalogCheckedAt,
    sources: [
      source("https://getcoldturkey.com/pricing/", "Cold Turkey Blocker pricing and free features", "pricing"),
      source("https://getcoldturkey.com/support/user-guide/", "Cold Turkey user guide and local settings note", "support"),
      source("https://getcoldturkey.com/privacy/", "Cold Turkey privacy policy", "privacy")
    ]
  },
  {
    id: "seed-google-privacy-checkup",
    slug: "google-privacy-checkup",
    name: "Google Account Privacy Checkup",
    category: { slug: "privacy-safety", name: "Privacy & safety" },
    purpose: "Review and adjust available privacy settings and activity controls for a Google Account.",
    bestFor: "Students who use Google services and want to review what activity is saved to their account.",
    goalTags: ["privacy", "safety", "accounts"],
    platforms: ["Web browser", "Android", "iOS"],
    costLabel: "free",
    costDetails: "Free account settings tool. It is part of Google Account controls, not an independent privacy service.",
    accountRequirements: "Sign in to the Google Account whose settings you want to review. School or managed accounts may have controls set by an administrator.",
    privacyNotes: "The checkup is intended to help review activity and privacy controls. Changing a setting does not necessarily delete previously saved data; review the deletion controls and Google's privacy policy too.",
    accessibilityNotes: "Available through the Google Account website and related apps. Interface and available controls can differ by account type, region, and rollout.",
    limitations: "Only covers Google Account and Google service settings. It does not review device, browser, or other app privacy settings, and some options may be controlled by an organization.",
    quickStart: "Open Google Account → Data & privacy → Privacy Checkup, review each section, and use My Activity to inspect saved activity.",
    lastVerifiedAt: catalogCheckedAt,
    sources: [
      source("https://support.google.com/accounts/answer/7660719?hl=en", "Find, control, and delete information in your Google Account", "support"),
      source("https://myaccount.google.com/intro/privacycheckup?hl=en-US", "Google Account Privacy Checkup", "product"),
      source("https://www.google.com/policies/privacy/", "Google Privacy Policy", "privacy")
    ]
  },
  {
    id: "seed-eff-ssd",
    slug: "eff-surveillance-self-defense",
    name: "EFF Surveillance Self-Defense",
    category: { slug: "privacy-safety", name: "Privacy & safety" },
    purpose: "Learn how to think about online privacy and security, assess risks, and choose practical safety steps.",
    bestFor: "Students who want plain-language digital safety guidance before choosing a specific privacy tool.",
    goalTags: ["privacy", "safety", "learning"],
    platforms: ["Any modern web browser"],
    costLabel: "free",
    costDetails: "Free, public educational guide from the Electronic Frontier Foundation; no purchase is required to read it.",
    accountRequirements: "No account is needed to read the public guide.",
    privacyNotes: "The guide encourages readers to assess their own risks and warns against assuming any tool guarantees complete security. EFF notes that some legal details may not apply in every country.",
    accessibilityNotes: "The hub links to the original guide; page formats and media vary by article. Accessibility has not been independently audited here.",
    limitations: "It is a broad digital security resource, not a personalized safety assessment or a substitute for specialist help. Some law-specific content is jurisdiction-dependent.",
    quickStart: "Start with the Your Security Plan guide, then choose only the topics that match your situation.",
    lastVerifiedAt: catalogCheckedAt,
    sources: [
      source("https://ssd.eff.org/", "Surveillance Self-Defense", "product"),
      source("https://ssd.eff.org/about-surveillance-self-defense", "About Surveillance Self-Defense", "support")
    ]
  }
];

export const guideSeeds: Array<Omit<Guide, "id" | "resource"> & { resourceSlug: string }> = [
  {
    slug: "set-up-an-iphone-focus",
    title: "Set up a study Focus on iPhone",
    summary: "Choose which notifications can interrupt a study block and how long the Focus should stay on.",
    platform: "iPhone",
    versionContext: "Menu names follow Apple's current iPhone Focus help; labels may differ slightly by iOS version.",
    intro: "Start with a short session and allow calls or apps you would still need. Focus changes notification behavior; it does not block websites or guarantee uninterrupted study.",
    prerequisites: ["An iPhone with Focus in Settings.", "Decide which people and apps must remain allowed during study."],
    undoSteps: "Open Control Center, tap Focus, then tap the active Focus to turn it off. You can edit or delete a custom Focus in Settings → Focus.",
    troubleshooting: "If Focus turns on automatically, open Settings → Focus and remove or adjust its schedule. Check Share Focus Status if you do not want supported apps to show that notifications are silenced.",
    imagePath: "/guides/iphone-focus.svg",
    imageAlt: "Illustration of iPhone Settings showing a Focus choice, allowed notifications, and a schedule; it contains no account or personal details.",
    lastVerifiedAt: catalogCheckedAt,
    resourceSlug: "apple-focus",
    sources: [source("https://support.apple.com/en-gb/guide/iphone/iphd6288a67f/ios", "Apple: Set up a Focus on iPhone", "support")],
    steps: [
      { position: 1, title: "Open Focus settings", instruction: "Open Settings → Focus and choose Do Not Disturb, Work, or a custom Focus." },
      { position: 2, title: "Choose allowed notifications", instruction: "Open People and Apps. Allow the people and apps you need, or silence selected ones." },
      { position: 3, title: "Add a schedule", instruction: "Choose Add Schedule and set a time window or another trigger for your study session." },
      { position: 4, title: "Try it and turn it off", instruction: "Turn the Focus on from Control Center. When the session ends, turn it off there or adjust the schedule.", note: "Check Share Focus Status if you want to control whether others can see that notifications are silenced." }
    ]
  },
  {
    slug: "schedule-android-focus-mode",
    title: "Schedule Focus mode on Android",
    summary: "Pause selected distracting apps during a chosen study window, then leave the rest of the phone available.",
    platform: "Android",
    versionContext: "Google's help notes that steps and availability vary by device maker and Android version.",
    intro: "Focus mode pauses only the apps you select. Keep essential communication or accessibility apps out of the paused list and test the schedule before depending on it.",
    prerequisites: ["An Android device with Digital Wellbeing and Focus mode available.", "Choose the apps you want paused during study."],
    undoSteps: "Open Settings → Digital Wellbeing → Focus mode and tap Turn off now. You can also edit or remove the schedule from that screen.",
    troubleshooting: "If Digital Wellbeing or Focus mode is missing, search Settings for the feature or check the phone maker's support page. Work or school account policies may restrict timers.",
    imagePath: "/guides/android-focus.svg",
    imageAlt: "Illustration of Android Settings showing Digital Wellbeing, selected paused apps, and a Focus mode schedule; no personal information is shown.",
    lastVerifiedAt: catalogCheckedAt,
    resourceSlug: "android-digital-wellbeing",
    sources: [source("https://support.google.com/android/answer/9346420?hl=en", "Google: Manage time on Android with Digital Wellbeing", "support")],
    steps: [
      { position: 1, title: "Open Digital Wellbeing", instruction: "Open Settings → Digital Wellbeing. On some phones it may appear under a different Settings section." },
      { position: 2, title: "Choose Focus mode", instruction: "Tap Focus mode and select the apps you want to pause during your study window." },
      { position: 3, title: "Set a schedule", instruction: "Tap Set a schedule and choose the days and times that suit your routine." },
      { position: 4, title: "Test and adjust", instruction: "Start Focus mode once to check which apps pause. Use Take a break or Turn off if you need access, then revise your app list.", note: "The exact controls vary by phone; follow the linked Google or device-maker instructions if labels differ." }
    ]
  },
  {
    slug: "install-leechblock-firefox",
    title: "Create a website block in LeechBlock NG",
    summary: "Install the Firefox extension and create one limited block set for a study session.",
    platform: "Firefox desktop or Android",
    versionContext: "Use the current extension from Mozilla Add-ons; the options page can change between releases.",
    intro: "A browser extension can block sites in that browser, but it cannot prevent opening the same site in another browser or app. Start with a short schedule so you can check the rules before relying on them.",
    prerequisites: ["Firefox for desktop or Android.", "A short list of distracting sites you want to block.", "Review the extension permissions before installing."],
    undoSteps: "Open the LeechBlock NG options and disable or edit the relevant block set. If a timed lock is active, read the extension's current documentation before turning it on so you understand how to unlock it.",
    troubleshooting: "If a site still opens, check the exact domain, browser profile, and schedule times. Confirm the extension is enabled for the current browser and review its permissions page.",
    imagePath: "/guides/leechblock.svg",
    imageAlt: "Illustration of a browser extension options page with a sample site list and study schedule; the sample contains no real account data.",
    lastVerifiedAt: catalogCheckedAt,
    resourceSlug: "leechblock-ng",
    sources: [
      source("https://addons.mozilla.org/en-US/firefox/addon/leechblock-ng/", "LeechBlock NG on Firefox Add-ons", "product"),
      source("https://www.proginosko.com/leechblock/documentation/", "LeechBlock NG documentation", "support")
    ],
    steps: [
      { position: 1, title: "Install from Firefox Add-ons", instruction: "Open the official Firefox Add-ons page, review the requested permissions, then choose Add to Firefox if you are comfortable with them." },
      { position: 2, title: "Open extension options", instruction: "Open the browser's Extensions menu, choose LeechBlock NG, then open its Options page." },
      { position: 3, title: "Enter a small site list", instruction: "In one block set, add the domains you want to pause. Use the extension's examples and documentation if you need wildcard or exception rules." },
      { position: 4, title: "Choose and test a time window", instruction: "Set the days and times for that set, save the options, and test the rule before using a strict or locked mode.", note: "The extension controls Firefox only; it does not block sites in other apps or browsers." }
    ]
  }
];
