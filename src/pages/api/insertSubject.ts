// pages/api/insertSubject.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabase-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, description } = req.body;

    try {
      // Insert subject details into the Subject table
      const { data, error } = await supabase.from('Subjects').upsert([
        {
          name,
          description,
        },
      ]);
      console.log(name);
      console.log(description);

      if (error) {
        throw error;
      }

      res.status(201).json({ success: true, data });
    } catch (error) {
      console.error('Error inserting subject:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
