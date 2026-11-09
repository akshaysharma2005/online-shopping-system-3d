import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useScene } from '../../context/SceneContext';
import { useAudio } from '../../context/AudioManager';
import { setMusicVolume, getMusicVolume } from '../../utils/audioManager';
import { useAchievements } from '../../context/AchievementsContext';
import AchievementPopup from './AchievementPopup';
import AchievementsPanel from './AchievementsPanel';
import '../../styles/NavigationUI.scss';

// Academic Room data for the Campus Map
const ROOMS = [
    { id: 'about', label: 'Academy Hub', x: 43, y: 38 },      // Paper airplane (left side)
    { id: 'gallery', label: 'Study Library', x: 43, y: 72 },  // City buildings (bottom left)
    { id: 'contact', label: 'Doubts Forum', x: 57, y: 25 },  // Pier/dock (top right)
    { id: 'studio', label: 'Lecture Hall', x: 57, y: 55 },    // Monitors stack (right side)
];

const PIN_START_POSITION = { x: 50.5, y: 97 };

const NavigationUI = () => {
    const { currentRoom, isInRoom, requestExit, exitRoom, hasEntered, teleportTo, isTeleporting, overlayContent, closeOverlay } = useScene();
    const { isMuted, toggleMute, globalVolume, setGlobalVolume } = useAudio();
    const { showTutorial, unlockAchievement } = useAchievements();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredRoom, setHoveredRoom] = useState(null);
    const [isExiting, setIsExiting] = useState(false);

    // Academic controls state
    const [isAudioMenuOpen, setIsAudioMenuOpen] = useState(false);
    const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isAssignmentsOpen, setIsAssignmentsOpen] = useState(false);
    const [activeRole, setActiveRole] = useState('student'); // 'student' | 'faculty' | 'admin'
    const [bgmVol, setBgmVol] = useState(0.3);
    const [isUIHidden, setIsUIHidden] = useState(false);

    // Assignments State
    const [assignments, setAssignments] = useState([
        {
            id: 'asg-1',
            title: 'Implement AVL Tree Rotation Invariants',
            course: 'CS-202 (Data Structures)',
            due: 'Due in 2 days',
            status: 'Pending',
            grade: null
        },
        {
            id: 'asg-2',
            title: 'Custom Fragment Shader Procedural Marble',
            course: 'CS-340 (3D Graphics)',
            due: 'Due in 5 days',
            status: 'In Progress',
            grade: null
        },
        {
            id: 'asg-3',
            title: 'Relational Schema 3NF Normalization & Indexes',
            course: 'CS-205 (Database Engineering)',
            due: 'Submitted',
            status: 'Graded',
            grade: '98/100 (A+)'
        }
    ]);
    const [submittedAssignmentId, setSubmittedAssignmentId] = useState(null);

    // Refs for focus management
    const mapPanelRef = useRef();
    const mapCloseRef = useRef();

    useEffect(() => {
        const handleInspectChange = (e) => {
            setIsUIHidden(e.detail);
            if (e.detail) {
                setIsMenuOpen(false);
                setIsAudioMenuOpen(false);
                setIsAchievementsOpen(false);
                setIsRoleModalOpen(false);
                setIsAssignmentsOpen(false);
            }
        };
        window.addEventListener('inspectChange', handleInspectChange);
        return () => window.removeEventListener('inspectChange', handleInspectChange);
    }, []);

    const paintedMapsRefs = {
        about: useRef(),
        gallery: useRef(),
        contact: useRef(),
        studio: useRef()
    };

    useEffect(() => {
        if (paintedMapsRefs.about.current) {
            gsap.to(paintedMapsRefs.about.current, {
                clipPath: (hoveredRoom === 'about' || currentRoom === 'about')
                    ? 'polygon(10% 20%, 40% 20%, 40% 55%, 10% 55%)'
                    : 'polygon(10% 20%, 10% 20%, 10% 55%, 10% 55%)',
                duration: 0.5,
                ease: "power2.out"
            });
        }

        if (paintedMapsRefs.gallery.current) {
            gsap.to(paintedMapsRefs.gallery.current, {
                clipPath: (hoveredRoom === 'gallery' || currentRoom === 'gallery')
                    ? 'polygon(10% 57%, 40% 57%, 40% 92%, 10% 92%)'
                    : 'polygon(10% 57%, 10% 57%, 10% 92%, 10% 92%)',
                duration: 0.5,
                ease: "power2.out"
            });
        }

        if (paintedMapsRefs.contact.current) {
            gsap.to(paintedMapsRefs.contact.current, {
                clipPath: (hoveredRoom === 'contact' || currentRoom === 'contact')
                    ? 'polygon(60% 10%, 95% 10%, 95% 35%, 60% 35%)'
                    : 'polygon(95% 10%, 95% 10%, 95% 35%, 95% 35%)',
                duration: 0.5,
                ease: "power2.out"
            });
        }

        if (paintedMapsRefs.studio.current) {
            gsap.to(paintedMapsRefs.studio.current, {
                clipPath: (hoveredRoom === 'studio' || currentRoom === 'studio')
                    ? 'polygon(60% 41%, 85% 41%, 85% 81%, 60% 81%)'
                    : 'polygon(85% 41%, 85% 41%, 85% 81%, 85% 81%)',
                duration: 0.5,
                ease: "power2.out"
            });
        }
    }, [hoveredRoom, currentRoom]);

    useEffect(() => {
        setBgmVol(getMusicVolume());
        const handleMusicVolumeChange = (e) => setBgmVol(e.detail);
        window.addEventListener('musicVolumeChanged', handleMusicVolumeChange);
        return () => window.removeEventListener('musicVolumeChanged', handleMusicVolumeChange);
    }, []);

    const handleBgmChange = (val) => {
        setBgmVol(val);
        setMusicVolume(val);
    };

    useEffect(() => {
        if (!hasEntered && !isTeleporting) {
            showTutorial('corridor_enter');
        } else if (hasEntered && !isInRoom && !isTeleporting) {
            showTutorial('corridor_explore');
        }
    }, [hasEntered, isInRoom, isTeleporting, showTutorial]);

    const handleBackClick = useCallback(() => {
        if (overlayContent) {
            closeOverlay();
            return;
        }
        setIsExiting(true);
        requestExit();

        // Fail-safe: If GSAP exit animation is desynced or interrupted, guarantee exit after 2.2s
        setTimeout(() => {
            if (currentRoom) {
                exitRoom();
                setIsExiting(false);
            }
        }, 2200);
    }, [overlayContent, closeOverlay, requestExit, currentRoom, exitRoom]);

    const handleGlobalKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            if (isMenuOpen) {
                setIsMenuOpen(false);
                return;
            }
            if (isAudioMenuOpen) {
                setIsAudioMenuOpen(false);
                return;
            }
            if (isAssignmentsOpen) {
                setIsAssignmentsOpen(false);
                return;
            }
            if (isRoleModalOpen) {
                setIsRoleModalOpen(false);
                return;
            }
            if (isInRoom) {
                handleBackClick();
            }
        }
    }, [isMenuOpen, isAudioMenuOpen, isAssignmentsOpen, isRoleModalOpen, isInRoom, handleBackClick]);

    useEffect(() => {
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [handleGlobalKeyDown]);

    const handleRoomClick = (roomId) => {
        if (roomId === currentRoom || isTeleporting) return;
        setIsMenuOpen(false);
        setIsAudioMenuOpen(false);
        setIsAchievementsOpen(false);
        setIsRoleModalOpen(false);
        setIsAssignmentsOpen(false);
        teleportTo(roomId);
    };

    const handleSubmitAssignment = (id) => {
        setSubmittedAssignmentId(id);
        setTimeout(() => {
            setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'Submitted', grade: 'Under Review' } : a));
            setSubmittedAssignmentId(null);
            alert('✓ Solution code submitted successfully to teaching faculty!');
        }, 1200);
    };

    return (
        <div className="navigation-ui">
            {/* Global Achievement Popup */}
            <AchievementPopup />

            {/* Top Left: Role Switcher & Student Portal Badge */}
            {hasEntered && (
                <div style={{
                    position: 'fixed',
                    top: '12px',
                    left: isInRoom ? '85px' : '20px',
                    zIndex: 105,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'left 0.3s ease',
                    pointerEvents: 'auto'
                }}>
                    <button
                        onClick={() => setIsRoleModalOpen(!isRoleModalOpen)}
                        style={{
                            background: '#ffffff',
                            border: '2px solid #1a1a1a',
                            borderRadius: '3px',
                            padding: '6px 14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontFamily: "'Cabin Sketch', cursive",
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            boxShadow: '3px 3px 0px rgba(0,0,0,0.15)',
                            transition: 'transform 0.15s ease'
                        }}
                    >
                        <span>
                            {activeRole === 'student' ? '🎓 Student: Alex Carter' :
                                activeRole === 'faculty' ? '👨‍🏫 Faculty: Prof. Alan Vance' :
                                    '🛡️ Dean: Admin Office'}
                        </span>
                        <span style={{ fontSize: '0.75rem' }}>▼</span>
                    </button>

                    {/* Live Class Indicator Button */}
                    {!isInRoom && (
                        <button
                            onClick={() => handleRoomClick('studio')}
                            style={{
                                background: '#fee2e2',
                                border: '2px solid #dc2626',
                                color: '#b91c1c',
                                borderRadius: '3px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontFamily: "'Cabin Sketch', cursive",
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                boxShadow: '2px 2px 0px rgba(220,38,38,0.2)'
                            }}
                        >
                            <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#dc2626',
                                display: 'inline-block',
                                animation: 'pulse 1.5s infinite'
                            }} />
                            <span>LIVE: Deep Learning (Lecture Hall) →</span>
                        </button>
                    )}
                </div>
            )}

            {/* Back Button - Only visible in rooms */}
            {hasEntered && isInRoom && (
                <button
                    className={`nav-btn back-btn ${isExiting ? 'exiting' : ''}`}
                    onClick={handleBackClick}
                    aria-label="Back to corridor"
                >
                    <svg viewBox="0 0 24 24" className="icon-back">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Right side controls */}
            {hasEntered && (
                <div className={`nav-controls ${isMenuOpen || isAudioMenuOpen || isAssignmentsOpen ? 'menu-open' : ''} ${isUIHidden ? 'ui-hidden' : ''}`}>
                    {/* Assignments Drawer Button */}
                    <button
                        className={`nav-btn ${isAssignmentsOpen ? 'open' : ''}`}
                        onClick={() => {
                            setIsAssignmentsOpen(!isAssignmentsOpen);
                            setIsMenuOpen(false);
                            setIsAudioMenuOpen(false);
                            setIsAchievementsOpen(false);
                        }}
                        aria-label="Assignments"
                        style={{ position: 'relative' }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>📝</span>
                        <span style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            backgroundColor: '#dc2626',
                            color: '#fff',
                            borderRadius: '50%',
                            width: '16px',
                            height: '16px',
                            fontSize: '0.65rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800
                        }}>
                            2
                        </span>
                    </button>

                    {/* Campus Blueprint Map Button */}
                    <button
                        className={`nav-btn hamburger-btn ${isMenuOpen ? 'open' : ''}`}
                        onClick={() => {
                            setIsMenuOpen(!isMenuOpen);
                            setIsAssignmentsOpen(false);
                            setIsAudioMenuOpen(false);
                            setIsAchievementsOpen(false);
                        }}
                        aria-label="Toggle map"
                        aria-expanded={isMenuOpen}
                    >
                        <div className="hamburger-icon">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>

                    {/* Audio Toggle Button */}
                    <button
                        className={`nav-btn audio-btn ${isAudioMenuOpen ? 'open' : ''}`}
                        onClick={() => {
                            setIsAudioMenuOpen(!isAudioMenuOpen);
                            setIsMenuOpen(false);
                            setIsAssignmentsOpen(false);
                            setIsAchievementsOpen(false);
                        }}
                        aria-label="Audio Settings"
                        aria-expanded={isAudioMenuOpen}
                    >
                        {isMuted ? (
                            <svg viewBox="0 0 24 24" className="icon-audio">
                                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                <line x1="23" y1="9" x2="17" y2="15" />
                                <line x1="17" y1="9" x2="23" y2="15" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" className="icon-audio">
                                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                <path d="M15 9a5 5 0 0 1 0 6" />
                                <path d="M18 5a9 9 0 0 1 0 14" />
                            </svg>
                        )}
                    </button>

                    {/* Achievements Toggle Button */}
                    <button
                        className={`nav-btn achievements-btn ${isAchievementsOpen ? 'open' : ''}`}
                        onClick={() => {
                            setIsAchievementsOpen(!isAchievementsOpen);
                            setIsMenuOpen(false);
                            setIsAudioMenuOpen(false);
                            setIsAssignmentsOpen(false);
                        }}
                        aria-label="Achievements"
                        aria-expanded={isAchievementsOpen}
                    >
                        <svg viewBox="0 0 24 24" className="icon-trophy">
                            <path d="M8 21h8M12 17v4M7 4h10M5 4h14v5a7 7 0 0 1-7 7 7 7 0 0 1-7-7z" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M5 9H3V6h2" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19 9h2V6h-2" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Academic Role Switcher Modal */}
            {isRoleModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: '55px',
                    left: isInRoom ? '85px' : '20px',
                    width: '320px',
                    backgroundColor: '#ffffff',
                    border: '2px solid #1a1a1a',
                    borderRadius: '4px',
                    padding: '1rem',
                    boxShadow: '6px 6px 0px rgba(0,0,0,0.15)',
                    zIndex: 210,
                    fontFamily: "'Cabin Sketch', cursive",
                    pointerEvents: 'auto'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px dashed #ccc', paddingBottom: '0.4rem', marginBottom: '0.6rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>ACADEMIC PROFILE</span>
                        <button onClick={() => setIsRoleModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 800 }}>✕</button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.8rem' }}>
                        {['student', 'faculty', 'admin'].map(r => (
                            <button
                                key={r}
                                onClick={() => setActiveRole(r)}
                                style={{
                                    flex: 1,
                                    padding: '4px',
                                    fontSize: '0.8rem',
                                    background: activeRole === r ? '#111' : '#f0f0f0',
                                    color: activeRole === r ? '#fff' : '#111',
                                    border: '1px solid #111',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize',
                                    fontWeight: 700
                                }}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    {activeRole === 'student' && (
                        <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            <div><strong>Student ID:</strong> #2026-CS-408</div>
                            <div><strong>Program:</strong> B.Sc Computer Science & AI</div>
                            <div><strong>Current GPA:</strong> 3.89 / 4.00 (Honors)</div>
                            <div><strong>Attendance:</strong> 94.2% (Eligible for Exams)</div>
                            <div><strong>Active Terms:</strong> Semester 4</div>
                            <div style={{ marginTop: '0.5rem', borderTop: '1px solid #eee', paddingTop: '0.4rem' }}>
                                <button
                                    onClick={() => {
                                        setIsRoleModalOpen(false);
                                        setIsAssignmentsOpen(true);
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '4px',
                                        background: '#0284c7',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '3px',
                                        cursor: 'pointer',
                                        fontWeight: 700
                                    }}
                                >
                                    View Pending Assignments (2) →
                                </button>
                            </div>
                        </div>
                    )}

                    {activeRole === 'faculty' && (
                        <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            <div><strong>Faculty:</strong> Prof. Alan Vance, Ph.D.</div>
                            <div><strong>Department:</strong> AI & Computing Lab</div>
                            <div><strong>Active Classes:</strong> CS-480, CS-301</div>
                            <div><strong>Ungraded Submissions:</strong> 14 students</div>
                            <button
                                onClick={() => alert('Faculty live streaming broadcast initiated to Lecture Hall!')}
                                style={{
                                    marginTop: '0.5rem',
                                    width: '100%',
                                    padding: '4px',
                                    background: '#15803d',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    fontWeight: 700
                                }}
                            >
                                🔴 Start Live Lecture Broadcast
                            </button>
                        </div>
                    )}

                    {activeRole === 'admin' && (
                        <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            <div><strong>Administrator:</strong> Dean Office Portal</div>
                            <div><strong>Pending Student Requests:</strong> 8 applications</div>
                            <div><strong>Faculty Verifications:</strong> 2 pending</div>
                            <div><strong>Campus System Status:</strong> 60 FPS • Optimal</div>
                            <button
                                onClick={() => alert('All pending student registrations approved!')}
                                style={{
                                    marginTop: '0.5rem',
                                    width: '100%',
                                    padding: '4px',
                                    background: '#b45309',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    fontWeight: 700
                                }}
                            >
                                ✓ Batch Approve Student Requests
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Assignments Drawer */}
            {isAssignmentsOpen && (
                <div style={{
                    position: 'fixed',
                    top: '80px',
                    right: '25px',
                    width: 'clamp(300px, 32vw, 420px)',
                    maxHeight: '75vh',
                    overflowY: 'auto',
                    backgroundColor: '#ffffff',
                    border: '2px solid #1a1a1a',
                    borderRadius: '4px',
                    padding: '1.2rem',
                    boxShadow: '6px 6px 0px rgba(0,0,0,0.15)',
                    zIndex: 200,
                    fontFamily: "'Cabin Sketch', cursive",
                    pointerEvents: 'auto'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px dashed #ccc', paddingBottom: '0.5rem', marginBottom: '0.8rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>📝 ACADEMIC ASSIGNMENTS</span>
                        <button onClick={() => setIsAssignmentsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 800 }}>✕</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {assignments.map(a => (
                            <div key={a.id} style={{
                                padding: '0.6rem',
                                border: '1.5px solid #111',
                                borderRadius: '3px',
                                backgroundColor: a.status === 'Graded' ? '#f0fdf4' : '#fafafa',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.3rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#0d5c75', fontWeight: 700 }}>{a.course}</span>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        padding: '1px 6px',
                                        borderRadius: '3px',
                                        background: a.status === 'Pending' ? '#fef3c7' : a.status === 'Graded' ? '#dcfce7' : '#e0f2fe',
                                        color: a.status === 'Pending' ? '#92400e' : a.status === 'Graded' ? '#166534' : '#0369a1',
                                        fontWeight: 700
                                    }}>
                                        {a.status}
                                    </span>
                                </div>
                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{a.title}</span>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#555' }}>
                                    <span>🕒 {a.due}</span>
                                    {a.grade && <span style={{ color: '#15803d', fontWeight: 800 }}>Grade: {a.grade}</span>}
                                </div>
                                {a.status !== 'Graded' && a.status !== 'Submitted' && (
                                    <button
                                        onClick={() => handleSubmitAssignment(a.id)}
                                        disabled={submittedAssignmentId === a.id}
                                        style={{
                                            marginTop: '4px',
                                            padding: '4px',
                                            background: '#111',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '2px',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer',
                                            fontWeight: 700
                                        }}
                                    >
                                        {submittedAssignmentId === a.id ? 'Uploading...' : '📤 Submit Solution Code'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Map Panel - Drops from top when open */}
            {hasEntered && (
                <div className={`map-panel ${isMenuOpen ? 'open' : ''}`} inert={!isMenuOpen ? true : undefined} ref={mapPanelRef} onKeyDown={handleMapKeyDown} role="dialog" aria-label="Campus Map">
                    <svg
                        className="map-border-overlay"
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
                    <div className="map-card">
                        <div className="map-header">
                            <h3>CAMPUS BLUEPRINT</h3>
                            <button
                                ref={mapCloseRef}
                                className="close-btn"
                                onClick={() => setIsMenuOpen(false)}
                                aria-label="Close campus map"
                            >
                                <svg viewBox="0 0 24 24">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="map-image-wrapper">
                            <img src="/images/map.webp" alt="Campus Blueprint Map" className="map-image" />
                            <img ref={paintedMapsRefs.about} src="/images/map_about_painted.webp" alt="" className="map-painted about" />
                            <img ref={paintedMapsRefs.gallery} src="/images/map_gallery_painted.webp" alt="" className="map-painted gallery" />
                            <img ref={paintedMapsRefs.contact} src="/images/map_contact_painted.webp" alt="" className="map-painted contact" />
                            <img ref={paintedMapsRefs.studio} src="/images/map_studio_painted.webp" alt="" className="map-painted studio" />

                            {ROOMS.map(room => (
                                <button
                                    key={room.id}
                                    className={`room-slot ${hoveredRoom === room.id ? 'hovered' : ''} ${currentRoom === room.id && isInRoom ? 'current' : ''}`}
                                    style={{
                                        left: `${room.x}%`,
                                        top: `${room.y}%`
                                    }}
                                    onMouseEnter={() => setHoveredRoom(room.id)}
                                    onMouseLeave={() => setHoveredRoom(null)}
                                    onClick={() => handleRoomClick(room.id)}
                                    aria-label={`Teleport to ${room.label}`}
                                >
                                    <img src="/images/pin-slot.webp" alt="" className="slot-image" />
                                </button>
                            ))}

                            <div
                                className="pin-marker"
                                style={{
                                    left: `${hoveredRoom
                                        ? ROOMS.find(r => r.id === hoveredRoom)?.x || PIN_START_POSITION.x
                                        : currentRoom && isInRoom
                                            ? ROOMS.find(r => r.id === currentRoom)?.x || PIN_START_POSITION.x
                                            : PIN_START_POSITION.x
                                        }%`,
                                    top: `${hoveredRoom
                                        ? ROOMS.find(r => r.id === hoveredRoom)?.y || PIN_START_POSITION.y
                                        : currentRoom && isInRoom
                                            ? ROOMS.find(r => r.id === currentRoom)?.y || PIN_START_POSITION.y
                                            : PIN_START_POSITION.y
                                        }%`
                                }}
                            >
                                <img src="/images/pin.webp" alt="You are here" className="pin-image" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Audio Panel */}
            {hasEntered && (
                <div className={`audio-panel ${isAudioMenuOpen ? 'open' : ''}`} inert={!isAudioMenuOpen ? true : undefined}>
                    <div className="audio-card">
                        <div className="audio-header">
                            <h3>CAMPUS SOUNDSCAPES</h3>
                            <button
                                className="close-btn"
                                onClick={() => setIsAudioMenuOpen(false)}
                                aria-label="Close audio settings"
                            >
                                <svg viewBox="0 0 24 24">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="audio-sliders-container">
                            <div className="slider-group">
                                <div className="slider-label">
                                    <span>Atmosphere</span>
                                    <span>{Math.round(bgmVol * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="1" step="0.01"
                                    value={bgmVol}
                                    onChange={(e) => handleBgmChange(parseFloat(e.target.value))}
                                    className="paper-slider"
                                    aria-label="Atmosphere volume"
                                />
                            </div>
                            <div className="slider-group">
                                <div className="slider-label">
                                    <span>Classroom SFX</span>
                                    <span>{Math.round(globalVolume * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="1" step="0.01"
                                    value={globalVolume}
                                    onChange={(e) => setGlobalVolume(parseFloat(e.target.value))}
                                    className="paper-slider"
                                    aria-label="SFX volume"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Achievements Panel */}
            <AchievementsPanel
                isOpen={isAchievementsOpen}
                onClose={() => setIsAchievementsOpen(false)}
            />

            {/* Overlay to close menus */}
            {(isMenuOpen || isAudioMenuOpen || isAchievementsOpen || isRoleModalOpen || isAssignmentsOpen) && (
                <div
                    className="menu-overlay"
                    onClick={() => {
                        setIsMenuOpen(false);
                        setIsAudioMenuOpen(false);
                        setIsAchievementsOpen(false);
                        setIsRoleModalOpen(false);
                        setIsAssignmentsOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default NavigationUI;
