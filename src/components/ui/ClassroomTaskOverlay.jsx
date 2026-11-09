import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useScene } from '../../context/SceneContext';
import { useAchievements } from '../../context/AchievementsContext';
import { useAudio } from '../../context/AudioManager';
import '../../styles/ClassroomTaskOverlay.scss';

// Room Task Definitions
const ROOM_TASKS = {
    studio: {
        roomTitle: 'Lecture Hall',
        roomBadge: '🖥️ LECTURE MISSIONS',
        roomDesc: 'Master modern computing through live streaming & interactive blackboard notes.',
        achievementId: 'studio_interact',
        tasks: [
            {
                id: 'studio_watch_lecture',
                title: 'Attend Live Lecture',
                desc: 'Watch the Deep Learning & 3D WebGL lecture stream',
                actionLabel: 'Watch Stream',
                eventType: 'lecture_watched',
                action: 'open_lecture'
            },
            {
                id: 'studio_take_notes',
                title: 'Blackboard Chalk Notes',
                desc: 'Write and save a study note on the digital chalkboard',
                actionLabel: 'Open Notepad',
                eventType: 'notes_saved',
                action: 'open_notes'
            },
            {
                id: 'studio_mark_attendance',
                title: 'Sign Attendance Sheet',
                desc: 'Confirm your verified presence in today\'s lecture',
                actionLabel: 'Mark Attendance',
                eventType: 'attendance_marked',
                action: 'mark_attendance'
            }
        ]
    },
    gallery: {
        roomTitle: 'Study Library',
        roomBadge: '📚 LIBRARY MISSIONS',
        roomDesc: 'Explore curated syllabus handbooks, data structures, and take knowledge checks.',
        achievementId: 'gallery_inspect',
        tasks: [
            {
                id: 'gallery_open_courseware',
                title: 'Inspect Course Syllabus',
                desc: 'Open course handbook for Python, Java, or WebGL',
                actionLabel: 'View Syllabus',
                eventType: 'courseware_opened',
                action: 'open_syllabus'
            },
            {
                id: 'gallery_take_quiz',
                title: 'Knowledge Check Quiz',
                desc: 'Complete the interactive 3-question module quiz',
                actionLabel: 'Take Quiz',
                eventType: 'quiz_completed',
                action: 'open_quiz'
            },
            {
                id: 'gallery_inspect_cards',
                title: 'Review Course Modules',
                desc: 'Browse through the 3D course cards on the balcony',
                actionLabel: 'Browse Books',
                eventType: 'card_inspected',
                action: 'browse_books'
            }
        ]
    },
    contact: {
        roomTitle: 'Doubts Forum',
        roomBadge: '💬 DOUBTS & Q&A MISSIONS',
        roomDesc: 'Collaborate with faculty and peer scholars, vote on questions, and submit doubts.',
        achievementId: 'contact_choose',
        tasks: [
            {
                id: 'contact_post_doubt',
                title: 'Message in a Bottle',
                desc: 'Write and throw an academic doubt bottle to professors',
                actionLabel: 'Post Doubt',
                eventType: 'doubt_submitted',
                action: 'open_post_doubt'
            },
            {
                id: 'contact_upvote_query',
                title: 'Upvote Peer Discussion',
                desc: 'Upvote a student question on the live Doubts Board',
                actionLabel: 'View Board',
                eventType: 'doubt_upvoted',
                action: 'open_forum'
            },
            {
                id: 'contact_check_office_hours',
                title: 'Faculty Consultation',
                desc: 'Check professor office hours & peer study circles',
                actionLabel: 'Office Hours',
                eventType: 'office_hours_viewed',
                action: 'open_office_hours'
            }
        ]
    },
    about: {
        roomTitle: 'Academy Hub',
        roomBadge: '🎓 ACADEMY HUB MISSIONS',
        roomDesc: 'Navigate through the academic journey, degree syllabus, and university charter.',
        achievementId: 'about_fly',
        tasks: [
            {
                id: 'about_fly_sky',
                title: 'Curriculum Flight Voyage',
                desc: 'Fly your paper airplane past semester milestones',
                actionLabel: 'Start Flight',
                eventType: 'about_fly',
                action: 'start_flight'
            },
            {
                id: 'about_review_roadmap',
                title: 'Degree Roadmap 2026',
                desc: 'Inspect the 4-year Computer Science curriculum charter',
                actionLabel: 'Read Charter',
                eventType: 'curriculum_viewed',
                action: 'open_charter'
            },
            {
                id: 'about_faculty_milestones',
                title: 'Dean\'s Honour Roll',
                desc: 'Examine academic accreditation & faculty distinctions',
                actionLabel: 'Honour Roll',
                eventType: 'honour_roll_viewed',
                action: 'open_honour'
            }
        ]
    }
};

