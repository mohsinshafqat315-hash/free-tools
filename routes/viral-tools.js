/**
 * Viral & Utility Tools Routes
 * 
 * This file contains all routes for Viral & Utility Tools category
 * 
 * Routes:
 * - POST /api/tools/viral/ai-image-generator/generate - Generate AI images from text prompts
 * - POST /api/tools/viral/qr-code-generator/generate - Generate QR codes from text, URL, or files
 */

const express = require('express');
const router = express.Router();

const aiImageGeneratorController = require('../controllers/aiImageGeneratorController');
const qrCodeGeneratorController = require('../controllers/qrCodeGeneratorController');

/**
 * Generate AI Image Route
 * POST /api/tools/viral/ai-image-generator/generate
 * 
 * Request Body:
 * {
 *   prompt: string,
 *   style: string (optional),
 *   aspectRatio: string (optional),
 *   imageCount: number (optional, 1-4)
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   data: {
 *     images: Array<{
 *       id: string,
 *       url: string,
 *       prompt: string,
 *       style: string,
 *       aspectRatio: string,
 *       width: number,
 *       height: number,
 *       timestamp: string
 *     }>
 *   },
 *   error?: string
 * }
 */
router.post('/ai-image-generator/generate', async (req, res) => {
    try {
        const { prompt, style, aspectRatio, imageCount } = req.body;

        // Validation
        if (!prompt || prompt.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Prompt is required'
            });
        }

        if (prompt.length < 10) {
            return res.status(400).json({
                success: false,
                error: 'Prompt must be at least 10 characters long'
            });
        }

        if (prompt.length > 1000) {
            return res.status(400).json({
                success: false,
                error: 'Prompt must be less than 1000 characters'
            });
        }

        const selectedStyle = style || 'realistic';
        if (!aiImageGeneratorController.validateStyle(selectedStyle)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid style selected'
            });
        }

        const selectedAspectRatio = aspectRatio || '1:1';
        if (!aiImageGeneratorController.validateAspectRatio(selectedAspectRatio)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid aspect ratio selected'
            });
        }

        const count = Math.min(Math.max(parseInt(imageCount) || 1, 1), 4);

        // Generate images
        const images = await aiImageGeneratorController.generateImage(
            prompt,
            selectedStyle,
            selectedAspectRatio,
            count
        );

        res.json({
            success: true,
            data: { images }
        });

    } catch (error) {
        console.error('AI image generator error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

/**
 * Generate QR Code Route
 * POST /api/tools/viral/qr-code-generator/generate
 * 
 * Request Body:
 * {
 *   content: string,
 *   inputType: string ('url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi'),
 *   size: number (optional, 200-500),
 *   errorCorrection: string (optional, 'L' | 'M' | 'Q' | 'H'),
 *   foregroundColor: string (optional, hex color),
 *   backgroundColor: string (optional, hex color)
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   data: {
 *     dataUrl: string,
 *     size: number,
 *     errorCorrection: string,
 *     content: string
 *   },
 *   error?: string
 * }
 */
router.post('/qr-code-generator/generate', async (req, res) => {
    try {
        const { content, inputType, size, errorCorrection, foregroundColor, backgroundColor } = req.body;

        // Validation
        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Content is required'
            });
        }

        const selectedInputType = inputType || 'text';
        if (!qrCodeGeneratorController.validateInputType(selectedInputType)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid input type'
            });
        }

        // Format content based on input type
        const formattedContent = qrCodeGeneratorController.formatContent(content, selectedInputType);

        const selectedSize = Math.min(Math.max(parseInt(size) || 300, 200), 500);
        const selectedErrorCorrection = errorCorrection || 'M';
        if (!qrCodeGeneratorController.validateErrorCorrection(selectedErrorCorrection)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid error correction level'
            });
        }

        const colors = {
            foreground: foregroundColor || '#000000',
            background: backgroundColor || '#FFFFFF'
        };

        // Generate QR code
        const result = await qrCodeGeneratorController.generateQRCode(
            formattedContent,
            selectedSize,
            selectedErrorCorrection,
            colors
        );

        res.json({
            success: true,
            data: {
                dataUrl: result.dataUrl,
                size: result.size,
                errorCorrection: result.errorCorrection,
                content: result.content
            }
        });

    } catch (error) {
        console.error('QR code generator error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
        });
    }
});

module.exports = router;

