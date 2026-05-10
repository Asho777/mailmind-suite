import { Worker, Job } from 'bullmq';
import { connection } from './client';
import { prisma } from '@/lib/db';
// import { analyzeEmail } from '@/lib/ai/analyser'; // To be implemented in Phase 2

export const setupWorker = () => {
  const worker = new Worker(
    'email-tasks',
    async (job: Job) => {
      console.log(`Processing job ${job.id} of type ${job.name}`);

      if (job.name === 'sync-inbox') {
        const { accountId } = job.data;
        // Implementation for syncing inbox
        console.log(`Syncing inbox for account ${accountId}`);
      }

      if (job.name === 'analyse-email') {
        const { emailId } = job.data;
        // Implementation for analysing email
        console.log(`Analysing email ${emailId}`);
      }
    },
    { connection }
  );

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.warn(`Job ${job?.id} failed with ${err.message}`);
  });

  return worker;
};
