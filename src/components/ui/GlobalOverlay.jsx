import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useScene } from '../../context/SceneContext';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import '../../styles/GlobalOverlay.scss';

gsap.registerPlugin(TextPlugin);

const GlobalOverlay = () => {
    const { overlayContent, closeOverlay, openOverlay } = useScene();
    const [isVisible, setIsVisible] = useState(false);
    const [animateOpen, setAnimateOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Listen for custom event from 3D Library Room cards
    useEffect(() => {
        const handleOpenStudy = (e) => {
            const project = e.detail;
            openOverlay({
                layout: 'study_material',
                title: project.title,
                courseCode: project.courseCode || 'CS-101',
                modulesCount: project.modulesCount || '16 Modules',
                description: project.description,
                techStack: project.techStack
            });
        };
        window.addEventListener('openStudyMaterial', handleOpenStudy);
        return () => window.removeEventListener('openStudyMaterial', handleOpenStudy);
    }, [openOverlay]);

    useEffect(() => {
        if (overlayContent) {
            setIsVisible(true);
            const delayAnim = setTimeout(() => {
                setAnimateOpen(true);
            }, 50);
            return () => clearTimeout(delayAnim);
        } else {
            setAnimateOpen(false);
            const timer = setTimeout(() => setIsVisible(false), 800);
            return () => clearTimeout(timer);
        }
    }, [overlayContent]);

    useEffect(() => {
        const handleOverlayKeyDown = (e) => {
            if (e.key === 'Escape' && overlayContent) {
                e.stopPropagation();
                closeOverlay();
            }
        };
        window.addEventListener('keydown', handleOverlayKeyDown);
        return () => window.removeEventListener('keydown', handleOverlayKeyDown);
    }, [overlayContent, closeOverlay]);

    const [cachedContent, setCachedContent] = useState(null);
    useEffect(() => {
        if (overlayContent) {
            setCachedContent(overlayContent);
        }
    }, [overlayContent]);

    const dummyGridContent = {
        title: 'Virtual Classroom',
        layout: 'lecture',
        description: 'Loading academic module...',
        platformConfig: { label: 'Lecture Hall' }
    };

    const content = overlayContent || cachedContent || dummyGridContent;

    return <ContentCard content={content} isOpen={animateOpen} onClose={closeOverlay} isMobile={isMobile} />;
};

const ContentCard = ({ content, isOpen, onClose, isMobile }) => {
    if (!content) return null;

    const label = content.platformConfig?.label || content.courseCode || 'Academic Portal';
    const isWiderModal = content.layout === 'classroom_forum' ||
        content.layout === 'faculty_desk' ||
        content.layout === 'study_material' ||
        content.layout === 'study_groups' ||
        content.layout === 'office_hours' ||
        content.videoUrl ||
        content.chapters;

    // GSAP Text typing effect for descriptions
    const descriptionRef = useRef(null);
    useEffect(() => {
        if (isOpen && content.description && descriptionRef.current && content.layout !== 'certificate_grid') {
            gsap.killTweensOf(descriptionRef.current);
            gsap.fromTo(descriptionRef.current,
                { text: "" },
                {
                    text: content.description,
                    duration: Math.min(2.0, content.description.length * 0.01),
                    ease: "none",
                    delay: 0.2
                }
            );
        }
    }, [isOpen, content]);

    // Backdrop click
    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('global-overlay-wrapper') || e.target.classList.contains('global-overlay-backdrop-layer')) {
            onClose();
        }
    };

    const transitionSpring = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease';
    const transitionContent = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';

    const cardStyle = isMobile ? {
        width: '92%',
        maxHeight: '75vh',
        bottom: '2.5rem',
        left: '50%',
        transform: isOpen ? 'translate(-50%, 0) rotate(-0.5deg)' : 'translate(-50%, 120%) rotate(8deg)',
        opacity: isOpen ? 1 : 0,
        color: '#1a1a1a',
    } : {
        width: isWiderModal ? 'clamp(380px, 46vw, 680px)' : 'clamp(280px, 30vw, 450px)',
        right: isWiderModal ? 'clamp(1rem, 4vw, 4rem)' : 'clamp(2rem, 12vw, 20rem)',
        top: '50%',
        maxHeight: '88vh',
        transform: isOpen ? 'translateY(-50%) rotate(0.5deg)' : 'translate(150%, -50%) rotate(12deg)',
        opacity: isOpen ? 1 : 0,
        color: '#1a1a1a',
    };

    const getStaggerStyle = (delay) => ({
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(16px)',
        transition: transitionContent,
        transitionDelay: isOpen ? `${delay}ms` : '0ms',
    });

    const maskStyle = (content.layout === 'certificate_grid' || isWiderModal) ? {
        maskImage: 'none',
        WebkitMaskImage: 'none'
    } : isMobile ? {
        maskImage: 'radial-gradient(circle at 50% 25%, transparent 0%, transparent 15%, black 40%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 25%, transparent 0%, transparent 15%, black 40%)'
    } : {
        maskImage: 'radial-gradient(circle at 31% 50%, transparent 0%, transparent 12%, black 35%)',
        WebkitMaskImage: 'radial-gradient(circle at 31% 50%, transparent 0%, transparent 12%, black 35%)'
    };

    return (
        <div
            className="global-overlay-wrapper"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 2000,
                pointerEvents: isOpen ? 'auto' : 'none',
            }}
            onClick={handleBackdropClick}
        >
            <div
                className="global-overlay-backdrop-layer"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    opacity: isOpen ? 1 : 0,
                    transition: 'opacity 0.8s ease',
                    ...maskStyle
                }}
            />

            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        padding: isMobile ? '1.2rem' : '2rem',
                        transition: transitionSpring,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.8rem',
                        fontFamily: "'Cabin Sketch', cursive",
                        pointerEvents: 'auto',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        ...cardStyle,
                    }}
                    className="studio-paper-card"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* SVG Torn Paper Border Outline */}
                    <svg
                        className="studio-border-overlay"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                            zIndex: 10
                        }}
                    >
                        <path
                            d="M 0 0 L 4 1 L 8 0 L 12 1 L 16 0 L 20 1 L 24 0 L 28 1 L 32 0 L 36 1 L 40 0 L 44 1 L 48 0 L 52 1 L 56 0 L 60 1 L 64 0 L 68 1 L 72 0 L 76 1 L 80 0 L 84 1 L 88 0 L 92 1 L 96 0 L 100 0 L 99 3 L 100 6 L 98 10 L 100 14 L 99 18 L 100 22 L 98 26 L 100 30 L 99 35 L 100 40 L 98 45 L 100 50 L 99 55 L 100 60 L 98 65 L 100 70 L 99 75 L 100 80 L 98 85 L 100 90 L 99 95 L 100 100 L 96 99 L 92 100 L 88 98 L 84 100 L 80 99 L 76 100 L 72 98 L 68 100 L 64 99 L 60 100 L 56 98 L 52 100 L 48 99 L 44 100 L 40 98 L 36 100 L 32 99 L 28 100 L 24 98 L 20 100 L 16 99 L 12 100 L 8 98 L 4 100 L 0 99 L 0.5 99.5 L 1 95 L 0 90 L 2 85 L 0 80 L 1 75 L 0 70 L 2 65 L 0 60 L 1 55 L 0 50 L 2 45 L 0 40 L 1 35 L 0 30 L 2 26 L 0 22 L 1 18 L 0 14 L 2 10 L 0 6 L 1 3 L 0 0 Z"
                            fill="none"
                            stroke="#1a1a1a"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>

                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '0.5rem',
                        ...getStaggerStyle(100)
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span style={{
                                textTransform: 'uppercase',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                letterSpacing: '1px',
                                color: '#0d5c75'
                            }}>
                                {content.courseCode ? `[${content.courseCode}] ` : ''}{label}
                            </span>
                            <h2 style={{
                                fontSize: '1.45rem',
                                margin: 0,
                                lineHeight: 1.15,
                                fontWeight: 800,
                                fontFamily: "'Cabin Sketch', cursive",
                            }}>
                                {content.title}
                            </h2>
                            {content.instructor && (
                                <span style={{ fontSize: '0.9rem', color: '#555', fontWeight: 600 }}>
                                    👨‍🏫 {content.instructor}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className="studio-close-btn"
                            aria-label="Close"
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* === DEDICATED LAYOUT ROUTING === */}
                    {content.layout === 'classroom_forum' ? (
                        <ClassroomForumView getStaggerStyle={getStaggerStyle} />
                    ) : content.layout === 'faculty_desk' ? (
                        <FacultyDeskView getStaggerStyle={getStaggerStyle} />
                    ) : content.layout === 'study_groups' ? (
                        <StudyGroupsView getStaggerStyle={getStaggerStyle} />
                    ) : content.layout === 'office_hours' ? (
                        <OfficeHoursView getStaggerStyle={getStaggerStyle} />
                    ) : content.layout === 'study_material' ? (
                        <StudyMaterialView content={content} getStaggerStyle={getStaggerStyle} />
                    ) : (content.videoUrl || content.chapters) ? (
                        <LectureVideoView content={content} descriptionRef={descriptionRef} getStaggerStyle={getStaggerStyle} />
                    ) : (
                        /* Default Card fallback */
                        <>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '1rem',
                                fontSize: '0.85rem',
                                color: '#666',
                                borderBottom: '1px dashed #ccc',
                                paddingBottom: '0.5rem',
                                ...getStaggerStyle(200)
                            }}>
                                <strong>{content.date}</strong>
                                {content.views && <span>{content.views}</span>}
                                {content.duration && <span>⏱️ {content.duration}</span>}
                            </div>

                            <p
                                ref={descriptionRef}
                                style={{
                                    lineHeight: 1.5,
                                    color: '#333',
                                    fontSize: '0.95rem',
                                    margin: 0,
                                    minHeight: '60px',
                                    ...getStaggerStyle(300)
                                }}>
                                {content.description}
                            </p>

                            <div style={{ marginTop: 'auto', paddingTop: '0.8rem', ...getStaggerStyle(400) }}>
                                <button
                                    onClick={onClose}
                                    className="studio-action-button"
                                    style={{ width: '100%', textAlign: 'center' }}
                                >
                                    Done Exploring ✓
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ========================================================
   SUB-COMPONENT 1: LECTURE VIDEO & BLACKBOARD VIEW
   ======================================================== */
const LectureVideoView = ({ content, descriptionRef, getStaggerStyle }) => {
    const [activeTab, setActiveTab] = useState('video'); // 'video' | 'notes' | 'chapters'
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isAttended, setIsAttended] = useState(false);
    const [notes, setNotes] = useState(() => {
        try {
            return localStorage.getItem(`notes_${content.id}`) || '';
        } catch {
            return '';
        }
    });
    const [noteSaved, setNoteSaved] = useState(false);
    const videoRef = useRef(null);

    const handleSpeedChange = (speed) => {
        setPlaybackSpeed(speed);
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
        }
    };

    const handleSaveNotes = () => {
        try {
            localStorage.setItem(`notes_${content.id}`, notes);
            setNoteSaved(true);
            window.dispatchEvent(new CustomEvent('notes_saved'));
            setTimeout(() => setNoteSaved(false), 2000);
        } catch (e) {
            console.warn(e);
        }
    };

    const handleMarkAttendance = () => {
        setIsAttended(true);
        window.dispatchEvent(new CustomEvent('attendance_marked'));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {/* Meta bar */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
                borderBottom: '1px dashed #ccc',
                paddingBottom: '0.4rem',
                ...getStaggerStyle(150)
            }}>
                <span>🕒 Duration: {content.duration || '45m'}</span>
                <span>👥 {content.views || 'Enrolled Class'}</span>
                <button
                    onClick={handleMarkAttendance}
                    style={{
                        background: isAttended ? '#2e7d32' : '#f5f5f5',
                        color: isAttended ? '#fff' : '#111',
                        border: '1.5px solid #111',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontFamily: "'Cabin Sketch', cursive",
                        fontWeight: 700
                    }}
                >
                    {isAttended ? '✓ Attended' : '+ Mark Attendance'}
                </button>
            </div>

            {/* Tab navigation */}
            <div style={{ display: 'flex', gap: '0.4rem', ...getStaggerStyle(200) }}>
                {['video', 'notes', 'chapters'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            flex: 1,
                            padding: '4px 6px',
                            background: activeTab === tab ? '#1a1a1a' : '#f0f0f0',
                            color: activeTab === tab ? '#fff' : '#222',
                            border: '1.5px solid #1a1a1a',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontFamily: "'Cabin Sketch', cursive",
                            fontWeight: 700,
                            textTransform: 'uppercase'
                        }}
                    >
                        {tab === 'video' ? '📺 Video Stream' : tab === 'notes' ? '📝 Chalk Notes' : '📑 Chapters'}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'video' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', ...getStaggerStyle(250) }}>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: '2px solid #111',
                        backgroundColor: '#000',
                        aspectRatio: '16/9'
                    }}>
                        <video
                            ref={videoRef}
                            src={content.videoUrl || '/videos/scrub-video-intra.mp4'}
                            controls
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>

                    {/* Video speed bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ fontWeight: 700 }}>Playback Speed:</span>
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                            {[1, 1.25, 1.5, 2].map((spd) => (
                                <button
                                    key={spd}
                                    onClick={() => handleSpeedChange(spd)}
                                    style={{
                                        padding: '2px 6px',
                                        background: playbackSpeed === spd ? '#111' : '#eee',
                                        color: playbackSpeed === spd ? '#fff' : '#111',
                                        border: '1px solid #111',
                                        borderRadius: '3px',
                                        cursor: 'pointer',
                                        fontSize: '0.75rem',
                                        fontWeight: 700
                                    }}
                                >
                                    {spd}x
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <p ref={descriptionRef} style={{ fontSize: '0.9rem', color: '#333', lineHeight: 1.4, margin: '0.4rem 0' }}>
                        {content.description}
                    </p>
                </div>
            )}

            {activeTab === 'notes' && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    backgroundColor: '#1b2a26',
                    padding: '0.8rem',
                    borderRadius: '6px',
                    border: '3px solid #6d4c41',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                    ...getStaggerStyle(250)
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#c8e6c9', fontSize: '0.8rem' }}>
                        <span>📋 Blackboard Scratchpad</span>
                        <span>{notes.split(/\s+/).filter(Boolean).length} words</span>
                    </div>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Type lecture notes, equations, formulas or key takeaways here..."
                        style={{
                            width: '100%',
                            minHeight: '120px',
                            background: 'transparent',
                            color: '#ffffff',
                            fontFamily: "'Cabin Sketch', cursive",
                            fontSize: '1.05rem',
                            border: '1px dashed rgba(255,255,255,0.2)',
                            borderRadius: '4px',
                            padding: '0.5rem',
                            resize: 'vertical',
                            outline: 'none'
                        }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', alignItems: 'center' }}>
                        {noteSaved && <span style={{ color: '#81c784', fontSize: '0.8rem' }}>Saved to student journal!</span>}
                        <button
                            onClick={handleSaveNotes}
                            style={{
                                background: '#f5f5f5',
                                color: '#111',
                                border: '1.5px solid #111',
                                borderRadius: '3px',
                                padding: '4px 12px',
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontFamily: "'Cabin Sketch', cursive"
                            }}
                        >
                            💾 Save Notes
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'chapters' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', ...getStaggerStyle(250) }}>
                    {(content.chapters || [
                        '00:00 - Lecture Overview & Concept Maps',
                        '12:30 - Core Theory & Algorithmic Proofs',
                        '28:45 - Live Coding & Implementation in Terminal',
                        '41:10 - Student Q&A & Performance Optimization'
                    ]).map((chapter, i) => (
                        <div
                            key={i}
                            style={{
                                padding: '0.5rem 0.7rem',
                                backgroundColor: '#f5f5f5',
                                border: '1px solid #1a1a1a',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                alert(`Seeking to: ${chapter.split('-')[0]}`);
                            }}
                        >
                            <span>▶ {chapter}</span>
                            <span style={{ fontSize: '0.75rem', color: '#006699', fontWeight: 700 }}>Jump</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.4rem', ...getStaggerStyle(300) }}>
                <button
                    onClick={() => alert('📥 Lecture Slides (.PDF) downloaded to your study folder.')}
                    className="studio-action-button"
                    style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}
                >
                    📥 Download Slides (.PDF)
                </button>
                <button
                    onClick={() => {
                        window.dispatchEvent(new CustomEvent('openClassroomForum'));
                        alert('Questions about this lecture can be posted in the Doubts Forum!');
                    }}
                    style={{
                        padding: '8px 12px',
                        background: '#e0f2fe',
                        border: '2px solid #0284c7',
                        borderRadius: '4px',
                        color: '#0369a1',
                        fontFamily: "'Cabin Sketch', cursive",
                        fontWeight: 700,
                        cursor: 'pointer'
                    }}
                >
                    ❓ Ask Doubt
                </button>
            </div>
        </div>
    );
};

/* ========================================================
   SUB-COMPONENT 2: STUDY MATERIAL DOSSIER & QUIZ VIEW
   ======================================================== */
const StudyMaterialView = ({ content, getStaggerStyle }) => {
    const [activeSection, setActiveSection] = useState('syllabus'); // 'syllabus' | 'quiz'
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    const questions = [
        {
            q: '1. What mechanism in CPython prevents simultaneous multi-core CPU thread execution?',
            options: ['A) The Garbage Collector (GC)', 'B) Global Interpreter Lock (GIL)', 'C) Just-in-Time Compiler (JIT)', 'D) Python Virtual Machine (PVM)'],
            correct: 1,
            explanation: 'The Global Interpreter Lock (GIL) is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes at once.'
        },
        {
            q: '2. In WebGL & Three.js, where is the fragment shader executed?',
            options: ['A) On the CPU main thread', 'B) On the Web Worker', 'C) Per rasterized pixel on the GPU', 'D) Inside the DOM renderer'],
            correct: 2,
            explanation: 'Fragment shaders compute the color and other attributes of each pixel/fragment directly on the GPU rasterization pipeline.'
        },
        {
            q: '3. What is the time complexity of searching in a balanced AVL or Red-Black Tree?',
            options: ['A) O(1)', 'B) O(log N)', 'C) O(N)', 'D) O(N log N)'],
            correct: 1,
            explanation: 'Because AVL and Red-Black trees maintain a logarithmic height invariant, search, insert, and delete are strictly guaranteed O(log N).'
        }
    ];

    const handleSelectOption = (qIdx, optIdx) => {
        if (quizSubmitted) return;
        setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    };

    const calculateScore = () => {
        let score = 0;
        questions.forEach((q, i) => {
            if (quizAnswers[i] === q.correct) score++;
        });
        return score;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {/* Header badges */}
            <div style={{ display: 'flex', gap: '0.5rem', ...getStaggerStyle(150) }}>
                <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                    📚 {content.modulesCount || '16 Modules'}
                </span>
                <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                    🎓 Accreditation: University Standard
                </span>
            </div>

            {/* Tab selector */}
            <div style={{ display: 'flex', gap: '0.4rem', ...getStaggerStyle(200) }}>
                <button
                    onClick={() => setActiveSection('syllabus')}
                    style={{
                        flex: 1,
                        padding: '4px 6px',
                        background: activeSection === 'syllabus' ? '#111' : '#eee',
                        color: activeSection === 'syllabus' ? '#fff' : '#111',
                        border: '1.5px solid #111',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontFamily: "'Cabin Sketch', cursive"
                    }}
                >
                    📑 Course Modules & Downloads
                </button>
                <button
                    onClick={() => setActiveSection('quiz')}
                    style={{
                        flex: 1,
                        padding: '4px 6px',
                        background: activeSection === 'quiz' ? '#111' : '#eee',
                        color: activeSection === 'quiz' ? '#fff' : '#111',
                        border: '1.5px solid #111',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontFamily: "'Cabin Sketch', cursive"
                    }}
                >
                    🧠 Knowledge Check (Quiz)
                </button>
            </div>

            {activeSection === 'syllabus' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', ...getStaggerStyle(250) }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#444' }}>
                        {content.description}
                    </p>

                    <div style={{ border: '2px solid #1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                        {[
                            { unit: '01', title: 'Environment Setup, Compilers & Runtimes', status: 'Downloaded', percent: '100%' },
                            { unit: '02', title: 'Syntax Paradigms, Memory Management & GC', status: 'Ready', percent: 'Download' },
                            { unit: '03', title: 'Concurrency, Threading & Asynchronous Schedulers', status: 'Ready', percent: 'Download' },
                            { unit: '04', title: 'Production Architecture & Performance Profiling', status: 'Ready', percent: 'Download' },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.4rem 0.6rem',
                                    borderBottom: idx < 3 ? '1px dashed #ccc' : 'none',
                                    backgroundColor: idx % 2 === 0 ? '#fafafa' : '#fff',
                                    fontSize: '0.85rem'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 800, color: '#0d5c75' }}>#{item.unit}</span>
                                    <span>{item.title}</span>
                                </div>
                                <button
                                    onClick={() => alert(`Downloaded Module ${item.unit}: ${item.title}`)}
                                    style={{
                                        background: item.status === 'Downloaded' ? '#dcfce7' : '#f3f4f6',
                                        color: item.status === 'Downloaded' ? '#166534' : '#111',
                                        border: '1px solid #111',
                                        borderRadius: '3px',
                                        padding: '2px 8px',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        fontFamily: "'Cabin Sketch', cursive",
                                        fontWeight: 700
                                    }}
                                >
                                    {item.status === 'Downloaded' ? '✓ Downloaded' : '📥 Download'}
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => alert('📥 Full Subject Handbook & Labs Archive (.ZIP) downloaded!')}
                        className="studio-action-button"
                        style={{ marginTop: '0.5rem' }}
                    >
                        📥 Download Complete Course Archive (.ZIP)
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', ...getStaggerStyle(250) }}>
                    {questions.map((q, qIdx) => (
                        <div key={qIdx} style={{ backgroundColor: '#f9f9f9', padding: '0.6rem', border: '1.5px solid #111', borderRadius: '4px' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>{q.q}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                {q.options.map((opt, optIdx) => {
                                    const isChosen = quizAnswers[qIdx] === optIdx;
                                    const isCorrect = q.correct === optIdx;
                                    let bg = '#fff';
                                    if (quizSubmitted) {
                                        if (isCorrect) bg = '#dcfce7';
                                        else if (isChosen && !isCorrect) bg = '#fee2e2';
                                    } else if (isChosen) {
                                        bg = '#e0f2fe';
                                    }

                                    return (
                                        <button
                                            key={optIdx}
                                            onClick={() => handleSelectOption(qIdx, optIdx)}
                                            style={{
                                                textAlign: 'left',
                                                padding: '4px 8px',
                                                backgroundColor: bg,
                                                border: '1px solid #999',
                                                borderRadius: '3px',
                                                fontSize: '0.8rem',
                                                cursor: quizSubmitted ? 'default' : 'pointer',
                                                fontFamily: "'Inter', sans-serif"
                                            }}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                            {quizSubmitted && (
                                <p style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.4rem', fontStyle: 'italic' }}>
                                    💡 {q.explanation}
                                </p>
                            )}
                        </div>
                    ))}

                    {!quizSubmitted ? (
                        <button
                            onClick={() => {
                                setQuizSubmitted(true);
                                window.dispatchEvent(new CustomEvent('quiz_completed'));
                            }}
                            className="studio-action-button"
                        >
                            Submit Answers for Grading 🎯
                        </button>
                    ) : (
                        <div style={{
                            padding: '0.8rem',
                            backgroundColor: '#f0fdf4',
                            border: '2px solid #22c55e',
                            borderRadius: '4px',
                            textAlign: 'center',
                            fontWeight: 700
                        }}>
                            Academic Score: {calculateScore()} / {questions.length} ({Math.round((calculateScore() / questions.length) * 100)}%)
                            <br />
                            <span style={{ fontSize: '0.85rem', color: '#15803d' }}>
                                {calculateScore() === 3 ? '🌟 Perfect score! Knowledge badge unlocked.' : 'Good effort! Review the explanations above.'}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/* ========================================================
   SUB-COMPONENT 3: CLASSROOM Q&A DOUBTS FORUM
   ======================================================== */
const ClassroomForumView = ({ getStaggerStyle }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [doubts, setDoubts] = useState(() => {
        const defaultDoubts = [
            {
                id: 'd-1',
                author: 'Elena Vance (Sem 4)',
                topic: 'Python',
                text: 'How does the Python asyncio event loop manage tasks under the hood without true multithreading?',
                date: '2 hours ago',
                upvotes: 14,
                answers: [
                    {
                        author: 'Prof. Alan Vance (AI & CS)',
                        role: 'Faculty',
                        text: 'Asyncio uses cooperative multitasking with epoll/kqueue OS socket event selectors. When a coroutine yields via "await", control returns to the loop to dispatch other ready tasks.'
                    }
                ]
            },
            {
                id: 'd-2',
                author: 'Liam Chen (Sem 2)',
                topic: 'DSA',
                text: 'When should I choose A* search instead of standard Dijkstra for pathfinding?',
                date: 'Yesterday',
                upvotes: 22,
                answers: [
                    {
                        author: 'Dr. Maya Lin (Graphics)',
                        role: 'Faculty',
                        text: 'Use A* whenever you have an admissible heuristic h(n) towards a known destination. It directs search frontiers towards the goal, expanding drastically fewer nodes.'
                    }
                ]
            },
            {
                id: 'd-3',
                author: 'Sarah O. (Sem 6)',
                topic: 'WebGL',
                text: 'What causes severe frame stuttering when switching Three.js materials dynamically?',
                date: '3 days ago',
                upvotes: 19,
                answers: [
                    {
                        author: 'Dr. Maya Lin (Graphics)',
                        role: 'Faculty',
                        text: 'Material switching can force synchronous shader re-compilation on the GPU! Always warm up shaders off-screen or compile asynchronously with gl.compileAsync().'
                    }
                ]
            }
        ];

        try {
            const saved = JSON.parse(localStorage.getItem('classroom_doubts') || '[]');
            return [...saved, ...defaultDoubts];
        } catch {
            return defaultDoubts;
        }
    });

    const [newQuestion, setNewQuestion] = useState('');
    const [studentName, setStudentName] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleUpvote = (id) => {
        setDoubts(prev => prev.map(d => d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d));
        window.dispatchEvent(new CustomEvent('doubt_upvoted'));
    };

    const handlePostDoubt = (e) => {
        e.preventDefault();
        if (!newQuestion.trim()) return;

        const created = {
            id: `d-${Date.now()}`,
            author: studentName.trim() || 'Anonymous Student',
            topic: selectedCategory === 'All' ? 'General' : selectedCategory,
            text: newQuestion,
            date: 'Just now',
            upvotes: 1,
            answers: [
                {
                    author: 'Faculty Desk',
                    role: 'Automated Acknowledgment',
                    text: 'Your question has been dispatched to the faculty queue. A professor or TA will answer shortly!'
                }
            ]
        };

        const updated = [created, ...doubts];
        setDoubts(updated);
        try {
            localStorage.setItem('classroom_doubts', JSON.stringify(updated.slice(0, 10)));
        } catch (err) {
            console.warn(err);
        }

        setNewQuestion('');
        setShowForm(false);
        window.dispatchEvent(new CustomEvent('doubt_submitted'));
    };

    const filtered = selectedCategory === 'All' ? doubts : doubts.filter(d => d.topic.toLowerCase() === selectedCategory.toLowerCase());

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {/* Topic Filter Pills */}
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', ...getStaggerStyle(150) }}>
                {['All', 'Python', 'DSA', 'WebGL', 'Security'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                            padding: '3px 8px',
                            background: selectedCategory === cat ? '#111' : '#f0f0f0',
                            color: selectedCategory === cat ? '#fff' : '#111',
                            border: '1px solid #111',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 700
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Post question button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...getStaggerStyle(200) }}>
                <span style={{ fontSize: '0.85rem', color: '#555' }}>
                    Showing {filtered.length} answered academic doubts
                </span>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        padding: '4px 10px',
                        background: '#15803d',
                        color: '#fff',
                        border: '1.5px solid #111',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        fontFamily: "'Cabin Sketch', cursive",
                        fontWeight: 700
                    }}
                >
                    {showForm ? '✕ Close Form' : '+ Ask New Doubt'}
                </button>
            </div>

            {/* Doubt Form */}
            {showForm && (
                <form
                    onSubmit={handlePostDoubt}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                        padding: '0.6rem',
                        backgroundColor: '#fffbeb',
                        border: '2px solid #b45309',
                        borderRadius: '4px'
                    }}
                >
                    <input
                        type="text"
                        placeholder="Your Name (e.g. Alex Carter)"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        style={{
                            padding: '4px 8px',
                            border: '1px solid #b45309',
                            borderRadius: '3px',
                            fontSize: '0.85rem'
                        }}
                    />
                    <textarea
                        placeholder="Type your question or academic doubt..."
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        rows={3}
                        style={{
                            padding: '4px 8px',
                            border: '1px solid #b45309',
                            borderRadius: '3px',
                            fontSize: '0.85rem',
                            resize: 'vertical'
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            background: '#b45309',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '3px',
                            padding: '6px',
                            cursor: 'pointer',
                            fontWeight: 700
                        }}
                    >
                        Post to Forum 🚀
                    </button>
                </form>
            )}

            {/* Doubts list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '350px', overflowY: 'auto', ...getStaggerStyle(250) }}>
                {filtered.map((d) => (
                    <div
                        key={d.id}
                        style={{
                            padding: '0.7rem',
                            backgroundColor: '#fff',
                            border: '1.5px solid #111',
                            borderRadius: '4px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.4rem'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.7rem', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', marginRight: '6px' }}>
                                    {d.topic}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>{d.author} • {d.date}</span>
                            </div>
                            <button
                                onClick={() => handleUpvote(d.id)}
                                style={{
                                    background: '#fef2f2',
                                    color: '#b91c1c',
                                    border: '1px solid #b91c1c',
                                    borderRadius: '12px',
                                    padding: '2px 8px',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    fontWeight: 700
                                }}
                            >
                                ▲ {d.upvotes}
                            </button>
                        </div>

                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#111' }}>
                            {d.text}
                        </p>

                        {d.answers?.map((ans, aIdx) => (
                            <div
                                key={aIdx}
                                style={{
                                    marginTop: '0.3rem',
                                    padding: '0.4rem 0.6rem',
                                    backgroundColor: '#f0fdf4',
                                    borderLeft: '3px solid #16a34a',
                                    borderRadius: '2px',
                                    fontSize: '0.8rem'
                                }}
                            >
                                <span style={{ fontWeight: 700, color: '#15803d' }}>
                                    ✓ {ans.author} ({ans.role}):
                                </span>
                                <p style={{ margin: '2px 0 0 0', color: '#333' }}>
                                    {ans.text}
                                </p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ========================================================
   SUB-COMPONENT 4: FACULTY DIRECTORY VIEW
   ======================================================== */
const FacultyDeskView = ({ getStaggerStyle }) => {
    const faculty = [
        {
            name: 'Prof. Alan Vance',
            role: 'Department Chair & AI Professor',
            office: 'Turing Hall #302',
            email: 'alan.vance@academia3d.edu',
            hours: 'Tue & Thu 2:00 PM - 4:00 PM',
            courses: 'CS-480 (Deep Learning), CS-301 (Operating Systems)'
        },
        {
            name: 'Dr. Maya Lin',
            role: 'Interactive Graphics & WebGL Lab Lead',
            office: 'Shannon Hall #104',
            email: 'maya.lin@academia3d.edu',
            hours: 'Wed 1:00 PM - 3:30 PM',
            courses: 'CS-340 (3D Graphics), CS-202 (Algorithms)'
        },
        {
            name: 'Prof. Sarah Jenkins',
            role: 'Software Architecture & Cloud Engineering',
            office: 'Hopper Hall #415',
            email: 'sarah.jenkins@academia3d.edu',
            hours: 'Fri 3:00 PM - 5:00 PM',
            courses: 'CS-310 (React & Distributed Web), CS-205 (SQL)'
        },
        {
            name: 'Dr. Elena Rostova',
            role: 'Cybersecurity & Cryptography Lab',
            office: 'Lovelace Hall #208',
            email: 'elena.rostova@academia3d.edu',
            hours: 'Mon 10:00 AM - 12:00 PM',
            courses: 'CS-450 (Zero-Day Exploits & Crypto Protocols)'
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', ...getStaggerStyle(200) }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}>
                Consult professors and academic advisors during their designated office hours.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '380px', overflowY: 'auto' }}>
                {faculty.map((f, idx) => (
                    <div
                        key={idx}
                        style={{
                            padding: '0.6rem',
                            border: '1.5px solid #111',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0d5c75' }}>{f.name}</span>
                            <span style={{ fontSize: '0.75rem', background: '#e0f2fe', padding: '1px 6px', borderRadius: '3px' }}>{f.office}</span>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#444', fontWeight: 600 }}>{f.role}</span>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>
                            <span>📧 {f.email}</span> • <span>🕒 {f.hours}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#222', marginTop: '2px' }}>
                            <strong>Teaching:</strong> {f.courses}
                        </div>
                        <button
                            onClick={() => alert(`Consultation appointment request sent to ${f.name}!`)}
                            style={{
                                marginTop: '0.3rem',
                                padding: '3px 8px',
                                background: '#111',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '3px',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                fontFamily: "'Cabin Sketch', cursive",
                                fontWeight: 700
                            }}
                        >
                            📅 Request Consultation
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ========================================================
   SUB-COMPONENT 5: PEER STUDY GROUPS VIEW
   ======================================================== */
const StudyGroupsView = ({ getStaggerStyle }) => {
    const groups = [
        { name: '🚀 Competitive Programming Club', members: '48 Online', topic: 'LeetCode Hard Graph Sprints', room: 'Virtual Room #3A' },
        { name: '🎨 3D WebGL & Creative Dev Guild', members: '32 Online', topic: 'Three.js & Custom GLSL Shaders', room: 'Virtual Room #1B' },
        { name: '🤖 PyTorch & Generative AI Lab', members: '64 Online', topic: 'Training Vision Transformers', room: 'Virtual Room #4C' },
        { name: '🛡️ Capture The Flag (CTF) Squad', members: '21 Online', topic: 'Reverse Engineering Binaries', room: 'Virtual Room #2D' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', ...getStaggerStyle(200) }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}>
                Join live student voice/code rooms to work on homework and exam preparations together.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {groups.map((g, idx) => (
                    <div
                        key={idx}
                        style={{
                            padding: '0.6rem',
                            border: '1.5px solid #111',
                            borderRadius: '4px',
                            backgroundColor: '#fafafa',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{g.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#555' }}>
                                🟢 {g.members} • Topic: {g.topic}
                            </div>
                        </div>
                        <button
                            onClick={() => alert(`Entering ${g.name} (${g.room})!`)}
                            style={{
                                padding: '4px 8px',
                                background: '#16a34a',
                                color: '#fff',
                                border: '1px solid #111',
                                borderRadius: '3px',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                fontWeight: 700
                            }}
                        >
                            Enter Room
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ========================================================
   SUB-COMPONENT 6: OFFICE HOURS TIMETABLE
   ======================================================== */
const OfficeHoursView = ({ getStaggerStyle }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', ...getStaggerStyle(200) }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}>
                Weekly drop-in mentoring schedule for all computer science and engineering disciplines.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', border: '1.5px solid #111' }}>
                <thead>
                    <tr style={{ backgroundColor: '#eee', borderBottom: '1.5px solid #111' }}>
                        <th style={{ padding: '6px', textAlign: 'left' }}>Day</th>
                        <th style={{ padding: '6px', textAlign: 'left' }}>Time</th>
                        <th style={{ padding: '6px', textAlign: 'left' }}>Faculty</th>
                        <th style={{ padding: '6px', textAlign: 'left' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        { day: 'Monday', time: '10:00 - 12:00', mentor: 'Dr. Rostova', action: 'Join Queue' },
                        { day: 'Tuesday', time: '14:00 - 16:00', mentor: 'Prof. Vance', action: 'Join Queue' },
                        { day: 'Wednesday', time: '13:00 - 15:30', mentor: 'Dr. Lin', action: 'Join Queue' },
                        { day: 'Thursday', time: '11:00 - 13:00', mentor: 'Prof. Thompson', action: 'Join Queue' },
                        { day: 'Friday', time: '15:00 - 17:00', mentor: 'Prof. Jenkins', action: 'Join Queue' },
                    ].map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #ccc', backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <td style={{ padding: '6px', fontWeight: 700 }}>{row.day}</td>
                            <td style={{ padding: '6px' }}>{row.time}</td>
                            <td style={{ padding: '6px' }}>{row.mentor}</td>
                            <td style={{ padding: '6px' }}>
                                <button
                                    onClick={() => alert(`You have been placed in the waiting queue for ${row.mentor}!`)}
                                    style={{
                                        padding: '2px 6px',
                                        background: '#0284c7',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '3px',
                                        fontSize: '0.7rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {row.action}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GlobalOverlay;
