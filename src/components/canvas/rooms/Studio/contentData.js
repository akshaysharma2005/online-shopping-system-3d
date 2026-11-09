/**
 * Virtual Classroom - Lecture Hall Content Data
 * 
 * Defines the rotating 3D screens in the Lecture Hall:
 * - Wide TV/CRT Screens: Core Video Lectures & Live Class Streams
 * - Thin Monitors: Comprehensive Computer Science Labs & Systems Architecture
 * - Vertical Tablets: Quick Code Micro-Lessons & Algorithmic Sprints
 */

export const PLATFORM_CONFIG = {
    youtube: {
        color: '#705658ff',
        accentColor: '#D90429',
        icon: '🔴',
        label: 'Live Lecture',
        shape: 'tv', // Wide CRT style
    },
    blog: {
        color: '#2563EB',
        accentColor: '#1D4ED8',
        icon: '💻',
        label: 'CS Core Lab',
        shape: 'monitor', // Thin desktop monitor
    },
    tiktok: {
        color: '#059669',
        accentColor: '#047857',
        icon: '⚡',
        label: 'Code Sprint',
        shape: 'phone', // Vertical phone / tablet
    },
    live: {
        color: '#E63946',
        accentColor: '#D90429',
        icon: '🔴',
        label: 'Live Lecture',
        shape: 'tv',
    },
    python: {
        color: '#306998',
        accentColor: '#FFD43B',
        icon: '🐍',
        label: 'Python Lab',
        shape: 'monitor',
    },
    webgl: {
        color: '#00B4D8',
        accentColor: '#0077B6',
        icon: '🧊',
        label: 'Graphics Lab',
        shape: 'tv',
    },
    algorithms: {
        color: '#2A9D8F',
        accentColor: '#264653',
        icon: '⚡',
        label: 'Algorithms Sprint',
        shape: 'phone',
    },
};

