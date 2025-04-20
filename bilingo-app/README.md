# Bilingo‑App (Tauri) Setup & Android Build

Frontend: **React**, **Tauri**, **Vite**  
Platforms: Desktop (Windows/Linux/macOS) & Android

---

## 1. Clone & Install

```bash
git clone https://github.com/kobtair/bilingo-app.git
cd bilingo-app
npm install   # or yarn install
```

---

## 2. Environment Variables

Create a file named `.env` in the root:

```env
VITE_BACKEND_API=http://example.com/api
```

---

## 3. Run in Development

```bash
npm run tauri dev
```

---

## 4. Build for Desktop

```bash
npm run tauri build
```

The output will be inside `src-tauri/target/release/bundle`.

---

## 5. Build for Android

> Requires Android SDK, NDK, Rust, and `ANDROID_HOME` set

### Step 1: Add Android Targets
```bash
rustup target add aarch64-linux-android armv7-linux-androideabi
```

### Step 2: Set Android SDK Path
```bash
export ANDROID_HOME=/path/to/Android/Sdk
```

### Step 3: Build APK
```bash
npm run tauri build --target aarch64-linux-android
```

### Step 4: Install to Device
```bash
adb install -r src-tauri/target/aarch64-linux-android/release/app.apk
```
