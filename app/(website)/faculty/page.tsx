import { db } from "@/lib/db";
import FacultyDirectory from "../../components/FacultyDirectory";

export default async function FacultyPage() {
  // Use a query that guarantees an array
  const result: any = await db.execute("SELECT * FROM faculty");
  
  // result[0] is the rows, result[1] is the fields. 
  // We want result[0].
  const facultyData = Array.isArray(result[0]) ? result[0] : [];

  return <FacultyDirectory facultyData={facultyData} />;
}