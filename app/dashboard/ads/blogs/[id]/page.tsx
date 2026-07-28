import { BlogDetailPage } from "@/app/components/dashboard/BlogDetailPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BlogPage({ params }: PageProps) {
  const { id } = await params;
  return <BlogDetailPage blogId={id} />;
}
