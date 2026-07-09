# ResumeCraft — Premium Resume Builder & ATS Scanner 🚀

ResumeCraft is a fast, premium, and 100% client-side online resume builder. Designed with privacy in mind, it allows candidates to build, format, and optimize their resumes for Applicant Tracking Systems (ATS) entirely within their local browser.

## ✨ Features

### 1. Interactive Form Editor
* **Dynamic Sections:** Edit Profile details, Work Experience, Education, Technical Skills, and Projects.
* **Fully Custom Sections:** Add new sections (e.g. Certifications, Languages) where you can define dynamic fields matching four distinct types:
  * **Header / Main Title** (Bold left aligned)
  * **Timeline / Date** (Right aligned)
  * **Sub-heading / Normal Text** (Italicized subtitle, supports automatic URL link formatting)
  * **Description** (Markdown-enabled paragraph lists)
* **Drag-and-Drop Reordering:** Rearrange layout blocks naturally to fit your hierarchy.

### 2. Premium Design Presets & Accents
* **12 Design Templates:** Swap between Silicon Valley classic layouts, executive Lora editorial stylings, and modern dual-column split designs.
* **Custom Typography & Sizing:** Curated font systems (Inter, Outfit, Georgia, Playfair, Lora) with layout spacing and margin fine-tuning.
* **Accent Themes:** Tailor accents with custom indicators matching color palettes (Navy, Indigo, Crimson, Emerald, Charcoal).

### 3. Local ATS Scanner (Job Description Keyword Matcher)
* **Keyword Matching:** Paste a target Job Description to scan your resume text for missing keywords and optimize ATS matching.
* **Disclaimers:** Includes a local notice explaining it runs without remote AI engines to ensure zero data ever leaves your computer.
* **Footer Dashboard:** Tracks formatting checklists and ATS matching percentages directly in the editor footer.

### 4. Visual Page Break Guidance
* Draws distinct page sheets with **Page 1 / Page 2 separator overlays** in the preview panel, matching print engine outputs. Adjust spacing dynamically to avoid overflow cuts before printing.

### 5. Multi-format Vector Exports
* Export resumes directly into high-fidelity vector **PDF** documents or download as editable **MS Word (.doc)** files.

---

## 🔒 Privacy First

ResumeCraft runs completely client-side. **No resume data, uploaded text, contact details, or job descriptions are sent to external databases or APIs.** Your documents remain entirely in your sandboxed browser.

---

## 🛠️ Technology Stack

* **Core:** React 18 + TypeScript + Vite
* **Styling:** Tailwind CSS (Vanilla utilities)
* **Icons:** Lucide React
* **Build System:** Vite (Fast bundle compilation)
* **CI/CD:** GitHub Actions (Deploy to Pages)

---

## 🚀 Getting Started

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mr-Who-Root/Free-Resume-Builder-Online.git
   cd Free-Resume-Builder-Online
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build the production bundle:**
   ```bash
   npm run build
   ```

### GitHub Pages Deploy

This project includes a pre-configured GitHub Actions workflow (`.github/workflows/deploy.yml`) to build and deploy the app to GitHub Pages. Push to the `main` branch to trigger the automatic build-and-publish run.
