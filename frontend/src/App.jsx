import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Will be consolidated into index.css

function App() {
  // Navigation States
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Typewriter States
  const [typewriterText, setTypewriterText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const phrases = [
    'Secure & Scalable Apps',
    'Full Stack Solutions',
    'AI-Powered Platforms',
    'Clean & Maintainable Code',
    'Microservices Architecture',
    'Cloud Native Services'
  ];

  // Custom Cursor Refs
  const cursorRef = useRef(null);
  const cursorFollowerRef = useRef(null);

  // Form States
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [notification, setNotification] = useState(null);

  // Card Tilt Effect Ref list
  const cardRefs = useRef([]);
  cardRefs.current = [];

  const addToCardRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  // Parallax Effect Ref list
  const parallaxRefs = useRef([]);
  parallaxRefs.current = [];
  const addToParallaxRefs = (el) => {
    if (el && !parallaxRefs.current.includes(el)) {
      parallaxRefs.current.push(el);
    }
  };

  // Hero 3D Tilt Ref & Handlers
  const heroRef = useRef(null);

  const handleHeroMouseMove = (e) => {
    const hero = heroRef.current;
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * 12; // max 12 deg
    const rotateY = ((x - centerX) / centerX) * 12; // max 12 deg

    const content = hero.querySelector('.hero-main-content');
    if (content) {
      content.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      content.style.transition = 'none';
    }
  };

  const handleHeroMouseLeave = () => {
    const hero = heroRef.current;
    if (!hero) return;
    const content = hero.querySelector('.hero-main-content');
    if (content) {
      content.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg)`;
      content.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
    }
  };

  // Audio Playback Handling
  const audioRef = useRef(new Audio('/audio/intro-audio.wav'));
  const [isSummaryPlaying, setIsSummaryPlaying] = useState(false);
  const summaryAudioRef = useRef(new Audio('/audio/summary.wav'));

  useEffect(() => {
    const audioObj = summaryAudioRef.current;
    const handlePlay = () => setIsSummaryPlaying(true);
    const handlePauseOrEnd = () => setIsSummaryPlaying(false);

    if (audioObj) {
      audioObj.addEventListener('play', handlePlay);
      audioObj.addEventListener('pause', handlePauseOrEnd);
      audioObj.addEventListener('ended', handlePauseOrEnd);
    }

    return () => {
      if (audioObj) {
        audioObj.removeEventListener('play', handlePlay);
        audioObj.removeEventListener('pause', handlePauseOrEnd);
        audioObj.removeEventListener('ended', handlePauseOrEnd);
      }
    };
  }, []);

  const handlePortraitClick = () => {
    if (summaryAudioRef.current) {
      summaryAudioRef.current.pause();
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => console.log("Audio play failed:", err));
    }
  };

  const toggleSummaryAudio = () => {
    if (summaryAudioRef.current) {
      if (isSummaryPlaying) {
        summaryAudioRef.current.pause();
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        summaryAudioRef.current.currentTime = 0;
        summaryAudioRef.current.play().catch((err) => console.log("Summary audio play failed:", err));
      }
    }
  };

  // Block inspection tools (Right-click & shortcuts)
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // Disable F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Disable Ctrl+Shift+I, J, C, U (Chrome DevTools shortcuts)
      if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'U'].includes(e.key.toUpperCase())) {
        e.preventDefault();
      }
      // Disable Cmd+Alt+I, J, C, U (Mac Chrome DevTools shortcuts)
      if (e.metaKey && e.altKey && ['I', 'J', 'C', 'U'].includes(e.key.toUpperCase())) {
        e.preventDefault();
      }
      // Disable Cmd+U (View Source)
      if (e.metaKey && e.key.toUpperCase() === 'U') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 1. Navbar Scroll Effect & Active Section Observer
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Determine active section
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'resume', 'contact'];
      let current = 'home';
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            current = sectionId;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Typewriter Effect
  useEffect(() => {
    let timer;
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setTypewriterText(currentPhrase.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, 50);
    } else {
      timer = setTimeout(() => {
        setTypewriterText(currentPhrase.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 100);
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, phraseIndex]);

  // 3. Custom Cursor & Mouse Trail & Parallax Mouse Move Handler
  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = cursorFollowerRef.current;

    const handleMouseMove = (e) => {
      if (cursor && follower) {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        follower.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
      }

      // Parallax Mouse Effect
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
      parallaxRefs.current.forEach((el) => {
        if (el) {
          el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 5. 3D Card Tilt Event Listeners
  useEffect(() => {
    const cards = cardRefs.current;

    cards.forEach((card) => {
      if (!card) return;

      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
      };

      const handleMouseLeave = () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, [cardRefs.current.length]);

  // 6. Scroll Reveal Observer
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
    return () => reveals.forEach((el) => observer.unobserve(el));
  }, []);

  // 7. Form Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formName || !formEmail || !formMessage) {
      triggerNotification('Please fill in all fields', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail)) {
      triggerNotification('Please enter a valid email address', 'error');
      return;
    }

    setIsSending(true);

    try {
      // Send message via EmailJS REST API
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_mourya';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_portfolio';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'user_mourya_placeholder';

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name: formName,
            from_email: formEmail,
            message: formMessage,
            to_name: 'Mourya'
          }
        })
      });

      if (response.ok) {
        triggerNotification('Message sent successfully! I will reach out soon.', 'success');
        setFormName('');
        setFormEmail('');
        setFormMessage('');
      } else {
        const errorText = await response.text();
        triggerNotification(errorText || 'Failed to send message via EmailJS.', 'error');
      }
    } catch (error) {
      triggerNotification('Failed to connect to EmailJS. Please check your internet connection.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const triggerNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Custom Cursor Elements */}
      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-follower" ref={cursorFollowerRef}></div>



      <div className="app-container">
        {/* Navigation Navbar */}
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
          <div className="nav-container">
            <a href="#home" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollToSection('home'); handlePortraitClick(); }}>
              <span className="logo-text">Mourya.dev</span>
            </a>
            <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
              <a href="#home" className={`nav-link ${activeSection === 'home' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a>
              <a href="#about" className={`nav-link ${activeSection === 'about' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
              <a href="#skills" className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}>Skills</a>
              <a href="#projects" className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}>Projects</a>
              <a href="#experience" className={`nav-link ${activeSection === 'experience' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); scrollToSection('experience'); }}>Testimonial</a>
              <a href="#contact" className="nav-link mobile-only-contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
            </div>
            <a href="#contact" className="nav-contact-btn" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>
              Contact
            </a>
            <div className={`nav-toggle ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="hero-template" ref={heroRef} onMouseMove={handleHeroMouseMove} onMouseLeave={handleHeroMouseLeave}>
          <div className="hero-template-container">
            {/* Background elements */}
            <div className="hero-bg-gradient"></div>

            {/* Content overlay layout */}
            <div className="hero-main-content">
              {/* Backing Serif Headings split left and right */}
              <div className="hero-greeting-left">Hey,</div>
              <div className="hero-greeting-right">there</div>

              {/* Status Pill (Left side overlay) */}
              <div className="hero-status-pill">
                <span className="pulse-dot"></span>
                <span>Available for new opportunities</span>
              </div>

              {/* Central Portrait frame */}
              <div className="hero-portrait-wrapper" onClick={handlePortraitClick}>
                <img
                  src="/images/profile.png"
                  alt="Mourya N"
                  className="hero-portrait-img"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop';
                  }}
                />
              </div>

              {/* SDE specialization and CTAs (Right side overlay) */}
              <div className="hero-specialization-card">
                <p className="specialization-text">
                  Specialized in Java, Spring Boot, ReactJS, Microservices, and AI-Powered Applications.
                </p>
                <div className="hero-specialization-ctas">
                  <a href="#resume" className="specialization-btn" onClick={(e) => { e.preventDefault(); scrollToSection('resume'); }}>
                    <i className="fas fa-file-alt"></i> Resume
                  </a>
                  <div className="specialization-socials">
                    <a href="https://www.linkedin.com/in/mourya-n/" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a>
                    <a href="https://github.com/Mourya-N" target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>
                    <a href="https://x.com/MouryaN23" target="_blank" rel="noreferrer"><i className="fab fa-x-twitter"></i></a>
                    <a href="mailto:nmourya189@gmail.com"><i className="fas fa-envelope"></i></a>
                  </div>
                </div>
              </div>

              {/* Bottom Large Titles */}
              <div className="hero-bottom-titles">
                <h1 className="hero-title-left">
                  <span>I AM</span>
                  <span>MOURYA</span>
                </h1>
                <h2 className="hero-title-right">
                  <span>SOFTWARE</span>
                  <span>DEVELOPMENT</span>
                  <span>ENGINEER</span>
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about">
          <div className="container">
            <h2 className="section-title reveal">
              <span>About Me</span>
              <i className="fas fa-user-circle"></i>
            </h2>
            <div className="about-summary reveal" style={{ position: 'relative' }}>
              <button onClick={toggleSummaryAudio} className="summary-audio-btn" aria-label="Play summary audio">
                <i className={`fas ${isSummaryPlaying ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
              </button>
              <h4>
                Aspiring Software Development Engineer with a strong foundation in Data Structures, Algorithms, and core Computer Science concepts. Hands-on experience building production-grade, full-stack applications and RESTful APIs using Java, Spring Boot, Microservices, JavaScript, ReactJS. Proven ability delivering backend services, database-driven features, and secure authentication systems in live industry projects. Passionate about writing clean, maintainable, scalable code and contributing to high-impact engineering teams.
              </h4>
            </div>

            <div className="about-grid">
              {/* Education Box */}
              <div className="about-card reveal" ref={addToCardRefs}>
                <div className="card-header">
                  <i className="fas fa-graduation-cap"></i>
                  <h3>Education</h3>
                </div>
                <div className="card-content">
                  <div className="edu-item">
                    <h4>B.E. Computer Science</h4>
                    <p className="edu-sub">Sri Krishna Institute of Technology</p>
                    <p className="edu-institute">Bengaluru, Karnataka</p>
                    <p className="edu-year">Nov 2022 - Jul 2026</p>
                    <p className="edu-year" style={{ marginTop: '4px', fontWeight: 'bold' }}>CGPA: 7.83 / 10</p>
                  </div>
                </div>
              </div>

              {/* Hackathons Box */}
              <div className="about-card reveal" ref={addToCardRefs}>
                <div className="card-header">
                  <i className="fas fa-trophy"></i>
                  <h3>Hackathons</h3>
                </div>
                <div className="card-content">
                  <ul className="about-list">
                    <li><i className="fas fa-code"></i> CTRL+Move 2025</li>
                    <li><i className="fas fa-code"></i> Solana Hacker House 2024</li>
                  </ul>
                </div>
              </div>

              {/* Volunteering Box */}
              <div className="about-card reveal" ref={addToCardRefs}>
                <div className="card-header">
                  <i className="fas fa-hands-helping"></i>
                  <h3>Volunteering</h3>
                </div>
                <div className="card-content">
                  <ul className="about-list">
                    <li><i className="fas fa-calendar-check"></i> India Blockchain Week (IBW) 2025</li>
                  </ul>
                </div>
              </div>

              {/* Industry Exposure Box */}
              <div className="about-card reveal" ref={addToCardRefs}>
                <div className="card-header">
                  <i className="fas fa-users"></i>
                  <h3>Industry Events</h3>
                </div>
                <div className="card-content">
                  <ul className="about-list">
                    <li><i className="fas fa-calendar-alt"></i> Microsoft AI Tour 2025</li>
                    <li><i className="fas fa-calendar-alt"></i> Google I/O Connect India 2024 & 2025</li>
                    <li><i className="fas fa-calendar-alt"></i> AWS Summit & AI Conclave</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="skills">
          <div className="container">
            <h2 className="section-title reveal">
              <span>Technical Skills</span>
              <i className="fas fa-cogs"></i>
            </h2>

            <div className="skills-container">
              {/* Category 1: Languages */}
              <div className="skill-category reveal">
                <h3 className="category-title">
                  <i className="fas fa-code"></i>
                  Languages
                </h3>
                <div className="skills-grid">
                  <div className="skill-item"><i className="fab fa-java" style={{ color: '#007396' }}></i><span>Java</span></div>
                  <div className="skill-item"><i className="fab fa-python" style={{ color: '#3776ab' }}></i><span>Python</span></div>
                  <div className="skill-item"><i className="fab fa-js" style={{ color: '#f7df1e' }}></i><span>JavaScript</span></div>
                  <div className="skill-item"><i className="fas fa-terminal"></i><span>C</span></div>
                </div>
              </div>

              {/* Category 2: Backend */}
              <div className="skill-category reveal">
                <h3 className="category-title">
                  <i className="fas fa-server"></i>
                  Backend Frameworks & Architecture
                </h3>
                <div className="skills-grid">
                  <div className="skill-item"><i className="fas fa-leaf" style={{ color: '#6db33f' }}></i><span>Spring Boot</span></div>
                  <div className="skill-item"><i className="fas fa-cubes" style={{ color: '#7b68ee' }}></i><span>Microservices</span></div>
                  <div className="skill-item"><i className="fas fa-plug" style={{ color: '#a020f0' }}></i><span>REST APIs</span></div>
                  <div className="skill-item"><i className="fas fa-link"></i><span>Feign Client</span></div>
                  <div className="skill-item"><i className="fas fa-network-wired"></i><span>Flask</span></div>
                </div>
              </div>

              {/* Category 3: Frontend */}
              <div className="skill-category reveal">
                <h3 className="category-title">
                  <i className="fas fa-laptop-code"></i>
                  Frontend
                </h3>
                <div className="skills-grid">
                  <div className="skill-item"><i className="fab fa-react" style={{ color: '#61dafb' }}></i><span>React.js</span></div>
                  <div className="skill-item"><i className="fab fa-js" style={{ color: '#f7df1e' }}></i><span>NextJS</span></div>
                  <div className="skill-item"><i className="fab fa-html5" style={{ color: '#e34f26' }}></i><span>HTML5</span></div>
                  <div className="skill-item"><i className="fab fa-css3-alt" style={{ color: '#1572b6' }}></i><span>CSS3</span></div>
                </div>
              </div>

              {/* Category 4: Databases */}
              <div className="skill-category reveal">
                <h3 className="category-title">
                  <i className="fas fa-database"></i>
                  Databases & Schema Migrations
                </h3>
                <div className="skills-grid">
                  <div className="skill-item"><i className="fas fa-database" style={{ color: '#00758f' }}></i><span>MySQL</span></div>
                  <div className="skill-item"><i className="fas fa-leaf" style={{ color: '#4db33d' }}></i><span>MongoDB</span></div>
                  <div className="skill-item"><i className="fas fa-file-invoice" style={{ color: '#cc292b' }}></i><span>Flyway Migration</span></div>
                  <div className="skill-item"><i className="fas fa-fire" style={{ color: '#ffca28' }}></i><span>Firebase</span></div>
                </div>
              </div>

              {/* Category 5: Tools & Core CS */}
              <div className="skill-category reveal">
                <h3 className="category-title">
                  <i className="fas fa-tools"></i>
                  Tools, Platforms & Concepts
                </h3>
                <div className="skills-grid">
                  <div className="skill-item"><i className="fab fa-git-alt" style={{ color: '#f05032' }}></i><span>Git & GitHub</span></div>
                  <div className="skill-item"><i className="fab fa-docker" style={{ color: '#0db7ed' }}></i><span>Docker</span></div>
                  <div className="skill-item"><i className="fas fa-dharmachakra" style={{ color: '#326ce5' }}></i><span>Kubernetes</span></div>
                  <div className="skill-item"><i className="fab fa-linux" style={{ color: '#f8b739' }}></i><span>Linux</span></div>
                  <div className="skill-item"><i className="fas fa-cloud" style={{ color: '#4285f4' }}></i><span>Google Cloud</span></div>
                  <div className="skill-item"><i className="fas fa-shield-alt"></i><span>JWT Auth</span></div>
                  <div className="skill-item"><i className="fas fa-paper-plane" style={{ color: '#ff6c37' }}></i><span>Postman</span></div>
                  <div className="skill-item"><i className="fas fa-laptop-code" style={{ color: '#fe2857' }}></i><span>IntelliJ</span></div>
                  <div className="skill-item"><i className="fas fa-desktop" style={{ color: '#4a5568' }}></i><span>Operating Systems (OS)</span></div>
                  <div className="skill-item"><i className="fas fa-network-wired" style={{ color: '#3b82f6' }}></i><span>Computer Networks (CN)</span></div>
                  <div className="skill-item"><i className="fas fa-brain"></i><span>DSA (Algorithms)</span></div>
                  <div className="skill-item"><i className="fas fa-sitemap"></i><span>System Design</span></div>
                  <div className="skill-item"><i className="fas fa-cogs"></i><span>OOP</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="projects">
          <div className="container">
            <h2 className="section-title reveal">
              <span>Featured Projects</span>
              <i className="fas fa-project-diagram"></i>
            </h2>

            <div className="projects-grid">
              {/* Project 1: MouCodeBrain */}
              <div className="project-card reveal" ref={addToCardRefs}>
                <div className="project-header">
                  <h3>MouCodeBrain – AI-Powered Codebase Intelligence</h3>
                  <div className="project-tech">
                    <span>React 18</span>
                    <span>Spring Boot 3</span>
                    <span>FastAPI</span>
                    <span>LangChain</span>
                    <span>FAISS</span>
                    <span>Docker</span>
                  </div>
                </div>
                <div className="project-body">
                  <ul className="project-features">
                    <li>Built a full-stack, microservices platform allowing developers to query entire codebases in natural language (RAG using LLMs and vector search).</li>
                    <li>Developed a custom AI engine (Python, FastAPI, LangChain, FAISS) driving semantic code search and vulnerability detection (OWASP/Snyk).</li>
                    <li>Secured backend APIs with Spring Boot 3, Spring Security, and JWT; designed an interactive dashboard using React 18 and React Flow; containerized with Docker.</li>
                  </ul>
                </div>
                <div className="project-links">
                  <a href="https://github.com/Mourya-N" target="_blank" rel="noreferrer" className="project-link">
                    <i className="fab fa-github"></i> Code
                  </a>
                </div>
              </div>

              {/* Project 2: Mobile Wallet */}
              <div className="project-card reveal" ref={addToCardRefs}>
                <div className="project-header">
                  <h3>Mobile Wallet with Multi-Currency Support</h3>
                  <div className="project-tech">
                    <span>React.js</span>
                    <span>Node.js</span>
                    <span>Express.js</span>
                    <span>MongoDB</span>
                    <span>JWT</span>
                    <span>CurrencyLayer API</span>
                  </div>
                </div>
                <div className="project-body">
                  <ul className="project-features">
                    <li>Designed and built a transactional backend service supporting deposits, withdrawals, transfers, and balance management with real-time exchange rates.</li>
                    <li>Implemented secure authentication and encrypted APIs using JWT, bcrypt password hashing, and HTTPS-based configurations.</li>
                    <li>Focused on system reliability, validating transactions, and implementing safe rollback states to ensure strict data consistency.</li>
                  </ul>
                </div>
                <div className="project-links">
                  <a href="https://github.com/Mourya-N" target="_blank" rel="noreferrer" className="project-link">
                    <i className="fab fa-github"></i> Code
                  </a>
                </div>
              </div>

              {/* Project 3: Candidate Ranking */}
              <div className="project-card reveal" ref={addToCardRefs}>
                <div className="project-header">
                  <h3>Candidate Ranking and Selection System</h3>
                  <div className="project-tech">
                    <span>Python</span>
                    <span>Flask</span>
                    <span>MySQL</span>
                    <span>HTML/CSS</span>
                    <span>JavaScript</span>
                  </div>
                </div>
                <div className="project-body">
                  <ul className="project-features">
                    <li>Created a full-stack web application automating candidate evaluation, using custom algorithms for resume parsing and ranking.</li>
                    <li>Designed normalized relational database schemas and complex SQL queries (joins, aggregates, nested queries) for fast dynamic filtering.</li>
                    <li>Created a reusable CRUD framework for rapid feature iteration, modularizing common views and validation handlers.</li>
                  </ul>
                </div>
                <div className="project-links">
                  <a href="https://github.com/Mourya-N" target="_blank" rel="noreferrer" className="project-link">
                    <i className="fab fa-github"></i> Code
                  </a>
                </div>
              </div>
            </div>

            {/* Certifications and achievements block */}
            <div className="certifications reveal">
              <h3 className="cert-title">
                <i className="fas fa-award"></i>
                Certifications & Achievements
              </h3>
              <div className="cert-grid">
                <div className="cert-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Solved 80+ Leetcode/HackerRank DSA Problems</span>
                </div>
                <div className="cert-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Big Data Analytics Certificate (NPTEL 2025)</span>
                </div>
                <div className="cert-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Fundamentals of Cryptography (Infosys 2025)</span>
                </div>
                <div className="cert-item">
                  <i className="fas fa-check-circle"></i>
                  <span>DSA in Java (GreatLearning 2024)</span>
                </div>
                <div className="cert-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Cyber Security Certificate (Ethicalbyte 2024)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="experience">
          <div className="container">
            <h2 className="section-title reveal">
              <span>Experience</span>
              <i className="fas fa-briefcase"></i>
            </h2>

            <div className="experience-timeline">
              {/* Internship at Skyllx */}
              <div className="exp-item reveal">
                <div className="exp-dot"></div>
                <div className="exp-date">Jan 2026 - Jul 2026</div>
                <div className="exp-content">
                  <h3>Software Engineer Intern – Full Stack</h3>
                  <h4>Skyllx Technologies Pvt. Ltd. | Onsite – Bengaluru</h4>
                  <ul>
                    <li>Contributed to <strong>Rainbow ERP (School/College Management System)</strong> by developing the Certificate Service module end-to-end using Java, Spring Boot, and Microservices, covering both frontend and backend configurations.</li>
                    <li>Built and consumed REST APIs using Feign Client for inter-service communication, and managed MySQL schema migration using Flyway for incremental deployments.</li>
                    <li>Contributed to <strong>Skyllx’s Learning Management System (LMS)</strong> backend microservices, core learning management workflows, and student/admin-facing ReactJS/NextJS integration.</li>
                    <li>Built and integrated frontend features using ReactJS and NextJS for both student-facing and admin-facing modules of the LMS, collaborating cross-functionally on real-time development tasks within a live, production codebase.</li>
                  </ul>
                  <div className="exp-tech-stack">
                    <span className="tech-tag">ReactJS</span>
                    <span className="tech-tag">Spring Boot 3</span>
                    <span className="tech-tag">Java</span>
                    <span className="tech-tag">Microservices</span>
                    <span className="tech-tag">Kubernetes</span>
                    <span className="tech-tag">REST APIs</span>
                    <span className="tech-tag">Docker</span>
                    <span className="tech-tag">Flyway Migration</span>
                    <span className="tech-tag">Feign Client</span>
                  </div>
                </div>
              </div>

              {/* Volunteer at IBW */}
              <div className="exp-item reveal">
                <div className="exp-dot"></div>
                <div className="exp-date">Dec 2025</div>
                <div className="exp-content">
                  <h3>Volunteer & Community Activist</h3>
                  <h4>India Blockchain Week (IBW) 2025 | Bengaluru</h4>
                  <ul>
                    <li>Engaged with Web3 developers and supported conference operations across various technical events.</li>
                    <li>Assisted in organizer workflows and networking sessions for international blockchain developers.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resume View Section */}
        <section id="resume" className="resume-section reveal">
          <div className="container">
            <div className="resume-card">
              <div className="resume-icon">
                <i className="fas fa-file-code"></i>
              </div>
              <h2>Review Technical Resume</h2>
              <p>Explore my technical background, software engineering skills, and system architecture designs.</p>
              <div className="resume-buttons">
                <a href="/resume.pdf" target="_blank" rel="noreferrer" className="btn btn-primary">
                  <i className="fas fa-eye"></i> View Resume
                </a>
                <a href="/resume.pdf" download="Mourya_N_Resume.pdf" className="btn btn-outline">
                  <i className="fas fa-download"></i> Download PDF
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact">
          <div className="container">
            <h2 className="section-title reveal">
              <span>Get In Touch</span>
              <i className="fas fa-paper-plane"></i>
            </h2>

            <div className="contact-grid">
              <div className="contact-info reveal">
                <h3>Let's Connect</h3>
                <p>I am actively seeking SDE / Software Engineer full-time opportunities. Feel free to contact me.</p>

                <div className="contact-details">
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <div>
                      <span>Email</span>
                      <a href="mailto:nmourya189@gmail.com">nmourya189@gmail.com</a>
                    </div>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-phone-alt"></i>
                    <div>
                      <span>Phone</span>
                      <a href="tel:+918861249940">+91 8861249940</a>
                    </div>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                      <span>Location</span>
                      <p>Bengaluru, Karnataka 560073</p>
                    </div>
                  </div>
                </div>

                <div className="contact-social">
                  <h4>Follow Me</h4>
                  <div className="social-links">
                    <a href="https://www.linkedin.com/in/mourya-n/" target="_blank" rel="noreferrer" className="social-link">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="https://github.com/Mourya-N" target="_blank" rel="noreferrer" className="social-link">
                      <i className="fab fa-github"></i>
                    </a>
                    <a href="https://x.com/MouryaN23" target="_blank" rel="noreferrer" className="social-link">
                      <i className="fab fa-x-twitter"></i>
                    </a>
                    <a href="https://www.instagram.com/n_mouryaa?igsh=Z2hib2oydHpkemM3" target="_blank" rel="noreferrer" className="social-link">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>

              <form className="contact-form reveal" onSubmit={handleFormSubmit}>
                <div className={`form-group ${formName ? 'has-value' : ''}`}>
                  <input
                    type="text"
                    id="name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                  <label htmlFor="name">Your Name</label>
                </div>
                <div className={`form-group ${formEmail ? 'has-value' : ''}`}>
                  <input
                    type="email"
                    id="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="email">Your Email</label>
                </div>
                <div className={`form-group ${formMessage ? 'has-value' : ''}`}>
                  <textarea
                    id="message"
                    rows="5"
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    required
                  ></textarea>
                  <label htmlFor="message">Your Message</label>
                </div>
                <button type="submit" className="btn btn-primary submit-btn" disabled={isSending}>
                  {isSending ? (
                    <>
                      <span>Sending...</span>
                      <i className="fas fa-spinner fa-spin"></i>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <i className="fas fa-paper-plane"></i>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Mourya N. All Rights Reserved.</p>
            <div className="footer-links">
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
              <a href="#skills" onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}>Skills</a>
              <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}>Projects</a>
              <a href="#experience" onClick={(e) => { e.preventDefault(); scrollToSection('experience'); }}>Experience</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Notifications */}
      {notification && (
        <div
          className={`notification notification-${notification.type}`}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '1rem 2rem',
            background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            borderRadius: '50px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 9999,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            animation: 'fadeInUp 0.3s ease',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.9rem',
            fontWeight: '600'
          }}
        >
          <i className={`fas fa-${notification.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
          <span>{notification.message}</span>
        </div>
      )}
    </>
  );
}

export default App;
