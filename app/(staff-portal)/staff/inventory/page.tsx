import { db } from '@/lib/db'; 
import InventoryClient from './InventoryClient';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  // 1. Fetch the items
  const [items]: any = await db.execute('SELECT * FROM inventory ORDER BY id DESC');
  
  // 2. Count the stats dynamically
  const [totalIT]: any = await db.execute(`SELECT COUNT(*) as count FROM inventory WHERE sku LIKE 'CMSIL-IT-%' OR sku LIKE 'CMSIL-CSE-%' OR sku LIKE 'CMSIL-NW-%'`);
  const [totalLab]: any = await db.execute(`SELECT COUNT(*) as count FROM inventory WHERE sku LIKE 'CMSIL-EEE-%' OR sku LIKE 'CMSIL-PHY-%'`);
  const [totalMaintenance]: any = await db.execute(`SELECT COUNT(*) as count FROM inventory WHERE status = 'Maintenance'`);

  // 3. Package the stats
  const stats = {
    it: totalIT[0].count,
    lab: totalLab[0].count,
    maintenance: totalMaintenance[0].count
  };

  // 4. Send it all to the Client Component
  return (
    <InventoryClient items={items} stats={stats} />
  );
}