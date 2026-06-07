import { getAllCompanies } from "@/lib/getCompaniesFromDB";
import DirectoryContent from "@/components/directory/DirectoryContent";

export default async function DirectoryLoader() {
  const companies = await getAllCompanies();
  return <DirectoryContent companies={companies} />;
}
