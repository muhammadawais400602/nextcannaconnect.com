import { getAllCompanies, getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import DirectoryContent from "@/components/directory/DirectoryContent";

interface Props {
  category: string | null;
}

export default async function DirectoryLoader({ category }: Props) {
  const companies = category
    ? await getCompaniesByCategory(category)
    : await getAllCompanies();
  return <DirectoryContent companies={companies} initialCategory={category} />;
}
