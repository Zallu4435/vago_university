import { Router } from 'express';
import { expressAdapter } from '../../adapters/ExpressAdapter';
import { getAssignmentComposer } from '../../../infrastructure/services/assignments/AssignmentComposers';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { assignmentUpload } from '../../../config/cloudinary.config';
const fetch = require('node-fetch');

const assignmentController = getAssignmentComposer();
const router = Router();

router.get('/download-submission-file', authMiddleware, async (req: any, res: any) => {
  console.log('--- /download-submission-file route HIT ---');
  try {
    let { fileUrl, fileName } = req.query;

    console.log('Received fileUrl:', fileUrl);
    console.log('Received fileName:', fileName);

    // If fileUrl or fileName are arrays (can happen with repeated query params), use the first value
    if (Array.isArray(fileUrl)) fileUrl = fileUrl[0];
    if (Array.isArray(fileName)) fileName = fileName[0];

    console.log('fileUrl after array check:', fileUrl);
    console.log('fileName after array check:', fileName);

    if (!fileUrl || typeof fileUrl !== 'string') {
      console.error('❌ Error: File URL is missing or invalid', fileUrl);
      return res.status(400).send('File URL is required');
    }

    if (!fileName || typeof fileName !== 'string') {
      console.error('❌ Error: File name is missing or invalid', fileName);
      return res.status(400).send('File name is required');
    }

    let cleanFileName = fileName.replace(/\s+/g, '_');
    cleanFileName = cleanFileName.replace(/[^a-zA-Z0-9._-]/g, '');
    cleanFileName = cleanFileName.replace(/"/g, '');

    console.log('Cleaned fileName:', cleanFileName);
    console.log('Fetching file from:', fileUrl);
    const response = await fetch(fileUrl);

    if (!response.ok) {
      console.error('❌ Error: Failed to fetch file from URL');
      console.error('Response status:', response.status);
      console.error('Response status text:', response.statusText);
      return res.status(500).send('Failed to fetch file');
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition = `attachment; filename="${cleanFileName}"`;

    res.setHeader('Content-Disposition', contentDisposition);
    res.setHeader('Content-Type', contentType);

    console.log('Streaming file to client...');
    response.body.pipe(res);
    console.log('--- /download-submission-file route END ---');

  } catch (err) {
    if (err instanceof Error) {
      console.error('❌ Error name:', err.name);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error stack:', err.stack);
    }
    console.error('❌ Full error object:', err);
    console.error('=== FACULTY DOWNLOAD FILE ERROR END ===');
    res.status(500).send('Download failed');
  }
});

router.get('/download-file', authMiddleware, async (req: any, res: any) => {
  try {
    const { fileUrl, fileName } = req.query;

    if (!fileUrl || typeof fileUrl !== 'string') {
      return res.status(400).send('File URL is required');
    }

    if (!fileName || typeof fileName !== 'string') {
      console.error('❌ Error: File name is missing or invalid');
      return res.status(400).send('File name is required');
    }

    let cleanFileName = fileName.replace(/\s+/g, '_');
    cleanFileName = cleanFileName.replace(/[^a-zA-Z0-9._-]/g, '');
    cleanFileName = cleanFileName.replace(/"/g, '');

    const response = await fetch(fileUrl);

    if (!response.ok) {
      console.error('❌ Error: Failed to fetch file from URL');
      console.error('Response status:', response.status);
      console.error('Response status text:', response.statusText);
      return res.status(500).send('Failed to fetch file');
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition = `attachment; filename="${cleanFileName}"`;
    
    res.setHeader('Content-Disposition', contentDisposition);
    res.setHeader('Content-Type', contentType);
    
    response.body.pipe(res);

  } catch (err) {
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



export default router; 