import { getAllCompaniesFresh } from "@/lib/getCompaniesFromDB";
import DirectoryContent from "@/components/directory/DirectoryContent";

export default async function DirectoryLoader() {
  const companies = await getAllCompaniesFresh();
  return <DirectoryContent companies={companies} />;
}