const RAW_CONTENT_DATA = [
    // ============ Live Video Lectures (TV Screens) ============
    {
        id: 'lec-001',
        platform: 'youtube',
        title: 'Deep Learning: Neural Attention & Transformer Models',
        instructor: 'Prof. Alan Vance (AI & Deep Learning Chair)',
        courseCode: 'CS-480',
        description: 'Comprehensive live lecture exploring self-attention mechanisms, multi-head transformer heads, backpropagation math, and PyTorch implementations with tensor parallelization on distributed clusters.',
        frontTexture: '/textures/studio/tvfront_filmikprojektdlamultiego.webp',
        paintedFrontTexture: '/textures/studio/tvfront_filmikprojektdlamultiego_painted.webp',
        videoUrl: '/videos/scrub-video-intra.mp4',
        url: '#lecture-transformers',
        date: 'Today • 10:00 AM (Live)',
        views: '1,420 Students Attending',
        duration: '52:18',
        slidesUrl: '#download-slides-dl',
        chapters: [
            '00:00 - Welcome & Transformer Foundations',
            '14:20 - Mathematical Derivation of Self-Attention',
            '29:45 - Multi-Head Attention & Positional Encodings',
            '44:10 - Live PyTorch Training Run & GPU Profiling'
        ]
    },
    {
        id: 'lec-002',
        platform: 'youtube',
        title: 'Interactive 3D WebGL & Creative Shader Engineering',
        instructor: 'Dr. Maya Lin (Interactive Media & Graphics Lab)',
        courseCode: 'CS-340',
        description: 'Masterclass on real-time computer graphics for the browser: GLSL fragment & vertex shaders, Three.js pipelines, Raymarching signed distance functions, and GPU memory optimization for 60 FPS performance.',
        frontTexture: '/textures/studio/tvfront_filmikedytowaniezdjec.webp',
        paintedFrontTexture: '/textures/studio/tvfront_filmikedytowaniezdjec_painted.webp',
        videoUrl: '/videos/scrub-video-intra.mp4',
        url: '#lecture-webgl',
        date: 'Recorded • Yesterday',
        views: '2,890 Views',
        duration: '58:45',
        slidesUrl: '#download-slides-webgl',
        chapters: [
            '00:00 - The Modern WebGL 2.0 Pipeline',
            '16:15 - Writing Custom Fragment Shaders in GLSL',
            '35:30 - Postprocessing, Bloom & Noise Textures',
            '50:00 - Benchmarking Draw Calls & Geometry Instancing'
        ]
    },
    {
        id: 'lec-003',
        platform: 'youtube',
        title: 'Distributed Systems & Cloud Fault Tolerance',
        instructor: 'Prof. Marcus Brody (Cloud Infrastructure Dept)',
        courseCode: 'CS-420',
        description: 'Study of consensus algorithms (Raft and Paxos), Byzantine fault tolerance, eventual consistency, distributed transactions with two-phase commit, and Kubernetes orchestrations at hyperscale.',
        frontTexture: '/textures/studio/tvfront_filmikprojektdlamultiego.webp',
        paintedFrontTexture: '/textures/studio/tvfront_filmikprojektdlamultiego_painted.webp',
        videoUrl: '/videos/scrub-video-intra.mp4',
        url: '#lecture-distributed',
        date: 'Recorded • 3 days ago',
        views: '1,750 Views',
        duration: '45:10',
        slidesUrl: '#download-slides-dist',
        chapters: [
            '00:00 - The CAP Theorem in 2026',
            '12:40 - Raft Leader Election & Log Replication',
            '28:15 - Sharding & Consistent Hashing Rings',
            '39:00 - Handling Network Partitions & Chaos Engineering'
        ]
    },
    {
        id: 'lec-004',
        platform: 'youtube',
        title: 'Cybersecurity: Zero-Day Exploit Analysis & Binary Auditing',
        instructor: 'Dr. Elena Rostova (Information Security Lab)',
        courseCode: 'CS-450',
        description: 'Advanced defensive cybersecurity: stack canary bypasses, ROP chains, memory sanitizer instrumentation, side-channel attacks, and post-quantum cryptographic primitives (Kyber & Dilithium).',
        frontTexture: '/textures/studio/tvfront_filmikedytowaniezdjec.webp',
        paintedFrontTexture: '/textures/studio/tvfront_filmikedytowaniezdjec_painted.webp',
        videoUrl: '/videos/scrub-video-intra.mp4',
        url: '#lecture-cybersec',
        date: 'Recorded • 5 days ago',
        views: '3,120 Views',
        duration: '62:30',
        slidesUrl: '#download-slides-sec',
        chapters: [
            '00:00 - Modern Threat Landscapes & Attack Vectors',
            '18:20 - Memory Safety in C/C++ vs Rust',
            '38:40 - Reverse Engineering with Ghidra & Disassembly',
            '54:10 - Hardening Kernels & Zero-Trust Architecture'
        ]
    },

    // ============ Core CS Labs & Notes (Desktop Monitors) ============
    {
        id: 'lab-001',
        platform: 'blog',
        title: 'Data Structures & Algorithms: Balanced Trees & Graphs',
        instructor: 'Prof. Ken Thompson (Core Computing Lab)',
        courseCode: 'CS-202',
        description: 'Hands-on lab exploring self-balancing search trees (AVL and Red-Black), B-Trees for database disk storage, topological sorting, Dijkstra shortest paths, and A* heuristic navigation.',
        frontTexture: '/textures/studio/monitorfront_postnafbdoublewinner.webp',
        paintedFrontTexture: '/textures/studio/monitorfront_postnafbdoublewinner_painted.webp',
        videoUrl: '/videos/scrub-video-intra.mp4',
        url: '#lab-dsa',
        date: 'Updated • This Week',
        views: '4,520 Reads',
        duration: '40 min read + Code Lab',
        slidesUrl: '#download-lab-dsa',
        chapters: [
            'Tree Rotations & Invariants',
            'Graph Adjacency Matrices vs Lists',
            'Dijkstra Priority Queue Optimization',
            'Dynamic Programming Memoization vs Tabulation'
        ]
    },
    {
        id: 'lab-002',
        platform: 'blog',
        title: 'Full-Stack Enterprise React 19 & Next.js Architecture',
        instructor: 'Prof. Sarah Jenkins (Software Engineering)',
        courseCode: 'CS-310',
        description: 'Comprehensive software engineering lab on React Server Components, Server Actions, streaming SSR, PostgreSQL connection pooling, and atomic state management patterns.',
        frontTexture: '/textures/studio/monitorfront_postnafbdoublewinner.webp',
        paintedFrontTexture: '/textures/studio/monitorfront_postnafbdoublewinner_painted.webp',
        videoUrl: '/videos/scrub-video-intra.mp4',
        url: '#lab-react',
        date: 'Updated • 2 weeks ago',
        views: '3,800 Reads',
        duration: '35 min read',
        slidesUrl: '#download-lab-web',
        chapters: [
            'Server Components vs Client Boundaries',
            'Optimistic UI Updates & Mutations',
            'Database Indexing & Prisma / Drizzle ORM',
            'End-to-End Testing with Playwright'
        ]
    },
    {
        id: 'lab-003',
        platform: 'blog',
        title: 'Operating Systems: Concurrency, Paging & Virtual Memory',
        instructor: 'Prof. Alan Vance (OS Engineering)',
        courseCode: 'CS-301',
        description: 'In-depth breakdown of kernel context switching, multi-level page tables, TLB cache invalidation, mutexes, condition variables, and deadlock avoidance via Banker algorithm.',
        frontTexture: '/textures/studio/monitorfront_postnafbdoublewinner.webp',
        paintedFrontTexture: '/textures/studio/monitorfront_postnafbdoublewinner_painted.webp',
        videoUrl: '/videos/scrub-video-intra.mp4',
        url: '#lab-os',
        date: 'Updated • Last Month',
        views: '2,940 Reads',
        duration: '50 min read',
        slidesUrl: '#download-lab-os',
        chapters: [
            'Virtual-to-Physical Address Translation',
            'Process Schedulers (CFS & Round-Robin)',
            'POSIX Threads & Synchronization Primitives',
            'File System Inodes & Journaling'
        ]
    },

    // ============ Micro-Lessons & Code Sprints (Vertical Tablets) ============
    {
        id: 'sprint-001',
        platform: 'tiktok',
        title: 'Python Under the Hood: The GIL & Bytecode Demystified',
        instructor: 'T.A. Leo Chen (Python Tutor)',
        courseCode: 'CS-101-SPRINT',
        description: 'Quick 8-minute deep dive explaining the Global Interpreter Lock, how CPython interprets bytecode, and when to use multiprocessing vs asyncio vs nogil builds.',
        frontTexture: '/textures/studio/phonefront_followmeontiktok.webp',
        paintedFrontTexture: '/textures/studio/phonefront_followmeontiktok_painted.webp',
        videoUrl: '/videos/scrub-video-intra.mp4',
        url: '#sprint-python-gil',
        date: 'Today',
        views: '12.4K Views',
        duration: '08:15',
    },
    {
        id: 'sprint-002',
        platform: 'tiktok',
        title: 'Bitwise Hacks Every Software Engineer Must Know',
        instructor: 'T.A. Sophie Vance (Competitive Coding)',
        courseCode: 'CS-202-SPRINT',
        description: 'Fast algorithmic sprint demonstrating Brian Kernighan bit-counting, fast power with binary exponentiation, bitmask subset generation, and XOR swap tricks.',
        frontTexture: '/textures/studio/phonefront_followmeontiktok.webp',
        paintedFrontTexture: '/textures/studio/phonefront_followmeontiktok_painted.webp',
        videoUrl: '/videos/scrub-video-intra.mp4',
        url: '#sprint-bitwise',
        date: 'Yesterday',
        views: '18.9K Views',
        duration: '06:30',
    },
    {
        id: 'sprint-003',
        platform: 'tiktok',
        title: 'GLSL Shaders: Building Your First Procedural Marble Texture',
        instructor: 'Dr. Maya Lin (Graphics Lab)',
        courseCode: 'CS-340-SPRINT',
        description: 'Learn fractional Brownian motion (fBm), Simplex noise, and domain warping in under 10 minutes to generate photorealistic procedural textures purely on the GPU.',
        frontTexture: '/textures/studio/phonefront_followmeontiktok.webp',
        paintedFrontTexture: '/textures/studio/phonefront_followmeontiktok_painted.webp',
        videoUrl: '/videos/scrub-video-intra.mp4',
        url: '#sprint-shaders',
        date: '3 days ago',
        views: '24.1K Views',
        duration: '09:45',
    },
    {
        id: 'sprint-004',
        platform: 'tiktok',
        title: 'SQL Query Optimization: B-Tree Index Lookups vs Full Scans',
        instructor: 'Prof. Sarah Jenkins (Databases)',
        courseCode: 'CS-205-SPRINT',
        description: 'Visualizing EXPLAIN ANALYZE execution plans, composite index column order rules, index-only scans, and solving N+1 query bottlenecks.',
        frontTexture: '/textures/studio/phonefront_followmeontiktok.webp',
        paintedFrontTexture: '/textures/studio/phonefront_followmeontiktok_painted.webp',
        videoUrl: '/videos/scrub-video-intra.mp4',
        url: '#sprint-sql',
        date: '4 days ago',
        views: '15.2K Views',
        duration: '07:20',
    },
];

