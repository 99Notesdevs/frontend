# 99Notes - UPSC Preparation Platform

A comprehensive web platform for UPSC aspirants built with Next.js, offering study materials, current affairs updates, and exam resources.

## Features

- **UPSC Notes**
  - Structured notes for all General Studies papers (GS1, GS2, GS3, GS4)
  - Topic-wise organization with detailed subtopics
  - Easy navigation through subjects

- **Current Affairs**
  - Daily News Analysis
  - The Hindu Editorial Analysis
  - Indian Express Editorial Coverage
  - PIB Updates
  - Daily Quiz
  - Daily Answer Writing Practice

- **Free Study Material**
  - Previous Year Question Papers (PYQs)
  - Complete UPSC Syllabus (Prelims, Mains, Optional)
  - Indian Constitution Study Material

- **Exam Forum**
  - Recruitment Exams Information
    - Group A (IAS, IPS, IFS)
    - Group B (SSC CGL, Banking)
    - Group C&D
  - Higher Education Entrance Exams
    - Engineering (JEE, GATE)
    - Medical (NEET)
    - Law (CLAT)
    - Management (CAT)
    - Central Universities (CUET)

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- React Icons

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/            
│   ├── Navbar/            # Navigation components
│   └── layout/            # Layout components
├── pages/                 # File-based routing
│   ├── current-affairs/   # Current affairs section
│   ├── exam-forum/        # Exam information
│   ├── free-study-material/# Study resources
│   └── upsc-notes/       # UPSC notes section
└── styles/               # Global styles
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/va24nsh/99NotesfrontendNEXT.git
   cd 99NotesfrontendNEXT
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Navigation Structure

- All navigation is handled through the Navbar component
- URLs follow a consistent pattern:
  - UPSC Notes: `/upsc-notes/[section]/[subject]/[topic]`
  - Current Affairs: `/current-affairs/[section]/[topic]`
  - Free Study Material: `/free-study-material/[section]`
  - Exam Forum: 
    - `/exam-forum/recruitment-exams/[group]/[exam]`
    - `/exam-forum/higher-education/[category]/[exam]`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/va24nsh/99NotesfrontendNEXT](https://github.com/va24nsh/99NotesfrontendNEXT)
