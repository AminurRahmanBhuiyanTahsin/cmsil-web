'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addAsset(formData: FormData) {
  const item_name = formData.get('item_name');
  const sku = formData.get('sku');
  const department = formData.get('department');
  const status = formData.get('status');

  if (!item_name || !sku || !department || !status) return;

  await db.execute(
    `INSERT INTO inventory (item_name, sku, department, status) VALUES (?, ?, ?, ?)`,
    [item_name, sku, department, status]
  );

  // This tells Next.js to instantly refresh the page data!
  revalidatePath('/staff/inventory'); 
}

export async function updateStatus(formData: FormData) {
  const id = formData.get('id');
  const status = formData.get('status');

  if (!id || !status) return;

  await db.execute(
    `UPDATE inventory SET status = ? WHERE id = ?`,
    [status, id]
  );

  revalidatePath('/staff/inventory');
}