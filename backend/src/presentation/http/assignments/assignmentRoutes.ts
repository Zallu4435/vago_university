import { Router } from 'express';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { AssignmentComposers } from '../../../infrastructure/services/assignments/AssignmentComposers';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import express from 'express';
import { assignmentUpload, cloudinary } from '../../../config/cloudinary.config';
import { config } from '../../../config/config';
const fetch = require('node-fetch');

const assignmentController = AssignmentComposers.composeAssignmentController();
const router = Router();

// Download file endpoint (similar to user assignment) - MUST BE FIRST
router.get('/download-file', authMiddleware, async (req: any, res: any) => {
  try {
    console.log('=== FACULTY DOWNLOAD FILE STARTED ===');
    console.log('📥 Request received:', {
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
      headers: req.headers
    });

    const { fileUrl, fileName } = req.query;

    console.log('🔍 Query parameters:', { fileUrl, fileName });

    if (!fileUrl || typeof fileUrl !== 'string') {
      console.error('❌ Error: File URL is missing or invalid');
      return res.status(400).send('File URL is required');
    }

    if (!fileName || typeof fileName !== 'string') {
      console.error('❌ Error: File name is missing or invalid');
      return res.status(400).send('File name is required');
    }

    console.log('✅ Parameters validation passed');

    // Clean the filename
    let cleanFileName = fileName.replace(/\s+/g, '_');
    cleanFileName = cleanFileName.replace(/[^a-zA-Z0-9._-]/g, '');
    cleanFileName = cleanFileName.replace(/"/g, '');

    console.log('📝 File name processing:', {
      original: fileName,
      cleaned: cleanFileName
    });

    console.log('🌐 Fetching file from URL:', fileUrl);

    // Fetch the file from the URL
    const response = await fetch(fileUrl);
    
    console.log('📡 Fetch response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      console.error('❌ Error: Failed to fetch file from URL');
      console.error('Response status:', response.status);
      console.error('Response status text:', response.statusText);
      return res.status(500).send('Failed to fetch file');
    }

    console.log('✅ File fetched successfully');

    // Set proper headers for download
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition = `attachment; filename="${cleanFileName}"`;
    
    console.log('📋 Setting response headers:', {
      'Content-Disposition': contentDisposition,
      'Content-Type': contentType
    });

    res.setHeader('Content-Disposition', contentDisposition);
    res.setHeader('Content-Type', contentType);
    
    console.log('📤 Starting file stream to client...');
    
    // Stream the file to the client
    response.body.pipe(res);
    
    console.log('✅ File stream initiated successfully');
    console.log('=== FACULTY DOWNLOAD FILE COMPLETED ===');

  } catch (err: any) {
    console.error('=== FACULTY DOWNLOAD FILE ERROR ===');
    console.error('❌ Error details:', err);
    console.error('❌ Error message:', err.message);
    console.error('❌ Error stack:', err.stack);
    console.error('❌ Error type:', err.constructor.name);
    
    if (err instanceof Error) {
      console.error('❌ Error name:', err.name);
    }
    
    console.error('=== FACULTY DOWNLOAD FILE ERROR END ===');
    res.status(500).send('Download failed');
  }
});

router.get('/analytics', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.getAnalytics.bind(assignmentController));
});

router.put('/:assignmentId/submissions/:submissionId/review', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.reviewSubmission.bind(assignmentController));
});

router.get('/', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.getAssignments.bind(assignmentController));
});

router.get('/:id', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.getAssignmentById.bind(assignmentController));
});

router.post('/',
    authMiddleware,
    assignmentUpload.array('files', 5),
    (req, res, next) => {
        expressAdapter(req, res, next, assignmentController.createAssignment.bind(assignmentController));
    }
);

router.put('/:id', authMiddleware, assignmentUpload.array('files', 5), (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.updateAssignment.bind(assignmentController));
});

router.delete('/:id', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.deleteAssignment.bind(assignmentController));
});

// Submission routes
router.get('/:assignmentId/submissions', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.getSubmissions.bind(assignmentController));
});

router.get('/:assignmentId/submissions/:submissionId', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.getSubmissionById.bind(assignmentController));
});

router.get('/:assignmentId/submissions/:submissionId/download', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.downloadSubmission.bind(assignmentController));
});

router.get('/:id/files/view', authMiddleware, (req, res, next) => {
    expressAdapter(req, res, next, assignmentController.viewAssignmentFile.bind(assignmentController));
});

// New endpoint for downloading submission files (similar to student side)
router.get('/download-submission-file', authMiddleware, async (req: any, res: any) => {
  try {
    console.log('=== FACULTY SUBMISSION FILE DOWNLOAD STARTED ===');
    console.log('📥 Request received:', {
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
      headers: req.headers
    });

    const { fileUrl, fileName } = req.query;

    console.log('🔍 Query parameters:', { fileUrl, fileName });

    if (!fileUrl || typeof fileUrl !== 'string') {
      console.error('❌ Error: File URL is missing or invalid');
      return res.status(400).send('File URL is required');
    }

    if (!fileName || typeof fileName !== 'string') {
      console.error('❌ Error: File name is missing or invalid');
      return res.status(400).send('File name is required');
    }

    console.log('✅ Parameters validation passed');

    // Clean the filename
    let cleanFileName = fileName.replace(/\s+/g, '_');
    cleanFileName = cleanFileName.replace(/[^a-zA-Z0-9._-]/g, '');
    cleanFileName = cleanFileName.replace(/"/g, '');

    console.log('📝 File name processing:', {
      original: fileName,
      cleaned: cleanFileName
    });

    console.log('🌐 Fetching file from URL:', fileUrl);

    // Fetch the file from the URL
    const response = await fetch(fileUrl);
    
    console.log('📡 Fetch response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      console.error('❌ Error: Failed to fetch file from URL');
      console.error('Response status:', response.status);
      console.error('Response status text:', response.statusText);
      return res.status(500).send('Failed to fetch file');
    }

    console.log('✅ File fetched successfully');

    // Set proper headers for download
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition = `attachment; filename="${cleanFileName}"`;
    
    console.log('📋 Setting response headers:', {
      'Content-Disposition': contentDisposition,
      'Content-Type': contentType
    });

    res.setHeader('Content-Disposition', contentDisposition);
    res.setHeader('Content-Type', contentType);
    
    console.log('📤 Starting file stream to client...');
    
    // Stream the file to the client
    response.body.pipe(res);
    
    console.log('✅ File stream initiated successfully');
    console.log('=== FACULTY SUBMISSION FILE DOWNLOAD COMPLETED ===');

  } catch (err: any) {
    console.error('=== FACULTY SUBMISSION FILE DOWNLOAD ERROR ===');
    console.error('❌ Error details:', err);
    console.error('❌ Error message:', err.message);
    console.error('❌ Error stack:', err.stack);
    console.error('❌ Error type:', err.constructor.name);
    
    if (err instanceof Error) {
      console.error('❌ Error name:', err.name);
    }
    
    console.error('=== FACULTY SUBMISSION FILE DOWNLOAD ERROR END ===');
    res.status(500).send('Download failed');
  }
});

export default router; 