const ClassroomTaskOverlay = () => {
    const { currentRoom, isInRoom, openOverlay } = useScene();
    const { unlockAchievement } = useAchievements();
    const { play } = useAudio();

    const [isMinimized, setIsMinimized] = useState(false);
    const [celebrationMessage, setCelebrationMessage] = useState(null);

    // Load completed tasks from localStorage
    const [completedTasks, setCompletedTasks] = useState(() => {
        try {
            const saved = localStorage.getItem('academic_classroom_tasks');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    // Save completed tasks to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('academic_classroom_tasks', JSON.stringify(completedTasks));
        } catch (e) {
            console.error('Failed to save tasks', e);
        }
    }, [completedTasks]);

    // Current room task set
    const roomConfig = useMemo(() => {
        if (!currentRoom || !ROOM_TASKS[currentRoom]) return null;
        return ROOM_TASKS[currentRoom];
    }, [currentRoom]);

    // Check if task is done
    const isTaskDone = useCallback((taskId) => {
        return !!completedTasks[taskId];
    }, [completedTasks]);

    // Mark task completed
    const completeTask = useCallback((taskId) => {
        setCompletedTasks(prev => {
            if (prev[taskId]) return prev;
            const updated = { ...prev, [taskId]: true };

            // Trigger celebration check
            if (roomConfig) {
                const allDone = roomConfig.tasks.every(t => t.id === taskId || updated[t.id]);
                if (allDone) {
                    setCelebrationMessage(`🏆 All ${roomConfig.roomTitle} Objectives Completed! +150 Academic Credits`);
                    if (roomConfig.achievementId) {
                        unlockAchievement(roomConfig.achievementId);
                    }
                    setTimeout(() => {
                        setCelebrationMessage(null);
                    }, 5000);
                }
            }

            return updated;
        });
    }, [roomConfig, unlockAchievement]);

    // Listen to custom academic window events to auto-complete tasks
    useEffect(() => {
        const handleCustomEvent = (event) => {
            const eventType = event.type;
            if (!roomConfig) return;

            roomConfig.tasks.forEach(task => {
                if (task.eventType === eventType) {
                    completeTask(task.id);
                }
            });
        };

        const eventTypes = [
            'lecture_watched',
            'notes_saved',
            'attendance_marked',
            'courseware_opened',
            'quiz_completed',
            'card_inspected',
            'doubt_submitted',
            'doubt_upvoted',
            'office_hours_viewed',
            'about_fly',
            'curriculum_viewed',
            'honour_roll_viewed'
        ];

        eventTypes.forEach(type => window.addEventListener(type, handleCustomEvent));
        return () => {
            eventTypes.forEach(type => window.removeEventListener(type, handleCustomEvent));
        };
    }, [roomConfig, completeTask]);

    // Handle Quick Action button clicks
    const handleActionClick = (task) => {
        completeTask(task.id);

        if (task.action === 'open_lecture') {
            openOverlay({
                title: 'CS-401: Deep Learning & Neural Architectures',
                layout: 'lecture',
                videoUrl: '/textures/studio/scrub-video-intra.mp4',
                description: 'Core lecture stream on Transformer attention mechanisms, backpropagation calculus, and GPU tensor pipelines.',
                platformConfig: { label: 'Lecture Hall Stream' }
            });
        } else if (task.action === 'open_notes') {
            openOverlay({
                title: 'Digital Blackboard Chalk Notes',
                layout: 'lecture',
                videoUrl: '/textures/studio/scrub-video-intra.mp4',
                description: 'Write, draw, and save your lecture notes with persistent blackboard storage.',
                platformConfig: { label: 'Blackboard Chalkboard' }
            });
        } else if (task.action === 'mark_attendance') {
            window.dispatchEvent(new CustomEvent('attendance_marked'));
            alert('✓ Attendance successfully recorded on Academia 3D ledger!');
        } else if (task.action === 'open_syllabus' || task.action === 'open_quiz') {
            openOverlay({
                layout: 'study_material',
                title: 'PYTHON & AI ARCHITECTURE',
                courseCode: 'CS-101',
                modulesCount: '16 Modules',
                description: 'Complete Python for AI & Computing: Memory layout, Asyncio coroutines, NumPy vectorization, and interactive quizzes.',
                techStack: ['/textures/gallery/wordpresslogo.webp', '/textures/gallery/phplogo.webp']
            });
        } else if (task.action === 'browse_books') {
            alert('💡 Click any 3D course card on the library balcony, then click [OPEN COURSEWARE] to inspect materials.');
        } else if (task.action === 'open_post_doubt') {
            window.dispatchEvent(new CustomEvent('openContactPaper'));
        } else if (task.action === 'open_forum') {
            openOverlay({
                layout: 'classroom_forum',
                title: 'Campus Doubts & Academic Discussion',
                description: 'Collaborate with faculty and fellow peers.',
                platformConfig: { label: 'Doubts Forum' }
            });
        } else if (task.action === 'open_office_hours') {
            openOverlay({
                layout: 'office_hours',
                title: 'Faculty Consultation & Office Hours',
                description: 'View live professor schedules and virtual consultation timings.',
                platformConfig: { label: 'Office Hours' }
            });
        } else if (task.action === 'open_charter') {
            openOverlay({
                layout: 'study_material',
                title: 'ACADEMIA 2026 CHARTER & 4-YEAR CURRICULUM',
                courseCode: 'DEGREE-BS-CS',
                modulesCount: '48 Semesters',
                description: 'Accredited university curriculum: Artificial Intelligence, Distributed Systems, 3D WebGL Graphics, and Quantum Computing foundations.'
            });
        } else if (task.action === 'open_honour') {
            openOverlay({
                layout: 'faculty_desk',
                title: 'Faculty Directory & Dean\'s Honour Roll',
                description: 'Academic council, peer study fellows, and top campus scholars.'
            });
        } else if (task.action === 'start_flight') {
            alert('✈️ Scroll down with mouse or trackpad to fly your paper glider through the semester sky!');
        }
    };

    if (!isInRoom || !roomConfig) return null;

    const completedCount = roomConfig.tasks.filter(t => isTaskDone(t.id)).length;
    const totalCount = roomConfig.tasks.length;
    const progressPercent = Math.round((completedCount / totalCount) * 100);

    return (
        <aside
            className={`classroom-tasks-container ${isMinimized ? 'minimized' : ''}`}
            aria-label="Classroom missions"
        >
            {/* Celebration Toast */}
            {celebrationMessage && (
                <div className="task-celebration-toast">
                    <span>{celebrationMessage}</span>
                </div>
            )}

            {/* Header / Minimized Pill */}
            <div className="task-header" onClick={() => setIsMinimized(!isMinimized)}>
                <div className="header-left">
                    <span className="task-icon">📋</span>
                    <span className="task-badge">{roomConfig.roomBadge}</span>
                    <span className="task-counter">({completedCount}/{totalCount})</span>
                </div>
                <button
                    className="toggle-minimize-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMinimized(!isMinimized);
                    }}
                    title={isMinimized ? 'Expand Tasks' : 'Minimize Tasks'}
                    aria-label={isMinimized ? 'Expand Tasks' : 'Minimize Tasks'}
                >
                    {isMinimized ? '▲ Expand' : '▼ Collapse'}
                </button>
            </div>

            {/* Task Content Body */}
            {!isMinimized && (
                <div className="task-content">
                    <p className="task-instructions">{roomConfig.roomDesc}</p>

                    {/* Progress Bar */}
                    <div className="task-progress-wrap">
                        <div className="progress-bar-bg">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <span className="progress-text">{progressPercent}% Completed</span>
                    </div>

                    {/* Task Checklist */}
                    <div className="tasks-list">
                        {roomConfig.tasks.map((task, idx) => {
                            const done = isTaskDone(task.id);
                            return (
                                <div
                                    key={task.id}
                                    className={`task-item ${done ? 'completed' : ''}`}
                                    onClick={() => completeTask(task.id)}
                                >
                                    <div className="task-checkbox-col">
                                        <div className={`chalk-checkbox ${done ? 'checked' : ''}`}>
                                            {done ? '✓' : ''}
                                        </div>
                                    </div>
                                    <div className="task-info-col">
                                        <div className="task-title-row">
                                            <span className="task-title">{task.title}</span>
                                        </div>
                                        <p className="task-desc">{task.desc}</p>
                                    </div>
                                    <div className="task-action-col">
                                        <button
                                            type="button"
                                            className={`task-action-btn ${done ? 'done-btn' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleActionClick(task);
                                            }}
                                        >
                                            {done ? 'Done ✓' : task.actionLabel}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Tip */}
                    <div className="task-footer">
                        <span>💡 Complete all classroom missions to graduate with campus honors.</span>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default ClassroomTaskOverlay;

