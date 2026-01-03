/**
 * Express Server Configuration
 * Serves frontend static files and API routes
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// CORS configuration - Allow requests from Netlify frontend and localhost
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'https://freetoolsio.netlify.app',
            'http://localhost:3000',
            'http://localhost:8080',
            'http://127.0.0.1:8080',
            'http://127.0.0.1:3000',
            'http://localhost:5500',
            'http://127.0.0.1:5500'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost') || origin.includes('127.0.0.1')) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all origins for now - can restrict later
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle favicon requests (browsers automatically request this)
app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // 204 No Content - standard for missing favicon
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Backend API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes (must be before static file serving)
app.use('/api/tools/student', require('./routes/student-tools'));
app.use('/api/tools/finance', require('./routes/finance-tools'));
app.use('/api/tools/seo', require('./routes/seo-tools'));
app.use('/api/tools/social-media', require('./routes/social-media-tools'));
app.use('/api/tools/viral', require('./routes/viral-tools'));

const frontendPath = path.join(__dirname, '..', 'frontend');

// Handle tool directory routes FIRST - serve index.html for directories and explicit index.html paths
// This must run before static middleware to handle /tools/ paths correctly
app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return next();
    }
    
    // Handle tool paths
    if (req.path.startsWith('/tools/')) {
        let filePath;
        let requestPath = req.path;
        
        // Remove trailing slash if present (except for root)
        if (requestPath.endsWith('/') && requestPath !== '/') {
            requestPath = requestPath.slice(0, -1);
        }
        
        // If path ends with index.html, use it directly
        if (requestPath.endsWith('/index.html') || requestPath.endsWith('index.html')) {
            filePath = path.join(frontendPath, requestPath);
        }
        // If path doesn't have extension, assume it's a directory and serve index.html
        else if (!path.extname(requestPath)) {
            filePath = path.join(frontendPath, requestPath, 'index.html');
        }
        // If it has an extension, let static middleware handle it
        else {
            return next();
        }
        
        // Normalize the path
        filePath = path.normalize(filePath);
        
        // Security check: ensure the path is within frontend directory
        const normalizedFrontendPath = path.normalize(frontendPath);
        if (!filePath.startsWith(normalizedFrontendPath)) {
            console.error('Security check failed:', filePath, 'not in', normalizedFrontendPath);
            return res.status(403).send('Forbidden');
        }
        
        // Check if file exists and serve it
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            console.log('Serving file:', filePath);
            return res.sendFile(filePath);
        } else {
            console.error('File not found:', filePath);
        }
    }
    
    // Continue to next middleware
    next();
});

// Serve static files from frontend directory (after tool routes)
// Exclude /tools/ paths from static serving to let custom handler manage them
app.use((req, res, next) => {
    if (req.path.startsWith('/tools/')) {
        return next(); // Skip static serving for tool paths
    }
    next();
}, express.static(frontendPath, {
    extensions: ['html', 'htm', 'css', 'js', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico']
}));

// Handle root path - provide API information
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'FreeTools API Backend',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            tools: {
                seo: '/api/tools/seo/*',
                finance: '/api/tools/finance/*',
                socialMedia: '/api/tools/social-media/*',
                student: '/api/tools/student/*',
                viral: '/api/tools/viral/*'
            }
        },
        documentation: 'This is an API-only backend. Frontend is deployed separately.',
        timestamp: new Date().toISOString()
    });
});

// Handle root and other routes - catch-all middleware
app.use((req, res) => {
    // Skip API routes (shouldn't reach here, but just in case)
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    
    // For non-API routes, return 404 with helpful message
    res.status(404).json({ 
        error: 'Page not found',
        message: 'This is an API-only backend. Please use /api/* endpoints.',
        availableEndpoints: '/api/health'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false, 
        error: err.message || 'Internal server error' 
    });
});

// Start server only if not in Vercel serverless environment
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Frontend files served from: ${frontendPath}`);
    });
}

module.exports = app;