const ytTextures = ['/textures/studio/tvfront_filmikprojektdlamultiego.webp', '/textures/studio/tvfront_filmikedytowaniezdjec.webp'];
const ytPaintedTextures = ['/textures/studio/tvfront_filmikprojektdlamultiego_painted.webp', '/textures/studio/tvfront_filmikedytowaniezdjec_painted.webp'];
const blogTextures = ['/textures/studio/monitorfront_postnafbdoublewinner.webp'];
const blogPaintedTextures = ['/textures/studio/monitorfront_postnafbdoublewinner_painted.webp'];
const ttTextures = ['/textures/studio/phonefront_followmeontiktok.webp'];
const ttPaintedTextures = ['/textures/studio/phonefront_followmeontiktok_painted.webp'];

let ytIdx = 0, blogIdx = 0, ttIdx = 0;
let ytPIdx = 0, blogPIdx = 0, ttPIdx = 0;

export const CONTENT_DATA = RAW_CONTENT_DATA.map((item) => {
    return {
        ...item,
        frontTexture: item.frontTexture || (
            item.platform === 'youtube' ? ytTextures[ytIdx++ % ytTextures.length] :
                item.platform === 'blog' ? blogTextures[blogIdx++ % blogTextures.length] :
                    ttTextures[ttIdx++ % ttTextures.length]
        ),
        paintedFrontTexture: item.paintedFrontTexture || (
            item.platform === 'youtube' ? ytPaintedTextures[ytPIdx++ % ytPaintedTextures.length] :
                item.platform === 'blog' ? blogPaintedTextures[blogPIdx++ % blogPaintedTextures.length] :
                    ttPaintedTextures[ttPIdx++ % ttPaintedTextures.length]
        )
    };
});

// Helper to get content by platform
export const getContentByPlatform = (platform) => {
    if (platform === 'all') return CONTENT_DATA;
    return CONTENT_DATA.filter(item => item.platform === platform);
};

// Get latest content (for "On Air" / Live indicator)
export const getLatestContent = () => {
    return CONTENT_DATA[0];
};
